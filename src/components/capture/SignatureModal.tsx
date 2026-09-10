import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Check, RotateCcw, X, FileText } from 'lucide-react';

interface SignatureModalProps {
  partyName: string;
  role: string;
  onSave: (signatureDataUrl: string | undefined, mode: 'digital' | 'physical') => void;
  onClose: () => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  partyName,
  role,
  onSave,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [mode, setMode] = useState<'digital' | 'physical'>('physical');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSave = () => {
    if (mode === 'physical') {
      onSave(undefined, 'physical');
      onClose();
    } else {
      const canvas = canvasRef.current;
      if (canvas && hasDrawn) {
        onSave(canvas.toDataURL('image/png'), 'digital');
      } else {
        onSave(undefined, 'physical');
      }
      onClose();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Signature Selection</h3>
            <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Client: <strong>{partyName}</strong> ({role})
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Mode Selector */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              marginBottom: '1.25rem',
            }}
          >
            <div
              onClick={() => setMode('physical')}
              style={{
                border: `2px solid ${mode === 'physical' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                background: mode === 'physical' ? '#F8FAFC' : '#FFFFFF',
                borderRadius: '8px',
                padding: '0.75rem',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s',
              }}
            >
              <FileText size={22} color={mode === 'physical' ? 'var(--color-accent)' : '#64748B'} style={{ margin: '0 auto 0.35rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Physical Sign on Paper</div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                Client signs with pen on printed certificate
              </div>
            </div>

            <div
              onClick={() => setMode('digital')}
              style={{
                border: `2px solid ${mode === 'digital' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                background: mode === 'digital' ? '#F8FAFC' : '#FFFFFF',
                borderRadius: '8px',
                padding: '0.75rem',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s',
              }}
            >
              <PenTool size={22} color={mode === 'digital' ? 'var(--color-accent)' : '#64748B'} style={{ margin: '0 auto 0.35rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Digital Canvas Pad</div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                Client signs with mouse or touch screen
              </div>
            </div>
          </div>

          {mode === 'physical' ? (
            <div
              style={{
                padding: '1.5rem',
                border: '1.5px dashed var(--color-border-dark)',
                borderRadius: '8px',
                background: '#F8FAFC',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                Traditional Physical Signature Selected
              </p>
              <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
                The printed certificate will include a designated signature line marked <em>"Signed before me"</em> so the client can sign directly in ink before Mom stamps her notary seal.
              </p>
            </div>
          ) : (
            <div>
              <div
                style={{
                  border: '1.5px solid var(--color-border-dark)',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <canvas
                  ref={canvasRef}
                  width={450}
                  height={180}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  style={{ display: 'block', width: '100%', height: '180px', touchAction: 'none', cursor: 'crosshair' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '12px',
                    fontSize: '0.7rem',
                    color: '#94A3B8',
                    pointerEvents: 'none',
                  }}
                >
                  Draw signature above
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleClear}
                  disabled={!hasDrawn}
                >
                  <RotateCcw size={14} />
                  Clear Pad
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Check size={16} />
            Confirm Signature
          </button>
        </div>
      </div>
    </div>
  );
};
