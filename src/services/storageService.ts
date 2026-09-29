import type { NotarialAct, NotaryProfile, LegalDraft, NotaryAccount, AccessRequest } from '../types/notary';

const STORAGE_KEYS = {
  ACTS: 'notary_acts_db_v3',
  PROFILE: 'notary_profile_v5',
  LANG: 'notary_lang_v1',
  DRAFTS: 'notary_drafts_v1',
  CURRENT_DRAFT: 'notary_current_draft_v1',
  SESSION_USER: 'notary_active_session_v1',
  CUSTOM_NOTARIES: 'notary_custom_profiles_v1',
  ACCOUNTS: 'notary_accounts_v2',
  ACCESS_REQUESTS: 'notary_access_requests_v2',
};

export const PRESET_NOTARIES: NotaryProfile[] = [
  {
    firmName: 'Advocate Nileema Saranga & Chambers',
    notaryName: 'Adv. Nileema Saranga',
    qualifications: 'B.A., LL.B., Advocate & Notary Public',
    regNo: 'Reg. No. 15960 / Govt. of India',
    areaOfPractice: 'Badlapur, Ulhasnagar, Kalyan & Thane District',
    officeAddress: 'Shop no. 12, Opp. IDBI Bank, Gandhi Chowk, Badlapur East, Thane 421503',
    mobile: '+91 98220 12345',
    email: 'adv.nileemasaranga@gmail.com',
    verificationDomain: 'notary.saranga.in',
    physicalStampingPreference: true,
  },
  {
    firmName: 'Verma & Associates Legal Chamber',
    notaryName: 'Adv. Rajesh K. Verma',
    qualifications: 'B.Sc., LL.M., Notary Public',
    regNo: 'Reg. No. 12480 / Govt. of India',
    areaOfPractice: 'Patiala House Courts & New Delhi District',
    officeAddress: 'Chamber 114, Lawyers Block, Patiala House Courts, New Delhi 110001',
    mobile: '+91 98110 54321',
    email: 'adv.rajeshverma@delhibar.org',
    verificationDomain: 'verma-notary.gov.in',
    physicalStampingPreference: true,
  },
  {
    firmName: 'Kulkarni Notary Chambers',
    notaryName: 'Adv. Anand R. Kulkarni',
    qualifications: 'B.A., LL.B., Notary Public',
    regNo: 'Reg. No. 18210 / Govt. of India',
    areaOfPractice: 'Shivajinagar & Pune District',
    officeAddress: 'Office 3, District Court Complex, Shivajinagar, Pune 411005',
    mobile: '+91 94220 98765',
    email: 'adv.anandkulkarni@punebar.in',
    verificationDomain: 'kulkarni.notary.in',
    physicalStampingPreference: true,
  },
];

export const DEFAULT_ACCOUNTS: NotaryAccount[] = [
  {
    username: 'nileema',
    password: 'notary123',
    role: 'admin',
    profile: PRESET_NOTARIES[0],
    createdAt: '2026-01-01',
  },
  {
    username: 'rajesh',
    password: 'notary123',
    role: 'notary',
    profile: PRESET_NOTARIES[1],
    createdAt: '2026-01-01',
  },
  {
    username: 'anand',
    password: 'notary123',
    role: 'notary',
    profile: PRESET_NOTARIES[2],
    createdAt: '2026-01-01',
  },
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    profile: PRESET_NOTARIES[0],
    createdAt: '2026-01-01',
  },
];

