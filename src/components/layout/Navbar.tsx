import React, { useState, useEffect } from 'react';
import type { NotaryProfile } from '../../types/notary';
import { SecuGenService } from '../../services/secugenService';
import { TRANSLATIONS, type Language } from '../../i18n/translations';
import {
  FileText,
  BookOpen,
  Settings,
  ShieldCheck,
  Cpu,
  Camera,
  Stamp,
  Printer,
  Sparkles,
  Globe,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'desk' | 'register' | 'drafter' | 'certificate' | 'settings' | 'verify';
  onSelectTab: (tab: 'desk' | 'register' | 'drafter' | 'certificate' | 'settings' | 'verify') => void;
  profile: NotaryProfile;
  lang: Language;
  onToggleLang: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  profile,
  lang,
  onToggleLang,
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
    <nav className="navbar no-print">
      {/* Left Brand */}
      <div className="brand-section">
        <div className="brand-logo" title="Notaries Act, 1952 - Govt. of India">
          <Stamp size={24} />
        </div>
        <div>
          <div className="brand-title">
            {t.brandTitle}
            <span className="badge-tag">{t.actTag}</span>
          </div>
          <span className="brand-subtitle">
            {lang === 'mr' ? 'ॲड. निलिमा सारंगा • नोंदणी क्र. १५९६०' : `${profile.notaryName} • ${profile.regNo}`}
          </span>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <div className="nav-tabs">
        <button
          className={`nav-tab-btn ${activeTab === 'desk' ? 'active' : ''}`}
          onClick={() => onSelectTab('desk')}
        >
          <FileText size={16} />
          {t.tabDesk}
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'certificate' ? 'active' : ''}`}
          onClick={() => onSelectTab('certificate')}
        >
          <Printer size={16} />
          {t.tabCertificate}
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => onSelectTab('register')}
        >
          <BookOpen size={16} />
          {t.tabRegister}
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'drafter' ? 'active' : ''}`}
          onClick={() => onSelectTab('drafter')}
        >
          <Sparkles size={16} />
          {t.tabDrafter}
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'verify' ? 'active' : ''}`}
          onClick={() => onSelectTab('verify')}
        >
          <ShieldCheck size={16} />
          {t.tabVerify}
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => onSelectTab('settings')}
        >
          <Settings size={16} />
          {t.tabSettings}
        </button>
      </div>

      {/* Right Controls: Language Switcher & Device Status */}
      <div className="device-status-deck">
        {/* Language Switcher Pill */}
        <button
          type="button"
          onClick={onToggleLang}
          className="device-pill"
          style={{
            background: '#F1F5F9',
            borderColor: 'var(--color-accent)',
            color: 'var(--color-primary)',
            cursor: 'pointer',
            padding: '0.35rem 0.8rem',
            fontWeight: 700,
          }}
          title="Switch Language / भाषा बदला"
        >
          <Globe size={14} color="var(--color-accent)" />
          <span>{lang === 'en' ? 'मराठी' : 'English'}</span>
        </button>

        <div
          className={`device-pill ${secuGenStatus.connected ? 'connected' : 'simulated'}`}
          title={secuGenStatus.message}
          onClick={() => onSelectTab('settings')}
        >
          <Cpu size={14} />
          <span className="status-dot" />
          <span>{secuGenStatus.connected ? t.secugenOnline : t.secugenSim}</span>
        </div>

        <div className="device-pill connected" title="Webcam sensor is active">
          <Camera size={14} />
          <span className="status-dot" />
          <span>{t.webcamReady}</span>
        </div>
      </div>
    </nav>
  );
};
