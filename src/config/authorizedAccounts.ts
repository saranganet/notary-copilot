import type { NotaryAccount } from '../types/notary';

/**
 * AUTHORIZED CHAMBER ACCOUNTS
 * 
 * You can add, edit, or configure hard-coded usernames and passwords here.
 * Anyone with these credentials can immediately log into their respective chamber.
 */
export const AUTHORIZED_ACCOUNTS: NotaryAccount[] = [
  {
    username: 'nileema',
    password: 'notary123',
    role: 'admin',
    profile: {
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
    createdAt: '2026-01-01',
  },
  {
    username: 'adv.nutan',
    password: 'notary@nutan',
    role: 'notary',
    profile: {
      firmName: 'Adv. Nutan Hegde',
      notaryName: 'Adv. Nutan Hegde',
      qualifications: 'B.L.S, LL.B, Notary Public',
      regNo: 'Reg. No. 15874 / Govt. of India',
      areaOfPractice: 'Mumbai District',
      officeAddress: 'Shop no. 8, Sai Hemlaxmi Tower, Near Gurudwara, Rambaug Lane No. 4, Kalyan(W), 421301',
      mobile: '+91 98704 28657',
      email: 'nutanvhegde@gmail.com',
      verificationDomain: 'notary.hegde.in',
      physicalStampingPreference: true,
    },
    createdAt: '2026-01-01',
  }
];
