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
    username: 'rajesh',
    password: 'notary123',
    role: 'notary',
    profile: {
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
    createdAt: '2026-01-01',
  },
  {
    username: 'anand',
    password: 'notary123',
    role: 'notary',
    profile: {
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
    createdAt: '2026-01-01',
  },
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    profile: {
      firmName: 'Advocate Chambers Master Desk',
      notaryName: 'Administrator & Notary Officer',
      qualifications: 'B.A., LL.B., Advocate & Notary Public',
      regNo: 'Reg. No. 10001 / Govt. of India',
      areaOfPractice: 'District & Sessions Court Jurisdiction',
      officeAddress: 'Main Court Complex, Chamber Block A',
      mobile: '+91 98000 00000',
      email: 'admin@notarydesk.in',
      verificationDomain: 'notarydesk.in',
      physicalStampingPreference: true,
    },
    createdAt: '2026-01-01',
  },
];
