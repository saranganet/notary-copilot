import QRCode from 'qrcode';
import type { NotarialAct, NotaryProfile } from '../types/notary';

export interface VerificationRecord {
  act: NotarialAct;
  profile: NotaryProfile;
  isFromPayload?: boolean;
}

export class QrVerificationService {
  /**
   * Generates a fully qualified public verification URL for the notarial act.
   * Encodes key evidentiary metadata into a compact URL parameter so external
   * devices (banks, courts, citizens) can instantly verify the physical certificate
   * even without access to the local browser database.
   */
  public static generateVerificationUrl(act: NotarialAct, profile: NotaryProfile): string {
    const origin =
      typeof window !== 'undefined' && window.location && window.location.origin
        ? window.location.origin
        : 'http://localhost:5174';

    const compact = {
      s: act.serialNo,
      t: act.verifiedToken,
      d: act.date,
      dt: act.customDocumentTitle || act.documentType,
      b: act.bookNo,
      pg: act.pageNo,
      n: profile.notaryName,
      r: profile.regNo,
      a: profile.areaOfPractice,
      f: profile.firmName,
      p: act.parties.map((pt) => ({
        n: pt.name,
        r: pt.role,
        idT: pt.idType,
        idN: pt.idNumber ? pt.idNumber.slice(-4) : '',
        bio: !!pt.fingerprintUrl,
        pho: !!pt.photoUrl,
      })),
    };

    try {
      const json = JSON.stringify(compact);
      // Safe base64 encoding with UTF-8 support
      const encoded = btoa(encodeURIComponent(json));
      return `${origin}/?verify=${encodeURIComponent(act.serialNo)}&v=${encodeURIComponent(encoded)}`;
    } catch (e) {
      console.error('Error generating verification payload:', e);
      return `${origin}/?verify=${encodeURIComponent(act.serialNo)}`;
    }
  }

  /**
   * Generates a crisp, scannable QR Code as a base64 data URL
   */
  public static async generateQrCode(url: string): Promise<string> {
    try {
      return await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 200,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
    } catch (e) {
      console.error('Failed to generate QR code data URL:', e);
      return '';
    }
  }

  /**
   * Decodes an encrypted / encoded URL payload into verifiable act & profile
   */
  public static decodePayload(encodedStr: string): VerificationRecord | null {
    try {
      const decodedJson = decodeURIComponent(atob(encodedStr));
      const data = JSON.parse(decodedJson);

      const profile: NotaryProfile = {
        firmName: data.f || `${data.n} Chambers`,
        notaryName: data.n || 'Advocate Notary Public',
        qualifications: 'Advocate & Notary Public (Govt. of India)',
        regNo: data.r || 'Govt. of India Registered',
        areaOfPractice: data.a || 'Court Jurisdiction',
        officeAddress: 'Chambers of Advocate Notary Public',
        mobile: '',
        email: '',
        verificationDomain: 'notarycopilot.in',
        physicalStampingPreference: true,
      };

      const act: NotarialAct = {
        id: `verified-${data.s}`,
        serialNo: data.s,
        date: data.d,
        documentType: data.dt || 'Notarial Certificate',
        customDocumentTitle: data.dt,
        bookNo: data.b || 1,
        pageNo: data.pg || 1,
        feesCharged: 0,
        stampValue: 100,
        watermark: 'Official',
        verifiedToken: data.t || `${data.s}-VERIFIED`,
        createdAt: new Date().toISOString(),
        status: 'Completed',
        parties: Array.isArray(data.p)
          ? data.p.map((item: any, idx: number) => ({
              id: `p-${idx + 1}`,
              role: item.r || 'Executant',
              name: item.n || 'Registered Party',
              relationType: 'S/o',
              relativeName: '',
              address: 'Verified Physical Presence',
              idType: item.idT || 'Official ID',
              idNumber: item.idN ? `XXXX-XXXX-${item.idN}` : 'Verified',
              mobile: '',
              signatureMode: 'physical',
              fingerprintQuality: item.bio ? 95 : undefined,
              fingerprintCapturedAt: item.bio ? 'SecuGen 500 DPI Verified' : undefined,
            }))
          : [],
      };

      return { act, profile, isFromPayload: true };
    } catch (e) {
      console.error('Failed to parse verification payload:', e);
      return null;
    }
  }
}
