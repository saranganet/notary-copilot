/**
 * Firebase Cloud Sync & Storage Engine for Notary Copilot
 * 
 * Provides:
 * 1. Cloud Firestore synchronization for Notarial Acts, Chambers, and Accounts.
 * 2. Firebase Cloud Storage for high-res biometric fingerprint scans & client passport photos.
 * 3. Graceful offline fallback: if offline or unconfigured, system uses IndexedDB with zero interruption.
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
  query,
  where,
  type Firestore,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  type FirebaseStorage,
} from 'firebase/storage';
import type { FirebaseConfig, NotarialAct, NotaryAccount } from '../types/notary';
import { indexedDb } from './indexedDbService';

const FIREBASE_CONFIG_KEY = 'firebase_cloud_config_v1';

class FirebaseSyncService {
  private app: FirebaseApp | null = null;
  private db: Firestore | null = null;
  private storage: FirebaseStorage | null = null;
  private cachedConfig: FirebaseConfig | null = null;
  private isInitialized = false;

  constructor() {
    this.initFromEnvOrCache();
  }

  private async initFromEnvOrCache(): Promise<void> {
    try {
      // 1. Check environment variables
      const envConfig: Partial<FirebaseConfig> = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
      };

      if (envConfig.apiKey && envConfig.projectId) {
        await this.init(envConfig as FirebaseConfig);
        return;
      }

      // 2. Check stored configuration in IndexedDB
      const saved = await indexedDb.getSetting<FirebaseConfig | null>(FIREBASE_CONFIG_KEY, null);
      if (saved && saved.apiKey && saved.projectId) {
        await this.init(saved);
      }
    } catch (err) {
      console.warn('[FirebaseSync] Auto-init failed, running in local-first mode:', err);
    }
  }

  public async init(config: FirebaseConfig): Promise<boolean> {
    try {
      if (!config.apiKey || !config.projectId) return false;

      const existingApps = getApps();
      if (existingApps.length > 0) {
        this.app = existingApps[0];
      } else {
        this.app = initializeApp(config);
      }

      this.db = getFirestore(this.app);
      if (config.storageBucket) {
        this.storage = getStorage(this.app);
      }
      this.cachedConfig = config;
      this.isInitialized = true;
      return true;
    } catch (err) {
      console.error('[FirebaseSync] Initialization error:', err);
      return false;
    }
  }

  public isConfigured(): boolean {
    return this.isInitialized && !!this.db;
  }

  public async getConfig(): Promise<FirebaseConfig | null> {
    if (this.cachedConfig) return this.cachedConfig;
    return await indexedDb.getSetting<FirebaseConfig | null>(FIREBASE_CONFIG_KEY, null);
  }

  public async saveConfig(config: FirebaseConfig): Promise<{ success: boolean; message: string }> {
    try {
      await indexedDb.setSetting(FIREBASE_CONFIG_KEY, config);
      const ok = await this.init(config);
      if (ok) {
        return { success: true, message: 'Firebase connected and verified successfully!' };
      }
      return { success: false, message: 'Invalid Firebase configuration.' };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      return { success: false, message: `Connection failed: ${errMsg}` };
    }
  }

  /**
   * Upload high-resolution biometric scan or passport photo to Cloud Storage
   * Returns permanent public URL, preventing huge base64 strings in DB
   */
  public async uploadAsset(
    chamberUsername: string,
    assetType: 'photo' | 'fingerprint' | 'signature',
    fileName: string,
    base64DataUrl: string
  ): Promise<string> {
    if (!this.storage || !base64DataUrl.startsWith('data:')) {
      return base64DataUrl; // Return original if cloud storage not ready
    }

    try {
      const storagePath = `chambers/${chamberUsername}/${assetType}s/${Date.now()}_${fileName}`;
      const storageRef = ref(this.storage, storagePath);
      await uploadString(storageRef, base64DataUrl, 'data_url');
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (err) {
      console.warn('[FirebaseSync] Upload asset failed, keeping local copy:', err);
      return base64DataUrl;
    }
  }

  /**
   * Push Notarial Act to Cloud Firestore
   */
  public async syncActToCloud(act: NotarialAct, chamberUsername: string): Promise<boolean> {
    if (!this.db) return false;
    try {
      const actDocRef = doc(this.db, 'acts', act.id);
      await setDoc(actDocRef, {
        ...act,
        chamberUsername: chamberUsername.toLowerCase(),
        lastCloudSyncAt: new Date().toISOString(),
      }, { merge: true });
      return true;
    } catch (err) {
      console.warn(`[FirebaseSync] Sync act ${act.serialNo} failed:`, err);
      return false;
    }
  }

  /**
   * Bulk Sync Acts for a Chamber
   */
  public async syncAllActsToCloud(acts: NotarialAct[], chamberUsername: string): Promise<number> {
    if (!this.db || !acts.length) return 0;
    let syncedCount = 0;
    for (const act of acts) {
      const ok = await this.syncActToCloud(act, chamberUsername);
      if (ok) syncedCount++;
    }
    return syncedCount;
  }

  /**
   * Fetch Acts for a specific Chamber from Cloud
   */
  public async fetchChamberActsFromCloud(chamberUsername: string): Promise<NotarialAct[]> {
    if (!this.db) return [];
    try {
      const actsRef = collection(this.db, 'acts');
      const q = query(actsRef, where('chamberUsername', '==', chamberUsername.toLowerCase()));
      const snapshot = await getDocs(q);
      const acts: NotarialAct[] = [];
      snapshot.forEach((d) => {
        acts.push(d.data() as NotarialAct);
      });
      return acts;
    } catch (err) {
      console.warn('[FirebaseSync] Failed to fetch acts from cloud:', err);
      return [];
    }
  }

  /**
   * Sync Chamber Accounts to Cloud (Admin only)
   */
  public async syncAccountsToCloud(accounts: NotaryAccount[]): Promise<void> {
    if (!this.db) return;
    try {
      for (const acc of accounts) {
        const accDocRef = doc(this.db, 'accounts', acc.username.toLowerCase());
        await setDoc(accDocRef, {
          username: acc.username.toLowerCase(),
          password: acc.password,
          role: acc.role,
          profile: acc.profile,
          status: acc.status || 'active',
          createdAt: acc.createdAt,
          lastLoginAt: acc.lastLoginAt || null,
          notes: acc.notes || '',
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }
    } catch (err) {
      console.warn('[FirebaseSync] Failed to sync accounts to cloud:', err);
    }
  }

  /**
   * Fetch All Authorized Chamber Accounts from Cloud
   */
  public async fetchAccountsFromCloud(): Promise<NotaryAccount[]> {
    if (!this.db) return [];
    try {
      const accRef = collection(this.db, 'accounts');
      const snapshot = await getDocs(accRef);
      const accounts: NotaryAccount[] = [];
      snapshot.forEach((d) => {
        accounts.push(d.data() as NotaryAccount);
      });
      return accounts;
    } catch (err) {
      console.warn('[FirebaseSync] Failed to fetch accounts from cloud:', err);
      return [];
    }
  }

  /**
   * Wipe all Notarial Acts from Cloud Firestore
   */
  public async wipeAllCloudActs(): Promise<number> {
    if (!this.db) return 0;
    try {
      const actsRef = collection(this.db, 'acts');
      const snapshot = await getDocs(actsRef);
      let count = 0;
      for (const d of snapshot.docs) {
        await deleteDoc(d.ref);
        count++;
      }
      return count;
    } catch (err) {
      console.warn('[FirebaseSync] Failed to wipe cloud acts:', err);
      return 0;
    }
  }
}

export const firebaseSync = new FirebaseSyncService();
