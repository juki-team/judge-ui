import { MdMathViewer, TextLangEdit } from 'components';
import { classNames } from 'helpers';
import { useJukiBase } from 'hooks';
import { useRouter } from 'next/router';
import React from 'react';
import { TextLanguageType } from 'types';

interface ProblemStatementProps {
  editorial: TextLanguageType,
  setEditorial?: (editorial: TextLanguageType) => void,
}

export const ProblemEditorial = ({ editorial, setEditorial }: ProblemStatementProps) => {
  
  const { query: { key, index, tab, ...query } } = useRouter();
  const { user: { settings: { preferredLanguage } } } = useJukiBase();
  
  return (
    <div className="problem-statement-layout">
      <div className="jk-row nowrap stretch left problem-content">
        <div className={classNames('problem-statement', { 'editing': !!setEditorial })}>
          {setEditorial ? (
            <TextLangEdit
              text={editorial}
              setText={(description) => setEditorial(description)}
            />
          ) : <MdMathViewer source={editorial?.[preferredLanguage]} />}
        </div>
      </div>
    </div>
  );
};
