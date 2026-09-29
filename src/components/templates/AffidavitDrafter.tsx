import React from 'react';
import type { NotarialAct, NotaryProfile } from '../../types/notary';
import type { Language } from '../../i18n/translations';
import { NotaryDocumentEditor } from '../editor/NotaryDocumentEditor';

interface AffidavitDrafterProps {
  acts: NotarialAct[];
  profile: NotaryProfile;
  lang?: Language;
}

export const AffidavitDrafter: React.FC<AffidavitDrafterProps> = ({ acts, profile, lang = 'en' }) => {
  return <NotaryDocumentEditor acts={acts} profile={profile} lang={lang} />;
};
