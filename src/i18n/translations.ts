export type Language = 'en' | 'mr' | 'hi';

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

  // Login & Credential Authorization
  loginHeading: string;
  loginSubheading: string;
  loginPortalBadge: string;
  loginCredentialsTab: string;
  loginRequestTab: string;
  loginUsernameLabel: string;
  loginPasswordLabel: string;
  loginEnterPortalBtn: string;
  loginInvalidCredentialsError: string;
  loginRequestHeading: string;
  loginRequestDesc: string;
  loginRequestNameLabel: string;
  loginRequestRegNoLabel: string;
  loginRequestMobileLabel: string;
  loginRequestEmailLabel: string;
  loginRequestJurisdictionLabel: string;
  loginRequestNotesLabel: string;
  loginRequestSubmitBtn: string;
  loginRequestSuccessTitle: string;
  loginRequestSuccessDesc: string;
  loginRequestWhatsAppBtn: string;
  loginDemoCredentialsLabel: string;
  logoutBtn: string;
  switchNotaryBtn: string;

  // Email & OTP Authentication
  loginEmailTab: string;
  loginEmailLabel: string;
  loginEmailPlaceholder: string;
  loginSendOtpBtn: string;
  loginSendingOtp: string;
  loginOtpPrompt: string;
  loginOtpLabel: string;
  loginVerifyOtpBtn: string;
  loginVerifyingOtp: string;
  loginResendOtpBtn: string;
  loginResendTimer: string;
  loginChangeEmailBtn: string;
  loginOtpInvalidError: string;
  loginOtpExpiredError: string;
  loginOtpAttemptsLeft: string;
  loginOtpSimulatedBannerTitle: string;
  loginOtpSimulatedBannerDesc: string;
  loginQuickSelectAdvocate: string;
  loginSecurityAuditNotice: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    brandTitle: 'Digital Notary Desk',
    brandSubtitle: 'Official Notary Public • Government of India',
    actTag: 'Act 1952',

    tabDesk: 'New Notary Entry',
    tabCertificate: 'Certificate Preview',
    tabRegister: 'Form XV Register',
    tabDrafter: 'Document Editor & Drafter',
    tabVerify: 'Verify QR',
    tabSettings: 'Profile & Settings',
    secugenOnline: 'SecuGen Online',
    secugenSim: 'SecuGen Sim',
    webcamReady: 'Webcam Ready',

    deskTitle: 'Notary Public Desk',
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

    loginHeading: 'Digital Notary Copilot',
    loginSubheading: 'Official Notarial Workstation & Biometric Form XV Portal',
    loginPortalBadge: 'Notaries Act, 1952 • Govt. of India',
    loginCredentialsTab: 'Authorized Sign-In',
    loginRequestTab: 'Interested? Request Access',
    loginUsernameLabel: 'Username / ID',
    loginPasswordLabel: 'Password',
    loginEnterPortalBtn: 'Sign In & Open Portal',
    loginInvalidCredentialsError: 'Invalid username or password. Please verify credentials or contact administrator.',
    loginRequestHeading: 'Request Official Workstation Access',
    loginRequestDesc: 'If you are an Advocate or Notary Public interested in this workstation, submit your details to receive your authorized login credentials from the administrator.',
    loginRequestNameLabel: 'Advocate Full Name',
    loginRequestRegNoLabel: 'Notary / Bar Registration No.',
    loginRequestMobileLabel: 'WhatsApp / Mobile Number',
    loginRequestEmailLabel: 'Official Email ID',
    loginRequestJurisdictionLabel: 'Court / District Jurisdiction',
    loginRequestNotesLabel: 'Requirement / Notes (Optional)',
    loginRequestSubmitBtn: 'Submit Access Request',
    loginRequestSuccessTitle: 'Request Sent to Administrator!',
    loginRequestSuccessDesc: 'Your request has been received. The administrator will verify your credentials and issue your official username and password via WhatsApp or email.',
    loginRequestWhatsAppBtn: 'Contact Administrator on WhatsApp for Instant Access',
    loginDemoCredentialsLabel: 'Available Demo Credentials (Click to Autofill)',
    logoutBtn: 'Logout',
    switchNotaryBtn: 'Switch Notary',

    // Email & OTP Authentication
    loginEmailTab: 'Email OTP Sign-In',
    loginEmailLabel: 'Official Registered Email ID',
    loginEmailPlaceholder: 'advocate.name@barcouncil.in or your email',
    loginSendOtpBtn: 'Send 6-Digit Authorization Code',
    loginSendingOtp: 'Dispatching Secure OTP...',
    loginOtpPrompt: 'Enter the 6-digit one-time authorization code dispatched to',
    loginOtpLabel: 'One-Time Verification Code (OTP)',
    loginVerifyOtpBtn: 'Verify Code & Enter Chamber',
    loginVerifyingOtp: 'Verifying Security Token...',
    loginResendOtpBtn: 'Resend Verification Code',
    loginResendTimer: 'Resend code in',
    loginChangeEmailBtn: 'Change Email Address',
    loginOtpInvalidError: 'Invalid or incorrect OTP code. Please enter the valid 6-digit code.',
    loginOtpExpiredError: 'Security token has expired. Please request a fresh OTP.',
    loginOtpAttemptsLeft: 'attempts remaining before lockout',
    loginOtpSimulatedBannerTitle: 'Ministry of Law / Chamber Secure Dispatch (Simulator)',
    loginOtpSimulatedBannerDesc: 'Your one-time authorization code for official chamber workstation access is:',
    loginQuickSelectAdvocate: 'Quick-Select Registered Advocate Profile:',
    loginSecurityAuditNotice: 'Evidentiary Chain of Custody Active. All access attempts are cryptographically timestamped.',
  },
  mr: {
    brandTitle: 'डिजिटल नॉटरी डेस्क',
    brandSubtitle: 'अधिकृत नोटरी पब्लिक • भारत सरकार',
    actTag: 'कायदा १९५२',

    tabDesk: 'नवीन नॉटरी नोंद',
    tabCertificate: 'प्रमाणपत्र पूर्वदृश्य',
    tabRegister: 'नमुना १५ नोंदवही',
    tabDrafter: 'दस्तऐवज संपादक व मसुदा',
    tabVerify: 'क्यूआर पडताळणी',
    tabSettings: 'माहिती व सेटिंग्ज',
    secugenOnline: 'SecuGen चालू आहे',
    secugenSim: 'सिम्युलेटर मोड',
    webcamReady: 'कॅमेरा सज्ज',

    deskTitle: 'नॉटरी कार्यकक्ष',
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

    loginHeading: 'डिजिटल नॉटरी कोपायलट',
    loginSubheading: 'अधिकृत नॉटरी कार्यप्रणाली व बायोमेट्रिक नमुना १५ नोंदवही पोर्टल',
    loginPortalBadge: 'नॉटरी कायदा, १९५२ • भारत सरकार',
    loginCredentialsTab: 'अधिकृत लॉगिन',
    loginRequestTab: 'इच्छुक आहात? प्रवेश विनंती करा',
    loginUsernameLabel: 'युझरनेम / आयडी',
    loginPasswordLabel: 'पासवर्ड',
    loginEnterPortalBtn: 'लॉगिन करा व पोर्टल उघडा',
    loginInvalidCredentialsError: 'अवैध युझरनेम किंवा पासवर्ड. कृपया माहिती तपासा किंवा प्रशासकाशी संपर्क साधा.',
    loginRequestHeading: 'कार्यप्रणाली प्रवेशासाठी अधिकृत विनंती',
    loginRequestDesc: 'जर आपण वकील किंवा नॉटरी पब्लिक असाल आणि हे पोर्टल वापरू इच्छित असाल, तर प्रशासकाकडून युझरनेम व पासवर्ड मिळवण्यासाठी आपले तपशील खाली भरा.',
    loginRequestNameLabel: 'वकिलांचे पूर्ण नाव',
    loginRequestRegNoLabel: 'नॉटरी / बार नोंदणी क्रमांक',
    loginRequestMobileLabel: 'व्हॉट्सअ‍ॅप / मोबाईल नंबर',
    loginRequestEmailLabel: 'अधिकृत ईमेल आयडी',
    loginRequestJurisdictionLabel: 'न्यायालय / जिल्हा अधिकारक्षेत्र',
    loginRequestNotesLabel: 'गरज / टिपणी (पर्यायी)',
    loginRequestSubmitBtn: 'प्रवेश विनंती पाठवा',
    loginRequestSuccessTitle: 'प्रशासकाकडे विनंती यशस्वीरित्या पाठवली!',
    loginRequestSuccessDesc: 'आपली विनंती प्राप्त झाली आहे. प्रशासक आपल्या माहितीची पडताळणी करून व्हॉट्सअ‍ॅप किंवा ईमेलद्वारे अधिकृत युझरनेम व पासवर्ड पाठवतील.',
    loginRequestWhatsAppBtn: 'तातडीच्या लॉगिनसाठी प्रशासकाशी व्हॉट्सअ‍ॅपवर संपर्क साधा',
    loginDemoCredentialsLabel: 'उपलब्ध डेमो खाती (ऑटोफिलसाठी क्लिक करा)',
    logoutBtn: 'लॉग आऊट',
    switchNotaryBtn: 'नॉटरी बदला',

    // Email & OTP Authentication
    loginEmailTab: 'ईमेल ओटीपी लॉगिन',
    loginEmailLabel: 'अधिकृत नोंदणीकृत ईमेल आयडी',
    loginEmailPlaceholder: 'advocate.name@gmail.com किंवा आपला ईमेल',
    loginSendOtpBtn: '६-अंकी पडताळणी कोड पाठवा',
    loginSendingOtp: 'सुरक्षित ओटीपी पाठवत आहे...',
    loginOtpPrompt: 'या ईमेलवर पाठवलेला ६-अंकी अधिकृत पडताळणी कोड प्रविष्ट करा:',
    loginOtpLabel: 'एकवेळचा पडताळणी कोड (OTP)',
    loginVerifyOtpBtn: 'पडताळणी करा व दालनात प्रवेश करा',
    loginVerifyingOtp: 'सुरक्षा टोकन तपासत आहे...',
    loginResendOtpBtn: 'पुन्हा कोड पाठवा',
    loginResendTimer: 'पुन्हा पाठवण्यासाठी वेळ:',
    loginChangeEmailBtn: 'ईमेल बदला',
    loginOtpInvalidError: 'अवैध किंवा चुकीचा ओटीपी कोड. कृपया वैध ६-अंकी कोड टाका.',
    loginOtpExpiredError: 'सुरक्षा कोडची मुदत संपली आहे. कृपया नवीन ओटीपी मागवा.',
    loginOtpAttemptsLeft: 'प्रयत्न शिल्लक',
    loginOtpSimulatedBannerTitle: 'विधी व न्याय मंत्रालय / सुरक्षित ओटीपी डिस्पॅच (सिम्युलेटर)',
    loginOtpSimulatedBannerDesc: 'अधिकृत नॉटरी दालन प्रवेशासाठी आपला एकवेळचा पडताळणी कोड आहे:',
    loginQuickSelectAdvocate: 'नोंदणीकृत वकील निवडा:',
    loginSecurityAuditNotice: 'पुरावा साखळी सक्रिय. सर्व प्रवेश नोंदी सुरक्षितपणे डिजिटल नोंदवहीत साठवल्या जातात.',
  },
  hi: {
    brandTitle: 'डिजिटल नोटरी डेस्क',
    brandSubtitle: 'आधिकारिक नोटरी पब्लिक • भारत सरकार',
    actTag: 'अधिनियम १९५२',

    tabDesk: 'नई नोटरी प्रविष्टि',
    tabCertificate: 'प्रमाणपत्र पूर्वावलोकन',
    tabRegister: 'प्रारूप १५ रजिस्टर',
    tabDrafter: 'दस्तावेज़ संपादक व मसौदा',
    tabVerify: 'क्यूआर सत्यापन',
    tabSettings: 'प्रोफ़ाइल व सेटिंग्स',
    secugenOnline: 'SecuGen चालू है',
    secugenSim: 'सिम्युलेटर मोड',
    webcamReady: 'वेबकैम तैयार',

    deskTitle: 'नोटरी डेस्क',
    deskSubtitle: 'चरण १: विवरण भरें → चरण २: फ़ोटो व SecuGen अंगूठे का निशान लें → चरण ३: प्रमाणपत्र प्रिंट करें और प्रारूप १५ में दर्ज करें',
    fillDemoBtn: 'नमूना प्रविष्टि भरें',
    generatePrintBtn: 'प्रमाणपत्र तैयार व प्रिंट करें (A4)',
    docDetailsTitle: '१. दस्तावेज़ की प्रकृति व आधिकारिक पंजीकरण विवरण',
    docDetailsSubtitle: 'प्रारूप १५ रजिस्टर के लिए स्वचालित रूप से आवंटित अनुक्रमांक',
    serialNoLabel: 'पंजीकरण अनुक्रमांक',
    docTypeLabel: 'विधिक दस्तावेज़ का प्रकार',
    docTitleLabel: 'दस्तावेज़ का शीर्षक (प्रमाणपत्र पर मुद्रित होगा)',
    executionDateLabel: 'निष्पादन तिथि',
    feeChargedLabel: 'नोटरी शुल्क (₹) [केवल आंतरिक रजिस्टर के लिए]',
    stampValueLabel: 'स्टाम्प पेपर मूल्य (₹)',

    partiesTitle: '२. निष्पादक पक्षकार व बायोमेट्रिक कैप्चर',
    partiesSubtitle: 'प्रत्येक पक्षकार का लाइव वेबकैम फ़ोटो, SecuGen फिंगरप्रिंट और हस्ताक्षर लें',
    addWitnessBtn: 'गवाह जोड़ें',
    addExecutantBtn: 'निष्पादक जोड़ें',
    readyForCert: 'प्रमाणपत्र हेतु तैयार',
    fullNameLabel: 'पूरा नाम',
    relationLabel: 'संबन्ध व पिता/पति का नाम',
    idProofLabel: 'पहचान प्रमाण (आधार/पैन/आदि)',
    mobileLabel: 'मोबाइल नंबर',
    addressLabel: 'स्थायी निवास का पता',
    takePhotoBtn: 'फ़ोटो लें',
    scanThumbBtn: 'अंगूठा स्कैन करें',
    paperSignBtn: 'कागज़ पर हस्ताक्षर',
    physicalInkNote: 'स्याही द्वारा हस्ताक्षर',
    photoCaptured: 'फ़ोटो ली गई ✓',
    thumbCaptured: 'अंगूठा स्कैन हुआ ✓',
    paperSignSelected: 'कागज़ पर भौतिक हस्ताक्षर',

    certDocTitle: 'नोटरी प्रमाणपत्र',
    certRegSerialNo: 'पंजीकरण अनुक्रमांक',
    certTypeOfDoc: 'दस्तावेज़ का प्रकार',
    certRegisteredOn: 'पंजीकरण तिथि',
    certExecutingParties: 'निष्पादक पक्षकार',
    certSignedPresenceWitness: 'गवाह की उपस्थिति में हस्ताक्षरित',
    certPartyInfo: 'पक्षकार विवरण',
    certDigitalPhoto: 'डिजिटल फ़ोटो',
    certThumbImpression: 'अंगूठे का निशान',
    certSignature: 'हस्ताक्षर',
    certSignedBeforeMe: 'मेरे समक्ष हस्ताक्षरित किया',
    certAttestationTitle: 'नोटरी अधिनियम, १९५२ के अंतर्गत वैधानिक अनुप्रमाणन',
    certAttestationJurat: 'मेरे समक्ष व्यक्तिगत रूप से उपस्थित होकर, बायोमेट्रिक अंगूठे के निशान और फ़ोटो द्वारा पहचान सत्यापित कराकर, स्वेच्छा से हस्ताक्षर किए एवं शपथपूर्वक सत्यकथन किया।',
    certAffixStampHere: 'नोटरी की आधिकारिक मोहर यहाँ लगाएं',
    certScanToVerify: 'सत्यापन हेतु क्यूआर स्कैन करें',
    certWatermark: 'वॉटरमार्क',
    certPreviewCopy: 'नमूना प्रति',
    certOfficialCopy: 'आधिकारिक प्रति',
    certNone: 'कोई नहीं',
    certPrintBtn: 'प्रमाणपत्र प्रिंट करें (A4)',
    certBackBtn: 'वापस जाएं',
    certBookNo: 'बही सं.',
    certPageNo: 'पृष्ठ सं.',

    registerTitle: 'प्रारूप १५ आधिकारिक नोटरी रजिस्टर',
    registerSubtitle: 'नोटरी नियम १९५६ के नियम ११(९) के अंतर्गत संधारित वैधानिक रजिस्टर',
    regTotalActs: 'कुल पंजीकृत दस्तावेज़',
    regTotalFees: 'कुल जमा शुल्क',
    regTenancyDocs: 'किराया अनुबंध',
    regAffidavits: 'शपथ पत्र (Affidavits)',
    regSearchPlaceholder: 'अनुक्रमांक (उदा. NS-2026-0018), नाम, मोबाइल या पते से खोजें...',
    regAllFilter: 'सभी दस्तावेज़',
    regTenancyFilter: 'किराया अनुबंध',
    regAffidavitFilter: 'शपथ पत्र',
    regColSNo: 'क्र.सं.',
    regColDate: 'तिथि',
    regColExecutant: 'निष्पादक पक्षकार का नाम',
    regColAddress: 'पता व संपर्क',
    regColWitness: 'पहचानकर्ता गवाह',
    regColNature: 'दस्तावेज़ की प्रकृति',
    regColFee: 'शुल्क (₹)',
    regColBiometrics: 'बायोमेट्रिक्स',
    regColActions: 'कार्रवाई',
    regViewBtn: 'देखें',
    regExportCsvBtn: 'एक्सेल / सीएसवी डाउनलोड',
    regPrintRegisterBtn: 'रजिस्टर प्रिंट करें',

    roleOwner: 'मकान मालिक',
    roleTenant: 'किरायेदार',
    roleDeponent: 'शपथकर्ता',
    roleWitness: 'गवाह',
    roleExecutant: 'निष्पादक',

    loginHeading: 'डिजिटल नोटरी कोपायलट',
    loginSubheading: 'आधिकारिक नोटरी कार्यस्थल व बायोमेट्रिक प्रारूप १५ रजिस्टर पोर्टल',
    loginPortalBadge: 'नोटरी अधिनियम, १९५२ • भारत सरकार',
    loginCredentialsTab: 'अधिकृत लॉगिन',
    loginRequestTab: 'इच्छुक हैं? प्रवेश अनुरोध भेजें',
    loginUsernameLabel: 'यूज़रनेम / आईडी',
    loginPasswordLabel: 'पासवर्ड',
    loginEnterPortalBtn: 'लॉगिन करें व पोर्टल खोलें',
    loginInvalidCredentialsError: 'अमान्य यूज़रनेम या पासवर्ड। कृपया विवरण जांचें या व्यवस्थापक से संपर्क करें।',
    loginRequestHeading: 'कार्यस्थल उपयोग हेतु आधिकारिक अनुरोध',
    loginRequestDesc: 'यदि आप एक अधिवक्ता या नोटरी पब्लिक हैं और इस पोर्टल का उपयोग करना चाहते हैं, तो व्यवस्थापक से यूज़रनेम और पासवर्ड प्राप्त करने के लिए नीचे अपना विवरण भरें।',
    loginRequestNameLabel: 'अधिवक्ता का पूरा नाम',
    loginRequestRegNoLabel: 'नोटरी / बार पंजीकरण संख्या',
    loginRequestMobileLabel: 'व्हाट्सएप / मोबाइल नंबर',
    loginRequestEmailLabel: 'आधिकारिक ईमेल आईडी',
    loginRequestJurisdictionLabel: 'न्यायालय / ज़िला अधिकार क्षेत्र',
    loginRequestNotesLabel: 'आवश्यकता / टिप्पणी (वैकल्पिक)',
    loginRequestSubmitBtn: 'प्रवेश अनुरोध भेजें',
    loginRequestSuccessTitle: 'व्यवस्थापक को अनुरोध सफलतापूर्वक भेजा गया!',
    loginRequestSuccessDesc: 'आपका अनुरोध प्राप्त हो गया है। व्यवस्थापक सत्यापन के बाद व्हाट्सएप या ईमेल द्वारा आधिकारिक यूज़रनेम और पासवर्ड उपलब्ध कराएंगे।',
    loginRequestWhatsAppBtn: 'त्वरित क्रेडेंशियल्स के लिए व्हाट्सएप पर व्यवस्थापक से संपर्क करें',
    loginDemoCredentialsLabel: 'उपलब्ध डेमो खाते (ऑटोफ़िल के लिए क्लिक करें)',
    logoutBtn: 'लॉग आउट',
    switchNotaryBtn: 'नोटरी बदलें',

    // Email & OTP Authentication
    loginEmailTab: 'ईमेल ओटीपी लॉगिन',
    loginEmailLabel: 'आधिकारिक पंजीकृत ईमेल आईडी',
    loginEmailPlaceholder: 'advocate.name@gmail.com या आपका ईमेल',
    loginSendOtpBtn: '६-अंकीय सत्यापन कोड भेजें',
    loginSendingOtp: 'सुरक्षित ओटीपी भेजा जा रहा है...',
    loginOtpPrompt: 'इस ईमेल पर भेजा गया ६-अंकीय आधिकारिक सत्यापन कोड दर्ज करें:',
    loginOtpLabel: 'एकमुश्त सत्यापन कोड (OTP)',
    loginVerifyOtpBtn: 'सत्यापित करें व कार्यस्थल खोलें',
    loginVerifyingOtp: 'सुरक्षा टोकन जांचा जा रहा है...',
    loginResendOtpBtn: 'पुनः कोड भेजें',
    loginResendTimer: 'पुनः भेजने हेतु समय:',
    loginChangeEmailBtn: 'ईमेल बदलें',
    loginOtpInvalidError: 'अमान्य या गलत ओटीपी कोड। कृपया सही ६-अंकीय कोड दर्ज करें।',
    loginOtpExpiredError: 'सुरक्षा टोकन की समय सीमा समाप्त हो गई है। कृपया नया ओटीपी प्राप्त करें।',
    loginOtpAttemptsLeft: 'प्रयास शेष',
    loginOtpSimulatedBannerTitle: 'विधि एवं न्याय मंत्रालय / सुरक्षित ओटीपी प्रेषण (सिम्युलेटर)',
    loginOtpSimulatedBannerDesc: 'आधिकारिक नोटरी कार्यस्थल प्रवेश हेतु आपका सत्यापन कोड है:',
    loginQuickSelectAdvocate: 'पंजीकृत अधिवक्ता प्रोफ़ाइल चुनें:',
    loginSecurityAuditNotice: 'साक्ष्य श्रृंखला सक्रिय। सभी लॉगिन प्रयास डिजिटल रूप से ऑडिट लॉग में दर्ज होते हैं।',
  },
};
