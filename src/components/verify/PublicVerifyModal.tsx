import React from 'react';
import type { NotarialAct, NotaryProfile } from '../../types/notary';
import { ShieldCheck, CheckCircle2, X } from 'lucide-react';
import { TRANSLATIONS, type Language } from '../../i18n/translations';

interface PublicVerifyModalProps {
  act: NotarialAct;
  profile: NotaryProfile;
  lang?: Language;
  onClose: () => void;
}

export const PublicVerifyModal: React.FC<PublicVerifyModalProps> = ({
  act,
  profile,
  lang = 'en',
  onClose,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '560px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            color: '#FFFFFF',
            padding: '1.5rem',
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
          >
            <X size={16} />
          </button>

          <div
            style={{
              width: '56px',
              height: '56px',
              background: '#059669',
              borderRadius: '50%',
              margin: '0 auto 0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(5, 150, 105, 0.5)',
            }}
          >
            <ShieldCheck size={32} color="#FFFFFF" />
          </div>

          <h2 style={{ color: '#FFFFFF', fontSize: '1.3rem', fontWeight: 800 }}>
            {lang === 'mr' ? 'अधिकृत साक्षांकित नॉटरी दस्तऐवज' : 'Officially Verified Notarial Act'}
          </h2>
          <p style={{ color: '#A7F3D0', fontSize: '0.82rem', fontWeight: 600, marginTop: '2px' }}>
            {lang === 'mr' ? 'नॉटरीज कायदा १९५२ (भारत सरकार) अन्वये नोंदणीकृत' : 'Registered under The Notaries Act, 1952 (Govt. of India)'}
          </p>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem' }}>
          {/* Certificate Metadata Card */}
          <div
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.25rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              fontSize: '0.85rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                {t.certRegSerialNo}
              </span>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--color-primary)' }}>
                {act.serialNo}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                {t.certRegisteredOn}
              </span>
              <div style={{ fontWeight: 700 }}>{act.date}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                {t.certTypeOfDoc}
              </span>
              <div style={{ fontWeight: 700 }}>{act.customDocumentTitle || act.documentType}</div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                {lang === 'mr' ? 'पडताळणी टोकन' : 'Verification Token'}
              </span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#0284C7' }}>
                {act.verifiedToken}
              </div>
            </div>
          </div>

          {/* Notary Information */}
          <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: '#475569', marginBottom: '0.4rem' }}>
              {lang === 'mr' ? 'साक्षांकन करणारे नॉटरी' : 'Attesting Notary Public'}
            </h4>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{profile.notaryName}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
              {profile.qualifications} | {profile.regNo}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
              {profile.areaOfPractice}
            </div>
          </div>

          {/* Executing Parties Verified */}
          <div>
            <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: '#475569', marginBottom: '0.6rem' }}>
              {t.certExecutingParties}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {act.parties.map((party) => (
                <div
                  key={party.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.75rem',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                  }}
                >
                  <div>
                    <strong>{party.name}</strong>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', marginLeft: '6px' }}>
                      ({party.role})
                    </span>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                      {party.idType}: {party.idNumber.length > 4 ? `XXXX-XXXX-${party.idNumber.slice(-4)}` : party.idNumber}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
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
                      {lang === 'mr' ? 'बायोमेट्रिक पडताळणी पूर्ण' : 'SecuGen & Photo Verified'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={onClose}>
            {lang === 'mr' ? 'बंद करा' : 'Close Verification'}
          </button>
        </div>
      </div>
    </div>
  );
};
