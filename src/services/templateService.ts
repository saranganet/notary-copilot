import type { NotarialAct, NotaryProfile } from '../types/notary';

export interface LegalTemplate {
  id: string;
  title: string;
  marathiTitle?: string;
  hindiTitle?: string;
  category: 'Blank';
  description: string;
  generateText: (act?: NotarialAct, profile?: NotaryProfile) => string;
  generateHtml: (act?: NotarialAct, profile?: NotaryProfile) => string;
}

export interface TemplateData {
  deponent: {
    name: string;
    relationType: string;
    relativeName: string;
    age: string;
    address: string;
    idType: string;
    idNumber: string;
  };
  secondParty: {
    name: string;
    relationType: string;
    relativeName: string;
    age: string;
    address: string;
    idType: string;
    idNumber: string;
  };
  identifierName: string;
  serialNo: string;
  bookNo: string | number;
  pageNo: string | number;
  date: string;
  location: string;
}

export function extractTemplateData(act?: NotarialAct, profile?: NotaryProfile): TemplateData {
  const p1 = act?.parties?.[0];
  const p2 = act?.parties?.[1];

  return {
    deponent: {
      name: p1?.name?.trim() || '[Full Name of Deponent / Executant]',
      relationType: p1?.relationType || 'S/o',
      relativeName: p1?.relativeName?.trim() || '[Father / Husband Name]',
      age: p1?.age || '[Age]',
      address: p1?.address?.trim() || '[Full Residential Address]',
      idType: p1?.idType || 'Aadhaar Card',
      idNumber: p1?.idNumber?.trim() || '[XXXX-XXXX-XXXX]',
    },
    secondParty: {
      name: p2?.name?.trim() || '[Name of Second Party / Tenant / Purchaser]',
      relationType: p2?.relationType || 'S/o',
      relativeName: p2?.relativeName?.trim() || '[Relative Name]',
      age: p2?.age || '[Age]',
      address: p2?.address?.trim() || '[Full Residential Address]',
      idType: p2?.idType || 'Aadhaar Card',
      idNumber: p2?.idNumber?.trim() || '[XXXX-XXXX-XXXX]',
    },
    identifierName: p2?.name?.trim() || '[Name of Advocate / Identifier]',
    serialNo: act?.serialNo || '[Notarial Serial No.]',
    bookNo: act?.bookNo ?? 1,
    pageNo: act?.pageNo ?? 1,
    date: act?.date || new Date().toISOString().split('T')[0],
    location: profile?.areaOfPractice ? profile.areaOfPractice.split(',')[0].trim() : '[Place of Attestation]',
  };
}

export const LEGAL_TEMPLATES: LegalTemplate[] = [
  {
    id: 'blank-document',
    title: 'Blank Document',
    marathiTitle: 'कोरे दस्तऐवज',
    hindiTitle: 'कोरा दस्तावेज़',
    category: 'Blank',
    description: 'Empty canvas for typing, pasting, or formatting legal documents from scratch.',
    generateText: () => '',
    generateHtml: () => '<p><br></p>',
  },
];

