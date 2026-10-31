'use client';

import { MdMathViewer, TextLangEdit } from 'components';
import { useUserStore } from 'hooks';
import { ProfileSetting, TextLanguageType } from 'types';

interface ProblemStatementProps {
  editorial: TextLanguageType,
  setEditorial?: (editorial: TextLanguageType) => void,
}

export const hasEditorial = (editorial?: TextLanguageType) => (
  Object.values(editorial ?? {}).some(text => !!text?.trim())
);

export const ProblemEditorial = ({ editorial, setEditorial }: ProblemStatementProps) => {

  const userPreferredLanguage = useUserStore(state => state.user.settings?.[ProfileSetting.LANGUAGE]);

  if (setEditorial) {
    return (
      <TextLangEdit
        text={editorial}
        setText={(description) => setEditorial(description)}
      />
    );
  }

  // the user's language first, only if it is blank fall back to the other language
  const source = editorial?.[userPreferredLanguage]?.trim()
    ? editorial[userPreferredLanguage]
    : Object.values(editorial ?? {}).find(text => !!text?.trim()) ?? '';

  return <MdMathViewer source={source} />;
};
