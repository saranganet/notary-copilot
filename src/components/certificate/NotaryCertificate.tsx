import React, { useState } from 'react';
import type { NotarialAct, NotaryProfile } from '../../types/notary';
import { StorageService } from '../../services/storageService';
import { Printer, ArrowLeft, Globe, BookOpen } from 'lucide-react';
import { TRANSLATIONS, type Language } from '../../i18n/translations';

interface NotaryCertificateProps {
  act: NotarialAct;
  profile: NotaryProfile;
  lang?: Language;
  onToggleLang?: () => void;
  onBack?: () => void;
  onUpdateAct?: (updated: NotarialAct) => void;
}

export const NotaryCertificate: React.FC<NotaryCertificateProps> = ({
  act,
  profile,
  lang = 'en',
  onToggleLang,
  onBack,
  onUpdateAct,
}) => {
  const [bookNo, setBookNo] = useState<number>(act.bookNo || 1);
  const [pageNo, setPageNo] = useState<number>(act.pageNo || 28);

  const t = TRANSLATIONS[lang];

  // Format date to DD-MM-YYYY
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateStr;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBookNoChange = (newBook: number) => {
    setBookNo(newBook);
    const updated = { ...act, bookNo: newBook, pageNo };
    StorageService.saveAct(updated);
    if (onUpdateAct) {
      onUpdateAct(updated);
    }
  };

  const handlePageNoChange = (newPage: number) => {
    setPageNo(newPage);
    const updated = { ...act, bookNo, pageNo: newPage };
    StorageService.saveAct(updated);
    if (onUpdateAct) {
      onUpdateAct(updated);
    }
  };

  // Group parties by Executant vs Witness
  const executants = act.parties.filter((p) => p.role !== 'Witness');
  const witnesses = act.parties.filter((p) => p.role === 'Witness');

  const getRoleDisplay = (role: string) => {
    if (lang === 'mr') {
      if (role === 'Owner') return 'घरमालक / पहिले पक्षकार (Owner)';
      if (role === 'Tenant') return 'भाडेकरू / दुसरे पक्षकार (Tenant)';
      if (role === 'Deponent') return 'शपथकर्ता (Deponent)';
      if (role === 'Witness') return 'साक्षीदार (Witness)';
      return `${role} (पक्षकार)`;
    }
    return role;
  };

  return (
    <div>
      {/* Top Floating Control Toolbar (Hidden in Print) */}
      <div
        className="no-print"
        style={{
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: '64px',
          zIndex: 30,
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {onBack && (
            <button className="btn btn-secondary btn-sm" onClick={onBack}>
              <ArrowLeft size={16} />
              {t.certBackBtn}
            </button>
          )}
          <div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
              {t.certRegSerialNo}: {act.serialNo}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', marginLeft: '0.75rem' }}>
              {act.customDocumentTitle || act.documentType}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Quick Book No and Page No editable fields */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.1)',
              padding: '0.25rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
            }}
          >
            <BookOpen size={14} color="#38BDF8" />
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>{lang === 'mr' ? 'वही क्र.:' : 'Book No:'}</span>
              <input
                type="number"
                value={bookNo}
                onChange={(e) => handleBookNoChange(Number(e.target.value))}
                style={{
                  width: '45px',
                  padding: '2px 4px',
                  fontSize: '0.8rem',
                  borderRadius: '4px',
                  border: '1px solid #64748B',
                  background: '#FFFFFF',
                  color: '#000000',
                  textAlign: 'center',
                  fontWeight: 700,
                }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '4px' }}>
              <span>{lang === 'mr' ? 'पान क्र.:' : 'Page No:'}</span>
              <input
                type="number"
                value={pageNo}
                onChange={(e) => handlePageNoChange(Number(e.target.value))}
                style={{
                  width: '52px',
                  padding: '2px 4px',
                  fontSize: '0.8rem',
                  borderRadius: '4px',
                  border: '1px solid #64748B',
                  background: '#FFFFFF',
                  color: '#000000',
                  textAlign: 'center',
                  fontWeight: 700,
                }}
              />
            </label>
          </div>

          {/* Language toggle button */}
          {onToggleLang && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={onToggleLang}
              style={{ fontWeight: 700 }}
            >
              <Globe size={15} />
              {lang === 'en' ? 'मराठी' : 'English'}
            </button>
          )}

          <button className="btn btn-seal" onClick={handlePrint} style={{ fontWeight: 700 }}>
            <Printer size={18} />
            {t.certPrintBtn}
          </button>
        </div>
      </div>

      {/* Certificate Sheet Display Wrapper */}
      <div className="notary-certificate-wrapper">
        <div className="notary-certificate-sheet">
          <div>
            {/* Header (Official header for Adv. Nileema Saranga with Badlapur address) */}
            <div className="cert-header">
              <div className="cert-firm-name">
                {lang === 'mr' ? 'ॲड. निलिमा सारंगा' : profile.firmName}
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#991B1B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {lang === 'mr'
                  ? 'वकील आणि अधिकृत नॉटरी (भारत सरकार)'
                  : `${profile.qualifications} (${profile.regNo})`}
              </div>
              <div className="cert-doc-title">
                {lang === 'mr' ? 'नॉटरी प्रमाणपत्र' : 'Notary Certificate'}
              </div>
              {(act.customDocumentTitle || act.documentType) && (
                <div
                  style={{
                    fontSize: '0.98rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#0F172A',
                    letterSpacing: '0.04em',
                    marginTop: '3px',
                    marginBottom: '2px',
                  }}
                >
                  {act.customDocumentTitle || act.documentType}
                </div>
              )}
              <div className="cert-address">
                {profile.officeAddress}
              </div>
            </div>

            {/* Registered Metadata Bar */}
            <div className="cert-meta-grid">
              <div className="cert-meta-item">
                <span className="cert-meta-label">{t.certRegSerialNo}</span>
                <span className="cert-meta-value">{act.serialNo}</span>
              </div>
              <div className="cert-meta-item" style={{ textAlign: 'center' }}>
                <span className="cert-meta-label">{t.certTypeOfDoc}</span>
                <span className="cert-meta-value" style={{ fontWeight: 800, color: '#0F172A' }}>
                  {act.customDocumentTitle || act.documentType}
                </span>
              </div>
              <div className="cert-meta-item" style={{ textAlign: 'right' }}>
                <span className="cert-meta-label">{t.certRegisteredOn}</span>
                <span className="cert-meta-value">{formatDate(act.date)}</span>
              </div>
            </div>

            {/* Executing Parties Section */}
            {executants.map((party) => (
              <div key={party.id} className="cert-section-block">
                <div className="cert-section-heading">
                  {t.certExecutingParties} - {getRoleDisplay(party.role)}
                </div>
                <table className="cert-table">
                  <thead>
                    <tr>
                      <th className="cert-col-details" style={{ textAlign: 'left' }}>
                        {t.certPartyInfo}
                      </th>
                      <th className="cert-col-photo">{t.certDigitalPhoto}</th>
                      <th className="cert-col-thumb">{t.certThumbImpression}</th>
                      <th className="cert-col-sign">{t.certSignature}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="cert-col-details">
                        <div style={{ lineHeight: '1.45' }}>
                          <p>
                            <strong>{lang === 'mr' ? 'नाव :' : 'Name :'}</strong> {party.name}
                          </p>
                          {party.relativeName && (
                            <p>
                              <strong>{party.relationType} :</strong> {party.relativeName}
                            </p>
                          )}
                          <p>
                            <strong>{lang === 'mr' ? 'पत्ता :' : 'Address :'}</strong> {party.address}
                          </p>
                          <p>
                            <strong>{lang === 'mr' ? 'ओळख पुरावा :' : 'Identification :'}</strong>{' '}
                            {party.idNumber} ({party.idType})
                          </p>
                          <p>
                            <strong>{lang === 'mr' ? 'मोबाईल :' : 'Mobile :'}</strong> {party.mobile}
                          </p>
                        </div>
                      </td>

                      {/* Photo Column */}
                      <td className="cert-col-photo">
                        <div className="cert-img-box">
                          {party.photoUrl ? (
                            <img src={party.photoUrl} alt={`${party.name} Photo`} />
                          ) : (
                            <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                              {lang === 'mr' ? 'फोटो नाही' : 'No Photo'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Thumb Impression Column */}
                      <td className="cert-col-thumb">
                        <div className="cert-img-box">
                          {party.fingerprintUrl ? (
                            <img
                              src={party.fingerprintUrl}
                              alt={`${party.name} Thumb Impression`}
                            />
                          ) : (
                            <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                              {lang === 'mr' ? 'ठसा नाही' : 'No Scan'}
                            </span>
                          )}
                        </div>
                        {party.fingerprintQuality && (
                          <div
                            style={{
                              fontSize: '0.62rem',
                              color: '#475569',
                              marginTop: '2px',
                              fontFamily: 'monospace',
                            }}
                          >
                            SecuGen: {party.fingerprintQuality}%
                          </div>
                        )}
                      </td>

                      {/* Signature Column */}
                      <td className="cert-col-sign">
                        <div className="cert-sign-box">
                          {party.signatureUrl && party.signatureMode === 'digital' ? (
                            <img
                              src={party.signatureUrl}
                              alt="Signature"
                              style={{ maxHeight: '70px', maxWidth: '100%', objectFit: 'contain' }}
                            />
                          ) : (
                            <div className="cert-sign-line">{t.certSignedBeforeMe}</div>
                          )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}

            {/* Witnesses Section */}
            {witnesses.length > 0 && (
              <div className="cert-section-block">
                <div className="cert-section-heading">{t.certSignedPresenceWitness}</div>
                <table className="cert-table">
                  <thead>
                    <tr>
                      <th className="cert-col-details" style={{ textAlign: 'left' }}>
                        {t.certPartyInfo}
                      </th>
                      <th className="cert-col-photo">{t.certDigitalPhoto}</th>
                      <th className="cert-col-thumb">{t.certThumbImpression}</th>
                      <th className="cert-col-sign">{t.certSignature}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {witnesses.map((witness) => (
                      <tr key={witness.id}>
                        <td className="cert-col-details">
                          <div style={{ lineHeight: '1.45' }}>
                            <p>
                              <strong>{lang === 'mr' ? 'नाव :' : 'Name :'}</strong> {witness.name}
                            </p>
                            {witness.relativeName && (
                              <p>
                                <strong>{witness.relationType} :</strong> {witness.relativeName}
                              </p>
                            )}
                            <p>
                              <strong>{lang === 'mr' ? 'पत्ता :' : 'Address :'}</strong> {witness.address}
                            </p>
                            <p>
                              <strong>{lang === 'mr' ? 'ओळख पुरावा :' : 'Identification :'}</strong>{' '}
                              {witness.idNumber} ({witness.idType})
                            </p>
                            <p>
                              <strong>{lang === 'mr' ? 'मोबाईल :' : 'Mobile :'}</strong> {witness.mobile}
                            </p>
                          </div>
                        </td>

                        <td className="cert-col-photo">
                          <div className="cert-img-box">
                            {witness.photoUrl ? (
                              <img src={witness.photoUrl} alt={`${witness.name} Photo`} />
                            ) : (
                              <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                                {lang === 'mr' ? 'फोटो नाही' : 'No Photo'}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="cert-col-thumb">
                          <div className="cert-img-box">
                            {witness.fingerprintUrl ? (
                              <img
                                src={witness.fingerprintUrl}
                                alt={`${witness.name} Thumb Impression`}
                              />
                            ) : (
                              <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                                {lang === 'mr' ? 'ठसा नाही' : 'No Scan'}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="cert-col-sign">
                          <div className="cert-sign-box">
                            {witness.signatureUrl && witness.signatureMode === 'digital' ? (
                              <img
                                src={witness.signatureUrl}
                                alt="Signature"
                                style={{ maxHeight: '70px', maxWidth: '100%', objectFit: 'contain' }}
                              />
                            ) : (
                              <div className="cert-sign-line">{t.certSignedBeforeMe}</div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Attestation Jurat & Clean Notary Signing Area (No QR code, No red stamp box) */}
          <div
            style={{
              marginTop: '16px',
              borderTop: '2px solid #000000',
              paddingTop: '10px',
              display: 'grid',
              gridTemplateColumns: '1fr 240px',
              gap: '24px',
              alignItems: 'flex-start',
            }}
          >
            {/* Jurat Legal Text with Book No and Page No */}
            <div style={{ fontSize: '0.74rem', lineHeight: '1.45', color: '#1E293B', textAlign: 'justify' }}>
              <p style={{ fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px', fontSize: '0.78rem' }}>
                {t.certAttestationTitle}
              </p>
              <p>
                {lang === 'mr'
                  ? `माझ्यासमक्ष प्रत्यक्ष हजर राहून, बायोमेट्रिक अंगठ्याचा ठसा व फोटोद्वारे ओळख पटवून, "${act.customDocumentTitle || act.documentType}" या दस्तऐवजावर स्वेच्छेने स्वाक्षरी करून शपथपूर्वक सत्यकथन केले.`
                  : `Solemnly affirmed and signed before me by the executants in respect of "${act.customDocumentTitle || act.documentType}" who appeared in person, were duly identified through verified biometric thumb impressions and photographic records, and acknowledged execution with free consent.`}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '1.2rem',
                  marginTop: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  background: '#F8FAFC',
                  padding: '4px 8px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '4px',
                  width: 'fit-content',
                }}
              >
                <span>
                  <strong>{lang === 'mr' ? 'वही क्र.:' : 'Book No:'}</strong> {bookNo}
                </span>
                <span>
                  <strong>{lang === 'mr' ? 'पान क्र.:' : 'Page No:'}</strong> {pageNo}
                </span>
                <span>
                  <strong>{lang === 'mr' ? 'नोंद दिनांक:' : 'Date:'}</strong> {formatDate(act.date)}
                </span>
              </div>
            </div>

            {/* Clean, authentic signing and physical stamp space for Mom */}
            <div style={{ textAlign: 'center', paddingTop: '10px' }}>
              {/* Blank space for physical brass seal and ink signature */}
              <div style={{ minHeight: '65px' }}></div>
              <div
                style={{
                  borderTop: '1px solid #000000',
                  paddingTop: '4px',
                  textAlign: 'center',
                  width: '230px',
                  marginLeft: 'auto',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#000000' }}>
                  {lang === 'mr' ? 'ॲड. निलिमा सारंगा' : 'ADV. NILEEMA SARANGA'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#1E293B', fontWeight: 600 }}>
                  {lang === 'mr'
                    ? 'वकील आणि अधिकृत नॉटरी (भारत सरकार)'
                    : 'Advocate & Notary Public (Govt. of India)'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#475569' }}>
                  {profile.regNo}
                </div>
                <div style={{ fontSize: '0.66rem', color: '#64748B', fontWeight: 600 }}>
                  {lang === 'mr' ? 'कार्यक्षेत्र: बदलापूर, ठाणे जिल्हा' : 'Area: Badlapur, Dist. Thane'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