export const DEFAULT_NOTARY_PROFILE: NotaryProfile = PRESET_NOTARIES[0];

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

  public static clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.SESSION_USER);
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
      // Ensure default accounts are present
      const merged = [...stored];
      DEFAULT_ACCOUNTS.forEach((d) => {
        if (!merged.some((m) => m.username.toLowerCase() === d.username.toLowerCase())) {
          merged.push(d);
        }
      });
      return merged;
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
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(updated));
  }

  public static authenticate(username: string, password: string): NotaryAccount | null {
    const trimmedUser = username.trim().toLowerCase();
    const accounts = this.getAccounts();
    const match = accounts.find(
      (acc) => acc.username.toLowerCase() === trimmedUser && acc.password === password.trim()
    );
    if (match) {
      this.setSessionUser(match.profile);
      return match;
    }
    return null;
  }

  /**
   * Access Requests for Notaries Interested in Portal Access
   */
  public static getAccessRequests(): AccessRequest[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCESS_REQUESTS);
    if (!raw) {
      // Seed with one sample demo request so the owner can see how it works!
      const initial: AccessRequest[] = [
        {
          id: 'REQ-DEMO-01',
          applicantName: 'Adv. Suresh M. Patil',
          regNo: 'MH/19842/2024',
          mobile: '+91 98230 45678',
          email: 'adv.spatil@gmail.com',
          jurisdiction: 'Kalyan & Dombivli District Court',
          status: 'pending',
          requestedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          notes: 'Interested in digital register and biometric attestation for daily notary work.',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.ACCESS_REQUESTS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
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
   * Retrieves all recorded notarial acts
   */
  public static getActs(): NotarialAct[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTS);
    if (!raw) {
      const initial = this.getInitialSeedActs();
      this.saveActs(initial);
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse stored acts:', e);
      return [];
    }
  }

  public static saveActs(acts: NotarialAct[]): void {
    localStorage.setItem(STORAGE_KEYS.ACTS, JSON.stringify(acts));
  }

  public static saveAct(act: NotarialAct): void {
    const acts = this.getActs();
    const existingIndex = acts.findIndex((a) => a.id === act.id);
    if (existingIndex >= 0) {
      acts[existingIndex] = act;
    } else {
      acts.unshift(act);
    }
    this.saveActs(acts);
  }

  public static deleteAct(id: string): void {
    const acts = this.getActs().filter((a) => a.id !== id);
    this.saveActs(acts);
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

  public static getActById(id: string): NotarialAct | undefined {
    return this.getActs().find((a) => a.id === id);
  }

  public static getActBySerial(serialNo: string): NotarialAct | undefined {
    const normalized = serialNo.trim().toUpperCase();
    return this.getActs().find(
      (a) =>
        a.serialNo.toUpperCase() === normalized ||
        a.verifiedToken.toUpperCase() === normalized
    );
  }

  public static getNextSerialNo(): string {
    const acts = this.getActs();
    const year = new Date().getFullYear();
    const prefix = `NS-${year}-`;

    const numbers = acts
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

    const max = numbers.length > 0 ? Math.max(...numbers) : 18;
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

  /**
   * Generates sample starter data customized for Adv. Nileema Saranga
   */
  private static getInitialSeedActs(): NotarialAct[] {
    const sampleFingerprint = this.generateSampleFingerprintSvg();
    const sampleOwnerPhoto = this.generateAvatarSvg('RP', '#0284C7');
    const sampleTenantPhoto = this.generateAvatarSvg('SD', '#0D9488');
    const sampleWitnessPhoto = this.generateAvatarSvg('AS', '#4F46E5');

    const seedAct: NotarialAct = {
      id: 'ns-act-8842-4123-b1c4-09871234abcd',
      serialNo: 'NS-2026-0018',
      date: '2026-09-08',
      documentType: 'Rental Agreement',
      customDocumentTitle: 'Residential Tenancy Agreement (11 Months)',
      status: 'Completed',
      feesCharged: 500,
      stampValue: 100,
      bookNo: 1,
      pageNo: 28,
      watermark: 'Preview',
      verifiedToken: 'NS-VERIFY-0018',
      createdAt: '2026-09-08T17:45:00.000Z',
      parties: [
        {
          id: 'p-1',
          role: 'Owner',
          name: 'Rajesh Patil',
          relationType: 'S/o',
          relativeName: 'Anant Patil',
          age: '46',
          address: 'Gandhi Chowk, Badlapur East 421503',
          idType: 'Aadhaar Card',
          idNumber: '984211223344',
          mobile: '9822101010',
          photoUrl: sampleOwnerPhoto,
          fingerprintUrl: sampleFingerprint,
          fingerprintQuality: 93,
          fingerprintCapturedAt: '2026-09-08 17:48:12',
          signatureMode: 'physical',
        },
        {
          id: 'p-2',
          role: 'Tenant',
          name: 'Sanjay Deshmukh',
          relationType: 'S/o',
          relativeName: 'Prakash Deshmukh',
          age: '31',
          address: 'Station Road, Badlapur East 421503',
          idType: 'PAN Card',
          idNumber: 'ABCDE1234F',
          mobile: '9823445566',
          photoUrl: sampleTenantPhoto,
          fingerprintUrl: sampleFingerprint,
          fingerprintQuality: 91,
          fingerprintCapturedAt: '2026-09-08 17:50:45',
          signatureMode: 'physical',
        },
        {
          id: 'p-3',
          role: 'Witness',
          name: 'Amit Shinde',
          relationType: 'S/o',
          relativeName: 'Dattatray Shinde',
          age: '38',
          address: 'Katrap, Badlapur East 421503',
          idType: 'Aadhaar Card',
          idNumber: '776655443322',
          mobile: '9822778899',
          photoUrl: sampleWitnessPhoto,
          fingerprintUrl: sampleFingerprint,
          fingerprintQuality: 95,
          fingerprintCapturedAt: '2026-09-08 17:52:19',
          signatureMode: 'physical',
        },
      ],
    };

    const affidavitAct: NotarialAct = {
      id: 'aff-9821-4123-b1c4-09871234abcd',
      serialNo: 'NS-2026-0017',
      date: '2026-09-07',
      documentType: 'General Affidavit',
      customDocumentTitle: 'Affidavit for Change of Name in Govt Records',
      status: 'Completed',
      feesCharged: 250,
      stampValue: 100,
      bookNo: 1,
      pageNo: 27,
      watermark: 'Official',
      verifiedToken: 'NS-VERIFY-0017',
      createdAt: '2026-09-07T11:20:00.000Z',
      parties: [
        {
          id: 'p-aff-1',
          role: 'Deponent',
          name: 'Sunita Sharma',
          relationType: 'W/o',
          relativeName: 'Vikram Sharma',
          age: '35',
          address: 'Rameshwar Park, Badlapur East 421503',
          idType: 'Aadhaar Card',
          idNumber: 'XXXX-XXXX-9921',
          mobile: '9823112233',
          photoUrl: sampleTenantPhoto,
          fingerprintUrl: sampleFingerprint,
          fingerprintQuality: 95,
          signatureMode: 'physical',
        },
        {
          id: 'p-aff-2',
          role: 'Witness',
          name: 'Adv. K. R. Joshi',
          relationType: 'S/o',
          relativeName: 'R. K. Joshi',
          age: '42',
          address: 'Badlapur Bar Association, Badlapur',
          idType: 'Voter ID',
          idNumber: 'MH/12/3421',
          mobile: '9822334455',
          photoUrl: sampleWitnessPhoto,
          fingerprintUrl: sampleFingerprint,
          fingerprintQuality: 88,
          signatureMode: 'physical',
        },
      ],
    };

    return [seedAct, affidavitAct];
  }

  private static generateAvatarSvg(initials: string, bg: string): string {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="240" viewBox="0 0 200 240">
      <rect width="200" height="240" fill="#F1F5F9"/>
      <circle cx="100" cy="90" r="45" fill="${bg}"/>
      <path d="M40 220 C40 160, 160 160, 160 220 Z" fill="${bg}" opacity="0.85"/>
      <text x="100" y="102" font-size="28" font-family="sans-serif" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${initials}</text>
      <rect x="10" y="210" width="180" height="22" rx="4" fill="#0F172A" opacity="0.75"/>
      <text x="100" y="225" font-size="9" font-family="monospace" fill="#F8FAFC" text-anchor="middle">LIVE WEBCAM VERIFIED</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  private static generateSampleFingerprintSvg(): string {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="240" viewBox="0 0 200 240">
      <rect width="200" height="240" fill="#FFFFFF"/>
      <g stroke="#1E293B" stroke-width="2" fill="none" stroke-linecap="round">
        <path d="M100 40 C60 40, 45 80, 45 120 C45 165, 65 200, 100 200 C135 200, 155 165, 155 120 C155 80, 140 40, 100 40 Z"/>
        <path d="M100 55 C70 55, 60 85, 60 120 C60 155, 75 185, 100 185 C125 185, 140 155, 140 120 C140 85, 130 55, 100 55 Z"/>
        <path d="M100 70 C80 70, 72 90, 72 120 C72 145, 82 170, 100 170 C118 170, 128 145, 128 120 C128 90, 120 70, 100 70 Z"/>
        <path d="M100 85 C88 85, 82 100, 82 120 C82 138, 90 155, 100 155 C110 155, 118 138, 118 120 C118 100, 112 85, 100 85 Z"/>
        <path d="M100 100 C95 100, 92 108, 92 120 C92 130, 95 140, 100 140 C105 140, 108 130, 108 120 C108 108, 105 100, 100 100 Z"/>
        <circle cx="100" cy="120" r="3" fill="#1E293B"/>
      </g>
      <rect x="25" y="210" width="150" height="20" rx="3" fill="#0F766E"/>
      <text x="100" y="224" font-size="9" font-family="monospace" font-weight="bold" fill="#F0FDFA" text-anchor="middle">SECUGEN VERIFIED (93%)</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }
}
