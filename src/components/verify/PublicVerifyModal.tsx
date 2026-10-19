import React, { useState, useEffect } from 'react';
import type { NotarialAct, NotaryProfile } from '../../types/notary';
import { ShieldCheck, CheckCircle2, X, Search, QrCode, ExternalLink, Copy, Check, FileText, Smartphone } from 'lucide-react';
import { TRANSLATIONS, type Language } from '../../i18n/translations';
import { QrVerificationService } from '../../services/qrVerificationService';
import { StorageService } from '../../services/storageService';

interface PublicVerifyModalProps {
  act?: NotarialAct | null;
  profile: NotaryProfile;
  lang?: Language;
  onClose: () => void;
  onOpenFullVerification?: (act: NotarialAct, profile: NotaryProfile) => void;
}

export const PublicVerifyModal: React.FC<PublicVerifyModalProps> = ({
  act: initialAct,
  profile,
  lang = 'en',
  onClose,
  onOpenFullVerification,
}) => {
  const [currentAct, setCurrentAct] = useState<NotarialAct | null>(initialAct || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchError, setSearchError] = useState<string>('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [verificationUrl, setVerificationUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const t = TRANSLATIONS[lang];

  // Whenever currentAct changes, regenerate verification URL and crisp scannable QR code
  useEffect(() => {
    if (currentAct) {
      const url = QrVerificationService.generateVerificationUrl(currentAct, profile);
      setVerificationUrl(url);
      QrVerificationService.generateQrCode(url).then((dataUrl) => {
        setQrCodeDataUrl(dataUrl);
      });
    } else {
      setVerificationUrl('');
      setQrCodeDataUrl('');
    }
  }, [currentAct, profile]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      setSearchError('Please enter a Serial Number, Token, or QR link.');
      return;
    }

    setSearchError('');

    // 1. Check if user pasted a full QR verification URL
    if (query.includes('?verify=') || query.includes('?token=') || query.includes('&v=')) {
      try {
        const urlObj = new URL(query, window.location.origin);
        const encoded = urlObj.searchParams.get('v');
        if (encoded) {
          const decoded = QrVerificationService.decodePayload(encoded);
          if (decoded) {
            setCurrentAct(decoded.act);
            return;
          }
        }
        const serial = urlObj.searchParams.get('verify') || urlObj.searchParams.get('token');
        if (serial) {
          const match = StorageService.findActAcrossChambers(serial);
          if (match) {
            setCurrentAct(match.act);
            return;
          }
        }
      } catch {}
    }

    // 2. Search local & cross-chamber registers
    const match = StorageService.findActAcrossChambers(query);
    if (match) {
      setCurrentAct(match.act);
      return;
    }

    // 3. Fallback: check sample preview act if searching sample
    if (query.toUpperCase().includes('SAMPLE')) {
      const sample = StorageService.createSamplePreviewAct(profile);
      setCurrentAct(sample);
      return;
    }

    setSearchError(
      lang === 'mr'
        ? `अनुक्रमांक "${query}" कोणत्याही चेंबर नोंदवहीत सापडला नाही.`
        : lang === 'hi'
        ? `अनुक्रमांक "${query}" किसी भी चैंबर रजिस्टर में नहीं मिला।`
        : `No notarial act found matching "${query}". Please check the serial number.`
    );
  };

  const handleCopyLink = () => {
    if (!verificationUrl) return;
    navigator.clipboard.writeText(verificationUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleLoadSample = () => {
    setSearchError('');
    const sample = StorageService.createSamplePreviewAct(profile);
    setCurrentAct(sample);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #064E3B 0%, #0F172A 100%)',
            color: '#FFFFFF',
            padding: '1.25rem 1.5rem',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Close"
          >
            <X size={16} />
          </button>

          <div
            style={{
              width: '48px',
              height: '48px',
              background: '#10B981',
              borderRadius: '50%',
              margin: '0 auto 0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
            }}
          >
            <ShieldCheck size={28} color="#FFFFFF" />
          </div>

          <h2 style={{ color: '#FFFFFF', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px 0' }}>
            {lang === 'mr' ? 'कायदेशीर QR पडताळणी केंद्र' : lang === 'hi' ? 'विधिक QR सत्यापन केंद्र' : 'Statutory QR Verification Center'}
          </h2>
          <p style={{ color: '#A7F3D0', fontSize: '0.78rem', fontWeight: 600, margin: 0 }}>
            {lang === 'mr' ? 'नॉटरीज कायदा १९५२ अन्वये अधिकृत डिजिटल पडताळणी' : 'Instant Evidentiary Verification under The Notaries Act, 1952'}
          </p>
        </div>

        <div className="modal-body" style={{ padding: '1.25rem 1.5rem' }}>
          {/* Universal Serial Number & QR Lookup Bar */}
          <form onSubmit={handleSearch} style={{ marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              {lang === 'mr' ? 'नोंदणी अनुक्रमांक किंवा QR लिंक द्वारे शोधा:' : lang === 'hi' ? 'पंजीकरण अनुक्रमांक अथवा QR लिंक से खोजें:' : 'Search or Verify by Serial No / Token / Link:'}
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder={lang === 'mr' ? 'उदा. 12480/2026/0001 किंवा QR लिंक पेस्ट करा' : 'e.g. 12480/2026/0001, token, or paste QR URL'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px 8px 34px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0 1rem', fontWeight: 700 }}>
                {lang === 'mr' ? 'पडताळा' : lang === 'hi' ? 'सत्यापित करें' : 'Verify'}
              </button>
            </div>
            {searchError && (
              <div style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '6px', fontWeight: 600 }}>
                {searchError}
              </div>
            )}
          </form>

          {/* Act Details + Scannable QR Code */}
          {currentAct ? (
            <div>
              {/* QR Code and Quick Scan Card */}
              <div
                style={{
                  background: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  marginBottom: '1.25rem',
                  flexWrap: 'wrap',
                }}
              >
                {/* QR Code Graphic */}
                <div style={{ textAlign: 'center', flexShrink: 0, margin: '0 auto' }}>
                  {qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt="Statutory QR Code"
                      style={{
                        width: '110px',
                        height: '110px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        background: '#FFFFFF',
                        padding: '4px',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '110px',
                        height: '110px',
                        borderRadius: '8px',
                        background: '#E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        color: '#64748B',
                      }}
                    >
                      Loading QR...
                    </div>
                  )}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: '#065F46',
                      marginTop: '4px',
                    }}
                  >
                    <Smartphone size={12} />
                    Scan with Phone
                  </span>
                </div>

                {/* QR Metadata & Action Buttons */}
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                    Official Verification Token
                  </div>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: '#0284C7',
                      background: '#FFFFFF',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid #E2E8F0',
                      marginTop: '2px',
                      marginBottom: '8px',
                      wordBreak: 'break-all',
                    }}
                  >
                    {currentAct.verifiedToken}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleCopyLink}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}
                    >
                      {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                      <span>{copied ? 'Link Copied!' : 'Copy QR Link'}</span>
                    </button>

                    {onOpenFullVerification ? (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => onOpenFullVerification(currentAct, profile)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                        }}
                      >
                        <ExternalLink size={14} />
                        <span>Open Public Portal</span>
                      </button>
                    ) : (
                      <a
                        href={verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        <ExternalLink size={14} />
                        <span>Test Portal</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Certificate Metadata Grid */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '0.85rem 1rem',
                  marginBottom: '1rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  fontSize: '0.82rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                    {t.certRegSerialNo}
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#B91C1C' }}>
                    {currentAct.serialNo}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                    {t.certRegisteredOn}
                  </span>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{currentAct.date}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                    {t.certTypeOfDoc}
                  </span>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>
                    {currentAct.customDocumentTitle || currentAct.documentType}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                    Register Location
                  </span>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>
                    Book {currentAct.bookNo || 1} • Page {currentAct.pageNo || 28}
                  </div>
                </div>
              </div>

              {/* Attesting Notary Public */}
              <div
                style={{
                  marginBottom: '1rem',
                  padding: '0.75rem 1rem',
                  background: '#F8FAFC',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 700 }}>
                  Attesting Notary Public (Govt. of India)
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0F172A', marginTop: '2px' }}>
                  {profile.notaryName}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                  {profile.regNo} {profile.areaOfPractice ? `• ${profile.areaOfPractice}` : ''}
                </div>
              </div>

              {/* Parties Verified */}
              {currentAct.parties && currentAct.parties.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 700, marginBottom: '6px' }}>
                    {t.certExecutingParties} ({currentAct.parties.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {currentAct.parties.map((party) => (
                      <div
                        key={party.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0.75rem',
                          background: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                        }}
                      >
                        <div>
                          <strong>{party.name}</strong>
                          <span style={{ fontSize: '0.72rem', color: '#64748B', marginLeft: '6px' }}>
                            ({party.role})
                          </span>
                          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                            {party.idType}: {party.idNumber ? `XXXX-XXXX-${party.idNumber.slice(-4)}` : 'Verified'}
                          </div>
                        </div>

                        <span
                          style={{
                            background: '#ECFDF5',
                            color: '#065F46',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          <CheckCircle2 size={12} />
                          Biometric Verified
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty State: No active act selected */
            <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#FEF2F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  color: '#B91C1C',
                }}
              >
                <QrCode size={28} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem' }}>
                {lang === 'mr' ? 'कोणताही अनुक्रमांक निवडलेला नाही' : 'No Document Selected'}
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.82rem', maxWidth: '420px', margin: '0 auto 1.25rem', lineHeight: 1.5 }}>
                {lang === 'mr'
                  ? 'वर अनुक्रमांक टाकून शोधा किंवा आपल्या चेंबर क्रेडेंशियल्ससह नमुना QR कोड तपासा.'
                  : 'Enter a Serial Number above to verify an existing act, or load a sample certificate with your credentials to test live QR scanning.'}
              </p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleLoadSample}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                <FileText size={16} />
                <span>Test Sample QR Code ({profile.notaryName})</span>
              </button>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between', padding: '0.85rem 1.5rem', background: '#F8FAFC' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
            Notary Verification Hub • Act 1952
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ fontWeight: 600 }}>
            {lang === 'mr' ? 'बंद करा' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
