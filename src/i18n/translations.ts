export type Language = 'en' | 'mr';

export interface Translations {
  // Brand & Header
  brandTitle: string;
  brandSubtitle: string;
  actTag: string;

  // Navbar
  tabDesk: string;
  tabCertificate: string;
  tabRegister: string;
  tabDrafter: string;
  tabVerify: string;
  tabSettings: string;
  secugenOnline: string;
  secugenSim: string;
  webcamReady: string;

  // Desk
  deskTitle: string;
  deskSubtitle: string;
  fillDemoBtn: string;
  generatePrintBtn: string;
  docDetailsTitle: string;
  docDetailsSubtitle: string;
  serialNoLabel: string;
  docTypeLabel: string;
  docTitleLabel: string;
  executionDateLabel: string;
  feeChargedLabel: string;
  stampValueLabel: string;

  // Parties
  partiesTitle: string;
  partiesSubtitle: string;
  addWitnessBtn: string;
  addExecutantBtn: string;
  readyForCert: string;
  fullNameLabel: string;
  relationLabel: string;
  idProofLabel: string;
  mobileLabel: string;
  addressLabel: string;
  takePhotoBtn: string;
  scanThumbBtn: string;
  paperSignBtn: string;
  physicalInkNote: string;
  photoCaptured: string;
  thumbCaptured: string;
  paperSignSelected: string;

  // Certificate
  certDocTitle: string;
  certRegSerialNo: string;
  certTypeOfDoc: string;
  certRegisteredOn: string;
  certExecutingParties: string;
  certSignedPresenceWitness: string;
  certPartyInfo: string;
  certDigitalPhoto: string;
  certThumbImpression: string;
  certSignature: string;
  certSignedBeforeMe: string;
  certAttestationTitle: string;
  certAttestationJurat: string;
  certAffixStampHere: string;
  certScanToVerify: string;
  certWatermark: string;
  certPreviewCopy: string;
  certOfficialCopy: string;
  certNone: string;
  certPrintBtn: string;
  certBackBtn: string;
  certBookNo: string;
  certPageNo: string;

  // Register Form XV
  registerTitle: string;
  registerSubtitle: string;
  regTotalActs: string;
  regTotalFees: string;
  regTenancyDocs: string;
  regAffidavits: string;
  regSearchPlaceholder: string;
  regAllFilter: string;
  regTenancyFilter: string;
  regAffidavitFilter: string;
  regColSNo: string;
  regColDate: string;
  regColExecutant: string;
  regColAddress: string;
  regColWitness: string;
  regColNature: string;
  regColFee: string;
  regColBiometrics: string;
  regColActions: string;
  regViewBtn: string;
  regExportCsvBtn: string;
  regPrintRegisterBtn: string;

  // Roles
  roleOwner: string;
  roleTenant: string;
  roleDeponent: string;
  roleWitness: string;
  roleExecutant: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    brandTitle: 'Digital Notary Desk',
    brandSubtitle: 'Advocate Nileema Saranga • Reg. No. 15960 / Govt. of India',
    actTag: 'Act 1952',

    tabDesk: 'New Notary Entry',
    tabCertificate: 'Certificate Preview',
    tabRegister: 'Form XV Register',
    tabDrafter: 'Affidavit Drafter',
    tabVerify: 'Verify QR',
    tabSettings: 'Profile & Settings',
    secugenOnline: 'SecuGen Online',
    secugenSim: 'SecuGen Sim',
    webcamReady: 'Webcam Ready',

    deskTitle: "Adv. Nileema Saranga's Notary Desk",
    deskSubtitle: 'Step 1: Enter details → Step 2: Snap photo & SecuGen thumb scan → Step 3: Print Certificate & log Form XV',
    fillDemoBtn: 'Fill Sample Client Entry',
    generatePrintBtn: 'Generate & Print Certificate (A4)',
    docDetailsTitle: '1. Document Nature & Registration Metadata',
    docDetailsSubtitle: 'Automatically allocated sequential serial number for Form XV register',
    serialNoLabel: 'Serial No',
    docTypeLabel: 'Type of Legal Document',
    docTitleLabel: 'Document Title (Printed on Certificate)',
    executionDateLabel: 'Execution Date',
    feeChargedLabel: 'Notarial Fee (₹) [Internal Register Only]',
    stampValueLabel: 'Stamp Paper Value (₹)',

    partiesTitle: '2. Executing Parties & Biometric Capture',
    partiesSubtitle: 'Capture live webcam facial photo, SecuGen USB fingerprint, and signature for each party',
    addWitnessBtn: 'Add Witness',
    addExecutantBtn: 'Add Executant',
    readyForCert: 'Ready for Certificate',
    fullNameLabel: 'Full Name',
    relationLabel: 'Relationship & Father / Spouse Name',
    idProofLabel: 'Identification Proof',
    mobileLabel: 'Mobile Number',
    addressLabel: 'Residential Address',
    takePhotoBtn: 'Take Photo',
    scanThumbBtn: 'Scan Thumb',
    paperSignBtn: 'Paper Sign',
    physicalInkNote: 'Physical Ink',
    photoCaptured: 'Captured ✓',
    thumbCaptured: 'Captured ✓',
    paperSignSelected: 'Physical sign on paper',

