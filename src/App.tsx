import React, { useState } from 'react';
import type { NotarialAct, NotaryProfile } from './types/notary';
import { StorageService } from './services/storageService';
import { Navbar } from './components/layout/Navbar';
import { NotaryDesk } from './components/desk/NotaryDesk';
import { NotaryCertificate } from './components/certificate/NotaryCertificate';
import { FormXVRegister } from './components/register/FormXVRegister';
import { AffidavitDrafter } from './components/templates/AffidavitDrafter';
import { NotarySettings } from './components/profile/NotarySettings';
import { PublicVerifyModal } from './components/verify/PublicVerifyModal';
import { NotaryLogin } from './components/auth/NotaryLogin';
import type { Language } from './i18n/translations';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<NotaryProfile | null>(() => StorageService.getSessionUser());
  const [acts, setActs] = useState<NotarialAct[]>(() => StorageService.getActs());
  const [profile, setProfile] = useState<NotaryProfile>(() => currentUser || StorageService.getProfile());
  const [activeTab, setActiveTab] = useState<'desk' | 'register' | 'drafter' | 'certificate' | 'settings' | 'verify'>('desk');
  const [selectedAct, setSelectedAct] = useState<NotarialAct>(() => acts[0]);
  const [verifyModalAct, setVerifyModalAct] = useState<NotarialAct | null>(null);
  const [lang, setLang] = useState<Language>(() => StorageService.getLanguage());

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
  };

  const handleLogout = () => {
    StorageService.clearSession();
    setCurrentUser(null);
  };

  // Sync state if acts update
  const refreshActs = () => {
    const updated = StorageService.getActs();
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
