import React, { useState } from 'react';
import type { NotaryProfile, AccessRequest } from '../../types/notary';
import { StorageService } from '../../services/storageService';
import { AUTHORIZED_ACCOUNTS } from '../../config/authorizedAccounts';
import { TRANSLATIONS, type Language } from '../../i18n/translations';
import { NotaryLogo } from '../common/NotaryLogo';
import {
  Lock,
  ArrowRight,
  Globe,
  Fingerprint,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Send,
  MessageCircle,
  ShieldCheck,
  Building2,
  KeyRound,
} from 'lucide-react';

interface NotaryLoginProps {
  onLogin: (profile: NotaryProfile) => void;
  lang: Language;
  onChangeLang: (lang: Language) => void;
}

export const NotaryLogin: React.FC<NotaryLoginProps> = ({
  onLogin,
  lang,
  onChangeLang,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'signin' | 'request'>('signin');

  // Sign-In State
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [showQuickSelect, setShowQuickSelect] = useState<boolean>(false);

  // Request Access State
  const [reqName, setReqName] = useState<string>('');
  const [reqRegNo, setReqRegNo] = useState<string>('');
  const [reqMobile, setReqMobile] = useState<string>('');
  const [reqEmail, setReqEmail] = useState<string>('');
  const [reqJurisdiction, setReqJurisdiction] = useState<string>('');
  const [reqNotes, setReqNotes] = useState<string>('');
  const [submittedRequest, setSubmittedRequest] = useState<AccessRequest | null>(null);

  // Handle Sign-In
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!username.trim() || !password.trim()) {
      setLoginError('Please enter both username and password.');
      return;
    }

    setIsLoggingIn(true);

    setTimeout(() => {
      const account = StorageService.authenticate(username, password);
      if (account) {
        onLogin(account.profile);
      } else {
        setLoginError('Invalid credentials. Please verify your assigned username and password.');
        setIsLoggingIn(false);
      }
    }, 250);
  };

  // Quick Autofill for Authorized Accounts
  const handleAutofill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setLoginError('');
  };

  // Handle Request Access Submission
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqName.trim() || !reqMobile.trim()) return;

    const newReq = StorageService.createAccessRequest({
      applicantName: reqName.trim(),
      regNo: reqRegNo.trim() || 'Pending Verification',
      mobile: reqMobile.trim(),
      email: reqEmail.trim() || 'notary@legal.in',
      jurisdiction: reqJurisdiction.trim() || 'District Court Jurisdiction',
      notes: reqNotes.trim(),
    });

    setSubmittedRequest(newReq);
  };

  const waText = encodeURIComponent(
    `Hello! I am an Advocate & Notary Public requesting official workstation setup.\n\nName: ${reqName || 'Advocate'}\nReg: ${reqRegNo || 'Bar Council'}\nEmail: ${reqEmail}\nJurisdiction: ${reqJurisdiction || 'District Court'}`
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0A1128 0%, #0F172A 50%, #1E293B 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.25rem',
        boxSizing: 'border-box',
        position: 'relative',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Top Header: Statutory Badge & Language Selector */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '500px',
          marginBottom: '1.25rem',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            color: '#94A3B8',
            fontSize: '0.76rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}
        >
          <ShieldCheck size={16} color="#10B981" />
          <span>Section 65B &amp; Form XV Compliant</span>
        </div>

        {/* Language Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '999px',
            padding: '2px 4px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Globe size={13} color="#CBD5E1" style={{ marginLeft: '6px', marginRight: '4px' }} />
          <button
            type="button"
            className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
            onClick={() => onChangeLang('en')}
            style={{
              background: lang === 'en' ? '#FFFFFF' : 'transparent',
              color: lang === 'en' ? '#0F172A' : '#94A3B8',
              fontWeight: 700,
              fontSize: '0.74rem',
              border: 'none',
              padding: '3px 8px',
              borderRadius: '999px',
              cursor: 'pointer',
            }}
          >
            EN
          </button>
          <button
            type="button"
            className={`lang-btn ${lang === 'mr' ? 'active' : ''}`}
            onClick={() => onChangeLang('mr')}
            style={{
              background: lang === 'mr' ? '#FFFFFF' : 'transparent',
              color: lang === 'mr' ? '#0F172A' : '#94A3B8',
              fontWeight: 700,
              fontSize: '0.74rem',
              border: 'none',
              padding: '3px 8px',
              borderRadius: '999px',
              cursor: 'pointer',
            }}
          >
            MR
          </button>
          <button
            type="button"
            className={`lang-btn ${lang === 'hi' ? 'active' : ''}`}
            onClick={() => onChangeLang('hi')}
            style={{
              background: lang === 'hi' ? '#FFFFFF' : 'transparent',
              color: lang === 'hi' ? '#0F172A' : '#94A3B8',
              fontWeight: 700,
              fontSize: '0.74rem',
              border: 'none',
              padding: '3px 8px',
              borderRadius: '999px',
              cursor: 'pointer',
            }}
          >
            HI
          </button>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          background: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          transition: 'all 0.25s ease',
        }}
      >
        {/* Card Header: Official Legal Crest */}
        <div
          style={{
            background: 'linear-gradient(135deg, #7F1D1D 0%, #991B1B 50%, #831843 100%)',
            padding: '2.25rem 2rem 2rem',
            color: '#FFFFFF',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              padding: '8px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.14)',
              backdropFilter: 'blur(10px)',
              marginBottom: '0.85rem',
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.25)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <NotaryLogo size={68} />
          </div>

          <h1
            style={{
              margin: '0 0 0.35rem 0',
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: '#FFFFFF',
            }}
          >
            {t.loginHeading}
          </h1>

          <p
            style={{
              margin: '0 auto 0.85rem',
              fontSize: '0.84rem',
              color: '#FEE2E2',
              lineHeight: 1.45,
              maxWidth: '380px',
            }}
          >
            Official Notarial Workstation &amp; Biometric Form XV Register
          </p>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            <ShieldCheck size={13} />
            <span>Notaries Act, 1952 • Govt. of India</span>
          </span>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #E2E8F0',
            background: '#F8FAFC',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setLoginError('');
            }}
            style={{
              flex: 1,
              padding: '0.95rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontWeight: 700,
              fontSize: '0.86rem',
              border: 'none',
              background: activeTab === 'signin' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'signin' ? '#991B1B' : '#64748B',
              borderBottom: activeTab === 'signin' ? '2.5px solid #991B1B' : '2.5px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Lock size={15} />
            <span>Chamber Sign-In</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('request')}
            style={{
              flex: 1,
              padding: '0.95rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontWeight: 700,
              fontSize: '0.86rem',
              border: 'none',
              background: activeTab === 'request' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'request' ? '#991B1B' : '#64748B',
              borderBottom: activeTab === 'request' ? '2.5px solid #991B1B' : '2.5px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Send size={14} />
            <span>Request Access</span>
          </button>
        </div>

        {/* Card Body */}
        <div style={{ padding: '2rem 1.75rem' }}>
          {activeTab === 'signin' ? (
            /* TAB 1: AUTHORIZED CREDENTIAL SIGN-IN */
            <form onSubmit={handleSignIn}>
              {loginError && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.85rem 1rem',
                    background: '#FEF2F2',
                    border: '1px solid #FCA5A5',
                    borderRadius: '10px',
                    color: '#991B1B',
                    fontSize: '0.83rem',
                    fontWeight: 600,
                    marginBottom: '1.25rem',
                  }}
                >
                  <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0 }} />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Username Input */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.86rem' }}>
                  Advocate ID / Assigned Username *
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    className="form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your assigned chamber username"
                    style={{
                      paddingLeft: '42px',
                      height: '48px',
                      fontSize: '0.94rem',
                      borderRadius: '10px',
                      borderColor: '#CBD5E1',
                    }}
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.86rem' }}>
                  Chamber Security Passcode *
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter chamber passcode"
                    style={{
                      paddingLeft: '42px',
                      paddingRight: '44px',
                      height: '48px',
                      fontSize: '0.94rem',
                      borderRadius: '10px',
                      borderColor: '#CBD5E1',
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'transparent',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Enter Workstation Button */}
              <button
                type="submit"
                className="btn btn-seal btn-lg"
                disabled={isLoggingIn}
                style={{
                  width: '100%',
                  fontWeight: 800,
                  fontSize: '0.96rem',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(153, 27, 27, 0.3)',
                  borderRadius: '10px',
                }}
              >
                <span>{isLoggingIn ? 'Verifying Chamber Credentials...' : 'Authenticate & Open Workstation'}</span>
                <ArrowRight size={18} />
              </button>

              {/* Quick Account Selector */}
              <div style={{ marginTop: '1.5rem', background: '#F8FAFC', borderRadius: '12px', padding: '0.95rem 1rem', border: '1px solid #E2E8F0' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#475569',
                  }}
                  onClick={() => setShowQuickSelect(!showQuickSelect)}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <KeyRound size={14} color="#991B1B" />
                    <span>Configured Chamber Accounts ({AUTHORIZED_ACCOUNTS.length})</span>
                  </span>
                  <span style={{ color: '#991B1B', fontSize: '0.74rem', fontWeight: 600 }}>
                    {showQuickSelect ? 'Hide' : 'Quick Fill'}
                  </span>
                </div>

                {showQuickSelect && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {AUTHORIZED_ACCOUNTS.map((acc) => (
                      <div
                        key={acc.username}
                        onClick={() => handleAutofill(acc.username, acc.password)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 10px',
                          background: '#FFFFFF',
                          borderRadius: '8px',
                          border: '1px solid #E2E8F0',
                          cursor: 'pointer',
                          fontSize: '0.76rem',
                          transition: 'all 0.15s ease',
                        }}
                        title={`Click to fill ${acc.profile.notaryName}`}
                      >
                        <div>
                          <strong>{acc.profile.notaryName}</strong>
                          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{acc.profile.regNo}</div>
                        </div>
                        <div style={{ color: '#991B1B', fontWeight: 600, fontFamily: 'monospace' }}>
                          user: <strong>{acc.username}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
          ) : (
            /* TAB 2: REQUEST ACCESS FOR NEW ADVOCATES */
            <div>
              {submittedRequest ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: '#ECFDF5',
                      border: '2px solid #A7F3D0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#059669',
                      margin: '0 auto 1.25rem',
                    }}
                  >
                    <CheckCircle2 size={34} />
                  </div>

                  <h3 style={{ margin: '0 0 0.5rem', color: '#065F46', fontWeight: 800, fontSize: '1.2rem' }}>
                    Access Request Submitted!
                  </h3>

                  <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5, margin: '0 auto 1.5rem', maxWidth: '380px' }}>
                    Your request has been received. The administrator will issue your authorized chamber username and password via WhatsApp or email.
                  </p>

                  <div
                    style={{
                      background: '#F8FAFC',
                      border: '1px dashed #CBD5E1',
                      borderRadius: '10px',
                      padding: '0.85rem 1.1rem',
                      fontSize: '0.82rem',
                      color: '#334155',
                      textAlign: 'left',
                      marginBottom: '1.35rem',
                    }}
                  >
                    <div><strong>Request Reference:</strong> {submittedRequest.id}</div>
                    <div><strong>Advocate:</strong> {submittedRequest.applicantName}</div>
                    <div><strong>Status:</strong> <span style={{ color: '#D97706', fontWeight: 700 }}>Pending Verification</span></div>
                  </div>

                  <a
                    href={`https://wa.me/?text=${waText}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      justifyContent: 'center',
                      background: '#25D366',
                      borderColor: '#25D366',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      marginBottom: '0.85rem',
                      height: '44px',
                      borderRadius: '10px',
                    }}
                  >
                    <MessageCircle size={17} />
                    <span>Contact Administrator on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedRequest(null);
                      setActiveTab('signin');
                    }}
                    className="btn btn-outline"
                    style={{ width: '100%', borderRadius: '10px' }}
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit}>
                  <div style={{ marginBottom: '1.35rem' }}>
                    <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                      Request Workstation Credentials
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B', lineHeight: 1.45 }}>
                      If you are an Advocate or Notary Public, submit your details below to receive your authorized login credentials.
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                    <div className="form-group">
                      <label className="form-label">{t.loginRequestNameLabel} *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={reqName}
                        onChange={(e) => setReqName(e.target.value)}
                        placeholder="e.g. Adv. Sunil M. Deshmukh"
                        required
                      />
                    </div>

                    <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                      <div className="form-group">
                        <label className="form-label">{t.loginRequestRegNoLabel}</label>
                        <input
                          type="text"
                          className="form-input"
                          value={reqRegNo}
                          onChange={(e) => setReqRegNo(e.target.value)}
                          placeholder="e.g. MH/21940/2026"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">{t.loginRequestMobileLabel} *</label>
                        <input
                          type="tel"
                          className="form-input"
                          value={reqMobile}
                          onChange={(e) => setReqMobile(e.target.value)}
                          placeholder="e.g. +91 98220 54321"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t.loginRequestJurisdictionLabel} *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={reqJurisdiction}
                        onChange={(e) => setReqJurisdiction(e.target.value)}
                        placeholder="e.g. Thane District Court &amp; Kalyan Taluka"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t.loginRequestEmailLabel}</label>
                      <input
                        type="email"
                        className="form-input"
                        value={reqEmail}
                        onChange={(e) => setReqEmail(e.target.value)}
                        placeholder="e.g. adv.sunil@gmail.com"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t.loginRequestNotesLabel}</label>
                      <input
                        type="text"
                        className="form-input"
                        value={reqNotes}
                        onChange={(e) => setReqNotes(e.target.value)}
                        placeholder="e.g. Daily notarial registry and biometric attestation"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-seal btn-lg"
                      style={{
                        width: '100%',
                        fontWeight: 800,
                        marginTop: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        borderRadius: '10px',
                        height: '46px',
                      }}
                    >
                      <Send size={16} />
                      <span>{t.loginRequestSubmitBtn}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Footer Security Badges */}
          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.1rem',
              borderTop: '1px dashed #E2E8F0',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.85rem',
              fontSize: '0.74rem',
              color: '#64748B',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Fingerprint size={15} color="#059669" />
              <span>SecuGen USB Biometrics</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={15} color="#991B1B" />
              <span>Encrypted Chamber Vault</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Footer Citation */}
      <div
        style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.74rem',
          color: '#64748B',
          maxWidth: '480px',
          lineHeight: 1.5,
        }}
      >
        Notarial records and biometric attestation entries are protected by statutory evidentiary audit trails under the Indian Evidence Act and Information Technology Act, 2000.
      </div>
    </div>
  );
};
