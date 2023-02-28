import { MdMathViewer, TextLangEdit } from 'components';
import { useJukiUser } from 'hooks';
import React from 'react';
import { ProfileSetting, TextLanguageType } from 'types';

interface ProblemStatementProps {
  editorial: TextLanguageType,
  setEditorial?: (editorial: TextLanguageType) => void,
}

export const ProblemEditorial = ({ editorial, setEditorial }: ProblemStatementProps) => {
  
  const { user: { settings: { [ProfileSetting.LANGUAGE]: preferredLanguage } } } = useJukiUser();
  
  return setEditorial ? (
    <TextLangEdit
      text={editorial}
      setText={(description) => setEditorial(description)}
    />
  ) : <MdMathViewer source={editorial?.[preferredLanguage]} />;
};
