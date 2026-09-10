import type { SecuGenCaptureResult } from '../types/notary';

const CANDIDATE_ENDPOINTS = [
  'https://localhost:8000',
  'https://127.0.0.1:8000',
  'https://localhost:8443',
  'https://127.0.0.1:8443',
  'http://localhost:8000',
  'http://127.0.0.1:8000',
];

/**
 * Service to communicate with physical SecuGen Fingerprint Scanner via SecuGen WebAPI
 * with an integrated fallback simulator for testing on systems without the physical device.
 */
export class SecuGenService {
  private static activeEndpoint: string = 'https://localhost:8000';
  private static useSimulatorFallback: boolean = false;

  public static getActiveEndpoint(): string {
    return this.activeEndpoint;
  }

  public static getDiagnosticUrl(): string {
    return `${this.activeEndpoint}/SGIDDInfo`;
  }

  /**
   * Test if the SecuGen WebAPI client is installed and running on localhost/127.0.0.1
   */
  public static async testDeviceConnection(): Promise<{ connected: boolean; endpoint?: string; message: string }> {
    for (const endpoint of CANDIDATE_ENDPOINTS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);

        const response = await fetch(`${endpoint}/SGIDDInfo`, {
          method: 'GET',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response && response.ok) {
          const data = await response.json();
          this.activeEndpoint = endpoint;
          return {
            connected: true,
            endpoint,
            message: `SecuGen Scanner Online (${endpoint}, Device: ${data.DeviceID || 'Hamster Pro 20'})`,
          };
        }
      } catch {
        // Continue to next endpoint
      }
    }

    return {
      connected: false,
      message: 'SecuGen WebAPI service not detected on localhost:8000. Hardware simulator ready.',
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

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 14000); // 14 seconds capture window

      const params = new URLSearchParams({
        Timeout: '10000',
        Quality: qualityThreshold.toString(),
        templateFormat: 'ISO',
        imageWSQRate: '0.75',
      });

      // Attempt primary active endpoint first
      let response = await fetch(`${this.activeEndpoint}/SGIFPCapture?${params.toString()}`, {
        method: 'GET',
        signal: controller.signal,
      }).catch(() => null);

      // If failed, probe other candidates
      if (!response || !response.ok) {
        for (const ep of CANDIDATE_ENDPOINTS) {
          if (ep === this.activeEndpoint) continue;
          try {
            const probeRes = await fetch(`${ep}/SGIFPCapture?${params.toString()}`, {
              method: 'GET',
              signal: controller.signal,
            });
            if (probeRes && probeRes.ok) {
              response = probeRes;
              this.activeEndpoint = ep;
              break;
            }
          } catch {
            // Next
          }
        }
      }

      clearTimeout(timeoutId);

      if (!response || !response.ok) {
        throw new Error('SecuGen device communication error');
      }

      const data = await response.json();

      if (data.ErrorCode === 0) {
        // ErrorCode 0 means SUCCESS in SecuGen WebAPI
        const bmpBase64 = data.BMPBase64
          ? `data:image/bmp;base64,${data.BMPBase64}`
          : undefined;

        return {
          success: true,
          errorCode: 0,
          imageBmpBase64: bmpBase64,
          isoTemplateBase64: data.ISOTemplateBase64,
          qualityScore: data.Quality || 88,
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
    } catch (err: any) {
      console.warn('Physical SecuGen capture failed, falling back to simulator:', err);
      // Fallback to high-fidelity realistic biometric simulator
      return this.simulateBiometricCapture(qualityThreshold);
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
      case 1:
        return 'Creation failed';
      case 2:
        return 'Function failed';
      case 3:
        return 'Invalid parameter';
      case 51:
        return 'Device not found. Please verify USB connection.';
      case 52:
        return 'Device open failed. Another application may be using the scanner.';
      case 53:
        return 'Device capture timed out. Place finger firmly on sensor.';
      case 54:
        return 'Sensor timed out waiting for finger.';
      case 101:
        return 'Fingerprint quality below minimum threshold. Please press firmly.';
      default:
        return `SecuGen hardware error code: ${code}`;
    }
  }
}
