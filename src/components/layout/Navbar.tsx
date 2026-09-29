import React, { useState, useEffect } from 'react';
import type { NotaryProfile } from '../../types/notary';
import { SecuGenService } from '../../services/secugenService';
import { TRANSLATIONS, type Language } from '../../i18n/translations';
import { NotaryLogo } from '../common/NotaryLogo';
import {
  FileText,
  BookOpen,
  Settings,
  ShieldCheck,
  Cpu,
  Camera,
  Printer,
  Sparkles,
  Globe,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'desk' | 'register' | 'drafter' | 'certificate' | 'settings' | 'verify';
  onSelectTab: (tab: 'desk' | 'register' | 'drafter' | 'certificate' | 'settings' | 'verify') => void;
  profile: NotaryProfile;
  lang: Language;
  onChangeLang?: (lang: Language) => void;
  onToggleLang: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  profile,
  lang,
  onChangeLang,
  onToggleLang,
  onLogout,
}) => {
  const [secuGenStatus, setSecuGenStatus] = useState<{ connected: boolean; message: string }>({
    connected: false,
    message: 'Checking...',
  });

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    async function check() {
      const res = await SecuGenService.testDeviceConnection();
      setSecuGenStatus({ connected: res.connected, message: res.message });
    }
    check();
  }, []);

  return (
    <header className="executive-header no-print">
      {/* Tier 1: Brand Identity & Utilities Bar */}
      <div className="header-top-bar">
        <div className="header-top-container">
          {/* Left: Red & White Logo + Single-line Brand + Notary Credentials */}
          <div className="header-brand-group">
            <NotaryLogo size={40} />
            <div className="header-brand-text">
              <div className="brand-title-row">
                <span className="brand-name">{t.brandTitle}</span>
                <span className="badge-tag">{t.actTag}</span>
              </div>
              <span className="brand-subtitle">
                {profile.notaryName} • {profile.regNo} {profile.areaOfPractice ? `• ${profile.areaOfPractice}` : ''}
              </span>
            </div>
          </div>

          {/* Right: Language Selector & Hardware Status */}
          <div className="header-utilities">
            {/* 3-Language Segmented Pill */}
            <div className="lang-pill-group">
              <Globe size={13} color="#B91C1C" />
              <button
                type="button"
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => (onChangeLang ? onChangeLang('en') : onToggleLang())}
                title="English"
              >
                English
              </button>
              <button
                type="button"
                className={`lang-btn ${lang === 'mr' ? 'active' : ''}`}
                onClick={() => (onChangeLang ? onChangeLang('mr') : onToggleLang())}
                title="मराठी (Marathi)"
              >
                मराठी
              </button>
              <button
                type="button"
                className={`lang-btn ${lang === 'hi' ? 'active' : ''}`}
                onClick={() => (onChangeLang ? onChangeLang('hi') : onToggleLang())}
                title="हिंदी (Hindi)"
              >
                हिंदी
              </button>
            </div>

            {/* SecuGen Hardware Pill */}
            <div
              className={`device-badge ${secuGenStatus.connected ? 'connected' : 'simulated'}`}
              title={secuGenStatus.message}
              onClick={() => onSelectTab('settings')}
            >
              <Cpu size={13} />
              <span className="status-dot" />
              <span>{secuGenStatus.connected ? t.secugenOnline : t.secugenSim}</span>
            </div>

            {/* Live Webcam Indicator */}
            <div className="device-badge connected" title="Webcam active">
              <Camera size={13} />
              <span className="status-dot" />
              <span>{t.webcamReady}</span>
            </div>

            {/* Switch Notary / Logout Button */}
            {onLogout && (
              <button
                type="button"
                className="device-badge"
                onClick={onLogout}
                title={`${t.logoutBtn} / ${t.switchNotaryBtn}`}
                style={{
                  background: '#FEF2F2',
                  borderColor: '#FCA5A5',
                  color: '#B91C1C',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.15s ease',
                }}
              >
                <LogOut size={13} color="#B91C1C" />
                <span>{t.switchNotaryBtn}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tier 2: Workflow Navigation Ribbon */}
      <div className="header-nav-bar">
        <div className="header-nav-container">
          <nav className="nav-tabs-ribbon">
            <button
              className={`nav-ribbon-btn ${activeTab === 'desk' ? 'active' : ''}`}
              onClick={() => onSelectTab('desk')}
            >
              <FileText size={16} />
              <span>{t.tabDesk}</span>
            </button>

            <button
              className={`nav-ribbon-btn ${activeTab === 'certificate' ? 'active' : ''}`}
              onClick={() => onSelectTab('certificate')}
            >
              <Printer size={16} />
              <span>{t.tabCertificate}</span>
            </button>

            <button
              className={`nav-ribbon-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => onSelectTab('register')}
            >
              <BookOpen size={16} />
              <span>{t.tabRegister}</span>
            </button>

            <button
              className={`nav-ribbon-btn ${activeTab === 'drafter' ? 'active' : ''}`}
              onClick={() => onSelectTab('drafter')}
            >
              <Sparkles size={16} />
              <span>{t.tabDrafter}</span>
            </button>

            <button
              className={`nav-ribbon-btn ${activeTab === 'verify' ? 'active' : ''}`}
              onClick={() => onSelectTab('verify')}
            >
              <ShieldCheck size={16} />
              <span>{t.tabVerify}</span>
            </button>

            <button
              className={`nav-ribbon-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => onSelectTab('settings')}
            >
              <Settings size={16} />
              <span>{t.tabSettings}</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
