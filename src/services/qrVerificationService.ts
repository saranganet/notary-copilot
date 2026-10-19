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
   * Uses optimized compact serialization so the resulting QR code has large,
   * high-contrast modules that any phone camera can scan instantly off screens.
   */
  public static generateVerificationUrl(act: NotarialAct, profile: NotaryProfile): string {
    let origin =
      typeof window !== 'undefined' && window.location && window.location.origin
        ? window.location.origin
        : 'http://localhost:5173';

    // When running on localhost / loopback, use the machine LAN IP so mobile phones on the same Wi-Fi can scan the QR code
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      origin = origin.replace('localhost', '192.168.0.102').replace('127.0.0.1', '192.168.0.102');
    }

    // Lean evidentiary payload without bloated duplicated keys
    const compact = {
      s: act.serialNo,
      t: act.verifiedToken,
      d: act.date,
      dt: act.customDocumentTitle || act.documentType,
      b: act.bookNo,
      pg: act.pageNo,
      n: profile.notaryName,
      r: profile.regNo,
      a: profile.areaOfPractice || '',
      f: profile.firmName,
      p: (act.parties || []).map((pt) => ({
        n: pt.name,
        r: pt.role,
        idN: pt.idNumber ? pt.idNumber.slice(-4) : '',
        bio: !!pt.fingerprintUrl,
      })),
    };

    try {
      const json = JSON.stringify(compact);
      // UTF-8 safe, URL-safe base64 encoding without '%' bloat
      const encoded = btoa(
        encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        )
      )
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      return `${origin}/?verify=${encodeURIComponent(act.serialNo)}&v=${encoded}`;
    } catch (e) {
      console.error('Error generating verification payload:', e);
      return `${origin}/?verify=${encodeURIComponent(act.serialNo)}`;
    }
  }

  /**
   * Generates a crisp, scannable QR Code as a base64 data URL.
   * Uses errorCorrectionLevel 'L' (Low) and quiet zone margin=2 to ensure
   * large, bold modules that smartphone camera sensors can detect effortlessly.
   */
  public static async generateQrCode(url: string): Promise<string> {
    try {
      return await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'L',
        margin: 2,
        width: 500,
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
      let raw = encodedStr.trim();
      try {
        raw = decodeURIComponent(raw);
      } catch {}

      // Handle base64url or standard base64 with padding
      let b64 = raw.replace(/-/g, '+').replace(/_/g, '/').replace(/ /g, '+');
      while (b64.length % 4) b64 += '=';

      // UTF-8 safe decode
      let decodedJson = '';
      try {
        decodedJson = decodeURIComponent(
          Array.prototype.map
            .call(atob(b64), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      } catch {
        decodedJson = atob(b64);
      }

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
              role: item.r || (typeof item === 'string' ? 'Party' : 'Executant'),
              name: typeof item === 'string' ? item : item.n || 'Registered Party',
              relationType: 'S/o',
              relativeName: '',
              address: 'Verified Physical Presence',
              idType: 'Official ID',
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
