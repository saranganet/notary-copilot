/**
 * IndexedDB Local Engine for Notary Copilot
 * 
 * Provides unbounded local storage (hundreds of MBs to GBs) for:
 * - Notarial Acts & Form XV Registers
 * - High-resolution 500 DPI SecuGen biometric thumb impressions
 * - Client Webcam / Passport photos
 * - Legal drafts & templates
 * - Authorized chamber accounts & profiles
 * 
 * This completely prevents QuotaExceededError crashes that happen in localStorage.
 */

const DB_NAME = 'notary_copilot_indexed_db';
const DB_VERSION = 1;

export const DB_STORES = {
  ACTS: 'acts',
  ACCOUNTS: 'accounts',
  DRAFTS: 'drafts',
  PROFILES: 'profiles',
  AUDIT: 'audit',
  SETTINGS: 'settings',
} as const;

export type DbStoreName = (typeof DB_STORES)[keyof typeof DB_STORES];

class IndexedDbService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  public async getDb(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported on this platform.'));
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Acts Store
        if (!db.objectStoreNames.contains(DB_STORES.ACTS)) {
          const actStore = db.createObjectStore(DB_STORES.ACTS, { keyPath: 'id' });
          actStore.createIndex('serialNo', 'serialNo', { unique: false });
          actStore.createIndex('chamberUsername', 'chamberUsername', { unique: false });
          actStore.createIndex('date', 'date', { unique: false });
        }

        // Accounts Store (Keyed by unique username)
        if (!db.objectStoreNames.contains(DB_STORES.ACCOUNTS)) {
          const accStore = db.createObjectStore(DB_STORES.ACCOUNTS, { keyPath: 'username' });
          accStore.createIndex('role', 'role', { unique: false });
        }

        // Drafts Store
        if (!db.objectStoreNames.contains(DB_STORES.DRAFTS)) {
          db.createObjectStore(DB_STORES.DRAFTS, { keyPath: 'id' });
        }

        // Profiles Store
        if (!db.objectStoreNames.contains(DB_STORES.PROFILES)) {
          db.createObjectStore(DB_STORES.PROFILES, { keyPath: 'regNo' });
        }

        // Audit Logs Store
        if (!db.objectStoreNames.contains(DB_STORES.AUDIT)) {
          const auditStore = db.createObjectStore(DB_STORES.AUDIT, { keyPath: 'id' });
          auditStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Settings Store (key-value)
        if (!db.objectStoreNames.contains(DB_STORES.SETTINGS)) {
          db.createObjectStore(DB_STORES.SETTINGS, { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });

    return this.dbPromise;
  }

  public async getAll<T>(storeName: DbStoreName): Promise<T[]> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result as T[]);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn(`[IndexedDB] Failed getAll from ${storeName}:`, err);
      return [];
    }
  }

  public async get<T>(storeName: DbStoreName, key: IDBValidKey): Promise<T | null> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(key);
        req.onsuccess = () => resolve((req.result as T) ?? null);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn(`[IndexedDB] Failed get from ${storeName} key=${String(key)}:`, err);
      return null;
    }
  }

  public async put<T>(storeName: DbStoreName, value: T): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.put(value);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error(`[IndexedDB] Failed put to ${storeName}:`, err);
    }
  }

  public async putMany<T>(storeName: DbStoreName, items: T[]): Promise<void> {
    if (!items.length) return;
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        items.forEach((item) => store.put(item));
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.error(`[IndexedDB] Failed putMany to ${storeName}:`, err);
    }
  }

  public async delete(storeName: DbStoreName, key: IDBValidKey): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error(`[IndexedDB] Failed delete from ${storeName} key=${String(key)}:`, err);
    }
  }

  public async clear(storeName: DbStoreName): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.error(`[IndexedDB] Failed clear ${storeName}:`, err);
    }
  }

  public async clearUserData(): Promise<void> {
    await this.clear(DB_STORES.ACTS);
    await this.clear(DB_STORES.DRAFTS);
    await this.clear(DB_STORES.AUDIT);
  }

  public async getSetting<T>(key: string, defaultValue: T): Promise<T> {
    const res = await this.get<{ key: string; value: T }>(DB_STORES.SETTINGS, key);
    return res ? res.value : defaultValue;
  }

  public async setSetting<T>(key: string, value: T): Promise<void> {
    await this.put(DB_STORES.SETTINGS, { key, value });
  }
}

export const indexedDb = new IndexedDbService();
