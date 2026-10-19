import React, { useState, useEffect } from 'react';
import type { NotarialAct, NotaryProfile, NotaryAccount } from './types/notary';
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
import { AdminChamberConsole } from './components/admin/AdminChamberConsole';
import { Printer, FileText, Eye } from 'lucide-react';
import type { Language } from './i18n/translations';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<NotaryProfile | null>(() => StorageService.getSessionUser());
  const [currentAccount, setCurrentAccount] = useState<NotaryAccount | null>(() => StorageService.getSessionAccount());
  const [profile, setProfile] = useState<NotaryProfile>(() => currentUser || StorageService.getProfile());
  const [acts, setActs] = useState<NotarialAct[]>(() => StorageService.getActs(currentUser || undefined));
  const [activeTab, setActiveTab] = useState<'desk' | 'register' | 'drafter' | 'certificate' | 'settings' | 'verify'>('desk');
  const [selectedAct, setSelectedAct] = useState<NotarialAct | null>(() => (acts.length > 0 ? acts[0] : null));
  const [verifyModalAct, setVerifyModalAct] = useState<NotarialAct | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [showAdminConsole, setShowAdminConsole] = useState<boolean>(false);
  const [lang, setLang] = useState<Language>(() => StorageService.getLanguage());

  // Public QR Code Verification Landing State
  const [publicVerifyRecord, setPublicVerifyRecord] = useState<{
    act: NotarialAct;
    profile: NotaryProfile;
  } | null>(null);

  useEffect(() => {
    // Purge legacy sample/demo acts and drafts
    StorageService.purgeDemoData();

    // One-time factory purge of all user data across all chambers
    const WIPE_FLAG = 'notary_user_data_wiped_v2';
    if (!localStorage.getItem(WIPE_FLAG)) {
      StorageService.wipeAllUserData().then(() => {
        localStorage.setItem(WIPE_FLAG, 'true');
        setActs([]);
      });
    }

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
    const acc = StorageService.getSessionAccount();
    setCurrentAccount(acc);
    const updatedActs = StorageService.getActs(loggedProfile);
    setActs(updatedActs);
    setSelectedAct(updatedActs.length > 0 ? updatedActs[0] : null);
  };

  const handleLogout = () => {
    StorageService.clearSession();
    setCurrentUser(null);
    setCurrentAccount(null);
    setShowAdminConsole(false);
    const defaultActs = StorageService.getActs();
    setActs(defaultActs);
    setSelectedAct(defaultActs.length > 0 ? defaultActs[0] : null);
  };

  const handleSwitchToChamber = (targetProfile: NotaryProfile) => {
    setProfile(targetProfile);
    const updatedActs = StorageService.getActs(targetProfile);
    setActs(updatedActs);
    setSelectedAct(updatedActs.length > 0 ? updatedActs[0] : null);
    setActiveTab('desk');
    setShowAdminConsole(false);
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

  // If not logged in, show the executive Notary Login screen
  if (!currentUser) {
    return (
      <NotaryLogin
        onLogin={handleLogin}
        lang={lang}
        onChangeLang={handleChangeLang}
      />
    );
  }

  const isMasterAdmin = currentAccount?.role === 'admin' || StorageService.isMasterAdmin();

  return (
    <div className="app-container">
      {/* Navbar with Brand, Language Switcher, Admin Console & Hardware Status */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'verify') {
            setVerifyModalAct(selectedAct || (acts.length > 0 ? acts[0] : null));
            setShowVerifyModal(true);
          } else if (tab === 'certificate') {
            if (!selectedAct && acts.length > 0) {
              setSelectedAct(acts[0]);
            }
            setActiveTab('certificate');
          } else {
            setActiveTab(tab);
          }
        }}
        profile={profile}
        lang={lang}
        onChangeLang={handleChangeLang}
        onToggleLang={handleToggleLang}
        onLogout={handleLogout}
        isAdmin={isMasterAdmin}
        onOpenAdmin={() => setShowAdminConsole(true)}
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

        {activeTab === 'certificate' && (
          selectedAct || acts.length > 0 ? (
            <NotaryCertificate
              act={selectedAct || acts[0]}
              profile={profile}
              lang={lang}
              onToggleLang={handleToggleLang}
              onBack={() => setActiveTab('desk')}
              availableActs={acts}
              onSelectAct={(act) => setSelectedAct(act)}
              onOpenVerification={(act, prof) => setPublicVerifyRecord({ act, profile: prof })}
            />
          ) : (
            <div style={{ maxWidth: '820px', margin: '3rem auto', padding: '1.5rem' }}>
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
                  padding: '3rem 2.5rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#FEF2F2',
                    border: '2px solid #FECACA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto',
                    color: '#B91C1C',
                  }}
                >
                  <Printer size={32} />
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                  {lang === 'mr' ? 'प्रमाणपत्र पूर्वावलोकन' : lang === 'hi' ? 'प्रमाणपत्र पूर्वावलोकन' : 'Certificate Preview'}
                </h2>

                <p style={{ color: '#64748B', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto 1.75rem auto', lineHeight: 1.6 }}>
                  {lang === 'mr'
                    ? 'या चेंबर नोंदवहीत अद्याप कोणतीही नोंद केलेली नाही. आपण प्रत्यक्ष नोंद तयार करू शकता किंवा आपल्या चेंबरच्या अधिकृत तपशीलांसह नमुना प्रमाणपत्र तपासू शकता.'
                    : lang === 'hi'
                    ? 'इस चैंबर रजिस्टर में अभी कोई प्रविष्टि दर्ज नहीं है। आप सीधे नई प्रविष्टि दर्ज कर सकते हैं या अपने चैंबर क्रेडेंशियल्स के साथ नमूना प्रमाणपत्र देख सकते हैं।'
                    : 'No notarial acts have been issued in this chamber yet. You can create a new entry on the Notary Desk, or generate an instant sample preview using your active chamber credentials.'}
                </p>

                <div
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '0.85rem 1.25rem',
                    maxWidth: '520px',
                    margin: '0 auto 2rem auto',
                    fontSize: '0.82rem',
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{profile.notaryName}</span>
                  <span style={{ color: '#94A3B8' }}>•</span>
                  <span>{profile.regNo}</span>
                  {profile.areaOfPractice && (
                    <>
                      <span style={{ color: '#94A3B8' }}>•</span>
                      <span>{profile.areaOfPractice}</span>
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setActiveTab('desk')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0.75rem 1.5rem',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                    }}
                  >
                    <FileText size={18} />
                    <span>{lang === 'mr' ? 'नवीन नोंदणी करा (New Entry)' : lang === 'hi' ? 'नई प्रविष्टि करें (New Entry)' : 'Create New Notary Entry'}</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedAct(StorageService.createSamplePreviewAct(profile))}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0.75rem 1.5rem',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                    }}
                  >
                    <Eye size={18} />
                    <span>{lang === 'mr' ? 'नमुना प्रमाणपत्र पहा (Sample Preview)' : lang === 'hi' ? 'नमूना प्रमाणपत्र देखें (Sample Preview)' : 'View Sample Certificate'}</span>
                  </button>
                </div>
              </div>
            </div>
          )
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
      {showVerifyModal && (
        <PublicVerifyModal
          act={verifyModalAct}
          profile={profile}
          lang={lang}
          onClose={() => setShowVerifyModal(false)}
          onOpenFullVerification={(act, prof) => {
            setShowVerifyModal(false);
            setPublicVerifyRecord({ act, profile: prof });
          }}
        />
      )}

      {/* Super Admin Chamber & Storage Console */}
      {showAdminConsole && currentAccount && (
        <AdminChamberConsole
          currentAccount={currentAccount}
          onSwitchToChamber={handleSwitchToChamber}
          onClose={() => setShowAdminConsole(false)}
        />
      )}
    </div>
  );
};

export default App;