export const NOTARY_SNIPPETS = {
  juratClause: (profile: NotaryProfile, act?: NotarialAct) => `
<div class="notary-inserted-snippet" style="border: 1.5px solid #000; padding: 14px 18px; margin-top: 28px; margin-bottom: 20px; background-color: #fafafa; font-size: 10.5pt; line-height: 1.5;">
  <p style="text-align: center; font-weight: bold; margin-bottom: 8px; text-decoration: underline;">ATTESTATION BY NOTARY PUBLIC (GOVT. OF INDIA)</p>
  <p style="text-align: justify; margin-bottom: 8px;">
    Solemnly affirmed and signed before me by the Deponent / Executant who is personally identified by <strong>${act?.parties?.[1]?.name || '[Name of Advocate / Identifier]'}</strong> on this <strong>${act?.date || new Date().toISOString().split('T')[0]}</strong> at ${profile.areaOfPractice ? profile.areaOfPractice.split(',')[0].trim() : '[Location]'}.
  </p>
  <table style="width: 100%; margin-top: 10px; font-size: 9.5pt;">
    <tr>
      <td style="vertical-align: top; width: 60%; line-height: 1.4;">
        <div><strong>Notarial Serial No:</strong> ${act?.serialNo || '[Notarial Serial No.]'}</div>
        <div><strong>Reg No:</strong> ${act?.bookNo ?? 1} &nbsp;|&nbsp; <strong>Page No:</strong> ${act?.pageNo ?? 1}</div>
        <div><strong>Entry Date:</strong> ${act?.date || new Date().toISOString().split('T')[0]}</div>
      </td>
      <td style="vertical-align: top; width: 40%; text-align: right; line-height: 1.3;">
        <div><strong>${profile.notaryName}</strong></div>
        <div style="font-size: 8.5pt;">${profile.qualifications}</div>
        <div style="font-size: 8.5pt;">${profile.regNo}</div>
        <div style="font-size: 8pt; color: #555;">${profile.areaOfPractice || ''}</div>
      </td>
    </tr>
  </table>
</div>`,

  verificationClause: (profile: NotaryProfile, dateStr?: string) => `
<div class="notary-inserted-snippet" style="margin-top: 24px; margin-bottom: 20px; border-top: 1px dashed #94a3b8; padding-top: 16px;">
  <p style="text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 8px;">VERIFICATION</p>
  <p style="text-align: justify; line-height: 1.6; margin-bottom: 20px;">
    Verified at <strong>${profile.areaOfPractice ? profile.areaOfPractice.split(',')[0].trim() : '[Location]'}</strong> on this <strong>${dateStr || new Date().toISOString().split('T')[0]}</strong>, that the contents of the above affidavit are true and correct to the best of my personal knowledge, belief, and records, and nothing material has been concealed therefrom.
  </p>
  <table style="width: 100%;">
    <tr>
      <td style="width: 50%;"></td>
      <td style="width: 50%; text-align: right;">
        <p style="margin-bottom: 36px;">DEPONENT</p>
        <p>___________________________</p>
      </td>
    </tr>
  </table>
</div>`,

  deponentClause: (party?: { name: string; relationType: string; relativeName: string; age?: string; address: string; idType: string; idNumber: string }) => `
<p class="notary-inserted-snippet" style="text-align: justify; line-height: 1.6; margin-bottom: 16px;">
  I, <strong>${party?.name || '[DEPONENT FULL NAME]'}</strong>, ${party?.relationType || 'S/o'} ${party?.relativeName || '[RELATIVE NAME]'}, aged about ${party?.age || '[Age]'} years, Indian Inhabitant, residing at <strong>${party?.address || '[FULL RESIDENTIAL ADDRESS]'}</strong>, bearing <strong>${party?.idType || 'Aadhaar Card'} No. ${party?.idNumber || '[XXXX-XXXX-XXXX]'}</strong>, do hereby solemnly affirm and state on oath as under:
</p>`,

  signatureBlock: () => `
<table class="notary-inserted-snippet" style="width: 100%; margin-top: 36px; margin-bottom: 24px; font-size: 11pt;">
  <tr>
    <td style="width: 50%; vertical-align: top;">
      <p>Identified by me:</p>
      <br/><br/>
      <p>___________________________<br/><strong>Advocate / Identifier</strong></p>
    </td>
    <td style="width: 50%; vertical-align: top; text-align: right;">
      <p>DEPONENT / EXECUTANT</p>
      <br/><br/>
      <p>___________________________<br/><strong>Signature / Left Thumb</strong></p>
    </td>
  </tr>
</table>`,

  krutiDevJuratClause: (profile: NotaryProfile, act?: NotarialAct) => `
<div class="notary-inserted-snippet font-krutidev" style="font-family: 'Kruti Dev 010', 'KrutiDev010', serif; font-size: 11pt; border: 1.5px solid #000; padding: 12px 16px; margin-top: 24px; margin-bottom: 20px; background-color: #fafafa;">
  <div style="text-align: center; font-weight: bold; margin-bottom: 8px; text-decoration: underline; font-size: 13pt;">
    uksVjh izekf.krdj.k ¼NOTARY ATTESTATION½
  </div>
  <table style="width: 100%; font-size: 10.5pt;">
    <tr>
      <td style="vertical-align: top; width: 60%; line-height: 1.5;">
        <div><strong>uksVjh Øekad %</strong> ${act?.serialNo || '[uksVjh Øekad]'}</div>
        <div><strong>iqLrd la[;k %</strong> ${act?.bookNo ?? 1} &nbsp;|&nbsp; <strong>i\`"B la[;k %</strong> ${act?.pageNo ?? 1}</div>
        <div><strong>fnukad %</strong> ${act?.date || new Date().toISOString().split('T')[0]}</div>
        <div style="font-size: 9.5pt; color: #333; margin-top: 4px;">'kiFkxzghrk }kjk esjs le{k mifLFkr gksdj 'kiFkiwoZd dFku fd;k x;kA</div>
      </td>
      <td style="vertical-align: top; width: 40%; text-align: right; line-height: 1.3;">
        <div style="font-weight: bold;">${profile.notaryName}</div>
        <div style="font-size: 9pt;">${profile.qualifications}</div>
        <div style="font-size: 9pt;">${profile.regNo}</div>
        <div style="font-size: 8.5pt; color: #444;">${profile.areaOfPractice || ''}</div>
      </td>
    </tr>
  </table>
</div>`,

  krutiDevVerificationClause: (profile: NotaryProfile, dateStr?: string) => `
<div class="notary-inserted-snippet font-krutidev" style="font-family: 'Kruti Dev 010', 'KrutiDev010', serif; font-size: 12.5pt; margin-top: 22px; margin-bottom: 18px; border-top: 1px dashed #94a3b8; padding-top: 14px;">
  <p style="text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 8px; font-size: 14pt;">lR;kiu</p>
  <p style="text-align: justify; line-height: 1.7; margin-bottom: 18px;">
    eSa mijksDr 'kiFkxzghrk lR;kfir djrk@djrh gw¡ fd bl 'kiFki= dh leLr dafMdkvksa esa of.kZr rF; esjs futh Kku o fo'okl ds vuqlkj lR; o lgh gSaA vr% vkt fnukad <strong>${dateStr || new Date().toISOString().split('T')[0]}</strong> dks LFkku <strong>${profile.areaOfPractice ? profile.areaOfPractice.split(',')[0].trim() : '[LFkku]'}</strong> ij lR;kfir fd;kA
  </p>
  <table style="width: 100%;">
    <tr>
      <td style="width: 50%;"></td>
      <td style="width: 50%; text-align: right;">
        <p style="margin-bottom: 30px; font-weight: bold;">'kiFkxzghrk</p>
        <p>¼---------------------------½</p>
      </td>
    </tr>
  </table>
</div>`,
};
