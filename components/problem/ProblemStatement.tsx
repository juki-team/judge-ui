import {
  ButtonLoader,
  DownloadIcon,
  FlagEnImage,
  FlagEsImage,
  FloatToolbar,
  MdMathEditor,
  MdMathViewer,
  PlusIcon,
  T,
  TabsInline,
} from 'components';
import { classNames, downloadBlobAsFile, downloadJukiMarkdownAsPdf, getStatementData } from 'helpers';
import { useJukiUI, useJukiUser, useT } from 'hooks';
import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  EditCreateProblemType,
  Judge,
  Language,
  ProblemResponseDTO,
  ProblemScoringMode,
  ProfileSetting,
  Status,
} from 'types';
import { ProblemLetter } from './ProblemLetter';
import { JukiProblemInfo } from './ProblemView/ProblemInfo';
import { SampleTest } from './SampleTest';

interface ProblemStatementProps {
  problem: ProblemResponseDTO,
  setProblem?: Dispatch<SetStateAction<EditCreateProblemType>>,
  contest?: { index: string, color: string },
}

export const ProblemStatement = ({ problem, setProblem, contest }: ProblemStatementProps) => {
  
  const { judge, key: problemKey, name, settings, tags, author, status, statement } = problem;
  const editing = !!setProblem;
  const { viewPortSize } = useJukiUI();
  const {
    user: {
      settings: {
        [ProfileSetting.LANGUAGE]: preferredLanguage,
        [ProfileSetting.THEME]: preferredTheme,
      },
    },
  } = useJukiUser();
  const { t } = useT();
  const problemName = contest?.index ? `(${t('problem')} ${contest?.index}) ${name}` : `(${t('id')} ${problemKey}) ${name}`;
  const {
    statementDescription,
    statementInput,
    statementOutput,
    statementNote,
    mdStatement,
  } = getStatementData(t, { statement, settings }, preferredLanguage, problemName);
  const [ language, setLanguage ] = useState<Language>(Language.EN);
  
  if ([ Judge.CODEFORCES, Judge.JV_UMSA, Judge.CODEFORCES_GYM ].includes(judge)) {
    return (
      <div className="jk-row extend top" style={{ overflow: 'auto', height: '100%', width: '100%' }}>
        <div
          className="jk-row extend top gap nowrap stretch left"
          style={{ position: 'relative' }}
        >
          {contest && (
            <ProblemLetter
              index={contest.index}
              color={contest.color}
              style={{ position: 'absolute', top: 'var(--pad-m)', left: 'var(--pad-m)' }}
            />
          )}
          <div
            className={`${judge}-statement`}
            dangerouslySetInnerHTML={{ __html: statement.html[Language.EN] || statement.html[Language.ES] }}
          />
        </div>
      </div>
    );
  }
  
  const handleDownloadPdf = () => {
    return downloadJukiMarkdownAsPdf(mdStatement, preferredTheme, `Juki Judge ${problemName}.pdf`);
  };
  
  const handleDownloadMd = async () => {
    downloadBlobAsFile(new Blob([ mdStatement ], { type: 'text/plain' }), `Juki Judge ${problemName}.md`);
  };
  
  const tabs = {
    [Language.EN]: {
      key: Language.EN,
      header: (
        <div className="jk-row nowrap">English <div style={{ width: 50, height: 24 }}><FlagEnImage /></div></div>
      ),
    },
    [Language.ES]: {
      key: Language.ES,
      header: (
        <div className="jk-row nowrap">Español <div style={{ width: 50, height: 24 }}><FlagEsImage /></div></div>
      ),
    },
  };
  
  const isSmall = viewPortSize === 'sm';
  
  return (
    <div className="jk-row extend top">
      <div className="jk-row extend top gap nowrap stretch left">
        <div className={classNames('jk-col top stretch flex-3', { editing })}>
          {!editing && isSmall && (
            <FloatToolbar
              actionButtons={[
                {
                  icon: <DownloadIcon />,
                  buttons: [
                    {
                      icon: <DownloadIcon />,
                      label: <T>pdf</T>,
                      onClick: handleDownloadPdf,
                    },
                    {
                      icon: <DownloadIcon />,
                      label: <T>md</T>,
                      onClick: handleDownloadMd,
                    },
                  ],
                },
              ]}
            />
          )}
          {editing && (
            <div className="jk-col">
              <div className="jk-row">
                <TabsInline<Language>
                  tabs={tabs}
                  onChange={(language) => setLanguage(language)}
                  selectedTabKey={language}
                />
              </div>
            </div>
          )}
          <div>
            <h3><T>description</T></h3>
            {editing ? (
              <div className="text-edit">
                <MdMathEditor
                  informationButton
                  uploadImageButton
                  source={statement.description?.[language]}
                  onChange={value => setProblem(prevState => ({
                    ...prevState,
                    statement: {
                      ...prevState.statement,
                      description: { ...statement.description, [language]: value },
                    },
                  }))}
                />
              </div>
            ) : (
              <div className="bc-we jk-pg-sm jk-br-ie">
                <MdMathViewer source={statementDescription} />
              </div>
            )}
          </div>
          <div>
            {(editing || !!statementInput) && <h3><T>input</T></h3>}
            {editing ? (
              <div className="text-edit">
                <MdMathEditor
                  informationButton
                  uploadImageButton
                  source={statement.input?.[language]}
                  onChange={value => setProblem(prevState => ({
                    ...prevState,
                    statement: {
                      ...statement,
                      input: { ...statement.input, [language]: value },
                    },
                  }))}
                />
              </div>
            ) : !!statementInput
              ? <div className="bc-we jk-pg-sm jk-br-ie">
                <MdMathViewer source={statementInput} />
              </div>
              : null}
          </div>
          <div>
            {(editing || !!statementOutput) && <h3><T>output</T></h3>}
            {editing ? (
              <div className="text-edit">
                <MdMathEditor
                  informationButton
                  uploadImageButton
                  source={statement.output?.[language]}
                  onChange={value => setProblem(prevState => ({
                    ...prevState,
                    statement: {
                      ...statement,
                      output: { ...statement.output, [language]: value },
                    },
                  }))}
                />
              </div>
            ) : statementOutput
              ? <div className="bc-we jk-pg-sm jk-br-ie">
                <MdMathViewer source={statementOutput} />
              </div>
              : null}
          </div>
          {settings.mode === ProblemScoringMode.SUBTASK && (
            <div>
              <h3><T>subtasks description</T></h3>
              <div className="jk-col left stretch gap">
                {Object.values(settings.pointsByGroups).map(pointsByGroup => (
                  <div className="jk-row extend gap" key={pointsByGroup.group}>
                    {editing && pointsByGroup.group !== 0 ? (
                      <>
                        <div className="jk-col fw-bd cr-pd" style={{ width: 100 }}>
                          <div className="tx-l"><T className="tt-se">subtask</T> {pointsByGroup.group}</div>
                          <div>
                            {pointsByGroup.points}&nbsp;
                            {pointsByGroup.points === 1 ? <T className="tt-se">point</T> :
                              <T className="tt-se">points</T>}
                          </div>
                        </div>
                        :
                        <div className="flex-1 text-edit-small">
                          <MdMathEditor
                            informationButton
                            uploadImageButton
                            source={pointsByGroup.description?.[language]}
                            onChange={value => setProblem(prevState => ({
                              ...prevState,
                              settings: {
                                ...prevState.settings,
                                pointsByGroups: {
                                  ...prevState.settings.pointsByGroups,
                                  [pointsByGroup.group]: {
                                    ...prevState.settings.pointsByGroups[pointsByGroup.group],
                                    description: {
                                      ...prevState.settings.pointsByGroups[pointsByGroup.group]?.description,
                                      [language]: value,
                                    },
                                  },
                                },
                              },
                            }))}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 bc-we jk-pg-sm jk-br-ie">
                        <div className="fw-bd cr-pd">
                          <T className="tt-se">subtask</T> {pointsByGroup.group}
                          &nbsp;({pointsByGroup.points}&nbsp;
                          {pointsByGroup.points === 1
                            ? <T className="tt-se">point</T>
                            : <T className="tt-se">points</T>})
                        </div>
                        <MdMathViewer
                          source={pointsByGroup.description?.[preferredLanguage] || pointsByGroup.description?.[Language.EN] || pointsByGroup.description?.[Language.ES]}
                        />
                      </div>
                    )}
                  </div>
                ))}
                <div></div>
              </div>
            </div>
          )}
          <div className="jk-row stretch gap">
            <div className="jk-row stretch gap nowrap flex-1 jk-pg-sm-tb">
              {/*<h3><T>output sample</T></h3>*/}
              <div className="jk-row"><T className="tt-se tx-h cr-pd fw-bd">input sample</T></div>
              <div className="jk-row"><T className="tt-se tx-h cr-pd fw-bd">output sample</T></div>
            </div>
            {editing && (
              <div className="jk-row">
                <PlusIcon
                  className="cr-py"
                  filledCircle
                  onClick={() => setProblem(prevState => ({
                    ...prevState,
                    statement: {
                      ...statement,
                      sampleCases: [ ...statement.sampleCases, { input: '', output: '' } ],
                    },
                  }))}
                />
              </div>
            )}
          </div>
          <div className="jk-col stretch gap">
            {(statement.sampleCases || [ { input: '', output: '' } ]).map((sample, index) => (
              <SampleTest
                index={index}
                sampleCases={statement.sampleCases}
                key={index}
                setSampleCases={setProblem ? (sampleCases) => setProblem(prevState => ({
                  ...prevState,
                  statement: { ...statement, sampleCases },
                })) : undefined}
              />
            ))}
          </div>
          <div>
            {editing ? (
              <>
                <h3><T>note</T></h3>
                <div className="text-edit">
                  <MdMathEditor
                    informationButton
                    uploadImageButton
                    source={statement.note?.[language]}
                    onChange={value => setProblem(prevState => ({
                      ...prevState,
                      statement: {
                        ...statement,
                        note: { ...statement.note, [language]: value },
                      },
                    }))}
                  />
                </div>
              </>
            ) : !!statementNote
              ? <>
                <h3><T>note</T></h3>
                <div className="br-g6 bc-we jk-pg-md jk-border-radius-inline">
                  <MdMathViewer source={statementNote} />
                </div>
              </>
              : null}
          </div>
        </div>
        {!contest && !editing && (
          <div className="screen md lg hg flex-1">
            <JukiProblemInfo
              settings={settings}
              status={status}
              tags={tags}
              author={author}
              expand
            >
              <ButtonLoader
                size="small"
                icon={<DownloadIcon />}
                onClick={async (setLoaderStatus) => {
                  setLoaderStatus(Status.LOADING);
                  try {
                    await handleDownloadPdf();
                    setLoaderStatus(Status.SUCCESS);
                  } catch (error) {
                    setLoaderStatus(Status.ERROR);
                  }
                }}
              >
                <T>download as pdf</T>
              </ButtonLoader>
              <ButtonLoader
                size="small"
                icon={<DownloadIcon />}
                onClick={async (setLoaderStatus) => {
                  setLoaderStatus(Status.LOADING);
                  try {
                    await handleDownloadMd();
                    setLoaderStatus(Status.SUCCESS);
                  } catch (error) {
                    setLoaderStatus(Status.ERROR);
                  }
                }}
              >
                <T>download as md</T>
              </ButtonLoader>
            </JukiProblemInfo>
          </div>
        )}
      </div>
    </div>
  );
};