    certDocTitle: 'Notary Certificate',
    certRegSerialNo: 'Registered Serial No',
    certTypeOfDoc: 'Type of Document',
    certRegisteredOn: 'Registered On',
    certExecutingParties: 'Executing Parties',
    certSignedPresenceWitness: 'Signed by Executing parties above in presence of Witness',
    certPartyInfo: 'Party Information',
    certDigitalPhoto: 'Digital Photo',
    certThumbImpression: 'Thumb Impression',
    certSignature: 'Signature',
    certSignedBeforeMe: 'Signed before me',
    certAttestationTitle: 'Attestation under the Notaries Act, 1952',
    certAttestationJurat: 'Solemnly affirmed and signed before me by the executants who appeared in person, were duly identified through verified biometric thumb impressions and photographic records, and acknowledged execution with free consent.',
    certAffixStampHere: 'AFFIX NOTARY STAMP HERE',
    certScanToVerify: 'Scan to Verify',
    certWatermark: 'Watermark',
    certPreviewCopy: 'Preview Copy',
    certOfficialCopy: 'Official Copy',
    certNone: 'None',
    certPrintBtn: 'Print Certificate (A4)',
    certBackBtn: 'Back to Desk',
    certBookNo: 'Book No',
    certPageNo: 'Page No',

    registerTitle: 'Form XV Notarial Register',
    registerSubtitle: 'Statutory Register of Notarial Acts maintained under Rule 11(9) of the Notaries Rules, 1956',
    regTotalActs: 'Total Recorded Acts',
    regTotalFees: 'Total Fees Collected',
    regTenancyDocs: 'Tenancy Agreements',
    regAffidavits: 'Affidavits Attested',
    regSearchPlaceholder: 'Search by Serial No (e.g. NS-2026-0018), Client Name, Mobile, or Address...',
    regAllFilter: 'All Documents',
    regTenancyFilter: 'Tenancy',
    regAffidavitFilter: 'Affidavits',
    regColSNo: 'S. No.',
    regColDate: 'Date',
    regColExecutant: 'Name of Executant(s)',
    regColAddress: 'Address & Contact',
    regColWitness: 'Person Identifying (Witness)',
    regColNature: 'Nature of Document',
    regColFee: 'Fee (₹)',
    regColBiometrics: 'Biometrics',
    regColActions: 'Actions',
    regViewBtn: 'View',
    regExportCsvBtn: 'Export Excel / CSV',
    regPrintRegisterBtn: 'Print Register',

