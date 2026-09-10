export type PartyRole =
  | 'Owner'
  | 'Tenant'
  | 'First Party'
  | 'Second Party'
  | 'Deponent'
  | 'Witness'
  | 'Purchaser'
  | 'Seller'
  | 'Attorney'
  | 'Executant';

export type IdentificationType =
  | 'Aadhaar Card'
  | 'PAN Card'
  | 'Voter ID'
  | 'Passport'
  | 'Driving License'
  | 'Other Official ID';

export type DocumentType =
  | 'Rental Agreement'
  | 'General Affidavit'
  | 'Name Change Affidavit'
  | 'Gap Certificate Affidavit'
  | 'Address Proof Affidavit'
  | 'Vehicle Sale Agreement'
  | 'Special Power of Attorney'
  | 'General Power of Attorney'
  | 'Indemnity Bond'
  | 'Declaration'
  | 'True Copy Attestation'
  | 'Other Legal Document';

export interface Party {
  id: string;
  role: PartyRole;
  name: string;
  relationType: 'S/o' | 'D/o' | 'W/o' | 'C/o';
  relativeName: string;
  age?: string;
  address: string;
  idType: IdentificationType;
  idNumber: string;
  mobile: string;
  photoUrl?: string; // base64 or object URL
  fingerprintUrl?: string; // base64 BMP or PNG
  fingerprintQuality?: number; // 0 - 100
  fingerprintCapturedAt?: string;
  signatureUrl?: string; // base64 data URL
  signatureMode: 'digital' | 'physical';
}

export interface NotarialAct {
  id: string;
  serialNo: string; // e.g. "XYZ-2026-0042"
  date: string; // YYYY-MM-DD
  documentType: DocumentType;
  customDocumentTitle: string;
  parties: Party[];
  feesCharged: number;
  stampValue: number;
  bookNo: number;
  pageNo: number;
  notes?: string;
  watermark: 'Preview' | 'Official' | 'None';
  verifiedToken: string;
  createdAt: string;
  status: 'Completed' | 'Draft';
}

export interface NotaryProfile {
  firmName: string;
  notaryName: string;
  qualifications: string;
  regNo: string;
  areaOfPractice: string;
  officeAddress: string;
  mobile: string;
  email: string;
  verificationDomain: string;
  physicalStampingPreference: boolean; // default true for mom's physical stamp & sign
  digitalSealUrl?: string;
  digitalSignUrl?: string;
}

export interface SecuGenCaptureResult {
  success: boolean;
  errorCode: number;
  errorMessage?: string;
  imageBmpBase64?: string;
  isoTemplateBase64?: string;
  qualityScore: number;
  isSimulated?: boolean;
}
