import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, AlertCircle } from 'lucide-react';

interface WebcamModalProps {
  partyName: string;
  onCapture: (photoDataUrl: string) => void;
  onClose: () => void;
}

export const WebcamModal: React.FC<WebcamModalProps> = ({ partyName, onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function startCamera() {
      try {
        setIsLoading(true);
        setError(null);
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
          },
          audio: false,
        });

        currentStream = mediaStream;

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
        setIsLoading(false);
      } catch (err: any) {
        console.warn('Camera access issue:', err);
        setError('Could not access camera. Please allow camera permissions or upload a photo.');
        setIsLoading(false);
      }
    }

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleTakeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Portrait 3:4 crop
    const cropWidth = Math.min(video.videoWidth, (video.videoHeight * 3) / 4);
    const cropHeight = (cropWidth * 4) / 3;
    const startX = (video.videoWidth - cropWidth) / 2;
    const startY = (video.videoHeight - cropHeight) / 2;

    canvas.width = 300;
    canvas.height = 380;

    // Draw video crop to canvas
    ctx.drawImage(video, startX, startY, cropWidth, cropHeight, 0, 0, 300, 380);

    // Add subtle official timestamp watermark on photo
    const now = new Date();
    const timestampStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(0, 356, 300, 24);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`NOTARY CAPTURE • ${timestampStr}`, 150, 372);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPhoto(dataUrl);
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      onClose();
    }
  };

  // Fallback photo upload if camera is not available
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Live Photo Capture</h3>
            <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Client: <strong>{partyName}</strong>
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center' }}>
          {error ? (
            <div style={{ padding: '2rem 1rem', background: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECDD3' }}>
              <AlertCircle size={32} color="#DC2626" style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '0.85rem', color: '#991B1B', marginBottom: '1rem' }}>{error}</p>
              <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
                Upload Client Photo
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
            </div>
          ) : (
            <div style={{ position: 'relative', width: '320px', height: '400px', margin: '0 auto', background: '#0F172A', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              {!capturedPhoto ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: 'scaleX(-1)', // Mirror image for natural client feel
                    }}
                  />

                  {/* Guided Face Oval Overlay for Passport-style Alignment */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '15%',
                      left: '17%',
                      width: '66%',
                      height: '62%',
                      border: '2px dashed rgba(255, 255, 255, 0.75)',
                      borderRadius: '50%',
                      boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.45)',
                      pointerEvents: 'none',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '0',
                      right: '0',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                    }}
                  >
                    Align face within the oval guide
                  </div>
                </>
              ) : (
                <img
                  src={capturedPhoto}
                  alt="Captured"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>
          )}

          {/* Hidden Canvas for crisp snapshot rendering */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        <div className="modal-footer">
          {!capturedPhoto ? (
            <>
              <button className="btn btn-secondary btn-sm" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleTakeSnapshot}
                disabled={isLoading || !!error}
              >
                <Camera size={18} />
                Snap Photo
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={handleRetake}>
                <RefreshCw size={16} />
                Retake
              </button>
              <button className="btn btn-seal" onClick={handleConfirm}>
                <Check size={16} />
                Use Photo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
