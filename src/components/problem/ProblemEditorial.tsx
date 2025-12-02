'use client';

import { MdMathViewer, TextLangEdit } from 'components';
import { useUserStore } from 'hooks';
import { ProfileSetting, TextLanguageType } from 'types';

interface ProblemStatementProps {
  editorial: TextLanguageType,
  setEditorial?: (editorial: TextLanguageType) => void,
}

export const ProblemEditorial = ({ editorial, setEditorial }: ProblemStatementProps) => {
  
  const userPreferredLanguage = useUserStore(state => state.user.settings?.[ProfileSetting.LANGUAGE]);
  
  return setEditorial ? (
    <TextLangEdit
      text={editorial}
      setText={(description) => setEditorial(description)}
    />
  ) : <MdMathViewer source={editorial?.[userPreferredLanguage]} />;
};
