'use client';

import {
  Button,
  ButtonLoader,
  CheckIcon,
  CloudDownloadIcon,
  CloudUploadIcon,
  CodeViewer,
  DeleteIcon,
  DraftIcon,
  ErrorIcon,
  FetcherLayer,
  Input,
  LoadingIcon,
  Modal,
  MultiSelect,
  RefreshIcon,
  SaveIcon,
  T,
  VisibilityIcon,
} from 'components';
import { jukiGlobalStore } from 'config';
import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, classNames, cleanRequest, downloadUrlAsFile, humanFileSize } from 'helpers';
import { useEffect, useJukiNotification, useMutate, useState } from 'hooks';
import { ReactNode } from 'react';
import {
  ButtonLoaderOnClickType,
  ContentResponseType,
  ContentsResponseType,
  HTTPMethod,
  KeyFileType,
  ProblemScoringMode,
  ProblemTestCasesResponseDTO,
  ProgrammingLanguage,
  Status,
  UpsertProblemUIDTO,
} from 'types';
// import Custom404 from '../../../pages/404';
import { TwoActionModal } from '../index';

enum UploadState {
  NO_FILE = 'NO_FILE',
  NO_SAVED = 'NO_SAVED',
  UPLOADING = 'UPLOADING',
  ERROR_ON_UPLOAD = 'ERROR_ON_UPLOAD',
  SAVED = 'SAVED',
}

type NewTestCaseType = {
  groups: number[],
  testCaseKey: string,
  inputFileSize: number,
  inputFileLastModified: Date,
  outputFileSize: number,
  outputFileLastModified: Date,
  
  inputNewFile: File | null,
  inputNewFileState: UploadState,
  outputNewFile: File | null,
  outputNewFileState: UploadState,
};

const transform = (problemTestCases: ProblemTestCasesResponseDTO) => {
  const initialTestCases: { [key: string]: NewTestCaseType } = {};
  problemTestCases.forEach(testCase => {
    initialTestCases[testCase.testCaseKey] = {
      testCaseKey: testCase.testCaseKey,
      groups: testCase.groups || [],
      inputFileSize: testCase.inputFileSize,
      inputFileLastModified: testCase.inputFileLastModified,
      inputNewFile: null,
      inputNewFileState: UploadState.NO_FILE,
      outputFileSize: testCase.outputFileSize,
      outputFileLastModified: testCase.outputFileLastModified,
      outputNewFile: null,
      outputNewFileState: UploadState.NO_FILE,
    };
  });
  return initialTestCases;
};

interface ProblemTestCasesPageProps {
  problem: UpsertProblemUIDTO,
  testCases: ProblemTestCasesResponseDTO,
  problemJudgeKey: string,
}

