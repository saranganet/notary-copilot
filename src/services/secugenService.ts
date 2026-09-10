import type { SecuGenCaptureResult } from '../types/notary';

const CANDIDATE_ENDPOINTS = [
  'https://localhost:8443',
  'https://127.0.0.1:8443',
  'https://localhost:8000',
  'https://127.0.0.1:8000',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
];

/**
 * Service to communicate with physical SecuGen Fingerprint Scanner via SecuGen WebAPI
 * using the exact protocol from official SecuGen Demo 1 & Demo 2 (Port 8443, POST).
 */
export class SecuGenService {
  private static activeEndpoint: string = 'https://localhost:8443';
  private static useSimulatorFallback: boolean = false;

  public static getActiveEndpoint(): string {
    return this.activeEndpoint;
  }

  public static getDiagnosticUrl(): string {
    return `${this.activeEndpoint}/SGIFPCapture`;
  }

  /**
   * Calls SecuGen WebAPI using the exact protocol from official Demo 1 and Demo 2:
   * POST to https://localhost:8443/SGIFPCapture with application/x-www-form-urlencoded params
   */
  public static async callSecuGenNativeCapture(
    endpoint: string = 'https://localhost:8443',
    qualityThreshold: number = 50,
    timeoutMs: number = 10000
  ): Promise<any> {
    const params = new URLSearchParams({
      Timeout: timeoutMs.toString(),
      Quality: qualityThreshold.toString(),
      licstr: '',
      templateFormat: 'ISO',
      imageWSQRate: '0.75',
    });

    return new Promise((resolve, reject) => {
      // First try XMLHttpRequest (identical to SecuGen Demo 1)
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${endpoint}/SGIFPCapture`, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.timeout = timeoutMs + 3000;

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              try {
                const parsed = JSON.parse(xhr.responseText);
                resolve(parsed);
              } catch (e) {
                reject(new Error('Invalid JSON from SecuGen WebAPI'));
              }
            } else {
              reject(new Error(`SecuGen WebAPI HTTP ${xhr.status}: ${xhr.statusText || 'Service Unreachable'}`));
            }
          }
        };

        xhr.onerror = function () {
          reject(new Error(`SecuGen connection refused on ${endpoint}`));
        };

        xhr.ontimeout = function () {
          reject(new Error(`SecuGen capture timed out on ${endpoint}`));
        };

        xhr.send(params.toString());
      } catch {
        // Fallback to fetch POST
        fetch(`${endpoint}/SGIFPCapture`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        })
          .then((res) => res.json())
          .then(resolve)
          .catch(reject);
      }
    });
  }

  /**
   * Test if the SecuGen WebAPI client is installed and running on localhost:8443 / 8000
   */
  public static async testDeviceConnection(): Promise<{ connected: boolean; endpoint?: string; message: string }> {
    const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.userAgent);

    for (const endpoint of CANDIDATE_ENDPOINTS) {
      try {
        // Quick probe to endpoint with 100ms timeout
        const data = await this.callSecuGenNativeCapture(endpoint, 50, 100);

        if (data && typeof data.ErrorCode !== 'undefined') {
          this.activeEndpoint = endpoint;
          if (data.ErrorCode === 53 || data.ErrorCode === 55) {
            return {
              connected: false,
              endpoint,
              message: `SecuGen WebAPI Online (${endpoint}), but USB reader not detected. Please plug in scanner.`,
            };
          }
          return {
            connected: true,
            endpoint,
            message: `SecuGen Scanner Online (${endpoint}, Status: Ready)`,
          };
        }
      } catch {
        // Continue to next endpoint
      }
    }

    if (isMac) {
      return {
        connected: false,
        message: 'macOS detected: SecuGen hardware WebAPI runs exclusively on Windows. Biometric Simulator is active for testing on Mac.',
      };
    }

    return {
      connected: false,
      message: 'SecuGen WebAPI not detected on localhost:8443. Open https://localhost:8443/SGIFPCapture once in Chrome to allow connection.',
    };
  }

  /**
   * Capture fingerprint from SecuGen reader
   */
  public static async captureFingerprint(
    forceSimulator: boolean = false,
    qualityThreshold: number = 50
  ): Promise<SecuGenCaptureResult> {
    if (forceSimulator || this.useSimulatorFallback) {
      return this.simulateBiometricCapture(qualityThreshold);
    }

    let data: any = null;
    let lastError: any = null;

    // Try primary active endpoint first
    try {
      data = await this.callSecuGenNativeCapture(this.activeEndpoint, qualityThreshold, 10000);
    } catch (err) {
      lastError = err;
      // Probe other candidate endpoints if primary fails
      for (const ep of CANDIDATE_ENDPOINTS) {
        if (ep === this.activeEndpoint) continue;
        try {
          data = await this.callSecuGenNativeCapture(ep, qualityThreshold, 10000);
          if (data && typeof data.ErrorCode !== 'undefined') {
            this.activeEndpoint = ep;
            break;
          }
        } catch {
          // Next
        }
      }
    }

    if (!data) {
      console.warn('SecuGen physical capture failed:', lastError);
      return {
        success: false,
        errorCode: -1,
        errorMessage: 'Cannot connect to SecuGen WebAPI on localhost:8443. Ensure SecuGen service is running on Windows.',
        qualityScore: 0,
      };
    }

    if (data.ErrorCode === 0) {
      // ErrorCode 0 means SUCCESS in SecuGen WebAPI
      const rawBmp = data.BMPBase64 || '';
      const bmpBase64 = rawBmp.length > 0
        ? (rawBmp.startsWith('data:image') ? rawBmp : `data:image/bmp;base64,${rawBmp}`)
        : undefined;

      const rawQuality = data.ImageQuality ?? data.Quality ?? 88;
      const qualityScore = typeof rawQuality === 'string' ? parseInt(rawQuality, 10) : Number(rawQuality);

      return {
        success: true,
        errorCode: 0,
        imageBmpBase64: bmpBase64,
        isoTemplateBase64: data.TemplateBase64 ?? data.ISOTemplateBase64,
        qualityScore: isNaN(qualityScore) ? 88 : qualityScore,
        isSimulated: false,
      };
    } else {
      return {
        success: false,
        errorCode: data.ErrorCode,
        errorMessage: this.mapSecuGenErrorCode(data.ErrorCode),
        qualityScore: 0,
      };
    }
  }

  /**
   * Generates a high-fidelity realistic fingerprint ridge pattern on an offscreen canvas
   */
  public static async simulateBiometricCapture(
    _targetQuality: number = 75
  ): Promise<SecuGenCaptureResult> {
    // Artificial scanning delay to mimic actual optical sensor illumination & reading
    await new Promise((resolve) => setTimeout(resolve, 800));

    const width = 260;
    const height = 300;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas 2D context unavailable');
    }

    // Realistic paper / sensor background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Center coordinates
    const cx = width / 2;
    const cy = height / 2 - 10;

    // Draw realistic concentric fingerprint ridges with organic whorl & loop variations
    const ridgeCount = 42;
    const randomSeed = Math.random() * 20;

    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Outer boundary mask oval
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, 95, 125, 0, 0, Math.PI * 2);
    ctx.clip();

    // Noise/texture background
    const imgData = ctx.getImageData(0, 0, width, height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 18;
      imgData.data[i] = 250 + noise;
      imgData.data[i + 1] = 250 + noise;
      imgData.data[i + 2] = 250 + noise;
    }
    ctx.putImageData(imgData, 0, 0);

    for (let r = 8; r < ridgeCount * 3.4; r += 3.4) {
      ctx.beginPath();
      const points = 80;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        // Whorl equation with pseudo-ridge breaks
        const distortion =
          Math.sin(angle * 3 + randomSeed) * 2.2 +
          Math.cos(r * 0.2 + angle) * 1.8;
        const rx = r * 0.72 + distortion;
        const ry = r * 1.05 + distortion;

        const px = cx + Math.cos(angle) * rx;
        const py = cy + Math.sin(angle) * ry;

        // Simulate ridge endings and breaks (minutiae)
        if (i % 24 === 0 && r > 20) {
          ctx.stroke();
          ctx.beginPath();
        } else {
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    }

    // Draw central whorl core
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#1E293B';
    ctx.fill();

    ctx.restore();

    // Randomize realistic quality between 82% and 97%
    const qualityScore = Math.floor(82 + Math.random() * 15);

    return {
      success: true,
      errorCode: 0,
      imageBmpBase64: canvas.toDataURL('image/png'),
      isoTemplateBase64: 'SIMULATED_ISO_TEMPLATE_' + Math.random().toString(36).substring(2),
      qualityScore,
      isSimulated: true,
    };
  }

  private static mapSecuGenErrorCode(code: number): string {
    switch (code) {
      case 0:
        return 'Success';
      case 51:
        return 'System file load failure (SecuGen driver)';
      case 52:
        return 'Sensor chip initialization failed';
      case 53:
        return 'Device not found. Please plug in the SecuGen USB scanner.';
      case 54:
        return 'Fingerprint image capture timeout. Place thumb firmly on the sensor.';
      case 55:
        return 'No device available. Re-insert the USB cable.';
      case 56:
        return 'Driver load failed';
      case 57:
        return 'Wrong image data captured';
      case 58:
        return 'Lack of USB bandwidth';
      case 59:
        return 'Device Busy - another application may be accessing the scanner';
      case 60:
        return 'Cannot get serial number of the device';
      case 61:
        return 'Unsupported device model';
      case 63:
        return "SgiBioSrv service didn't start. Please restart SecuGen WebAPI service.";
      case 101:
        return 'Fingerprint quality below minimum threshold. Please press firmly.';
      default:
        return `SecuGen hardware response code: ${code}`;
    }
  }
}
