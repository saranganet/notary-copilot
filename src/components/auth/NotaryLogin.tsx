import React, { useState } from 'react';
import type { NotaryProfile, AccessRequest } from '../../types/notary';
import { StorageService } from '../../services/storageService';
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
  KeyRound,
  ShieldCheck,
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

  // Sign-in state
  const [username, setUsername] = useState<string>('nileema');
  const [password, setPassword] = useState<string>('notary123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState<boolean>(true);

  // Request Access state
  const [reqName, setReqName] = useState<string>('');
  const [reqRegNo, setReqRegNo] = useState<string>('');
  const [reqMobile, setReqMobile] = useState<string>('');
  const [reqEmail, setReqEmail] = useState<string>('');
  const [reqJurisdiction, setReqJurisdiction] = useState<string>('');
  const [reqNotes, setReqNotes] = useState<string>('');
  const [submittedRequest, setSubmittedRequest] = useState<AccessRequest | null>(null);

  // Handle Login submission
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    setTimeout(() => {
      const account = StorageService.authenticate(username, password);
      if (account) {
        onLogin(account.profile);
      } else {
        setLoginError(t.loginInvalidCredentialsError);
        setIsLoggingIn(false);
      }
    }, 200);
  };

  // Quick autofill helper
  const handleAutofill = (demoUser: string, demoPass: string) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setLoginError('');
  };

  // Handle Access Request submission
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqName.trim() || !reqMobile.trim()) {
      return;
    }

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

  // Prepare WhatsApp message
  const waText = encodeURIComponent(
    `Hello! I am an Advocate & Notary Public interested in getting access to the Digital Notary Desk portal.\n\nName: ${reqName || 'Advocate'}\nRegistration: ${reqRegNo || 'Govt of India'}\nJurisdiction: ${reqJurisdiction || 'District Court'}\n\nPlease issue me a login username and password.`
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #EEF2F6 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* Top Language Switcher */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',
          maxWidth: '520px',
          marginBottom: '1.25rem',
        }}
      >
        <div className="lang-pill-group" style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <Globe size={13} color="#B91C1C" />
          <button
            type="button"
            className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
            onClick={() => onChangeLang('en')}
            title="English"
          >
            English
          </button>
          <button
            type="button"
            className={`lang-btn ${lang === 'mr' ? 'active' : ''}`}
            onClick={() => onChangeLang('mr')}
            title="मराठी (Marathi)"
          >
            मराठी
          </button>
          <button
            type="button"
            className={`lang-btn ${lang === 'hi' ? 'active' : ''}`}
            onClick={() => onChangeLang('hi')}
            title="हिंदी (Hindi)"
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 20px 40px -15px rgba(185, 28, 28, 0.12), 0 1px 3px rgba(0, 0, 0, 0.05)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
        }}
      >
        {/* Card Header with Red & White Emblem */}
        <div
          style={{
            background: 'linear-gradient(135deg, #7F1D1D 0%, #B91C1C 60%, #991B1B 100%)',
            padding: '2rem 1.75rem 1.75rem',
            color: '#FFFFFF',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              padding: '6px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              marginBottom: '0.75rem',
            }}
          >
            <NotaryLogo size={64} />
          </div>

          <h1
            style={{
              margin: '0 0 0.35rem 0',
              fontSize: '1.45rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
            }}
          >
            {t.loginHeading}
          </h1>

          <p
            style={{
              margin: '0 auto 0.75rem',
              fontSize: '0.82rem',
              color: '#FEE2E2',
              lineHeight: 1.4,
              maxWidth: '380px',
            }}
          >
            {t.loginSubheading}
          </p>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 12px',
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
            <ShieldCheck size={12} />
            <span>{t.loginPortalBadge}</span>
          </span>
        </div>

        {/* Tab Navigation: Sign-In vs Request Access */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #E2E8F0',
            background: '#F8FAFC',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('signin')}
            style={{
              flex: 1,
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontWeight: 700,
              fontSize: '0.86rem',
              border: 'none',
              background: activeTab === 'signin' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'signin' ? '#B91C1C' : '#64748B',
              borderBottom: activeTab === 'signin' ? '2.5px solid #B91C1C' : '2.5px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <KeyRound size={16} />
            <span>{t.loginCredentialsTab}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('request')}
            style={{
              flex: 1,
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontWeight: 700,
              fontSize: '0.86rem',
              border: 'none',
              background: activeTab === 'request' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'request' ? '#B91C1C' : '#64748B',
              borderBottom: activeTab === 'request' ? '2.5px solid #B91C1C' : '2.5px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Send size={15} />
            <span>{t.loginRequestTab}</span>
          </button>
        </div>

        {/* Card Body */}
        <div style={{ padding: '1.75rem' }}>
          {activeTab === 'signin' ? (
            /* TAB 1: AUTHORIZED CREDENTIAL SIGN-IN */
            <form onSubmit={handleSignIn}>
              {/* Error Message */}
              {loginError && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0.75rem 1rem',
                    background: '#FEF2F2',
                    border: '1px solid #FCA5A5',
                    borderRadius: '8px',
                    color: '#991B1B',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    marginBottom: '1.25rem',
                  }}
                >
                  <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0 }} />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Username Input */}
              <div className="form-group" style={{ marginBottom: '1.1rem' }}>
                <label className="form-label" style={{ fontWeight: 700, color: '#334155' }}>
                  {t.loginUsernameLabel} *
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your assigned username"
                    style={{ paddingLeft: '38px', height: '44px', fontSize: '0.92rem' }}
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="form-group" style={{ marginBottom: '1.4rem' }}>
                <label className="form-label" style={{ fontWeight: 700, color: '#334155' }}>
                  {t.loginPasswordLabel} *
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    style={{ paddingLeft: '38px', paddingRight: '40px', height: '44px', fontSize: '0.92rem' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
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
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="btn btn-seal btn-lg"
                disabled={isLoggingIn}
                style={{
                  width: '100%',
                  fontWeight: 800,
                  fontSize: '0.96rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(185, 28, 28, 0.25)',
                }}
              >
                <span>{isLoggingIn ? 'Verifying Credentials...' : t.loginEnterPortalBtn}</span>
                <ArrowRight size={18} />
              </button>

              {/* Quick Demo Credential Helper */}
              <div style={{ marginTop: '1.5rem', background: '#F8FAFC', borderRadius: '10px', padding: '0.85rem 1rem', border: '1px solid #E2E8F0' }}>
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
                  onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <KeyRound size={13} color="#B91C1C" />
                    <span>{t.loginDemoCredentialsLabel}</span>
                  </span>
                  <span style={{ color: '#B91C1C', fontSize: '0.74rem' }}>
                    {showDemoAccounts ? 'Hide' : 'Show'}
                  </span>
                </div>

                {showDemoAccounts && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div
                      onClick={() => handleAutofill('nileema', 'notary123')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        background: '#FFFFFF',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                      title="Click to autofill Adv. Nileema Saranga"
                    >
                      <div>
                        <strong>Adv. Nileema Saranga</strong> (Reg. 15960)
                      </div>
                      <div style={{ color: '#B91C1C', fontWeight: 600 }}>
                        User: <code style={{ color: '#0F172A' }}>nileema</code> | Pass: <code style={{ color: '#0F172A' }}>notary123</code>
                      </div>
                    </div>

                    <div
                      onClick={() => handleAutofill('rajesh', 'notary123')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        background: '#FFFFFF',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                      title="Click to autofill Adv. Rajesh K. Verma"
                    >
                      <div>
                        <strong>Adv. Rajesh Verma</strong> (Delhi)
                      </div>
                      <div style={{ color: '#B91C1C', fontWeight: 600 }}>
                        User: <code style={{ color: '#0F172A' }}>rajesh</code> | Pass: <code style={{ color: '#0F172A' }}>notary123</code>
                      </div>
                    </div>

                    <div
                      onClick={() => handleAutofill('anand', 'notary123')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        background: '#FFFFFF',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                      title="Click to autofill Adv. Anand R. Kulkarni"
                    >
                      <div>
                        <strong>Adv. Anand Kulkarni</strong> (Pune)
                      </div>
                      <div style={{ color: '#B91C1C', fontWeight: 600 }}>
                        User: <code style={{ color: '#0F172A' }}>anand</code> | Pass: <code style={{ color: '#0F172A' }}>notary123</code>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          ) : (
            /* TAB 2: INTERESTED? REQUEST WORKSTATION ACCESS */
            <div>
              {submittedRequest ? (
                /* Success Screen After Submission */
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: '#ECFDF5',
                      border: '2px solid #A7F3D0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#059669',
                      margin: '0 auto 1rem',
                    }}
                  >
                    <CheckCircle2 size={32} />
                  </div>

                  <h3 style={{ margin: '0 0 0.5rem', color: '#065F46', fontWeight: 800 }}>
                    {t.loginRequestSuccessTitle}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, margin: '0 auto 1.5rem', maxWidth: '380px' }}>
                    {t.loginRequestSuccessDesc}
                  </p>

                  <div
                    style={{
                      background: '#F8FAFC',
                      border: '1px dashed #CBD5E1',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      fontSize: '0.8rem',
                      color: '#334155',
                      textAlign: 'left',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div><strong>Request ID:</strong> {submittedRequest.id}</div>
                    <div><strong>Name:</strong> {submittedRequest.applicantName}</div>
                    <div><strong>Status:</strong> <span style={{ color: '#D97706', fontWeight: 700 }}>Pending Approval</span></div>
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
                      marginBottom: '0.75rem',
                    }}
                  >
                    <MessageCircle size={16} />
                    <span>{t.loginRequestWhatsAppBtn}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedRequest(null);
                      setActiveTab('signin');
                    }}
                    className="btn btn-outline"
                    style={{ width: '100%' }}
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                /* Access Request Form */
                <form onSubmit={handleRequestSubmit}>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                      {t.loginRequestHeading}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748B', lineHeight: 1.45 }}>
                      {t.loginRequestDesc}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
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

                    <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
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
                        placeholder="e.g. Thane District Court & Kalyan Taluka"
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
                        placeholder="e.g. I need biometric attestation and Form XV register"
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
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px dashed #E2E8F0',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              fontSize: '0.74rem',
              color: '#64748B',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Fingerprint size={14} color="#059669" />
              <span>SecuGen USB Biometrics</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Lock size={14} color="#B91C1C" />
              <span>100% Offline Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
