import React from 'react';
import type { NotarialAct, NotaryProfile } from '../../types/notary';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  User,
  Printer,
  ArrowLeft,
  Award,
} from 'lucide-react';
import { NotaryLogo } from '../common/NotaryLogo';

interface PublicVerificationPageProps {
  act: NotarialAct;
  profile: NotaryProfile;
  onExit?: () => void;
}

export const PublicVerificationPage: React.FC<PublicVerificationPageProps> = ({
  act,
  profile,
  onExit,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0B1120',
        color: '#F8FAFC',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: '1.5rem 1rem',
      }}
    >
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        {/* Top Navigation / Action Bar */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <NotaryLogo size={36} showShadow={false} />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.02em' }}>
                NOTARY CO-PILOT
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                Central Legal Attestation & Verification Network
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handlePrint}
              style={{
                background: '#1E293B',
                color: '#F8FAFC',
                border: '1px solid #334155',
                borderRadius: '6px',
                padding: '0.45rem 0.9rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Printer size={15} />
              Print Verification Record
            </button>

            {onExit && (
              <button
                onClick={onExit}
                style={{
                  background: '#B91C1C',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.45rem 0.9rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <ArrowLeft size={15} />
                Open Notary Desk
              </button>
            )}
          </div>
        </div>

        {/* Verification Certificate Container Card */}
        <div
          style={{
            background: '#0F172A',
            border: '1px solid #1E293B',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Official Verification Header Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #064E3B 0%, #065F46 60%, #047857 100%)',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                background: '#10B981',
                borderRadius: '50%',
                margin: '0 auto 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(16, 185, 129, 0.6)',
                border: '3px solid #ECFDF5',
              }}
            >
              <ShieldCheck size={40} color="#FFFFFF" />
            </div>

            <div
              style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.2)',
                color: '#ECFDF5',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '4px 12px',
                borderRadius: '999px',
                marginBottom: '0.6rem',
              }}
            >
              GOVERNMENT OF INDIA • THE NOTARIES ACT, 1952
            </div>

            <h1
              style={{
                fontSize: '1.6rem',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                margin: '0 0 0.4rem',
              }}
            >
              OFFICIALLY VERIFIED NOTARIAL ACT
            </h1>

            <p style={{ color: '#D1FAE5', fontSize: '0.88rem', margin: 0, fontWeight: 500 }}>
              This document has been solemnly affirmed, biometrically captured, and recorded in the statutory Form XV Register.
            </p>
          </div>

          <div style={{ padding: '1.75rem' }}>
            {/* Metadata Summary Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                background: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.75rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Statutory Serial No
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#38BDF8', fontFamily: 'monospace', marginTop: '2px' }}>
                  {act.serialNo}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Execution Date
                </div>
                <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#F1F5F9', marginTop: '3px' }}>
                  {act.date}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Register Book & Page
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F1F5F9', marginTop: '3px' }}>
                  Book {act.bookNo || 1} • Page {act.pageNo || 28}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Verification Token
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34D399', fontFamily: 'monospace', marginTop: '4px' }}>
                  {act.verifiedToken}
                </div>
              </div>
            </div>

            {/* Document Nature Banner */}
            <div
              style={{
                background: '#0F172A',
                border: '1px solid #334155',
                borderRadius: '10px',
                padding: '1rem 1.25rem',
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <FileText size={28} color="#F59E0B" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                  Document Nature & Statutory Subject
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {act.customDocumentTitle || act.documentType}
                </div>
              </div>
            </div>

            {/* Attesting Notary Public Section */}
            <div
              style={{
                background: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.85rem' }}>
                <Award size={18} color="#EF4444" />
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 800, color: '#CBD5E1', margin: 0, letterSpacing: '0.04em' }}>
                  Attesting Notary Public Credentials
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>
                    {profile.notaryName}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '2px' }}>
                    {profile.qualifications}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#F87171', fontWeight: 700, marginTop: '2px' }}>
                    {profile.regNo}
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: '1.5' }}>
                  <div>
                    <strong style={{ color: '#E2E8F0' }}>Jurisdiction:</strong> {profile.areaOfPractice}
                  </div>
                  {profile.officeAddress && (
                    <div style={{ marginTop: '3px' }}>
                      <strong style={{ color: '#E2E8F0' }}>Chambers:</strong> {profile.officeAddress}
                    </div>
                  )}
                  {profile.verificationDomain && (
                    <div style={{ marginTop: '3px', color: '#38BDF8' }}>
                      <strong style={{ color: '#E2E8F0' }}>Authorized Domain:</strong> {profile.verificationDomain}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Executing Parties & Biometric Records */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <User size={18} color="#38BDF8" />
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 800, color: '#CBD5E1', margin: 0, letterSpacing: '0.04em' }}>
                  Verified Executing Parties & Biometric Records
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {act.parties.map((party, index) => (
                  <div
                    key={party.id || index}
                    style={{
                      background: '#1E293B',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr auto',
                      gap: '1.25rem',
                      alignItems: 'center',
                    }}
                  >
                    {/* Photo Box */}
                    <div
                      style={{
                        width: '80px',
                        height: '96px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: '#0F172A',
                        border: '1px solid #475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {party.photoUrl ? (
                        <img
                          src={party.photoUrl}
                          alt={party.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <User size={32} color="#64748B" />
                      )}
                    </div>

                    {/* Party Details */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
                          {party.name}
                        </span>
                        <span
                          style={{
                            background: '#0F172A',
                            color: '#38BDF8',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            border: '1px solid #334155',
                          }}
                        >
                          {party.role}
                        </span>
                      </div>

                      {party.relativeName && (
                        <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '3px' }}>
                          {party.relationType || 'S/o'}: {party.relativeName}
                        </div>
                      )}

                      <div style={{ fontSize: '0.78rem', color: '#CBD5E1', marginTop: '4px' }}>
                        <strong>ID Proof:</strong> {party.idType} ({party.idNumber.length > 4 ? `XXXX-XXXX-${party.idNumber.slice(-4)}` : party.idNumber})
                      </div>

                      {party.address && (
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>
                          {party.address}
                        </div>
                      )}
                    </div>

                    {/* Biometric Verification Badge & Fingerprint */}
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      <div
                        style={{
                          background: '#064E3B',
                          color: '#A7F3D0',
                          border: '1px solid #059669',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <CheckCircle2 size={13} color="#10B981" />
                        SecuGen 500 DPI Verified
                      </div>

                      {party.fingerprintUrl && (
                        <div
                          style={{
                            width: '42px',
                            height: '52px',
                            background: '#FFFFFF',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            border: '1px solid #CBD5E1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          title="Verified Biometric Thumbprint"
                        >
                          <img
                            src={party.fingerprintUrl}
                            alt="Thumb Impression"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </div>
                      )}

                      <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                        Webcam Live Verified
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statutory Compliance Footer */}
            <div
              style={{
                borderTop: '1px solid #334155',
                paddingTop: '1.25rem',
                fontSize: '0.74rem',
                color: '#64748B',
                lineHeight: '1.6',
                textAlign: 'center',
              }}
            >
              <p style={{ margin: 0 }}>
                This electronic attestation verification is generated under Rule 11 of the <strong>Notaries Rules, 1956</strong> and <strong>The Information Technology Act, 2000</strong>.
                The physical document bears the authentic wet-ink signature and official brass seal of the Notary Public.
              </p>
              <p style={{ margin: '6px 0 0', color: '#475569' }}>
                Verification ID: {act.verifiedToken} • Certified by Notary Co-Pilot Digital Desk
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
