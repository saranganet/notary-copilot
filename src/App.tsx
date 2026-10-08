import React, { useState, useEffect } from 'react';
import type { NotarialAct, NotaryProfile } from './types/notary';
import { StorageService } from './services/storageService';
import { QrVerificationService } from './services/qrVerificationService';
import { Navbar } from './components/layout/Navbar';
import { NotaryDesk } from './components/desk/NotaryDesk';
import { NotaryCertificate } from './components/certificate/NotaryCertificate';
import { FormXVRegister } from './components/register/FormXVRegister';
import { AffidavitDrafter } from './components/templates/AffidavitDrafter';
import { NotarySettings } from './components/profile/NotarySettings';
import { PublicVerifyModal } from './components/verify/PublicVerifyModal';
import { PublicVerificationPage } from './components/verify/PublicVerificationPage';
import { NotaryLogin } from './components/auth/NotaryLogin';
import type { Language } from './i18n/translations';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<NotaryProfile | null>(() => StorageService.getSessionUser());
  const [profile, setProfile] = useState<NotaryProfile>(() => currentUser || StorageService.getProfile());
  const [acts, setActs] = useState<NotarialAct[]>(() => StorageService.getActs(currentUser || undefined));
  const [activeTab, setActiveTab] = useState<'desk' | 'register' | 'drafter' | 'certificate' | 'settings' | 'verify'>('desk');
  const [selectedAct, setSelectedAct] = useState<NotarialAct>(() => acts[0]);
  const [verifyModalAct, setVerifyModalAct] = useState<NotarialAct | null>(null);
  const [lang, setLang] = useState<Language>(() => StorageService.getLanguage());

  // Public QR Code Verification Landing State
  const [publicVerifyRecord, setPublicVerifyRecord] = useState<{
    act: NotarialAct;
    profile: NotaryProfile;
  } | null>(null);

  useEffect(() => {
    // Detect if accessed via QR code scan (?verify=... or ?token=...)
    const searchParams = new URLSearchParams(window.location.search);
    const verifySerial = searchParams.get('verify') || searchParams.get('token');
    const encodedPayload = searchParams.get('v');

    if (verifySerial) {
      // 1. Try local chamber registers
      const match = StorageService.findActAcrossChambers(verifySerial);
      if (match) {
        setPublicVerifyRecord(match);
        return;
      }

      // 2. Decode compact evidentiary payload from QR parameter (for external devices/phones)
      if (encodedPayload) {
        const decoded = QrVerificationService.decodePayload(encodedPayload);
        if (decoded) {
          setPublicVerifyRecord({ act: decoded.act, profile: decoded.profile });
          return;
        }
      }

      // 3. Fallback: check current loaded acts
      const fallbackAct = StorageService.getActs().find(
        (a) => a.serialNo.toUpperCase() === verifySerial.toUpperCase()
      );
      if (fallbackAct) {
        setPublicVerifyRecord({ act: fallbackAct, profile });
      }
    }
  }, []);

  const handleChangeLang = (newLang: Language) => {
    setLang(newLang);
    StorageService.setLanguage(newLang);
  };

  const handleToggleLang = () => {
    const cycle: Record<Language, Language> = { en: 'mr', mr: 'hi', hi: 'en' };
    handleChangeLang(cycle[lang]);
  };

  const handleLogin = (loggedProfile: NotaryProfile) => {
    setCurrentUser(loggedProfile);
    setProfile(loggedProfile);
    const updatedActs = StorageService.getActs(loggedProfile);
    setActs(updatedActs);
    if (updatedActs.length > 0) {
      setSelectedAct(updatedActs[0]);
    }
  };

  const handleLogout = () => {
    StorageService.clearSession();
    setCurrentUser(null);
    const defaultActs = StorageService.getActs();
    setActs(defaultActs);
  };

  // Sync state if acts update
  const refreshActs = () => {
    const updated = StorageService.getActs(profile);
    setActs(updated);
  };

  const handleActSaved = (newAct: NotarialAct) => {
    refreshActs();
    setSelectedAct(newAct);
  };

  const handleViewCertificate = (act: NotarialAct) => {
    setSelectedAct(act);
    setActiveTab('certificate');
  };

  // If person scanned QR code on the certificate, show the official verification portal
  if (publicVerifyRecord) {
    return (
      <PublicVerificationPage
        act={publicVerifyRecord.act}
        profile={publicVerifyRecord.profile}
        onExit={() => {
          window.history.replaceState({}, document.title, window.location.pathname);
          setPublicVerifyRecord(null);
        }}
      />
    );
  }

  // If not logged in, show the executive Red & White Notary Login screen
  if (!currentUser) {
    return (
      <NotaryLogin
        onLogin={handleLogin}
        lang={lang}
        onChangeLang={handleChangeLang}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Navbar with Brand, Language Switcher & Hardware Status */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'verify') {
            setVerifyModalAct(selectedAct || acts[0]);
          } else {
            setActiveTab(tab);
          }
        }}
        profile={profile}
        lang={lang}
        onChangeLang={handleChangeLang}
        onToggleLang={handleToggleLang}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'desk' && (
          <NotaryDesk
            profile={profile}
            lang={lang}
            onViewCertificate={handleViewCertificate}
            onActSaved={handleActSaved}
          />
        )}

        {activeTab === 'certificate' && selectedAct && (
          <NotaryCertificate
            act={selectedAct}
            profile={profile}
            lang={lang}
            onToggleLang={handleToggleLang}
            onBack={() => setActiveTab('desk')}
          />
        )}

        {activeTab === 'register' && (
          <FormXVRegister
            acts={acts}
            profile={profile}
            lang={lang}
            onViewCertificate={handleViewCertificate}
            onNewAct={() => setActiveTab('desk')}
          />
        )}

        {activeTab === 'drafter' && (
          <AffidavitDrafter acts={acts} profile={profile} lang={lang} />
        )}

        {activeTab === 'settings' && (
          <NotarySettings
            profile={profile}
            onUpdateProfile={(updated) => setProfile(updated)}
          />
        )}
      </main>

      {/* QR Code Verification Modal */}
      {verifyModalAct && (
        <PublicVerifyModal
          act={verifyModalAct}
          profile={profile}
          lang={lang}
          onClose={() => setVerifyModalAct(null)}
        />
      )}
    </div>
  );
};

export default App;
