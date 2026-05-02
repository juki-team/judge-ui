'use client';

import { TextLangEdit } from 'components';
import { MdMathViewer, useUserStore } from '@juki-team/base-ui';
import { ProfileSetting } from '@juki-team/commons/enums';
import { type TextLanguage } from '@juki-team/commons/types';

interface ProblemStatementProps {
  editorial: TextLanguage,
  setEditorial?: (editorial: TextLanguage) => void,
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
