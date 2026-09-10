import React, { useState, useEffect } from 'react';
import { Fingerprint, Check, RefreshCw, X, Cpu, ShieldCheck } from 'lucide-react';
import { SecuGenService } from '../../services/secugenService';

interface FingerprintModalProps {
  partyName: string;
  role: string;
  onCapture: (fingerprintUrl: string, qualityScore: number) => void;
  onClose: () => void;
}

export const FingerprintModal: React.FC<FingerprintModalProps> = ({
  partyName,
  role,
  onCapture,
  onClose,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(0);
  const [hardwareDetected, setHardwareDetected] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Ready to scan thumb impression.');
  const [usePhysicalHardware, setUsePhysicalHardware] = useState<boolean>(false);

  const checkDevice = async () => {
    setStatusMessage('Checking SecuGen USB scanner...');
    const res = await SecuGenService.testDeviceConnection();
    if (res.connected) {
      setHardwareDetected(true);
      setUsePhysicalHardware(true);
      setStatusMessage(res.message);
    } else {
      setHardwareDetected(false);
      setUsePhysicalHardware(false);
      setStatusMessage('SecuGen hardware service not active on localhost:8000. Hardware simulator ready.');
    }
  };

  useEffect(() => {
    checkDevice();
  }, []);

  const handleStartScan = async () => {
    setIsScanning(true);
    setStatusMessage('Place thumb firmly on the SecuGen sensor...');

    try {
      const result = await SecuGenService.captureFingerprint(!usePhysicalHardware, 50);

      if (result.success && result.imageBmpBase64) {
        setCapturedImage(result.imageBmpBase64);
        setQuality(result.qualityScore);
        setStatusMessage(
          `Fingerprint captured successfully! Quality score: ${result.qualityScore}%`
        );
      } else {
        setStatusMessage(result.errorMessage || 'Scan timed out. Please try again.');
      }
    } catch (e: any) {
      setStatusMessage('Capture error: ' + (e.message || 'Unknown device error'));
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage, quality);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>SecuGen Fingerprint Scanner</h3>
            <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Client: <strong>{partyName}</strong> ({role})
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center' }}>
          {/* Mode Switcher */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F8FAFC',
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              marginBottom: '1rem',
              fontSize: '0.78rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Cpu size={15} color={hardwareDetected ? '#059669' : '#D97706'} />
              <span style={{ fontWeight: 600 }}>
                {hardwareDetected ? 'SecuGen Hamster Pro 20' : 'Device Mode:'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                className={`btn btn-sm ${!usePhysicalHardware ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}
                onClick={() => setUsePhysicalHardware(false)}
              >
                Simulator
              </button>
              <button
                type="button"
                className={`btn btn-sm ${usePhysicalHardware ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}
                onClick={() => setUsePhysicalHardware(true)}
              >
                USB Reader
              </button>
            </div>
          </div>

          {/* Scanner Optical Platen Area */}
          <div
            style={{
              width: '220px',
              height: '260px',
              margin: '0 auto',
              background: capturedImage ? '#FFFFFF' : '#0F172A',
              border: '3px solid #334155',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isScanning
                ? '0 0 25px rgba(2, 132, 199, 0.6)'
                : '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'box-shadow 0.3s ease',
            }}
          >
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Fingerprint Scan"
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }}
              />
            ) : (
              <>
                <Fingerprint
                  size={90}
                  color={isScanning ? '#38BDF8' : '#475569'}
                  style={{
                    filter: isScanning ? 'drop-shadow(0 0 10px #38BDF8)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                />
                <div
                  style={{
                    color: isScanning ? '#7DD3FC' : '#94A3B8',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    marginTop: '0.75rem',
                  }}
                >
                  {isScanning ? 'Reading Biometrics...' : 'Place Right Thumb'}
                </div>

                {/* Laser scanline animation during capture */}
                {isScanning && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'linear-gradient(90deg, transparent, #38BDF8, transparent)',
                      boxShadow: '0 0 12px 2px #38BDF8',
                      animation: 'scanSweep 1.2s infinite ease-in-out',
                    }}
                  />
                )}
              </>
            )}

            {/* Quality badge when captured */}
            {capturedImage && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  background: quality >= 80 ? '#059669' : '#D97706',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ShieldCheck size={12} />
                Quality: {quality}% ({quality >= 80 ? 'Excellent' : 'Acceptable'})
              </div>
            )}
          </div>

          {/* Status caption */}
          <p
            style={{
              fontSize: '0.8rem',
              color: '#475569',
              marginTop: '0.85rem',
              minHeight: '22px',
            }}
          >
            {statusMessage}
          </p>

          {!hardwareDetected && (
            <div
              style={{
                marginTop: '0.65rem',
                fontSize: '0.74rem',
                color: '#334155',
                background: typeof navigator !== 'undefined' && /Mac/i.test(navigator.userAgent) ? '#EFF6FF' : '#FEF3C7',
                padding: '8px 12px',
                borderRadius: '8px',
                textAlign: 'left',
                border: typeof navigator !== 'undefined' && /Mac/i.test(navigator.userAgent) ? '1px solid #BFDBFE' : '1px solid #FDE68A',
                lineHeight: '1.45',
              }}
            >
              {typeof navigator !== 'undefined' && /Mac/i.test(navigator.userAgent) ? (
                <div>
                  <div style={{ fontWeight: 700, color: '#1E40AF', marginBottom: '2px' }}>
                    💻 You are on macOS
                  </div>
                  <div>
                    SecuGen does not make USB drivers for Mac — their hardware WebAPI is <strong>Windows-only</strong>.
                    The built-in <strong>Simulator Mode</strong> is active so you can test all certificate creation, photos, and printing right now. On Mom's Windows laptop, the USB reader will connect directly!
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 700, color: '#92400E', marginBottom: '2px' }}>
                    🔌 SecuGen Windows Troubleshooting:
                  </div>
                  <ol style={{ paddingLeft: '1.1rem', margin: '4px 0' }}>
                    <li>Ensure <strong>SecuGen WebAPI Client</strong> is installed (<a href="https://secugen.com/webapi/" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'var(--color-primary)' }}>Download</a>).</li>
                    <li>Verify the scanner is plugged into a USB port.</li>
                    <li>
                      If running from web/Vercel:{' '}
                      <a
                        href={SecuGenService.getDiagnosticUrl()}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'underline' }}
                      >
                        Click here to approve localhost:8000
                      </a>{' '}
                      in Chrome (Advanced → Proceed).
                    </li>
                  </ol>
                  <div style={{ textAlign: 'right', marginTop: '4px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={checkDevice}
                      style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                    >
                      <RefreshCw size={11} /> Check Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          {!capturedImage ? (
            <>
              <button className="btn btn-secondary btn-sm" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-accent"
                onClick={handleStartScan}
                disabled={isScanning}
                style={{ minWidth: '130px' }}
              >
                <Fingerprint size={18} />
                {isScanning ? 'Scanning...' : 'Scan Thumb'}
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={() => setCapturedImage(null)}>
                <RefreshCw size={16} />
                Re-Scan
              </button>
              <button className="btn btn-seal" onClick={handleConfirm}>
                <Check size={16} />
                Attach Impression
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scanSweep {
          0% { top: 0%; }
          50% { top: 95%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
};
