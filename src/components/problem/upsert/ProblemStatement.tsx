'use client';

import { Button, CodeEditor, RedoIcon, Select, T, TabsInline, UndoIcon } from 'components';
import { useMultiDeepHistory, useState, useUIStore } from 'hooks';
import { type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { CodeLanguage, Language, UpsertProblemUIDTO } from 'types';
import { ProblemStatementAiRedactorChat } from './ProblemStatementAiRedactorChat';
import { ProblemStatementMd } from './ProblemStatementMd';
import { ProblemStatementPdf } from './ProblemStatementPdf';

interface ProblemStatementProps {
  problem: UpsertProblemUIDTO,
  setProblem: Dispatch<SetStateAction<UpsertProblemUIDTO>>,
}

const paths = [ 'statement' ];

export const ProblemStatement = ({ problem, setProblem }: ProblemStatementProps) => {
  
  const { judgeKey, statement, judgeIsExternal } = problem;
  
  const [ language, setLanguage ] = useState<Language>(Language.ES);
  const [ type, setType ] = useState<'md' | 'html' | 'pdf'>(judgeIsExternal ? 'html' : 'md');
  const { Image } = useUIStore(store => store.components);
  
  const tabs = {
    [Language.ES]: {
      key: Language.ES,
      header: (
        <div className="jk-row nowrap">Español&nbsp;
          <Image
            alt="ES image"
            src="https://images.juki.pub/assets/image-es.png"
            width={24}
            height={18}
          />
        </div>
      ),
    },
    [Language.EN]: {
      key: Language.EN,
      header: (
        <div className="jk-row nowrap">English&nbsp;
          <Image
            alt="US image"
            src="https://images.juki.pub/assets/image-us.png"
            width={24}
            height={18}
          />
        </div>
      ),
    },
  };
  
  const {
    undo,
    canUndo,
    redo,
    canRedo,
    recordHistory,
  } = useMultiDeepHistory(problem as unknown as Record<string, unknown>, setProblem as unknown as Dispatch<SetStateAction<Record<string, unknown>>>, paths, 64);
  
  return (
    <div className="jk-row gap nowrap top" style={{ position: 'sticky', top: 0 }}>
      <div className="flex-1 jk-col top stretch gap nowrap">
        <div className="jk-row">
          <TabsInline<Language>
            tabs={tabs}
            tickStyle="background"
            onChange={(language) => setLanguage(language)}
            selectedTabKey={language}
            extraNodes={[
              <div key="history" className="jk-row nowrap gap br-hl jk-pg-xsm jk-br-ie">
                <Button icon={<UndoIcon />} tooltipContent="undo" onClick={undo} size="tiny" disabled={!canUndo} />
                <T className="tx-s">history</T>
                <Button icon={<RedoIcon />} tooltipContent="redo" onClick={redo} size="tiny" disabled={!canRedo} />
              </div>,
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
          ? (
            <ProblemStatementMd
              setProblem={setProblem}
              problem={problem}
              recordHistory={recordHistory}
              language={language}
            />
          ) : type === 'html'
            ? (
              <div className="wh-100 jk-row gap nowrap top" style={{ minHeight: 240 }}>
                <div style={{ width: '50%' }} className="ht-100">
                  <CodeEditor
                    language={CodeLanguage.HTML}
                    source={statement.html[language]}
                    onChange={({ source }) => {
                      recordHistory();
                      setProblem(prevState => ({
                        ...prevState,
                        statement: {
                          ...prevState.statement,
                          html: { ...prevState.statement.html, [language]: source },
                        },
                      }));
                    }}
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
      {(type === 'md' || type === 'html') && (
        <ProblemStatementAiRedactorChat
          statement={{
            description: type === 'html' ? problem.statement.html[language] : problem.statement.description[language],
            input: type === 'html' ? '' : problem.statement.input[language],
            output: type === 'html' ? '' : problem.statement.output[language],
            note: type === 'html' ? '' : problem.statement.note[language],
            sampleCases: problem.statement.sampleCases,
          }}
          recordHistory={recordHistory}
          setStatement={statement => {
            setProblem(prevState => ({
              ...prevState,
              statement: {
                ...prevState.statement,
                description: { ...prevState.statement.description, [language]: statement.description },
                input: { ...prevState.statement.description, [language]: statement.input },
                output: { ...prevState.statement.description, [language]: statement.output },
                sampleCases: statement.sampleCases,
                note: { ...prevState.statement.note, [language]: statement.note },
              },
            }));
          }}
        />
      )}
    </div>
  );
};