const ProblemTestCasesPage = ({ problem, testCases: problemTestCases, problemJudgeKey }: ProblemTestCasesPageProps) => {
  
  const [ testCases, setTestCases ] = useState<{ [key: string]: NewTestCaseType }>(transform(problemTestCases));
  const [ newGroups, setNewGroups ] = useState([ 1 ]);
  const [ lock, setLock ] = useState(false);
  useEffect(() => {
    setTestCases(transform(problemTestCases));
  }, [ problemTestCases ]);
  const { notifyResponse } = useJukiNotification();
  const mutate = useMutate();
  const [ modal, setModal ] = useState<ReactNode>(null);
  const { t } = jukiGlobalStore.getI18n();
  
  const handleServerDelete = (testCaseKey: string, keyFile: KeyFileType): ButtonLoaderOnClickType => async (setLoaderStatus) => {
    setLock(true);
    setLoaderStatus(Status.LOADING);
    const response = cleanRequest<ContentsResponseType<{}>>(
      await authorizedRequest(JUDGE_API_V1.PROBLEM.TEST_CASE_KEY_FILE(problemJudgeKey, testCaseKey, keyFile), {
        method: HTTPMethod.DELETE,
      }));
    await mutate(new RegExp(JUDGE_API_V1.PROBLEM.TEST_CASES(problemJudgeKey)));
    notifyResponse(response, setLoaderStatus);
    setLock(false);
  };
  
  const handleDelete = (testCase: NewTestCaseType, keyFile: KeyFileType) => () => {
    const newTestCases = { ...testCases };
    newTestCases[testCase.testCaseKey] = { ...newTestCases[testCase.testCaseKey], [keyFile + 'NewFile']: null };
    if (!newTestCases[testCase.testCaseKey].inputNewFile && !newTestCases[testCase.testCaseKey].outputNewFile && newTestCases[testCase.testCaseKey].inputFileSize === -1 && newTestCases[testCase.testCaseKey].outputFileSize === -1) {
      delete newTestCases[testCase.testCaseKey];
    }
    setTestCases(newTestCases);
  };
  
  const handleInputOutputFiles = (keyFile: KeyFileType) => (fileList: FileList) => {
    const newTestCases: { [key: string]: NewTestCaseType } = { ...testCases };
    for (const file of Array.from(fileList)) {
      const testCaseKey = file.name.replace(/\.[^/.]+$/, '');
      newTestCases[testCaseKey] = {
        inputNewFileState: newTestCases[testCaseKey]?.inputNewFileState || UploadState.NO_FILE,
        outputNewFileState: newTestCases[testCaseKey]?.outputNewFileState || UploadState.NO_FILE,
        inputFileSize: newTestCases[testCaseKey]?.inputFileSize || -1,
        outputFileSize: newTestCases[testCaseKey]?.outputFileSize || -1,
        outputNewFile: newTestCases[testCaseKey]?.outputNewFile || null,
        inputNewFile: newTestCases[testCaseKey]?.inputNewFile || null,
        testCaseKey,
        groups: problem.settings.scoringMode === ProblemScoringMode.SUBTASK ? (newTestCases[testCaseKey]?.groups || newGroups) : [ 1 ],
      } as NewTestCaseType;
      newTestCases[testCaseKey][(keyFile + 'NewFile') as 'outputNewFile'] = file;
      newTestCases[testCaseKey][(keyFile + 'NewFileState') as 'outputNewFileState'] = UploadState.NO_SAVED;
    }
    setTestCases(newTestCases);
  };
  
  const groupsOptions = Object.values(problem.settings.pointsByGroups)
    .map(group => ({ value: group.group, label: group.group + '' }));
  
  const handleUpload = async (testCase: NewTestCaseType, body: {}, keyFile: KeyFileType) => {
  
  };
  
  return (
    <div className="jk-col gap nowrap stretch">
      <div className="jk-row gap block bc-we jk-pg-sm jk-br-ie">
        <ButtonLoader
          size="small"
          disabled={lock}
          type="light"
          icon={<RefreshIcon />}
          onClick={async (setLoaderStatus) => {
            setLock(true);
            setLoaderStatus(Status.LOADING);
            await mutate(new RegExp(JUDGE_API_V1.PROBLEM.TEST_CASES(problemJudgeKey)));
            setLoaderStatus(Status.SUCCESS);
            setLock(false);
          }}
        >
          <T>reload test cases</T> (<T>the changes will be lost</T>)
        </ButtonLoader>
        <ButtonLoader
          size="small"
          disabled={lock}
          type="light"
          icon={<CloudDownloadIcon />}
          onClick={async (setLoaderStatus) => {
            setLoaderStatus(Status.LOADING);
            const response = cleanRequest<ContentResponseType<{ urlExportedZip: string }>>(
              await authorizedRequest(
                JUDGE_API_V1.PROBLEM.ALL_TEST_CASES(problemJudgeKey),
              ),
            );
            if (notifyResponse(response, setLoaderStatus)) {
              setLoaderStatus(Status.LOADING);
              await downloadUrlAsFile(response.content.urlExportedZip, problemJudgeKey + '.zip');
              setLoaderStatus(Status.SUCCESS);
            }
          }}
        >
          <T>download all test cases</T>
        </ButtonLoader>
        {modal}
        <ButtonLoader
          size="small"
          disabled={lock}
          type="light"
          icon={<DeleteIcon className="cr-er" />}
          onClick={() => setModal(
            <TwoActionModal
              isOpen
              onClose={() => setModal(null)}
              secondary={{
                onClick: () => setModal(null),
                label: <T>cancel</T>,
              }}
              primary={{
                onClick: async (setLoaderStatus) => {
                  setLock(true);
                  for (const { testCaseKey } of Object.values(testCases)) {
                    setLoaderStatus(Status.LOADING);
                    await Promise.all([ 'input' as KeyFileType, 'output' as KeyFileType ].map(async (keyFile: KeyFileType) => {
                      const response = cleanRequest<ContentsResponseType<{}>>(
                        await authorizedRequest(JUDGE_API_V1.PROBLEM.TEST_CASE_KEY_FILE(problemJudgeKey, testCaseKey, keyFile), {
                          method: HTTPMethod.DELETE,
                        }));
                      notifyResponse(response);
                    }));
                    setLoaderStatus(Status.SUCCESS);
                  }
                  await mutate(new RegExp(JUDGE_API_V1.PROBLEM.TEST_CASES(problemJudgeKey)));
                  setLock(false);
                  setModal(null);
                },
                label: <T>delete</T>,
              }}
              title={<T>delete all test cases</T>}
            >
              <div className="jk-col gap">
                <T className="tt-se">
                  are you sure you want to delete all test cases permanently? This action cannot be undone.
                </T>
              </div>
            </TwoActionModal>,
          )}
        >
          <T className="cr-er">delete all test cases</T>
        </ButtonLoader>
      </div>
      <div className="jk-col stretch bc-we">
        <div className="jk-table-inline-header jk-row block">
          {(problem.settings.scoringMode === ProblemScoringMode.SUBTASK || problem.settings.scoringMode === ProblemScoringMode.PARTIAL) && (
            <div className="jk-row">
              <T>group</T>
            </div>
          )}
          <div className="jk-row"><T>test case key</T></div>
          <div className="jk-row">
            <div className="jk-row" style={{ width: 270 }}><T>input</T></div>
          </div>
          <div className="jk-row">
            <div className="jk-row" style={{ width: 270 }}><T>output</T></div>
          </div>
        </div>
        {Object.values(testCases).map((testCase) => {
          return (
            <div className="jk-table-inline-row jk-row block" key={testCase.testCaseKey}>
              {(problem.settings.scoringMode === ProblemScoringMode.SUBTASK || problem.settings.scoringMode === ProblemScoringMode.PARTIAL) && (
                <div className="jk-row nowrap gap">
                  <MultiSelect
                    disabled={lock}
                    extend
                    options={groupsOptions}
                    selectedOptions={testCase.groups.map(group => ({ value: group }))}
                    onChange={(options) => {
                      const newTestCases = { ...testCases };
                      newTestCases[testCase.testCaseKey] = {
                        ...newTestCases[testCase.testCaseKey],
                        groups: options.map(({ value }) => value),
                      };
                      setTestCases(newTestCases);
                    }}
                  />
                  <ButtonLoader
                    size="small"
                    type="text"
                    disabled={lock}
                    icon={<SaveIcon />}
                    onClick={async (setLoaderStatus) => {
                      setLock(true);
                      setLoaderStatus(Status.LOADING);
                      const response = cleanRequest<ContentsResponseType<{}>>(
                        await authorizedRequest(JUDGE_API_V1.PROBLEM.TEST_CASES_GROUPS(problemJudgeKey), {
                          method: HTTPMethod.PUT,
                          body: JSON.stringify({ testCases: { [testCase.testCaseKey]: { groups: testCase.groups } } }),
                        }));
                      notifyResponse(response, setLoaderStatus);
                      await mutate(new RegExp(JUDGE_API_V1.PROBLEM.TEST_CASES(problemJudgeKey)));
                      setLock(false);
                    }}
                  />
                </div>
              )}
              <div className="jk-row">
                {testCase.testCaseKey}
              </div>
              {[ 'input' as KeyFileType, 'output' as KeyFileType ].map((keyPut: KeyFileType) => (
                <div className="jk-row center gap" key={keyPut}>
                  <div className={classNames('jk-row gap nowrap', { 'cr-ss': testCase[(keyPut + 'FileSize') as 'outputFileSize'] !== -1 })}>
                    <div className="jk-row left nowrap" style={{ width: 110 }}>
                      <CloudUploadIcon /><T className="ws-np">on server</T>:
                    </div>
                    <div className="jk-row" style={{ width: 80 }}>
                      {testCase[(keyPut + 'FileSize') as 'outputFileSize'] !== -1 ?
                        <div
                          className="jk-row"
                          data-tooltip-id="jk-tooltip"
                          data-tooltip-html={`
                            <div class="jk-row center">
                              <span class="ws-np fw-bd tt-se">${t('last updated')}: </span>
                              <span class="ws-np">${new Date(testCase[(keyPut + 'FileLastModified') as 'outputFileLastModified']).toLocaleString()}</span>
                            </div>
                          `}
                        >
                          {humanFileSize(testCase[(keyPut + 'FileSize') as 'outputFileSize'])}
                        </div>
                        : '-'}
                    </div>
                    <div className="jk-row left" style={{ width: 70 }}>
                      {testCase[(keyPut + 'FileSize') as 'inputFileSize'] !== -1 && (
                        <>
                          <div
                            data-tooltip-id="jk-tooltip"
                            data-tooltip-content="the changes will be lost"
                            data-tooltip-t-class-name="ws-np tt-se"
                            className="jk-row"
                          >
                            <ButtonLoader
                              type="text"
                              size="small"
                              icon={<DeleteIcon />}
                              onClick={handleServerDelete(testCase.testCaseKey, keyPut)}
                              disabled={lock}
                            />
                          </div>
                          <ButtonLoader
                            type="text"
                            size="small"
                            icon={<VisibilityIcon />}
                            onClick={async (setLoaderStatus) => {
                              setLoaderStatus(Status.LOADING);
                              const response = cleanRequest<ContentResponseType<{ source: string }>>(
                                await authorizedRequest(
                                  JUDGE_API_V1.PROBLEM.TEST_CASE_KEY_FILE(problemJudgeKey, testCase.testCaseKey, keyPut),
                                ),
                              );
                              if (notifyResponse(response, setLoaderStatus)) {
                                setModal(
                                  <Modal isOpen onClose={() => setModal(null)} closeIcon>
                                    <div className="jk-pg">
                                      <div>{testCase.testCaseKey}.{keyPut === 'input' ? 'in' : 'out'}</div>
                                      <CodeViewer
                                        code={response.content.source} language={ProgrammingLanguage.TEXT}
                                        style={{ maxHeight: 'calc(var(--100VH) * 0.9)', overflow: 'auto' }}
                                      />
                                    </div>
                                  </Modal>,
                                );
                              }
                            }}
                            disabled={lock}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  {!!testCase[(keyPut + 'NewFile') as 'outputNewFile'] && (
                    <div className={classNames('jk-row gap nowrap', { 'cr-er ': !!testCase[(keyPut + 'NewFile') as 'outputNewFile'] })}>
                      <div className="jk-row left nowrap" style={{ width: 110 }}>
                        <DraftIcon /><T className="ws-np">on local</T>:
                      </div>
                      <div className="jk-row" style={{ width: 80 }}>
                        {testCase[(keyPut + 'NewFile') as 'outputNewFile']?.size ? humanFileSize(testCase[(keyPut + 'NewFile') as 'outputNewFile']?.size || 0) : '-'}
                      </div>
                      <div className="jk-row left" style={{ width: 70 }}>
                        {testCase[(keyPut + 'NewFile') as 'outputNewFile'] && (
                          <Button
                            data-tooltip-id="jk-tooltip"
                            data-tooltip-content="delete"
                            type="text"
                            size="small"
                            icon={<DeleteIcon />}
                            onClick={handleDelete(testCase, keyPut)}
                            disabled={lock}
                          />
                        )}
                        {testCase[(keyPut + 'NewFileState') as 'outputNewFileState'] === UploadState.ERROR_ON_UPLOAD && (
                          <ErrorIcon
                            data-tooltip-id="jk-tooltip"
                            data-tooltip-content="file not uploaded, error on upload file"
                          />
                        )}
                        {testCase[(keyPut + 'NewFileState') as 'outputNewFileState'] === UploadState.UPLOADING && (
                          <LoadingIcon />
                        )}
                        {testCase[(keyPut + 'NewFileState') as 'outputNewFileState'] === UploadState.SAVED && (
                          <CheckIcon />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
        <div className="jk-table-inline-row jk-row block">
          <div className="jk-row block">
            <ButtonLoader
              disabled={lock}
              type="secondary"
              icon={<SaveIcon />}
              onClick={async (setLoaderStatus) => {
                setLock(true);
                setLoaderStatus(Status.LOADING);
                for (const testCase of Object.values(testCases)) {
                  await Promise.all(([ 'input' as KeyFileType, 'output' as KeyFileType ]).map(async (keyFile: KeyFileType) => {
                    if (testCase[(keyFile + 'NewFile') as 'outputNewFile']) {
                      setTestCases(prevState => ({
                        ...prevState,
                        [testCase.testCaseKey]: {
                          ...prevState[testCase.testCaseKey],
                          [keyFile + 'NewFileState']: UploadState.UPLOADING,
                        },
                      }));
                      const result = cleanRequest<ContentResponseType<{ signedUrl: string }>>(
                        await authorizedRequest(JUDGE_API_V1.PROBLEM.TEST_CASE(problemJudgeKey), {
                          method: HTTPMethod.POST,
                          body: JSON.stringify({
                            testCaseKey: testCase.testCaseKey,
                            groups: testCase.groups,
                            type: keyFile,
                          }),
                        }));
                      if (result.success) {
                        try {
                          const file = testCase[(keyFile + 'NewFile') as 'outputNewFile'] as File;
                          await fetch(result.content.signedUrl, {
                            method: HTTPMethod.PUT,
                            headers: {
                              'Content-Type': 'text/plain',
                            },
                            body: file,
                          });
                          setTestCases(prevState => ({
                            ...prevState,
                            [testCase.testCaseKey]: {
                              ...prevState[testCase.testCaseKey],
                              [keyFile + 'NewFileState']: UploadState.SAVED,
                            },
                          }));
                        } catch (error) {
                          setTestCases(prevState => ({
                            ...prevState,
                            [testCase.testCaseKey]: {
                              ...prevState[testCase.testCaseKey],
                              [keyFile + 'NewFileState']: UploadState.ERROR_ON_UPLOAD,
                            },
                          }));
                        }
                      } else {
                        setTestCases(prevState => ({
                          ...prevState,
                          [testCase.testCaseKey]: {
                            ...prevState[testCase.testCaseKey],
                            [keyFile + 'NewFileState']: UploadState.ERROR_ON_UPLOAD,
                          },
                        }));
                      }
                    }
                  }));
                }
                await mutate(new RegExp(JUDGE_API_V1.PROBLEM.TEST_CASES(problemJudgeKey)));
                setLoaderStatus(Status.SUCCESS);
                setLock(false);
              }}
            >
              <T>upload / replace files</T>
            </ButtonLoader>
          </div>
        </div>
        <div className="jk-table-inline-row jk-row block">
          {(problem.settings.scoringMode === ProblemScoringMode.SUBTASK || problem.settings.scoringMode === ProblemScoringMode.PARTIAL) && (
            <div className="jk-row">
              <T className="tt-se cr-er">only applicable for new test case keys</T>
              <MultiSelect
                options={groupsOptions}
                selectedOptions={newGroups.map(newGroup => ({ value: newGroup }))}
                onChange={(options) => setNewGroups(options.map(({ value }) => value))}
                extend
                disabled={lock}
              />
            </div>
          )}
          <div className="jk-row">
            <label>
              <div className="jk-button primary jk-border-radius-inline">
                <T className="fw-bd tt-ue ">load input files</T>
              </div>
              <Input
                type="files"
                onChange={handleInputOutputFiles('input')}
                className="screen"
              />
            </label>
          </div>
          <div className="jk-row">
            <label>
              <div className="jk-button primary jk-border-radius-inline">
                <T className="fw-bd tt-ue">load output files</T>
              </div>
              <Input
                type="files"
                onChange={handleInputOutputFiles('output')}
                className="screen"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProblemTestCasesProps {
  problem: UpsertProblemUIDTO,
  problemJudgeKey: string,
}

export const ProblemTestCases = ({ problem, problemJudgeKey }: ProblemTestCasesProps) => {
  return (
    <FetcherLayer<ContentResponseType<ProblemTestCasesResponseDTO>>
      url={JUDGE_API_V1.PROBLEM.TEST_CASES(problemJudgeKey)}
      // errorView={<Custom404 />}
      options={{ refreshInterval: 0, revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false }}
    >
      {({ data }) => {
        return <ProblemTestCasesPage problem={problem} testCases={data.content} problemJudgeKey={problemJudgeKey} />;
      }}
    </FetcherLayer>
  );
};
