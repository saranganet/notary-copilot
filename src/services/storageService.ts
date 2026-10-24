import type {
  NotarialAct,
  NotaryProfile,
  LegalDraft,
  NotaryAccount,
  AccessRequest,
  EmailOtpSession,
  AuthAuditEntry,
} from '../types/notary';
import { indexedDb, DB_STORES } from './indexedDbService';
import { firebaseSync } from './firebaseSyncService';

const STORAGE_KEYS = {
  ACTS: 'notary_acts_db_v3',
  PROFILE: 'notary_profile_v5',
  LANG: 'notary_lang_v1',
  DRAFTS: 'notary_drafts_v1',
  CURRENT_DRAFT: 'notary_current_draft_v1',
  SESSION_USER: 'notary_active_session_v1',
  SESSION_ACCOUNT: 'notary_active_account_v1',
  CUSTOM_NOTARIES: 'notary_custom_profiles_v1',
  ACCOUNTS: 'notary_accounts_v2',
  ACCESS_REQUESTS: 'notary_access_requests_v2',
  OTP_SESSIONS: 'notary_otp_sessions_v1',
  AUTH_AUDIT: 'notary_auth_audit_v1',
};

export const PRESET_NOTARIES: NotaryProfile[] = [
  {
    firmName: 'Advocate & Notary Public Chambers',
    notaryName: 'Adv. Notary Public',
    qualifications: 'B.A., LL.B., Advocate & Notary Public',
    regNo: 'Reg. No. 00000 / Govt. of India',
    areaOfPractice: 'District & Sessions Court Jurisdiction',
    officeAddress: 'Chambers Complex, District Court',
    mobile: '+91 98000 00000',
    email: 'notary@chambers.in',
    verificationDomain: 'notary.verify.gov.in',
    physicalStampingPreference: true,
  },
];

import { AUTHORIZED_ACCOUNTS } from '../config/authorizedAccounts';

export const DEFAULT_ACCOUNTS: NotaryAccount[] = AUTHORIZED_ACCOUNTS;

export const DEFAULT_NOTARY_PROFILE: NotaryProfile = AUTHORIZED_ACCOUNTS[0].profile;

