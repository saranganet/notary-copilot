import type { NotarialAct, NotaryProfile } from '../types/notary';

export interface LegalTemplate {
  id: string;
  title: string;
  category: 'Affidavit' | 'Agreement' | 'Power of Attorney' | 'Attestation';
  description: string;
  generateText: (act: NotarialAct, profile: NotaryProfile) => string;
}

export const LEGAL_TEMPLATES: LegalTemplate[] = [
  {
    id: 'general-affidavit',
    title: 'General Affidavit (Solemn Affirmation)',
    category: 'Affidavit',
    description: 'Standard affidavit for general declarations under the Oaths Act, 1969.',
    generateText: (act, profile) => {
      const deponent = act.parties[0] || {
        name: '[DEPONENT NAME]',
        relationType: 'S/o',
        relativeName: '[RELATIVE NAME]',
        age: '30',
        address: '[FULL ADDRESS]',
        idType: 'Aadhaar Card',
        idNumber: '[ID NUMBER]',
      };

      return `AFFIDAVIT

I, ${deponent.name}, ${deponent.relationType} ${deponent.relativeName}, aged about ${deponent.age || '30'} years, residing at ${deponent.address}, bearing ${deponent.idType} No. ${deponent.idNumber}, do hereby solemnly affirm and state on oath as under:

1. That I am a citizen of India and currently residing at the address stated above.
2. That all the statements made in this affidavit are true and correct to the best of my personal knowledge, belief, and information, and nothing material has been concealed therein.
3. That this affidavit is being executed for the purpose of official submission and attestation before the competent authorities.

DEPONENT
(${deponent.name})

VERIFICATION
Verified at ${profile.areaOfPractice.split(',')[0]} on this ${act.date}, that the contents of paragraphs 1 to 3 of this affidavit are true and correct. No part of it is false and nothing has been concealed.

DEPONENT

-----------------------------------------------------------------------------
ATTESTATION BY NOTARY PUBLIC
Solemnly affirmed and signed before me by the Deponent who is identified by Shri/Smt. ${act.parties[1]?.name || 'Advocate / Identifier'}, whom I personally know or who has satisfied me regarding the identity of the deponent.

Notarial Entry No: ${act.serialNo}
Book No: ${act.bookNo} | Page No: ${act.pageNo}
Date: ${act.date}

${profile.notaryName}
${profile.qualifications}
${profile.regNo}
${profile.officeAddress}
`;
    },
  },
  {
    id: 'rental-attestation',
    title: 'Rental Agreement Notarial Certificate Slip',
    category: 'Agreement',
    description: 'Official attestation endorsement for 11-month residential or commercial tenancy.',
    generateText: (act, profile) => {
      const owner = act.parties.find((p) => p.role === 'Owner') || act.parties[0];
      const tenant = act.parties.find((p) => p.role === 'Tenant') || act.parties[1];
      const witness = act.parties.find((p) => p.role === 'Witness') || act.parties[2];

      return `NOTARIAL ATTESTATION ENDORSEMENT
(Under The Notaries Act, 1952)

Be it known to all that on this ${act.date}, at my office situated at ${profile.officeAddress}:

Appeared before me:
1. FIRST PARTY (LANDLORD / OWNER):
   Shri/Smt: ${owner ? owner.name : '[OWNER NAME]'}
   ${owner ? owner.relationType : 'S/o'} ${owner ? owner.relativeName : '[FATHER/SPOUSE NAME]'}
   Residing at: ${owner ? owner.address : '[ADDRESS]'}
   Identification: ${owner ? owner.idType : 'Aadhaar'} No. ${owner ? owner.idNumber : 'XXXX'}

2. SECOND PARTY (TENANT):
   Shri/Smt: ${tenant ? tenant.name : '[TENANT NAME]'}
   ${tenant ? tenant.relationType : 'S/o'} ${tenant ? tenant.relativeName : '[FATHER/SPOUSE NAME]'}
   Residing at: ${tenant ? tenant.address : '[ADDRESS]'}
   Identification: ${tenant ? tenant.idType : 'Aadhaar'} No. ${tenant ? tenant.idNumber : 'XXXX'}

AND
Identified by Witness: ${witness ? witness.name : 'Independent Witness'}, residing at ${witness ? witness.address : 'Pune'}.

Both parties have acknowledged and admitted that they have voluntarily read, understood, executed, and signed the Tenancy / Rental Agreement on appropriate Stamp Paper of value ₹${act.stampValue}, in my presence, with sound mind and free will without any undue influence or coercion.

Live biometric thumb impressions and webcam digital facial photographs of all executing parties and witness have been captured, verified, and registered in my official Notarial Register Form XV.

Registered Serial No: ${act.serialNo}
Book No: ${act.bookNo} | Page No: ${act.pageNo}
Fees Collected: ₹${act.feesCharged}/-

${profile.notaryName}
Advocate & Notary Public (Govt. of India)
${profile.regNo}
`;
    },
  },
  {
    id: 'name-change-affidavit',
    title: 'Name Change / One & Same Person Affidavit',
    category: 'Affidavit',
    description: 'Affidavit for discrepancy in name between Aadhaar, Marksheets, or Gazette.',
    generateText: (act, profile) => {
      const deponent = act.parties[0] || {
        name: '[DEPONENT CURRENT NAME]',
        relationType: 'S/o',
        relativeName: '[RELATIVE NAME]',
        age: '28',
        address: '[FULL ADDRESS]',
        idType: 'Aadhaar Card',
        idNumber: '[ID NUMBER]',
      };

      return `AFFIDAVIT FOR CHANGE / DISCREPANCY IN NAME

I, ${deponent.name}, ${deponent.relationType} ${deponent.relativeName}, aged ${deponent.age || '28'} years, residing at ${deponent.address}, bearing ${deponent.idType} No. ${deponent.idNumber}, do hereby solemnly state and affirm as follows:

1. That my name is recorded as "${deponent.name}" in my official documents including ${deponent.idType}.
2. That in some of my educational / revenue / banking records, my name has inadvertently been written / misspelled as "[FORMER / ALTERNATE NAME]".
3. That both the names, namely "${deponent.name}" and "[FORMER / ALTERNATE NAME]", refer to one and the same person, which is myself.
4. That henceforth I shall be known, called, and referred to for all purposes by my correct name "${deponent.name}".

DEPONENT

VERIFICATION
Verified at ${profile.areaOfPractice.split(',')[0]} on ${act.date}, that the contents above are true to my personal knowledge.

DEPONENT

Attested before me:
${profile.notaryName}, Notary Public
Serial No: ${act.serialNo}
`;
    },
  },
];
