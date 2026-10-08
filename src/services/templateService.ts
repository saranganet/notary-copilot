import type { NotarialAct, NotaryProfile } from '../types/notary';

export interface LegalTemplate {
  id: string;
  title: string;
  marathiTitle?: string;
  hindiTitle?: string;
  category: 'Affidavit' | 'Agreement' | 'Power of Attorney' | 'Attestation' | 'Blank';
  description: string;
  generateText: (act: NotarialAct, profile: NotaryProfile) => string;
  generateHtml: (act: NotarialAct, profile: NotaryProfile) => string;
}

export const LEGAL_TEMPLATES: LegalTemplate[] = [
  {
    id: 'general-affidavit',
    title: 'General Affidavit (Solemn Affirmation)',
    marathiTitle: 'साधारण प्रतिज्ञापत्र (शपथेवर निवेदन)',
    hindiTitle: 'सामान्य शपथ पत्र (सत्यनिष्ठापूर्वक कथन)',
    category: 'Affidavit',
    description: 'Standard affidavit under Oaths Act, 1969 for declarations before government, courts or authorities.',
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

1. That I am a bona fide citizen of India and permanently residing at the address mentioned above.
2. That all the statements made in this affidavit are true and correct to the best of my personal knowledge, belief, and records, and nothing material has been concealed therein.
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
    generateHtml: (act, profile) => {
      const deponent = act.parties[0] || {
        name: '[DEPONENT NAME]',
        relationType: 'S/o',
        relativeName: '[RELATIVE NAME]',
        age: '30',
        address: '[FULL ADDRESS]',
        idType: 'Aadhaar Card',
        idNumber: '[ID NUMBER]',
      };

      return `<div style="text-align: center; margin-bottom: 24px;">
  <h2 style="font-size: 16pt; font-weight: bold; text-decoration: underline; margin-bottom: 4px; text-transform: uppercase;">AFFIDAVIT</h2>
  <div style="font-size: 10pt; font-style: italic; color: #475569;">(Under Section 3 of The Oaths Act, 1969)</div>
</div>

<p style="text-align: justify; line-height: 1.6; margin-bottom: 16px;">
  I, <strong>${deponent.name}</strong>, ${deponent.relationType} ${deponent.relativeName}, aged about ${deponent.age || '30'} years, Indian Inhabitant, residing at <strong>${deponent.address}</strong>, bearing <strong>${deponent.idType} No. ${deponent.idNumber}</strong>, do hereby solemnly affirm and state on oath as under:
</p>

<ol style="margin-left: 24px; line-height: 1.7; margin-bottom: 24px;">
  <li style="margin-bottom: 12px; text-align: justify;">
    That I am a bona fide citizen of India and currently residing at the address mentioned hereinabove.
  </li>
  <li style="margin-bottom: 12px; text-align: justify;">
    That all statements, declarations, and facts stated in this affidavit are true and correct to the best of my personal knowledge, belief, and official records.
  </li>
  <li style="margin-bottom: 12px; text-align: justify;">
    That no material fact has been concealed or misrepresented herein, and I am fully aware that making a false statement in an affidavit entails legal penalties under the Indian Penal Code.
  </li>
  <li style="margin-bottom: 12px; text-align: justify;">
    That this affidavit is executed for the purpose of submitting the same before the concerned statutory / government / educational authorities for their official records and verification.
  </li>
</ol>

<table style="width: 100%; margin-top: 32px; margin-bottom: 24px;">
  <tr>
    <td style="width: 50%;"></td>
    <td style="width: 50%; text-align: right; line-height: 1.4;">
      <p style="margin-bottom: 36px;">DEPONENT</p>
      <p><strong>(${deponent.name})</strong></p>
    </td>
  </tr>
</table>

<div style="border-top: 1px dashed #94a3b8; padding-top: 16px; margin-top: 24px;">
  <p style="text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 10px;">VERIFICATION</p>
  <p style="text-align: justify; line-height: 1.6; margin-bottom: 20px;">
    Verified at <strong>${profile.areaOfPractice.split(',')[0]}</strong> on this <strong>${act.date}</strong>, that the contents of paragraphs 1 to 4 of this affidavit are true and correct to the best of my personal knowledge, information, and belief, and nothing stated herein is false.
  </p>
  <table style="width: 100%;">
    <tr>
      <td style="width: 50%;"></td>
      <td style="width: 50%; text-align: right;">
        <p style="margin-bottom: 36px;">DEPONENT</p>
        <p><strong>(${deponent.name})</strong></p>
      </td>
    </tr>
  </table>
</div>

<div style="border: 1.5px solid #000; padding: 14px 18px; margin-top: 36px; background-color: #fafafa; font-size: 10.5pt;">
  <p style="text-align: center; font-weight: bold; margin-bottom: 8px; text-decoration: underline;">ATTESTATION BY NOTARY PUBLIC (GOVT. OF INDIA)</p>
  <p style="text-align: justify; line-height: 1.5; margin-bottom: 8px;">
    Solemnly affirmed and signed before me by the Deponent <strong>${deponent.name}</strong> who is personally identified by <strong>${act.parties[1]?.name || 'Advocate / Identifier'}</strong>, whom I personally know or whose identity has been verified through official documentary proof, on this day at ${profile.areaOfPractice.split(',')[0]}.
  </p>
  <table style="width: 100%; margin-top: 10px; font-size: 9.5pt;">
    <tr>
      <td style="vertical-align: top; width: 60%; line-height: 1.4;">
        <div><strong>Notarial Serial No:</strong> ${act.serialNo}</div>
        <div><strong>Book No:</strong> ${act.bookNo} &nbsp;|&nbsp; <strong>Page No:</strong> ${act.pageNo}</div>
        <div><strong>Execution Date:</strong> ${act.date}</div>
      </td>
      <td style="vertical-align: top; width: 40%; text-align: right; line-height: 1.3;">
        <div><strong>${profile.notaryName}</strong></div>
        <div style="font-size: 8.5pt;">${profile.qualifications}</div>
        <div style="font-size: 8.5pt;">${profile.regNo}</div>
        <div style="font-size: 8pt; color: #555;">${profile.areaOfPractice}</div>
      </td>
    </tr>
  </table>
</div>`;
    },
  },
  {
    id: 'krutidev-court-affidavit',
    title: 'Court Affidavit (Kruti Dev 010 / कृतिदेव ०१०)',
    marathiTitle: 'न्यायालयीन प्रतिज्ञापत्र (कृतिदेव ०१०)',
    hindiTitle: 'न्यायालयीन शपथ पत्र (कृतिदेव 010 फ़ॉन्ट)',
    category: 'Affidavit',
    description: 'Universal court & legal typist format in Kruti Dev 010 font for Indian District Courts, Sub-Divisions & High Court registries.',
    generateText: (act, profile) => {
      const deponent = act.parties[0] || {
        name: 'शपथग्रहीता',
        relationType: 'आत्मज',
        relativeName: 'पिता का नाम',
        age: '30',
        address: 'स्थानीय पता',
        idType: 'आधार कार्ड',
        idNumber: 'XXXXXXXXXXXX',
      };

      return `'kiFk&i=
¼/kkjk 139 flfoy izfdz;k lafgrk rFkk uksVjh vf/kfu;e 1952 ds varxZr½

le{k % Jheku~ uksVjh ifCyd egksn;] ${profile.areaOfPractice.split(',')[0]}

eSa ${deponent.name}] ${deponent.relationType} ${deponent.relativeName}] vk;q yxHkx ${deponent.age || '30'} o"kZ] fuoklh ${deponent.address}] 'kiFkiwoZd fuEu c;ku djrk@djrh gw¡ %

1- ;g fd eSa Hkkjr dk ewy fuoklh gw¡ rFkk 'kiFki= esa of.kZr irs ij fuokl djrk gw¡A
2- ;g fd mDr nLrkost@'kiFki= esa fn, x, leLr rF; esjs futh Kku o fo'okl ds vuqlkj lR; o lgh gSaA
3- ;g fd blesa dksbZ Hkh rF; fNik;k ugha x;k gSA
4- ;g fd ;g 'kiFki= eSaus 'kkldh; @ U;k;ky;hu dk;Z gsrq viuh LosPNk ls fcuk fdlh ncko ds fu"ikfnr fd;k gSA

'kiFkxzghrk ¼Deponent½

lR;kiu ¼Verification½
eSa mijksDr 'kiFkxzghrk lR;kfir djrk gw¡ fd mDr 'kiFki= dh pj.k la[;k 1 ls 4 esa of.kZr leLr dFku esjs futh Kku o fo'okl ds vuqlkj lgh o lR; gSaA vr% vkt fnukad ${act.date} dks LFkku ${profile.areaOfPractice.split(',')[0]} ij lR;kfir fd;kA

'kiFkxzghrk ¼Deponent½

-----------------------------------------------------------------------------
uksVjh izekf.krdj.k ¼Notary Attestation½
mDr 'kiFkxzghrk esjs le{k mifLFkr gq, ,oa mUgksaus vius gLrk{kj vafdr fd,A

uksVjh iathdj.k la[;k % ${act.serialNo}
iqLrd la[;k % ${act.bookNo} | i\`"B la[;k % ${act.pageNo}
fnukad % ${act.date}

${profile.notaryName}
${profile.qualifications}
${profile.regNo}
`;
    },
    generateHtml: (act, profile) => {
      const deponent = act.parties[0] || {
        name: 'शपथग्रहीता',
        relationType: 'आत्मज',
        relativeName: 'पिता का नाम',
        age: '30',
        address: 'स्थानीय पता',
        idType: 'Aadhaar Card',
        idNumber: 'XXXXXXXXXXXX',
      };

      return `<div style="font-family: 'Kruti Dev 010', 'KrutiDev010', serif; font-size: 13pt; line-height: 1.7;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h2 style="font-size: 18pt; font-weight: bold; text-decoration: underline; margin-bottom: 6px;">'kiFk&i=</h2>
    <div style="font-size: 11pt; color: #334155;">¼/kkjk 139 flfoy izfdz;k lafgrk rFkk uksVjh vf/kfu;e 1952 ds varxZr½</div>
  </div>

  <p style="text-align: left; font-weight: bold; margin-bottom: 18px; font-size: 13pt;">
    le{k % Jheku~ uksVjh ifCyd egksn;] ${profile.areaOfPractice.split(',')[0]}
  </p>

  <p style="text-align: justify; margin-bottom: 16px;">
    eSa <strong>${deponent.name}</strong>] vkRet <strong>${deponent.relativeName}</strong>] vk;q yxHkx <strong>${deponent.age || '30'}</strong> o"kZ] fuoklh <strong>${deponent.address}</strong>] 'kiFkiwoZd fuEu dFku djrk@djrh gw¡ %
  </p>

  <ol style="margin-left: 28px; line-height: 1.8; margin-bottom: 24px;">
    <li style="margin-bottom: 12px; text-align: justify;">
      ;g fd eSa Hkkjr dk ewy fuoklh gw¡ rFkk mijksDr irs ij vius ifjokj lfgr fuokl djrk gw¡A
    </li>
    <li style="margin-bottom: 12px; text-align: justify;">
      ;g fd mDr 'kiFki= esa fn, x, leLr rF; o dFku esjs futh Kku o fo'okl ds vuqlkj iw.kZr% lR; o lgh gSaA
    </li>
    <li style="margin-bottom: 12px; text-align: justify;">
      ;g fd blesa dksbZ Hkh rF; fNik;k ugha x;k gS vkSj u gh dksbZ vlR; dFku vafdr fd;k x;k gSA
    </li>
    <li style="margin-bottom: 12px; text-align: justify;">
      ;g fd ;g 'kiFki= eSaus viuh iw.kZ lksp&le> o LosPNk ls fcuk fdlh vuqfpr ncko ds fu"ikfnr fd;k gSA
    </li>
  </ol>

  <table style="width: 100%; margin-top: 32px; margin-bottom: 24px;">
    <tr>
      <td style="width: 50%;"></td>
      <td style="width: 50%; text-align: right;">
        <p style="margin-bottom: 40px; font-weight: bold;">'kiFkxzghrk</p>
        <p>¼-------------------------------------½</p>
      </td>
    </tr>
  </table>

  <div style="border-top: 1px dashed #64748b; padding-top: 18px; margin-top: 24px;">
    <p style="text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 10px; font-size: 15pt;">lR;kiu</p>
    <p style="text-align: justify; margin-bottom: 20px;">
      eSa mijksDr 'kiFkxzghrk lR;kfir djrk@djrh gw¡ fd bl 'kiFki= dh dafMdk la[;k 1 yxk;r 4 esa of.kZr leLr rF; esjs futh Kku o fo'okl ds vuqlkj lgh o lR; gSaA vr% vkt fnukad <strong>${act.date}</strong> dks LFkku <strong>${profile.areaOfPractice.split(',')[0]}</strong> ij lR;kfir fd;kA
    </p>

    <table style="width: 100%;">
      <tr>
        <td style="width: 50%; font-size: 12pt;">
          <p>igpkudrkZ %</p>
          <br/><br/>
          <p>-----------------------------------<br/>vf/koDrk @ igpkudrkZ</p>
        </td>
        <td style="width: 50%; text-align: right;">
          <p style="margin-bottom: 40px; font-weight: bold;">'kiFkxzghrk</p>
          <p>¼-------------------------------------½</p>
        </td>
      </tr>
    </table>
  </div>

  <div style="margin-top: 32px; border: 1.5px solid #000; padding: 14px 18px; background: #fafafa;">
    <div style="text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 8px; font-size: 13pt;">
      uksVjh izekf.krdj.k ¼NOTARY ATTESTATION½
    </div>
    <table style="width: 100%; font-size: 11pt;">
      <tr>
        <td style="width: 55%; vertical-align: top; line-height: 1.6;">
          <div><strong>uksVjh Øekad %</strong> ${act?.serialNo || 'NS-' + new Date().getFullYear() + '-XXXX'}</div>
          <div><strong>iqLrd la[;k %</strong> ${act?.bookNo || 1} &nbsp;|&nbsp; <strong>i\`"B la[;k %</strong> ${act?.pageNo || 1}</div>
          <div><strong>fnukad %</strong> ${act?.date || new Date().toISOString().split('T')[0]}</div>
          <div style="font-size: 9.5pt; color: #444; margin-top: 4px;">esjs le{k 'kiFkiwoZd lR;kfir ,oa gLrk{kfjr fd;k x;kA</div>
        </td>
        <td style="width: 45%; vertical-align: top; text-align: right; line-height: 1.4;">
          <div><strong>${profile.notaryName}</strong></div>
          <div style="font-size: 10pt;">${profile.qualifications}</div>
          <div style="font-size: 10pt;">${profile.regNo}</div>
          <div style="font-size: 9pt; color: #444;">${profile.areaOfPractice}</div>
        </td>
      </tr>
    </table>
  </div>
</div>`;
    },
  },
  {
    id: 'name-change-affidavit',
    title: 'Name Change / Discrepancy Affidavit',
    marathiTitle: 'नाव बदल / एकच व्यक्ती प्रतिज्ञापत्र',
    hindiTitle: 'नाम परिवर्तन / विसंगति शपथ पत्र',
    category: 'Affidavit',
    description: 'Affidavit for discrepancy in name between Aadhaar, Marksheets, Gazette, or Passport.',
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

I, ${deponent.name}, ${deponent.relationType} ${deponent.relativeName}, aged about ${deponent.age || '28'} years, residing at ${deponent.address}, bearing ${deponent.idType} No. ${deponent.idNumber}, do hereby solemnly state and affirm on oath as follows:

1. That my correct and legal name is "${deponent.name}" as recorded in my ${deponent.idType}.
2. That in some of my previous educational / banking / revenue records, my name has inadvertently been written / misspelled as "[PREVIOUS / ALTERNATE NAME]".
3. That both names, namely "${deponent.name}" and "[PREVIOUS / ALTERNATE NAME]", refer to one and the same person, which is myself.
4. That henceforth I shall be known, called, and referred to for all legal and official purposes by my correct name "${deponent.name}".

DEPONENT

VERIFICATION
Verified at ${profile.areaOfPractice.split(',')[0]} on this ${act.date}, that the contents above are true to my personal knowledge.

DEPONENT

Attested before me:
${profile.notaryName}, Notary Public (Govt. of India)
Serial No: ${act.serialNo}
`;
    },
    generateHtml: (act, profile) => {
      const deponent = act.parties[0] || {
        name: '[DEPONENT CURRENT NAME]',
        relationType: 'S/o',
        relativeName: '[RELATIVE NAME]',
        age: '28',
        address: '[FULL ADDRESS]',
        idType: 'Aadhaar Card',
        idNumber: '[ID NUMBER]',
      };

      return `<div style="text-align: center; margin-bottom: 24px;">
  <h2 style="font-size: 16pt; font-weight: bold; text-decoration: underline; margin-bottom: 4px; text-transform: uppercase;">AFFIDAVIT FOR CHANGE / DISCREPANCY IN NAME</h2>
  <div style="font-size: 10pt; font-style: italic; color: #475569;">(Declaration of One & Same Person for Official Records)</div>
</div>

<p style="text-align: justify; line-height: 1.6; margin-bottom: 16px;">
  I, <strong>${deponent.name}</strong>, ${deponent.relationType} ${deponent.relativeName}, aged about ${deponent.age || '28'} years, Indian Inhabitant, residing at <strong>${deponent.address}</strong>, bearing <strong>${deponent.idType} No. ${deponent.idNumber}</strong>, do hereby solemnly state and affirm on oath as follows:
</p>

<ol style="margin-left: 24px; line-height: 1.7; margin-bottom: 24px;">
  <li style="margin-bottom: 12px; text-align: justify;">
    That my correct, current, and legal name is <strong>"${deponent.name}"</strong> as duly registered in my official identity proof, namely <strong>${deponent.idType}</strong>.
  </li>
  <li style="margin-bottom: 12px; text-align: justify;">
    That in some of my educational marksheets / PAN card / bank records, my name has inadvertently been entered / misspelled as <strong>"[PREVIOUS / MISSPELLED NAME]"</strong>.
  </li>
  <li style="margin-bottom: 12px; text-align: justify;">
    That I hereby explicitly clarify and confirm that both names, namely <strong>"${deponent.name}"</strong> and <strong>"[PREVIOUS / MISSPELLED NAME]"</strong>, belong to one and the same living person, which is myself.
  </li>
  <li style="margin-bottom: 12px; text-align: justify;">
    That henceforth I shall be recognized, identified, called, and referred to for all legal, educational, banking, and government purposes exclusively by my correct name <strong>"${deponent.name}"</strong>.
  </li>
</ol>

<table style="width: 100%; margin-top: 32px; margin-bottom: 24px;">
  <tr>
    <td style="width: 50%;"></td>
    <td style="width: 50%; text-align: right; line-height: 1.4;">
      <p style="margin-bottom: 36px;">DEPONENT</p>
      <p><strong>(${deponent.name})</strong></p>
    </td>
  </tr>
</table>

<div style="border-top: 1px dashed #94a3b8; padding-top: 16px; margin-top: 24px;">
  <p style="text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 10px;">VERIFICATION</p>
  <p style="text-align: justify; line-height: 1.6; margin-bottom: 20px;">
    Verified at <strong>${profile.areaOfPractice.split(',')[0]}</strong> on this <strong>${act.date}</strong>, that the statements made in paragraphs 1 to 4 are true and correct to my personal knowledge and belief.
  </p>
  <table style="width: 100%;">
    <tr>
      <td style="width: 50%;"></td>
      <td style="width: 50%; text-align: right;">
        <p style="margin-bottom: 36px;">DEPONENT</p>
        <p><strong>(${deponent.name})</strong></p>
      </td>
    </tr>
  </table>
</div>

<div style="border: 1.5px solid #000; padding: 14px 18px; margin-top: 36px; background-color: #fafafa; font-size: 10.5pt;">
  <p style="text-align: center; font-weight: bold; margin-bottom: 8px; text-decoration: underline;">ATTESTATION BY NOTARY PUBLIC (GOVT. OF INDIA)</p>
  <p style="text-align: justify; line-height: 1.5; margin-bottom: 8px;">
    Solemnly affirmed and signed before me by the Deponent who is identified by <strong>${act.parties[1]?.name || 'Advocate'}</strong> on this day at ${profile.areaOfPractice.split(',')[0]}.
  </p>
  <table style="width: 100%; margin-top: 10px; font-size: 9.5pt;">
    <tr>
      <td style="vertical-align: top; width: 60%; line-height: 1.4;">
        <div><strong>Notarial Serial No:</strong> ${act.serialNo}</div>
        <div><strong>Book No:</strong> ${act.bookNo} &nbsp;|&nbsp; <strong>Page No:</strong> ${act.pageNo}</div>
      </td>
      <td style="vertical-align: top; width: 40%; text-align: right; line-height: 1.3;">
        <div><strong>${profile.notaryName}</strong></div>
        <div style="font-size: 8.5pt;">${profile.regNo}</div>
      </td>
    </tr>
  </table>
</div>`;
    },
  },
  {
    id: 'gap-certificate-affidavit',
    title: 'Gap Certificate Affidavit (Education / Job)',
    marathiTitle: 'गॅप सर्टिफिकेट प्रतिज्ञापत्र (शिक्षण / नोकरी)',
    hindiTitle: 'शैक्षणिक अंतराल (गैप) शपथ पत्र',
    category: 'Affidavit',
    description: 'Affidavit explaining gap period in studies or employment for college admission or job verification.',
    generateText: (act, profile) => {
      const deponent = act.parties[0] || {
        name: '[STUDENT NAME]',
        relationType: 'S/o',
        relativeName: '[PARENT NAME]',
        age: '22',
        address: '[FULL ADDRESS]',
        idType: 'Aadhaar Card',
        idNumber: '[ID NUMBER]',
      };

      return `GAP CERTIFICATE AFFIDAVIT

I, ${deponent.name}, ${deponent.relationType} ${deponent.relativeName}, aged about ${deponent.age || '22'} years, residing at ${deponent.address}, bearing ${deponent.idType} No. ${deponent.idNumber}, do hereby state and declare on oath as under:

1. That I have completed my [PREVIOUS QUALIFICATION e.g., H.S.C. / B.Sc.] in the year [YEAR OF PASSING] from [COLLEGE / BOARD NAME].
2. That during the period from [START YEAR] to [END YEAR], there is a gap of [NUMBER] years in my academic studies / employment.
3. That during the aforesaid gap period, I was preparing for competitive entrance examinations / medical treatment / personal family circumstances.
4. That during this entire gap period, I did not engage in any unlawful, anti-social, or criminal activities, nor is any criminal case pending against me in any court of law.
5. That I am executing this affidavit to explain my gap period for securing admission in [NAME OF COLLEGE / COURSE].

DEPONENT

VERIFICATION
Verified at ${profile.areaOfPractice.split(',')[0]} on ${act.date}, that the contents are true to my personal knowledge.

DEPONENT

Before Me:
${profile.notaryName}, Notary Public (Govt. of India)
Serial No: ${act.serialNo}
`;
    },
    generateHtml: (act, profile) => {
      const deponent = act.parties[0] || {
        name: '[STUDENT NAME]',
        relationType: 'S/o',
        relativeName: '[PARENT NAME]',
        age: '22',
        address: '[FULL ADDRESS]',
        idType: 'Aadhaar Card',
        idNumber: '[ID NUMBER]',
      };

      return `<div style="text-align: center; margin-bottom: 24px;">
  <h2 style="font-size: 16pt; font-weight: bold; text-decoration: underline; margin-bottom: 4px; text-transform: uppercase;">GAP CERTIFICATE AFFIDAVIT</h2>
  <div style="font-size: 10pt; font-style: italic; color: #475569;">(Declaration of Academic / Employment Gap Period)</div>
</div>

<p style="text-align: justify; line-height: 1.6; margin-bottom: 16px;">
  I, <strong>${deponent.name}</strong>, ${deponent.relationType} ${deponent.relativeName}, aged about ${deponent.age || '22'} years, Indian Inhabitant, residing at <strong>${deponent.address}</strong>, bearing <strong>${deponent.idType} No. ${deponent.idNumber}</strong>, do hereby solemnly affirm and state on oath as under:
</p>

<ol style="margin-left: 24px; line-height: 1.7; margin-bottom: 24px;">
  <li style="margin-bottom: 12px; text-align: justify;">
    That I have passed my <strong>[Previous Qualification e.g., H.S.C. / B.Com / Degree]</strong> examination held in the month of <strong>[Month & Year]</strong> from <strong>[Name of College / University]</strong>.
  </li>
  <li style="margin-bottom: 12px; text-align: justify;">
    That after passing the aforesaid examination, there is an academic gap of <strong>[Number] year(s)</strong> from <strong>[Start Year]</strong> to <strong>[End Year]</strong>.
  </li>
  <li style="margin-bottom: 12px; text-align: justify;">
    That during the aforesaid gap period, I did not enroll or register in any other university, degree college, or institution, and was solely preparing for competitive entrance examinations / attending to medical & family responsibilities.
  </li>
  <li style="margin-bottom: 12px; text-align: justify;">
    That during the entire gap period, I was not involved in any criminal offense, court litigation, or anti-social activities anywhere in India.
  </li>
  <li style="margin-bottom: 12px; text-align: justify;">
    That I am submitting this affidavit to the competent college authority / employer for regularizing my admission / joining formalities.
  </li>
</ol>

<table style="width: 100%; margin-top: 32px; margin-bottom: 24px;">
  <tr>
    <td style="width: 50%;"></td>
    <td style="width: 50%; text-align: right; line-height: 1.4;">
      <p style="margin-bottom: 36px;">DEPONENT</p>
      <p><strong>(${deponent.name})</strong></p>
    </td>
  </tr>
</table>

<div style="border-top: 1px dashed #94a3b8; padding-top: 16px; margin-top: 24px;">
  <p style="text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 10px;">VERIFICATION</p>
  <p style="text-align: justify; line-height: 1.6; margin-bottom: 20px;">
    Verified at <strong>${profile.areaOfPractice.split(',')[0]}</strong> on this <strong>${act.date}</strong>, that the contents of paragraphs 1 to 5 are true and correct to my personal knowledge.
  </p>
  <table style="width: 100%;">
    <tr>
      <td style="width: 50%;"></td>
      <td style="width: 50%; text-align: right;">
        <p style="margin-bottom: 36px;">DEPONENT</p>
        <p><strong>(${deponent.name})</strong></p>
      </td>
    </tr>
  </table>
</div>

<div style="border: 1.5px solid #000; padding: 14px 18px; margin-top: 36px; background-color: #fafafa; font-size: 10.5pt;">
  <p style="text-align: center; font-weight: bold; margin-bottom: 8px; text-decoration: underline;">ATTESTATION BY NOTARY PUBLIC (GOVT. OF INDIA)</p>
  <p style="text-align: justify; line-height: 1.5; margin-bottom: 8px;">
    Solemnly affirmed and signed before me by the Deponent who is identified by <strong>${act.parties[1]?.name || 'Advocate'}</strong> on this day.
  </p>
  <table style="width: 100%; margin-top: 10px; font-size: 9.5pt;">
    <tr>
      <td style="vertical-align: top; width: 60%; line-height: 1.4;">
        <div><strong>Notarial Serial No:</strong> ${act.serialNo}</div>
        <div><strong>Book No:</strong> ${act.bookNo} &nbsp;|&nbsp; <strong>Page No:</strong> ${act.pageNo}</div>
      </td>
      <td style="vertical-align: top; width: 40%; text-align: right; line-height: 1.3;">
        <div><strong>${profile.notaryName}</strong></div>
        <div style="font-size: 8.5pt;">${profile.regNo}</div>
      </td>
    </tr>
  </table>
</div>`;
    },
  },
  {
    id: 'rental-agreement',
    title: '11-Month Residential Tenancy Agreement',
    marathiTitle: 'निवासी भाडे करारनामा (११ महिने)',
    hindiTitle: 'आवासीय किराया अनुबंध (११ माह)',
    category: 'Agreement',
    description: 'Comprehensive 11-month residential leave & license / rent agreement for Maharashtra.',
    generateText: (act, profile) => {
      const owner = act.parties.find((p) => p.role === 'Owner') || act.parties[0] || {
        name: '[LANDLORD NAME]',
        relationType: 'S/o',
        relativeName: '[LANDLORD FATHER]',
        address: '[LANDLORD ADDRESS]',
        idType: 'Aadhaar Card',
        idNumber: '[LANDLORD AADHAAR]',
      };
      const tenant = act.parties.find((p) => p.role === 'Tenant') || act.parties[1] || {
        name: '[TENANT NAME]',
        relationType: 'S/o',
        relativeName: '[TENANT FATHER]',
        address: '[TENANT ADDRESS]',
        idType: 'Aadhaar Card',
        idNumber: '[TENANT AADHAAR]',
      };

      return `RESIDENTIAL RENT AGREEMENT (11 MONTHS)

This Agreement is made at ${profile.areaOfPractice.split(',')[0]} on this ${act.date}, BETWEEN:

1. FIRST PARTY (LANDLORD / OWNER):
Shri/Smt. ${owner.name}, ${owner.relationType} ${owner.relativeName}, residing at ${owner.address}, bearing ${owner.idType} No. ${owner.idNumber} (hereinafter called the "LESSOR / LICENSOR").

AND

2. SECOND PARTY (TENANT / LICENSEE):
Shri/Smt. ${tenant.name}, ${tenant.relationType} ${tenant.relativeName}, residing at ${tenant.address}, bearing ${tenant.idType} No. ${tenant.idNumber} (hereinafter called the "LESSEE / LICENSEE").

WHEREAS the Licensor is the lawful owner of Flat / House situated at [FULL PREMISES ADDRESS], and has agreed to let out the same to the Licensee for residential use on an 11-month temporary basis.

NOW THIS AGREEMENT WITNESSETH AS FOLLOWS:
1. TENURE: The tenure of this agreement shall be for 11 months commencing from ${act.date}.
2. RENT: The Licensee shall pay a monthly rent of ₹[RENT AMOUNT]/- payable in advance on or before the 5th of each English calendar month.
3. SECURITY DEPOSIT: The Licensee has deposited an interest-free refundable security deposit of ₹[DEPOSIT AMOUNT]/- with the Licensor.
4. ELECTRICITY & MAINTENANCE: Electricity and society maintenance charges shall be paid directly by the Licensee according to meter readings.
5. USE OF PREMISES: The premises shall be used exclusively for residential purposes and not for any commercial, illegal, or hazardous trade.
6. TERMINATION: Either party may terminate this agreement by giving one (1) month prior written notice.

IN WITNESS WHEREOF the parties have set their hands on this day.

FIRST PARTY (OWNER)                 SECOND PARTY (TENANT)

WITNESS 1:                          WITNESS 2:

Attested Before Me:
${profile.notaryName}, Notary Public (Govt. of India)
Serial No: ${act.serialNo}
`;
    },
    generateHtml: (act, profile) => {
      const owner = act.parties.find((p) => p.role === 'Owner') || act.parties[0] || {
        name: '[LANDLORD NAME]',
        relationType: 'S/o',
        relativeName: '[LANDLORD FATHER]',
        address: '[LANDLORD ADDRESS]',
        idType: 'Aadhaar Card',
        idNumber: '[LANDLORD AADHAAR]',
      };
      const tenant = act.parties.find((p) => p.role === 'Tenant') || act.parties[1] || {
        name: '[TENANT NAME]',
        relationType: 'S/o',
        relativeName: '[TENANT FATHER]',
        address: '[TENANT ADDRESS]',
        idType: 'Aadhaar Card',
        idNumber: '[TENANT AADHAAR]',
      };

      return `<div style="text-align: center; margin-bottom: 24px;">
  <h2 style="font-size: 16pt; font-weight: bold; text-decoration: underline; margin-bottom: 4px; text-transform: uppercase;">RESIDENTIAL RENT / LEAVE & LICENSE AGREEMENT</h2>
  <div style="font-size: 10pt; font-style: italic; color: #475569;">(Tenancy for 11 Months on Appropriate Stamp Duty)</div>
</div>

<p style="text-align: justify; line-height: 1.6; margin-bottom: 16px;">
  This Tenancy Agreement is made and executed at <strong>${profile.areaOfPractice.split(',')[0]}</strong> on this <strong>${act.date}</strong>, by and between:
</p>

<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; margin-bottom: 14px; border-radius: 4px;">
  <p style="margin-bottom: 6px;"><strong>1. FIRST PARTY (LANDLORD / LICENSOR):</strong></p>
  <p style="line-height: 1.5; margin-bottom: 0;">
    <strong>${owner.name}</strong>, ${owner.relationType} ${owner.relativeName}, residing at <strong>${owner.address}</strong>, bearing <strong>${owner.idType} No. ${owner.idNumber}</strong> (hereinafter referred to as the <em>"LICENSOR"</em>, which expression shall include legal heirs, successors and assigns).
  </p>
</div>

<div style="text-align: center; font-weight: bold; margin-bottom: 14px; font-size: 11pt;">--- AND ---</div>

<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; margin-bottom: 18px; border-radius: 4px;">
  <p style="margin-bottom: 6px;"><strong>2. SECOND PARTY (TENANT / LICENSEE):</strong></p>
  <p style="line-height: 1.5; margin-bottom: 0;">
    <strong>${tenant.name}</strong>, ${tenant.relationType} ${tenant.relativeName}, residing at <strong>${tenant.address}</strong>, bearing <strong>${tenant.idType} No. ${tenant.idNumber}</strong> (hereinafter referred to as the <em>"LICENSEE"</em>, which expression shall include legal heirs and permitted assigns).
  </p>
</div>

<p style="text-align: justify; line-height: 1.6; margin-bottom: 16px;">
  WHEREAS the Licensor is the sole and absolute owner of residential premises situated at <strong>[Full Premises Address: Flat No. ____, Building ____, Sector ____, Badlapur / Kalyan]</strong> (hereinafter referred to as the <em>"Licensed Premises"</em>) and has agreed to let out the same to the Licensee on an 11-month temporary tenancy.
</p>

<p style="font-weight: bold; text-decoration: underline; margin-bottom: 8px;">NOW THIS INDENTURE WITNESSETH AS UNDER:</p>

<ol style="margin-left: 24px; line-height: 1.7; margin-bottom: 24px;">
  <li style="margin-bottom: 10px; text-align: justify;">
    <strong>PERIOD:</strong> The period of this agreement shall be for eleven (11) English calendar months commencing from <strong>${act.date}</strong> to <strong>[End Date]</strong>.
  </li>
  <li style="margin-bottom: 10px; text-align: justify;">
    <strong>MONTHLY COMPENSATION:</strong> The Licensee shall pay a monthly license fee / rent of <strong>₹[Amount]/- (Rupees ____________________ only)</strong>, payable on or before the 5th day of every month in advance.
  </li>
  <li style="margin-bottom: 10px; text-align: justify;">
    <strong>REFUNDABLE SECURITY DEPOSIT:</strong> The Licensee has paid an interest-free refundable security deposit of <strong>₹[Deposit Amount]/-</strong> to the Licensor, refundable upon vacant handover.
  </li>
  <li style="margin-bottom: 10px; text-align: justify;">
    <strong>ELECTRICITY & OUTGOINGS:</strong> The electricity bill as per meter reading and monthly society charges shall be borne and paid punctually by the Licensee.
  </li>
  <li style="margin-bottom: 10px; text-align: justify;">
    <strong>RESIDENTIAL USE:</strong> The premises shall be utilized exclusively for residential purposes of the Licensee and family, and no illegal or commercial activity shall be carried on.
  </li>
  <li style="margin-bottom: 10px; text-align: justify;">
    <strong>LOCK-IN & NOTICE:</strong> Either party may terminate this agreement prior to expiry by giving one (1) month advance written notice.
  </li>
</ol>

<table style="width: 100%; margin-top: 36px; margin-bottom: 30px;">
  <tr>
    <td style="width: 50%; vertical-align: top;">
      <p style="margin-bottom: 40px;">___________________________<br/><strong>LICENSOR (OWNER)</strong></p>
      <p style="font-size: 9.5pt;">Name: ${owner.name}</p>
    </td>
    <td style="width: 50%; vertical-align: top; text-align: right;">
      <p style="margin-bottom: 40px;">___________________________<br/><strong>LICENSEE (TENANT)</strong></p>
      <p style="font-size: 9.5pt;">Name: ${tenant.name}</p>
    </td>
  </tr>
</table>

<table style="width: 100%; margin-top: 10px; margin-bottom: 24px; font-size: 10pt;">
  <tr>
    <td style="width: 50%;">
      <p><strong>WITNESS 1:</strong></p>
      <p>Signature: ______________________</p>
      <p>Name & Addr: __________________</p>
    </td>
    <td style="width: 50%;">
      <p><strong>WITNESS 2:</strong></p>
      <p>Signature: ______________________</p>
      <p>Name & Addr: __________________</p>
    </td>
  </tr>
</table>

<div style="border: 1.5px solid #000; padding: 14px 18px; margin-top: 36px; background-color: #fafafa; font-size: 10.5pt;">
  <p style="text-align: center; font-weight: bold; margin-bottom: 8px; text-decoration: underline;">ATTESTATION BY NOTARY PUBLIC (GOVT. OF INDIA)</p>
  <p style="text-align: justify; line-height: 1.5; margin-bottom: 8px;">
    The executing parties have personally appeared before me, acknowledged execution of this Agreement on Non-Judicial Stamp Paper, and affixed their signatures in my presence.
  </p>
  <table style="width: 100%; margin-top: 10px; font-size: 9.5pt;">
    <tr>
      <td style="vertical-align: top; width: 60%; line-height: 1.4;">
        <div><strong>Notarial Serial No:</strong> ${act.serialNo}</div>
        <div><strong>Stamp Value:</strong> ₹${act.stampValue}/- &nbsp;|&nbsp; <strong>Date:</strong> ${act.date}</div>
      </td>
      <td style="vertical-align: top; width: 40%; text-align: right; line-height: 1.3;">
        <div><strong>${profile.notaryName}</strong></div>
        <div style="font-size: 8.5pt;">${profile.regNo}</div>
      </td>
    </tr>
  </table>
</div>`;
    },
  },
  {
    id: 'special-power-of-attorney',
    title: 'Special Power of Attorney (SPA)',
    marathiTitle: 'विशेष कुलमुखत्यारपत्र (SPA)',
    hindiTitle: 'विशेष मुख्तारनामा (SPA)',
    category: 'Power of Attorney',
    description: 'SPA appointing an attorney to act in relation to specific property, vehicle, or legal representation.',
    generateText: (act, profile) => {
      const principal = act.parties[0] || {
        name: '[PRINCIPAL NAME]',
        relationType: 'S/o',
        relativeName: '[RELATIVE NAME]',
        address: '[FULL ADDRESS]',
        idType: 'Aadhaar Card',
        idNumber: '[ID NUMBER]',
      };
      const attorney = act.parties[1] || {
        name: '[ATTORNEY NAME]',
        relationType: 'S/o',
        relativeName: '[RELATIVE NAME]',
        address: '[FULL ADDRESS]',
        idType: 'Aadhaar Card',
        idNumber: '[ID NUMBER]',
      };

      return `SPECIAL POWER OF ATTORNEY

TO ALL TO WHOM THESE PRESENTS SHALL COME, I, ${principal.name}, ${principal.relationType} ${principal.relativeName}, residing at ${principal.address}, holding ${principal.idType} No. ${principal.idNumber} (hereinafter called the "PRINCIPAL"), SEND GREETINGS:

WHEREAS I am unable to personally attend to matters relating to [PROPERTY / VEHICLE / MATTER DETAILS], I do hereby appoint and constitute Shri/Smt. ${attorney.name}, ${attorney.relationType} ${attorney.relativeName}, residing at ${attorney.address}, holding ${attorney.idType} No. ${attorney.idNumber}, as my true and lawful SPECIAL ATTORNEY to act for me and in my name.

1. To appear before concerned offices, courts, sub-registrars, banks, or local bodies.
2. To sign, verify, and submit all necessary applications, forms, affidavits, and receipts.
3. To do all lawful acts necessary for the execution of the aforesaid specific matter.

I hereby ratify and confirm all acts lawfully done by my said Attorney.

IN WITNESS WHEREOF I have executed this Special Power of Attorney on this ${act.date}.

PRINCIPAL                             ATTORNEY (Specimen Signature)

Attested Before Me:
${profile.notaryName}, Notary Public (Govt. of India)
Serial No: ${act.serialNo}
`;
    },
    generateHtml: (act, profile) => {
      const principal = act.parties[0] || {
        name: '[PRINCIPAL NAME]',
        relationType: 'S/o',
        relativeName: '[RELATIVE NAME]',
        address: '[FULL ADDRESS]',
        idType: 'Aadhaar Card',
        idNumber: '[ID NUMBER]',
      };
      const attorney = act.parties[1] || {
        name: '[ATTORNEY NAME]',
        relationType: 'S/o',
        relativeName: '[RELATIVE NAME]',
        address: '[FULL ADDRESS]',
        idType: 'Aadhaar Card',
        idNumber: '[ID NUMBER]',
      };

      return `<div style="text-align: center; margin-bottom: 24px;">
  <h2 style="font-size: 16pt; font-weight: bold; text-decoration: underline; margin-bottom: 4px; text-transform: uppercase;">SPECIAL POWER OF ATTORNEY</h2>
  <div style="font-size: 10pt; font-style: italic; color: #475569;">(For Specific Legal / Property / Administrative Act)</div>
</div>

<p style="text-align: justify; line-height: 1.6; margin-bottom: 16px;">
  <strong>TO ALL TO WHOM THESE PRESENTS SHALL COME</strong>, I, <strong>${principal.name}</strong>, ${principal.relationType} ${principal.relativeName}, Indian Inhabitant, residing at <strong>${principal.address}</strong>, bearing <strong>${principal.idType} No. ${principal.idNumber}</strong> (hereinafter referred to as the <em>"PRINCIPAL / EXECUTANT"</em>), SEND GREETINGS:
</p>

<p style="text-align: justify; line-height: 1.6; margin-bottom: 16px;">
  <strong>WHEREAS</strong> I am presently unable to personally attend to, manage, and execute specific matters relating to <strong>[Property / Case / Vehicle / Bank Matter Details]</strong> due to my busy schedule / personal circumstances;
</p>

<p style="text-align: justify; line-height: 1.6; margin-bottom: 16px;">
  <strong>NOW KNOW YE AND THESE PRESENTS WITNESS</strong> that I do hereby nominate, constitute, and appoint Shri/Smt. <strong>${attorney.name}</strong>, ${attorney.relationType} ${attorney.relativeName}, residing at <strong>${attorney.address}</strong>, bearing <strong>${attorney.idType} No. ${attorney.idNumber}</strong>, as my true and lawful <strong>SPECIAL ATTORNEY</strong>, to act for me, on my behalf, and in my name to perform the following acts:
</p>

<ol style="margin-left: 24px; line-height: 1.7; margin-bottom: 24px;">
  <li style="margin-bottom: 10px; text-align: justify;">
    To represent me before any Government, Semi-Government, Municipal Corporation, Bank, Electricity Board, Police Station, or judicial authority.
  </li>
  <li style="margin-bottom: 10px; text-align: justify;">
    To sign, execute, verify, and submit all necessary applications, representations, declarations, forms, and NOCs.
  </li>
  <li style="margin-bottom: 10px; text-align: justify;">
    To receive all communications, receipts, orders, and certificates on my behalf.
  </li>
  <li style="margin-bottom: 10px; text-align: justify;">
    Generally to do all lawful acts, deeds, and things as may be necessary and expedient for the due fulfillment of the above specific purpose.
  </li>
</ol>

<p style="text-align: justify; line-height: 1.6; margin-bottom: 24px;">
  And I hereby declare that all acts, deeds, and things lawfully executed by my said Special Attorney under this power shall be construed as good, valid, and binding on me as if done by myself in person.
</p>

<table style="width: 100%; margin-top: 36px; margin-bottom: 24px;">
  <tr>
    <td style="width: 50%; vertical-align: top;">
      <p style="margin-bottom: 40px;">___________________________<br/><strong>PRINCIPAL (EXECUTANT)</strong></p>
      <p style="font-size: 9.5pt;">Name: ${principal.name}</p>
    </td>
    <td style="width: 50%; vertical-align: top; text-align: right;">
      <p style="margin-bottom: 40px;">___________________________<br/><strong>SPECIAL ATTORNEY</strong></p>
      <p style="font-size: 9.5pt;">Specimen Signature: ${attorney.name}</p>
    </td>
  </tr>
</table>

<div style="border: 1.5px solid #000; padding: 14px 18px; margin-top: 36px; background-color: #fafafa; font-size: 10.5pt;">
  <p style="text-align: center; font-weight: bold; margin-bottom: 8px; text-decoration: underline;">ATTESTATION BY NOTARY PUBLIC (GOVT. OF INDIA)</p>
  <p style="text-align: justify; line-height: 1.5; margin-bottom: 8px;">
    Appeared before me the Principal <strong>${principal.name}</strong> and Attorney <strong>${attorney.name}</strong> and signed this Power of Attorney in my presence on this ${act.date}.
  </p>
  <table style="width: 100%; margin-top: 10px; font-size: 9.5pt;">
    <tr>
      <td style="vertical-align: top; width: 60%; line-height: 1.4;">
        <div><strong>Notarial Serial No:</strong> ${act.serialNo}</div>
        <div><strong>Book No:</strong> ${act.bookNo} &nbsp;|&nbsp; <strong>Page No:</strong> ${act.pageNo}</div>
      </td>
      <td style="vertical-align: top; width: 40%; text-align: right; line-height: 1.3;">
        <div><strong>${profile.notaryName}</strong></div>
        <div style="font-size: 8.5pt;">${profile.regNo}</div>
      </td>
    </tr>
  </table>
</div>`;
    },
  },
  {
    id: 'blank-document',
    title: 'Blank Legal Sheet (Start Typing or Paste Draft)',
    marathiTitle: 'कोरा कायदेशीर मसुदा (नवीन टाइप करा किंवा पेस्ट करा)',
    hindiTitle: 'कोरा विधिक दस्तावेज़ (टाइप अथवा पेस्ट करें)',
    category: 'Blank',
    description: 'Clean formatted legal sheet with proper margins, ready for typing, dictation, or pasting text from Word.',
    generateText: (act, profile) => {
      return `LEGAL DOCUMENT / DEED

Place cursor here to start typing, or paste text directly from Microsoft Word / WhatsApp...

Dated: ${act.date}
Serial No: ${act.serialNo}
Notary: ${profile.notaryName}
`;
    },
    generateHtml: (_act, _profile) => {
      return `<div style="text-align: center; margin-bottom: 24px;">
  <h2 style="font-size: 16pt; font-weight: bold; text-decoration: underline; margin-bottom: 4px; text-transform: uppercase;">LEGAL DOCUMENT / DEED</h2>
  <div style="font-size: 10pt; font-style: italic; color: #475569;">(Type your custom legal draft or copy-paste text below)</div>
</div>

<p style="text-align: justify; line-height: 1.6; margin-bottom: 16px;">
  Type or paste your legal text here. You can format text with <strong>bold</strong>, <em>italics</em>, <u>underline</u>, numbered clauses, or use the quick buttons above to insert Deponent clauses, Jurat attestation, or Verification blocks.
</p>

<ol style="margin-left: 24px; line-height: 1.7; margin-bottom: 24px;">
  <li style="margin-bottom: 10px; text-align: justify;">
    Clause 1: That the parties have agreed to the terms set forth herein...
  </li>
  <li style="margin-bottom: 10px; text-align: justify;">
    Clause 2: That this deed shall remain binding on all executants and legal representatives...
  </li>
</ol>

<table style="width: 100%; margin-top: 40px; margin-bottom: 24px;">
  <tr>
    <td style="width: 50%; vertical-align: top;">
      <p style="margin-bottom: 40px;">___________________________<br/><strong>FIRST PARTY / EXECUTANT</strong></p>
    </td>
    <td style="width: 50%; vertical-align: top; text-align: right;">
      <p style="margin-bottom: 40px;">___________________________<br/><strong>SECOND PARTY / DEPONENT</strong></p>
    </td>
  </tr>
</table>`;
    },
  },
];

export const NOTARY_SNIPPETS = {
  juratClause: (profile: NotaryProfile, act?: NotarialAct) => `
<div class="notary-inserted-snippet" style="border: 1.5px solid #000; padding: 14px 18px; margin-top: 28px; margin-bottom: 20px; background-color: #fafafa; font-size: 10.5pt; line-height: 1.5;">
  <p style="text-align: center; font-weight: bold; margin-bottom: 8px; text-decoration: underline;">ATTESTATION BY NOTARY PUBLIC (GOVT. OF INDIA)</p>
  <p style="text-align: justify; margin-bottom: 8px;">
    Solemnly affirmed and signed before me by the Deponent / Executant who is personally identified by <strong>[Name of Advocate / Identifier]</strong> on this <strong>${act?.date || new Date().toISOString().split('T')[0]}</strong> at ${profile.areaOfPractice.split(',')[0]}, Maharashtra.
  </p>
  <table style="width: 100%; margin-top: 10px; font-size: 9.5pt;">
    <tr>
      <td style="vertical-align: top; width: 60%; line-height: 1.4;">
        <div><strong>Notarial Serial No:</strong> ${act?.serialNo || 'NS-' + new Date().getFullYear() + '-XXXX'}</div>
        <div><strong>Book No:</strong> ${act?.bookNo || 1} &nbsp;|&nbsp; <strong>Page No:</strong> ${act?.pageNo || 1}</div>
        <div><strong>Entry Date:</strong> ${act?.date || new Date().toISOString().split('T')[0]}</div>
      </td>
      <td style="vertical-align: top; width: 40%; text-align: right; line-height: 1.3;">
        <div><strong>${profile.notaryName}</strong></div>
        <div style="font-size: 8.5pt;">${profile.qualifications}</div>
        <div style="font-size: 8.5pt;">${profile.regNo}</div>
        <div style="font-size: 8pt; color: #555;">${profile.areaOfPractice}</div>
      </td>
    </tr>
  </table>
</div>`,

  verificationClause: (profile: NotaryProfile, dateStr?: string) => `
<div class="notary-inserted-snippet" style="margin-top: 24px; margin-bottom: 20px; border-top: 1px dashed #94a3b8; padding-top: 16px;">
  <p style="text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 8px;">VERIFICATION</p>
  <p style="text-align: justify; line-height: 1.6; margin-bottom: 20px;">
    Verified at <strong>${profile.areaOfPractice.split(',')[0]}</strong> on this <strong>${dateStr || new Date().toISOString().split('T')[0]}</strong>, that the contents of the above affidavit are true and correct to the best of my personal knowledge, belief, and records, and nothing material has been concealed therefrom.
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
  I, <strong>${party?.name || '[DEPONENT FULL NAME]'}</strong>, ${party?.relationType || 'S/o'} ${party?.relativeName || '[RELATIVE NAME]'}, aged about ${party?.age || '35'} years, Indian Inhabitant, residing at <strong>${party?.address || '[FULL RESIDENTIAL ADDRESS]'}</strong>, bearing <strong>${party?.idType || 'Aadhaar Card'} No. ${party?.idNumber || 'XXXX-XXXX-XXXX'}</strong>, do hereby solemnly affirm and state on oath as under:
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
        <div><strong>uksVjh Øekad %</strong> ${act?.serialNo || 'NS-' + new Date().getFullYear() + '-XXXX'}</div>
        <div><strong>iqLrd la[;k %</strong> ${act?.bookNo || 1} &nbsp;|&nbsp; <strong>i\`"B la[;k %</strong> ${act?.pageNo || 1}</div>
        <div><strong>fnukad %</strong> ${act?.date || new Date().toISOString().split('T')[0]}</div>
        <div style="font-size: 9.5pt; color: #333; margin-top: 4px;">'kiFkxzghrk }kjk esjs le{k mifLFkr gksdj 'kiFkiwoZd dFku fd;k x;kA</div>
      </td>
      <td style="vertical-align: top; width: 40%; text-align: right; line-height: 1.3;">
        <div style="font-weight: bold;">${profile.notaryName}</div>
        <div style="font-size: 9pt;">${profile.qualifications}</div>
        <div style="font-size: 9pt;">${profile.regNo}</div>
        <div style="font-size: 8.5pt; color: #444;">${profile.areaOfPractice}</div>
      </td>
    </tr>
  </table>
</div>`,

  krutiDevVerificationClause: (profile: NotaryProfile, dateStr?: string) => `
<div class="notary-inserted-snippet font-krutidev" style="font-family: 'Kruti Dev 010', 'KrutiDev010', serif; font-size: 12.5pt; margin-top: 22px; margin-bottom: 18px; border-top: 1px dashed #94a3b8; padding-top: 14px;">
  <p style="text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 8px; font-size: 14pt;">lR;kiu</p>
  <p style="text-align: justify; line-height: 1.7; margin-bottom: 18px;">
    eSa mijksDr 'kiFkxzghrk lR;kfir djrk@djrh gw¡ fd bl 'kiFki= dh leLr dafMdkvksa esa of.kZr rF; esjs futh Kku o fo'okl ds vuqlkj lR; o lgh gSaA vr% vkt fnukad <strong>${dateStr || new Date().toISOString().split('T')[0]}</strong> dks LFkku <strong>${profile.areaOfPractice.split(',')[0]}</strong> ij lR;kfir fd;kA
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