export class StorageService {
  public static getLanguage(): 'en' | 'mr' | 'hi' {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as 'en' | 'mr' | 'hi') || 'en';
  }

  public static setLanguage(lang: 'en' | 'mr' | 'hi'): void {
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  }

  /**
   * User Authentication & Multi-Notary Session Management
   */
  public static getSessionUser(): NotaryProfile | null {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public static setSessionUser(profile: NotaryProfile): void {
    localStorage.setItem(STORAGE_KEYS.SESSION_USER, JSON.stringify(profile));
    this.saveProfile(profile);
  }

  public static getSessionAccount(): NotaryAccount | null {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION_ACCOUNT);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    const prof = this.getSessionUser();
    if (!prof) return null;
    return this.getAccounts().find((a) => a.profile.regNo === prof.regNo) || null;
  }

  public static setSessionAccount(account: NotaryAccount): void {
    localStorage.setItem(STORAGE_KEYS.SESSION_ACCOUNT, JSON.stringify(account));
  }

  public static clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.SESSION_USER);
    localStorage.removeItem(STORAGE_KEYS.SESSION_ACCOUNT);
  }

  public static isMasterAdmin(): boolean {
    const acc = this.getSessionAccount();
    return !!acc && acc.role === 'admin';
  }

  public static getAllNotaries(): NotaryProfile[] {
    const accounts = this.getAccounts();
    return accounts.map((acc) => acc.profile);
  }

  public static saveCustomNotary(profile: NotaryProfile): void {
    const existing = this.getAllNotaries();
    const updated = [profile, ...existing.filter((p) => p.regNo !== profile.regNo)];
    localStorage.setItem(STORAGE_KEYS.CUSTOM_NOTARIES, JSON.stringify(updated));
    this.setSessionUser(profile);
  }

  /**
   * Credential Authentication & Multi-Notary Account Management
   */
  public static getAccounts(): NotaryAccount[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    try {
      const stored: NotaryAccount[] = JSON.parse(raw);
      const accountsMap = new Map<string, NotaryAccount>();

      // Preserve custom accounts created by admin (excluding old demo/seed accounts)
      stored.forEach((acc) => {
        const u = acc.username.toLowerCase();
        if (u !== 'rajesh' && u !== 'anand' && u !== 'nileema' && u !== 'adv.nutan') {
          accountsMap.set(u, acc);
        }
      });

      // Synchronize current DEFAULT_ACCOUNTS from config
      DEFAULT_ACCOUNTS.forEach((d) => {
        accountsMap.set(d.username.toLowerCase(), d);
      });

      const result = Array.from(accountsMap.values());
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(result));
      return result;
    } catch {
      return DEFAULT_ACCOUNTS;
    }
  }

  public static saveAccount(account: NotaryAccount): void {
    const accounts = this.getAccounts();
    const filtered = accounts.filter(
      (a) => a.username.toLowerCase() !== account.username.toLowerCase()
    );
    const updated = [account, ...filtered];
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(updated));
    } catch {}

    // Persist to IndexedDB & Cloud
    indexedDb.put(DB_STORES.ACCOUNTS, account).catch(() => {});
    if (firebaseSync.isConfigured()) {
      firebaseSync.syncAccountsToCloud([account]).catch(() => {});
    }
  }

  public static authenticate(username: string, password: string): NotaryAccount | null {
    const trimmedUser = username.trim().toLowerCase();
    const accounts = this.getAccounts();
    const match = accounts.find(
      (acc) => acc.username.toLowerCase() === trimmedUser && acc.password === password.trim()
    );
    if (match) {
      if (match.status === 'suspended') {
        this.logAuthEvent(
          match.profile.email,
          'CREDENTIAL_LOGIN',
          'FAILURE',
          `Suspended user ${match.username} attempted to sign in`
        );
        throw new Error('This chamber account has been suspended. Please contact the platform administrator.');
      }

      match.lastLoginAt = new Date().toISOString();
      this.saveAccount(match);
      this.setSessionAccount(match);
      this.setSessionUser(match.profile);
      this.logAuthEvent(
        match.profile.email,
        'CREDENTIAL_LOGIN',
        'SUCCESS',
        `User ${match.username} authenticated successfully`
      );
      return match;
    }
    return null;
  }

  /**
   * High-Security Audit Logging for Legal Compliance
   */
  public static logAuthEvent(
    email: string,
    eventType: AuthAuditEntry['eventType'],
    status: 'SUCCESS' | 'FAILURE',
    details: string
  ): void {
    try {
      const logs = this.getAuthAuditLogs();
      const newEntry: AuthAuditEntry = {
        id: `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString(),
        email: email || 'unknown',
        eventType,
        ipAddress: '127.0.0.1 (Local Workstation)',
        status,
        details,
      };
      const updated = [newEntry, ...logs.slice(0, 99)]; // Keep recent 100 entries
      localStorage.setItem(STORAGE_KEYS.AUTH_AUDIT, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  }

  public static getAuthAuditLogs(): AuthAuditEntry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_AUDIT);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  /**
   * Find notary profile by registered email
   */
  public static findProfileByEmail(email: string): NotaryProfile | null {
    const normalized = email.trim().toLowerCase();
    const notaries = this.getAllNotaries();
    const found = notaries.find((p) => p.email.trim().toLowerCase() === normalized);
    return found || null;
  }

  /**
   * Generate & Dispatch 6-digit OTP for Email Authentication
   */
  public static sendEmailOtp(email: string): {
    success: boolean;
    otp: string;
    expiresAt: number;
    profile: NotaryProfile | null;
    isExistingUser: boolean;
  } {
    const normalized = email.trim().toLowerCase();
    // Cryptographically secure 6-digit code
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const otp = String(100000 + (array[0] % 900000));
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    const session: EmailOtpSession = {
      email: normalized,
      otp,
      expiresAt,
      attemptsLeft: 3,
      createdAt: Date.now(),
    };

    const sessions = this.getOtpSessions();
    const filtered = sessions.filter((s) => s.email !== normalized);
    filtered.push(session);
    localStorage.setItem(STORAGE_KEYS.OTP_SESSIONS, JSON.stringify(filtered));

    const existingProfile = this.findProfileByEmail(normalized);

    // Record statutory audit trail
    this.logAuthEvent(
      normalized,
      'OTP_REQUESTED',
      'SUCCESS',
      `6-digit authorization token generated for ${existingProfile ? existingProfile.notaryName : 'Chamber User'}`
    );

    return {
      success: true,
      otp,
      expiresAt,
      profile: existingProfile,
      isExistingUser: !!existingProfile,
    };
  }

  private static getOtpSessions(): EmailOtpSession[] {
    const raw = localStorage.getItem(STORAGE_KEYS.OTP_SESSIONS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  /**
   * Verify entered 6-digit OTP
   */
  public static verifyEmailOtp(
    email: string,
    enteredOtp: string
  ): {
    success: boolean;
    profile?: NotaryProfile;
    error?: string;
    attemptsLeft?: number;
  } {
    const normalized = email.trim().toLowerCase();
    const sessions = this.getOtpSessions();
    const session = sessions.find((s) => s.email === normalized);

    if (!session) {
      this.logAuthEvent(normalized, 'OTP_FAILED', 'FAILURE', 'Verification attempted with no active session');
      return { success: false, error: 'No OTP session found. Please request a new code.' };
    }

    if (Date.now() > session.expiresAt) {
      this.logAuthEvent(normalized, 'OTP_FAILED', 'FAILURE', 'Expired security token submitted');
      return { success: false, error: 'Authorization code has expired. Please request a new one.' };
    }

    if (session.attemptsLeft <= 0) {
      this.logAuthEvent(normalized, 'OTP_FAILED', 'FAILURE', 'Maximum failed attempts exceeded');
      return { success: false, error: 'Too many incorrect attempts. Please request a fresh OTP.' };
    }

    if (session.otp !== enteredOtp.trim()) {
      session.attemptsLeft -= 1;
      localStorage.setItem(STORAGE_KEYS.OTP_SESSIONS, JSON.stringify(sessions));
      this.logAuthEvent(
        normalized,
        'OTP_FAILED',
        'FAILURE',
        `Incorrect code entered. ${session.attemptsLeft} attempts remaining.`
      );
      return {
        success: false,
        error: 'Invalid verification code. Please check the digits and try again.',
        attemptsLeft: session.attemptsLeft,
      };
    }

    // OTP is valid!
    // Remove the used session
    const remaining = sessions.filter((s) => s.email !== normalized);
    localStorage.setItem(STORAGE_KEYS.OTP_SESSIONS, JSON.stringify(remaining));

    // Resolve or generate Notary Profile for this email
    let profile = this.findProfileByEmail(normalized);
    if (!profile) {
      const nameParts = normalized.split('@')[0].replace(/[._]/g, ' ');
      const formattedName = nameParts.replace(/\b\w/g, (c) => c.toUpperCase());
      const randomReg = Math.floor(14000 + Math.random() * 85000);

      profile = {
        firmName: `${formattedName} & Associates Chambers`,
        notaryName: `Adv. ${formattedName}`,
        qualifications: 'B.A., LL.B., Advocate & Notary Public',
        regNo: `Reg. No. ${randomReg} / Govt. of India`,
        areaOfPractice: 'District & Sessions Court Jurisdiction',
        officeAddress: 'Chambers of Legal Practice, District Court Complex',
        mobile: '+91 98220 99999',
        email: normalized,
        verificationDomain: 'notary.law.in',
        physicalStampingPreference: true,
      };

      this.saveAccount({
        username: normalized.split('@')[0],
        password: 'notary123',
        role: 'notary',
        profile,
        createdAt: new Date().toISOString(),
      });
    }

    this.setSessionUser(profile);

    this.logAuthEvent(
      normalized,
      'OTP_VERIFIED',
      'SUCCESS',
      `Identity cryptographically authenticated for ${profile.notaryName} (${profile.regNo})`
    );

    return {
      success: true,
      profile,
    };
  }

  /**
   * Access Requests for Notaries Interested in Portal Access
   */
  public static getAccessRequests(): AccessRequest[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCESS_REQUESTS);
    if (!raw) return [];
    try {
      const parsed: AccessRequest[] = JSON.parse(raw);
      return parsed.filter((r) => r.id !== 'REQ-DEMO-01');
    } catch {
      return [];
    }
  }

  public static createAccessRequest(
    data: Omit<AccessRequest, 'id' | 'status' | 'requestedAt'>
  ): AccessRequest {
    const existing = this.getAccessRequests();
    const newReq: AccessRequest = {
      ...data,
      id: `REQ-${Date.now().toString(36).toUpperCase()}`,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };
    const updated = [newReq, ...existing];
    localStorage.setItem(STORAGE_KEYS.ACCESS_REQUESTS, JSON.stringify(updated));
    return newReq;
  }

  public static updateAccessRequest(id: string, status: 'approved' | 'rejected'): void {
    const existing = this.getAccessRequests();
    const updated = existing.map((r) => (r.id === id ? { ...r, status } : r));
    localStorage.setItem(STORAGE_KEYS.ACCESS_REQUESTS, JSON.stringify(updated));
  }


  /**
   * Retrieves all recorded notarial acts scoped to the active notary chamber
   */
  public static getNotaryKey(profile?: NotaryProfile): string {
    const active = profile || this.getSessionUser() || this.getProfile();
    if (!active) return 'default';
    const numMatch = active.regNo.match(/\d+/);
    if (numMatch) return numMatch[0];
    return active.notaryName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'default';
  }

  public static getNotaryInitials(name: string): string {
    if (!name) return 'NOT';
    const clean = name.replace(/^(Adv(\.|ocate)?|Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'NOT';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  public static isDemoAct(act: NotarialAct): boolean {
    if (!act) return false;
    if (act.id && (act.id.startsWith('ns-act-8842') || act.id.startsWith('aff-9821') || act.id.startsWith('gap-1234') || act.id.startsWith('rv-act-') || act.id.startsWith('ak-act-'))) {
      return true;
    }
    if (act.serialNo && (act.serialNo === 'NS-2026-0018' || act.serialNo === 'NS-2026-0017' || act.serialNo === 'NS-2026-0016' || act.serialNo === 'RV-2026-0008' || act.serialNo === 'AK-2026-0005')) {
      return true;
    }
    if (act.parties && act.parties.some((p) => p.name === 'Rajesh Patil' || p.name === 'Aditya Verma' || p.name === 'Sanjay Deshmukh' || p.name === 'Vikram Malhotra')) {
      return true;
    }
    return false;
  }

  public static purgeDemoData(): void {
    try {
      // Clear draft with demo data
      const currentDraft = localStorage.getItem(STORAGE_KEYS.CURRENT_DRAFT);
      if (
        currentDraft &&
        (currentDraft.includes('Rajesh Patil') ||
          currentDraft.includes('NS-2026-0018') ||
          currentDraft.includes('Sanjay Deshmukh') ||
          currentDraft.includes('Gandhi Chowk') ||
          currentDraft.includes('984211223344') ||
          currentDraft.includes('General Affidavit - Solemn Affirmation'))
      ) {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_DRAFT);
      }

      // Also clean up any saved drafts containing demo data
      const rawDrafts = localStorage.getItem(STORAGE_KEYS.DRAFTS);
      if (rawDrafts) {
        try {
          const drafts: LegalDraft[] = JSON.parse(rawDrafts);
          if (Array.isArray(drafts)) {
            const cleaned = drafts.filter(
              (d) =>
                !d.contentHtml.includes('Rajesh Patil') &&
                !d.contentHtml.includes('NS-2026-0018') &&
                !d.contentHtml.includes('Sanjay Deshmukh') &&
                !d.title.includes('General Affidavit - Solemn Affirmation')
            );
            localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(cleaned));
          }
        } catch {}
      }

      // Clean all chamber act keys in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEYS.ACTS)) {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              const acts: NotarialAct[] = JSON.parse(raw);
              if (Array.isArray(acts)) {
                const cleaned = acts.filter((a) => !this.isDemoAct(a));
                if (cleaned.length !== acts.length) {
                  localStorage.setItem(key, JSON.stringify(cleaned));
                }
              }
            } catch {}
          }
        }
      }
    } catch {}
  }

  /**
   * Completely wipe all user data (notarial acts, drafts, biometric scans,
   * client records, access requests, and audit logs) across all users.
   * Keeps authorized chamber credentials with clean 0-entry registers.
   */
  public static async wipeAllUserData(): Promise<{ wipedActs: number; wipedDrafts: number; status: string }> {
    let wipedActsCount = 0;
    let wipedDraftsCount = 0;

    try {
      // 1. Remove all drafts
      const rawDrafts = localStorage.getItem(STORAGE_KEYS.DRAFTS);
      if (rawDrafts) {
        try {
          const drafts = JSON.parse(rawDrafts);
          if (Array.isArray(drafts)) wipedDraftsCount = drafts.length;
        } catch {}
      }
      localStorage.removeItem(STORAGE_KEYS.DRAFTS);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_DRAFT);

      // 2. Remove all chamber acts from localStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith(STORAGE_KEYS.ACTS) || key.startsWith('notary_acts_'))) {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              const acts = JSON.parse(raw);
              if (Array.isArray(acts)) wipedActsCount += acts.length;
            } catch {}
          }
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));

      // 3. Clear access requests, otp sessions, and audit logs
      localStorage.removeItem(STORAGE_KEYS.ACCESS_REQUESTS);
      localStorage.removeItem(STORAGE_KEYS.OTP_SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.AUTH_AUDIT);
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_NOTARIES);

      // 4. Wipe high-capacity IndexedDB stores (acts, drafts, audit)
      await indexedDb.clearUserData();

      // 5. If Firebase is active, purge all cloud acts
      if (firebaseSync.isConfigured()) {
        await firebaseSync.wipeAllCloudActs();
      }

      // Log clean wipe audit
      const sessionUser = this.getSessionUser();
      this.logAuthEvent(
        sessionUser?.email || 'admin@notarydesk.in',
        'DATA_WIPED',
        'SUCCESS',
        `Complete wipe executed: removed ${wipedActsCount} acts and ${wipedDraftsCount} drafts across all chambers.`
      );

      return {
        wipedActs: wipedActsCount,
        wipedDrafts: wipedDraftsCount,
        status: 'SUCCESS',
      };
    } catch (err) {
      console.error('[StorageService] Error wiping all user data:', err);
      return {
        wipedActs: wipedActsCount,
        wipedDrafts: wipedDraftsCount,
        status: 'PARTIAL_ERROR',
      };
    }
  }

  public static getActs(profile?: NotaryProfile): NotarialAct[] {
    const active = profile || this.getSessionUser() || this.getProfile();
    const notaryKey = this.getNotaryKey(active);
    const specificStorageKey = `${STORAGE_KEYS.ACTS}_${notaryKey}`;

    const raw = localStorage.getItem(specificStorageKey);
    if (raw) {
      try {
        const parsed: NotarialAct[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const cleanActs = parsed.filter((a) => !this.isDemoAct(a));
          if (cleanActs.length !== parsed.length) {
            this.saveActs(cleanActs, active);
          }
          return cleanActs;
        }
      } catch (e) {
        console.error('Failed to parse stored acts:', e);
      }
    }

    return [];
  }

  public static saveActs(acts: NotarialAct[], profile?: NotaryProfile): void {
    const active = profile || this.getSessionUser() || this.getProfile();
    const notaryKey = this.getNotaryKey(active);
    const specificStorageKey = `${STORAGE_KEYS.ACTS}_${notaryKey}`;

    try {
      localStorage.setItem(specificStorageKey, JSON.stringify(acts));
      if (notaryKey === '15960' || !active) {
        localStorage.setItem(STORAGE_KEYS.ACTS, JSON.stringify(acts));
      }
    } catch (quotaErr) {
      console.warn('[StorageService] LocalStorage quota reached. Protected by IndexedDB:', quotaErr);
    }

    // Unbounded High-Capacity Local Storage in IndexedDB
    indexedDb.putMany(DB_STORES.ACTS, acts).catch((err) => {
      console.warn('[StorageService] IndexedDB putMany warning:', err);
    });

    // Cloud Backup if Firebase is configured
    if (firebaseSync.isConfigured() && active) {
      const acc = this.getAccounts().find((a) => a.profile.regNo === active.regNo);
      const chamberUser = acc ? acc.username : notaryKey;
      firebaseSync.syncAllActsToCloud(acts, chamberUser).catch(() => {});
    }
  }

  public static saveAct(act: NotarialAct, profile?: NotaryProfile): void {
    const acts = this.getActs(profile);
    const existingIndex = acts.findIndex((a) => a.id === act.id);
    if (existingIndex >= 0) {
      acts[existingIndex] = act;
    } else {
      acts.unshift(act);
    }
    this.saveActs(acts, profile);

    const active = profile || this.getSessionUser() || this.getProfile();
    const acc = active ? this.getAccounts().find((a) => a.profile.regNo === active.regNo) : null;
    const chamberUser = acc ? acc.username : this.getNotaryKey(active);

    indexedDb.put(DB_STORES.ACTS, { ...act, chamberUsername: chamberUser }).catch(() => {});
    if (firebaseSync.isConfigured()) {
      firebaseSync.syncActToCloud(act, chamberUser).catch(() => {});
    }
  }

  public static deleteAct(id: string, profile?: NotaryProfile): void {
    const acts = this.getActs(profile).filter((a) => a.id !== id);
    this.saveActs(acts, profile);
    indexedDb.delete(DB_STORES.ACTS, id).catch(() => {});
  }

  /**
   * Drafts management for Notary Document Editor
   */
  public static getDrafts(): LegalDraft[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DRAFTS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public static saveDrafts(drafts: LegalDraft[]): void {
    localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
  }

  public static saveDraft(draft: LegalDraft): void {
    const drafts = this.getDrafts();
    const idx = drafts.findIndex((d) => d.id === draft.id);
    if (idx >= 0) {
      drafts[idx] = draft;
    } else {
      drafts.unshift(draft);
    }
    this.saveDrafts(drafts);
    this.saveCurrentDraft(draft);
  }

  public static deleteDraft(id: string): void {
    const drafts = this.getDrafts().filter((d) => d.id !== id);
    this.saveDrafts(drafts);
  }

  public static getCurrentDraft(): LegalDraft | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_DRAFT);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public static saveCurrentDraft(draft: LegalDraft): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_DRAFT, JSON.stringify(draft));
  }

  public static clearCurrentDraft(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_DRAFT);
  }

  public static getActById(id: string, profile?: NotaryProfile): NotarialAct | undefined {
    return this.getActs(profile).find((a) => a.id === id);
  }

  public static getActBySerial(serialNo: string, profile?: NotaryProfile): NotarialAct | undefined {
    const normalized = serialNo.trim().toUpperCase();
    return this.getActs(profile).find(
      (a) =>
        a.serialNo.toUpperCase() === normalized ||
        a.verifiedToken.toUpperCase() === normalized
    );
  }

  /**
   * Search all chamber registers to resolve public QR verification scans
   */
  public static findActAcrossChambers(serialNo: string): { act: NotarialAct; profile: NotaryProfile } | null {
    const normalized = serialNo.trim().toUpperCase();
    const accounts = this.getAccounts();

    // 1. Search across all known authorized accounts
    for (const acc of accounts) {
      const acts = this.getActs(acc.profile);
      const match = acts.find(
        (a) =>
          a.serialNo.toUpperCase() === normalized ||
          a.verifiedToken.toUpperCase() === normalized
      );
      if (match) {
        return { act: match, profile: acc.profile };
      }
    }

    // 2. Search legacy store if not yet migrated
    const legacyRaw = localStorage.getItem(STORAGE_KEYS.ACTS);
    if (legacyRaw) {
      try {
        const legacyActs: NotarialAct[] = JSON.parse(legacyRaw);
        const match = legacyActs.find(
          (a) =>
            a.serialNo.toUpperCase() === normalized ||
            a.verifiedToken.toUpperCase() === normalized
        );
        if (match) {
          return { act: match, profile: DEFAULT_NOTARY_PROFILE };
        }
      } catch {}
    }

    return null;
  }

  public static getNextSerialNo(profile?: NotaryProfile): string {
    const active = profile || this.getSessionUser() || this.getProfile();
    const acts = this.getActs(active);
    const year = new Date().getFullYear();
    const initials = this.getNotaryInitials(active?.notaryName || 'Adv. Notary Public');
    const prefix = `${initials}-${year}-`;

    const matchingActs = acts.filter((a) => a.serialNo && a.serialNo.startsWith(prefix));
    const numbers = matchingActs
      .map((a) => {
        if (!a.serialNo) return 0;
        const match = a.serialNo.match(/(\d+)$/);
        if (match) return parseInt(match[1], 10);
        const all = a.serialNo.match(/\d+/g);
        if (all && all.length > 0) {
          return parseInt(all[all.length - 1], 10);
        }
        return 0;
      })
      .filter((n) => !isNaN(n) && n > 0 && n < 100000);

    const max = numbers.length > 0 ? Math.max(...numbers) : 0;
    const next = max + 1;
    return `${prefix}${next.toString().padStart(4, '0')}`;
  }

  public static getProfile(): NotaryProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      this.saveProfile(DEFAULT_NOTARY_PROFILE);
      return DEFAULT_NOTARY_PROFILE;
    }
    try {
      return { ...DEFAULT_NOTARY_PROFILE, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_NOTARY_PROFILE;
    }
  }

  public static saveProfile(profile: NotaryProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }

  public static exportBackup(): string {
    const data = {
      acts: this.getActs(),
      profile: this.getProfile(),
      exportedAt: new Date().toISOString(),
      version: '3.0',
    };
    return JSON.stringify(data, null, 2);
  }

  public static importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.acts && Array.isArray(parsed.acts)) {
        this.saveActs(parsed.acts);
      }
      if (parsed.profile) {
        this.saveProfile(parsed.profile);
      }
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }


  public static createSamplePreviewAct(profile?: NotaryProfile): NotarialAct {
    const prof = profile || this.getProfile();
    const regInitials = prof.regNo.replace(/[^a-zA-Z0-9]/g, '').slice(0, 5).toUpperCase() || 'NOTARY';
    const year = new Date().getFullYear();
    const today = new Date().toISOString().split('T')[0];

    return {
      id: 'sample-preview-act',
      serialNo: `${regInitials}/${year}/SAMPLE-01`,
      date: today,
      documentType: 'General Affidavit',
      customDocumentTitle: 'Affidavit of Solemn Affirmation & Attestation',
      parties: [
        {
          id: 'sample-party-1',
          role: 'Deponent',
          name: 'Rameshwar D. Sharma',
          relationType: 'S/o',
          relativeName: 'Dinanath Sharma',
          age: '38',
          address: 'B-402, Shanti Heights, Station Road, Near Court Complex',
          idType: 'Aadhaar Card',
          idNumber: 'XXXX-XXXX-4589',
          mobile: '+91 98765 43210',
          signatureMode: 'physical',
        },
        {
          id: 'sample-party-2',
          role: 'Witness',
          name: 'Adv. Suresh V. Patil',
          relationType: 'S/o',
          relativeName: 'Vilas Patil',
          age: '42',
          address: 'Bar Association Room No. 4, District Court Complex',
          idType: 'Other Official ID',
          idNumber: 'MAH/BAR/2012/88',
          mobile: '+91 98230 11223',
          signatureMode: 'physical',
        },
      ],
      feesCharged: 100,
      stampValue: 100,
      bookNo: 1,
      pageNo: 1,
      notes: 'Sample preview for verification of certificate typography, layout, and QR seal.',
      watermark: 'Preview',
      verifiedToken: 'SAMPLE-VERIFY-' + Date.now().toString(36).toUpperCase(),
      createdAt: new Date().toISOString(),
      status: 'Completed',
    };
  }

}
