'use client';

import { CodeEditor, Input, Select, T, TabsInline } from 'components';
import { useState, useUIStore } from 'hooks';
import { type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { CodeLanguage, Language, UpsertProblemUIDTO } from 'types';
import { ProblemStatementMd } from './ProblemStatementMd';
import { ProblemStatementPdf } from './ProblemStatementPdf';

interface ProblemStatementProps {
  problem: UpsertProblemUIDTO,
  setProblem: Dispatch<SetStateAction<UpsertProblemUIDTO>>,
}

export const ProblemStatement = ({ problem, setProblem }: ProblemStatementProps) => {
  
  const { judgeKey, statement, judgeIsExternal } = problem;
  
  const [ language, setLanguage ] = useState<Language>(Language.ES);
  const [ type, setType ] = useState<'md' | 'html' | 'pdf'>(judgeIsExternal ? 'html' : 'md');
  const { Image } = useUIStore(store => store.components);
  
  const tabs = {
    [Language.ES]: {
      key: Language.ES,
      header: (
        <div className="jk-row nowrap jk-pg-xsm-tb">Español&nbsp;
          <Image
            alt="ES image"
            src="https://images.juki.pub/assets/image-es.png"
            width={50}
            height={24}
          />
        </div>
      ),
    },
    [Language.EN]: {
      key: Language.EN,
      header: (
        <div className="jk-row nowrap jk-pg-xsm-tb">English&nbsp;
          <Image
            alt="US image"
            src="https://images.juki.pub/assets/image-us.png"
            width={50}
            height={24}
          />
        </div>
      ),
    },
  };
  
  return (
    <div className="jk-col extend top stretch gap nowrap">
      <div className="jk-br-ie bc-we jk-row left jk-pg-sm">
        <Input
          value={problem.shortname}
          label={<T className="tt-se">shortname</T>}
          labelPlacement="left"
          onChange={value => setProblem(prevState => ({
            ...prevState,
            shortname: value,
          }))}
        />
      </div>
      <div className="jk-row">
        <TabsInline<Language>
          tabs={tabs}
          tickStyle="background"
          onChange={(language) => setLanguage(language)}
          selectedTabKey={language}
          extraNodes={[
            <Select<'md' | 'html' | 'pdf', ReactNode, ReactNode>
              key="selector"
              options={judgeIsExternal
                ? [
                  { value: 'html', label: <T>HTML</T> },
                  { value: 'pdf', label: <T>PDF</T> },
                ]
                : [
                  { value: 'md', label: <T>Markdown</T> },
                  { value: 'pdf', label: <T>PDF</T> },
                ]
              }
              selectedOption={{ value: type }}
              onChange={({ value }) => {
                setType(value);
              }}
            />,
          ]}
        />
      </div>
      {type === 'md'
        ? <ProblemStatementMd setProblem={setProblem} problem={problem} language={language} />
        : type === 'html'
          ? (
            <div className="wh-100 jk-row gap nowrap top" style={{ minHeight: 240 }}>
              <div style={{ width: '50%' }} className="ht-100">
                <CodeEditor
                  language={CodeLanguage.HTML}
                  source={statement.html[language]}
                  onChange={({ source }) => setProblem(prevState => ({
                    ...prevState,
                    statement: {
                      ...prevState.statement,
                      html: { ...prevState.statement.html, [language]: source },
                    },
                  }))}
                />
              </div>
              <div className="jk-row extend top" style={{ width: '50%' }}>
                <div
                  className="jk-row extend top gap nowrap stretch left"
                  style={{ position: 'relative' }}
                >
                  <div
                    className={`${judgeKey}-statement`}
                    dangerouslySetInnerHTML={{ __html: statement.html[language] }}
                  />
                </div>
              </div>
            </div>
          )
          : type === 'pdf' && (
          <ProblemStatementPdf problem={problem} language={language} setProblem={setProblem} />
        )}
    </div>
  );
};