    roleOwner: 'Owner',
    roleTenant: 'Tenant',
    roleDeponent: 'Deponent',
    roleWitness: 'Witness',
    roleExecutant: 'Executant',
  },
  mr: {
    brandTitle: 'डिजिटल नॉटरी डेस्क',
    brandSubtitle: 'ॲड. निलिमा सारंगा • नोंदणी क्र. १५९६० / भारत सरकार',
    actTag: 'कायदा १९५२',

    tabDesk: 'नवीन नॉटरी नोंद',
    tabCertificate: 'प्रमाणपत्र पूर्वदृश्य',
    tabRegister: 'नमुना १५ नोंदवही',
    tabDrafter: 'शपथपत्र ड्राफ्टर',
    tabVerify: 'क्यूआर पडताळणी',
    tabSettings: 'माहिती व सेटिंग्ज',
    secugenOnline: 'SecuGen चालू आहे',
    secugenSim: 'सिम्युलेटर मोड',
    webcamReady: 'कॅमेरा सज्ज',

    deskTitle: 'ॲड. निलिमा सारंगा - नॉटरी कार्यकक्ष',
    deskSubtitle: 'पायरी १: माहिती भरा → पायरी २: फोटो व सेकुजेन अंगठ्याचा ठसा घ्या → पायरी ३: प्रमाणपत्र प्रिंट करा व नोंदवहीत नोंदवा',
    fillDemoBtn: 'नमुना पक्षकार माहिती भरा',
    generatePrintBtn: 'प्रमाणपत्र तयार करा व प्रिंट करा (A4)',
    docDetailsTitle: '१. दस्तऐवज प्रकार व अधिकृत नोंदणी तपशील',
    docDetailsSubtitle: 'नमुना १५ नोंदवहीसाठी आपोआप निर्माण होणारा अनुक्रमांक',
    serialNoLabel: 'नोंदणी अनुक्रमांक',
    docTypeLabel: 'कायदेशीर दस्तऐवज प्रकार',
    docTitleLabel: 'दस्तऐवजाचे नाव (प्रमाणपत्रावर छापले जाईल)',
    executionDateLabel: 'नोंदणी दिनांक',
    feeChargedLabel: 'नॉटरी फी (₹) [केवळ अंतर्गत नोंदवहीसाठी]',
    stampValueLabel: 'मुद्रांक शुल्क / स्टॅम्प मूल्य (₹)',

    partiesTitle: '२. निष्पादक पक्षकार व बायोमेट्रिक नोंदणी',
    partiesSubtitle: 'प्रत्येक पक्षकाराचा थेट वेबकॅम फोटो, सेकुजेन अंगठ्याचा ठसा आणि स्वाक्षरी घ्या',
    addWitnessBtn: 'साक्षीदार जोडा',
    addExecutantBtn: 'पक्षकार जोडा',
    readyForCert: 'प्रमाणपत्रासाठी सज्ज',
    fullNameLabel: 'पूर्ण नाव',
    relationLabel: 'नाते व वडील/पतीचे नाव',
    idProofLabel: 'ओळख पुरावा (आधार/पॅन/इ.)',
    mobileLabel: 'मोबाईल क्रमांक',
    addressLabel: 'राहण्याचा पूर्ण पत्ता',
    takePhotoBtn: 'फोटो काढा',
    scanThumbBtn: 'अंगठा स्कॅन करा',
    paperSignBtn: 'कागदावर स्वाक्षरी',
    physicalInkNote: 'शाईने स्वाक्षरी',
    photoCaptured: 'फोटो घेतला ✓',
    thumbCaptured: 'ठसा घेतला ✓',
    paperSignSelected: 'कागदावर प्रत्यक्ष स्वाक्षरी',

    certDocTitle: 'नॉटरी प्रमाणपत्र',
    certRegSerialNo: 'नोंदणी अनुक्रमांक',
    certTypeOfDoc: 'दस्तऐवजाचा प्रकार',
    certRegisteredOn: 'नोंदणी दिनांक',
    certExecutingParties: 'निष्पादक पक्षकार',
    certSignedPresenceWitness: 'साक्षीदाराच्या समक्ष स्वाक्षरी केली',
    certPartyInfo: 'पक्षकाराचा तपशील',
    certDigitalPhoto: 'डिजिटल फोटो',
    certThumbImpression: 'अंगठ्याचा ठसा',
    certSignature: 'स्वाक्षरी',
    certSignedBeforeMe: 'माझ्यासमक्ष स्वाक्षरी केली',
    certAttestationTitle: 'नॉटरीज कायदा, १९५२ अन्वये अधिकृत साक्षांकन',
    certAttestationJurat: 'माझ्यासमक्ष प्रत्यक्ष हजर राहून, बायोमेट्रिक अंगठ्याचा ठसा व फोटोद्वारे ओळख पटवून, स्वेच्छेने स्वाक्षरी करून शपथपूर्वक सत्यकथन केले.',
    certAffixStampHere: 'नॉटरी अधिकृत शिक्का येथे मारा',
    certScanToVerify: 'पडताळणीसाठी स्कॅन करा',
    certWatermark: 'वॉटरमार्क',
    certPreviewCopy: 'नमुना प्रत',
    certOfficialCopy: 'अधिकृत प्रत',
    certNone: 'काहीही नाही',
    certPrintBtn: 'प्रमाणपत्र प्रिंट करा (A4)',
    certBackBtn: 'मागे जा',
    certBookNo: 'वही क्र.',
    certPageNo: 'पान क्र.',

    registerTitle: 'नमुना १५ अधिकृत नॉटरी नोंदवही',
    registerSubtitle: 'नॉटरीज नियम १९५६ च्या नियम ११(९) नुसार ठेवण्यात आलेली अधिकृत नोंदवही',
    regTotalActs: 'एकूण नोंदवलेले दस्त',
    regTotalFees: 'एकूण जमा फी',
    regTenancyDocs: 'भाडेकरार नोंदी',
    regAffidavits: 'शपथपत्रे (Affidavits)',
    regSearchPlaceholder: 'अनुक्रमांक (उदा. NS-2026-0018), नाव, मोबाईल किंवा पत्त्याने शोधा...',
    regAllFilter: 'सर्व दस्तऐवज',
    regTenancyFilter: 'भाडेकरार',
    regAffidavitFilter: 'शपथपत्रे',
    regColSNo: 'अ.क्र.',
    regColDate: 'दिनांक',
    regColExecutant: 'निष्पादक पक्षकाराचे नाव',
    regColAddress: 'पत्ता व संपर्क',
    regColWitness: 'ओळख पटवणारा साक्षीदार',
    regColNature: 'दस्तऐवजाचे स्वरूप',
    regColFee: 'फी (₹)',
    regColBiometrics: 'बायोमेट्रिक्स',
    regColActions: 'कृती',
    regViewBtn: 'पहा',
    regExportCsvBtn: 'एक्सेल/सीएसव्ही डाऊनलोड',
    regPrintRegisterBtn: 'नोंदवही प्रिंट करा',

    roleOwner: 'घरमालक',
    roleTenant: 'भाडेकरू',
    roleDeponent: 'शपथकर्ता',
    roleWitness: 'साक्षीदार',
    roleExecutant: 'निष्पादक',
  },
};
