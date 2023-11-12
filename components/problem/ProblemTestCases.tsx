import {
  Button,
  ButtonLoader,
  CheckIcon,
  CloudDownloadIcon,
  CloudUploadIcon,
  DeleteIcon,
  ExclamationIcon,
  FetcherLayer,
  FileIcon,
  Input,
  LoadingIcon,
  MultiSelect,
  ReloadIcon,
  SaveIcon,
  T,
  Tooltip,
} from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, classNames, cleanRequest, downloadBlobAsFile, humanFileSize } from 'helpers';
import { useEffect, useNotification, useState, useSWR } from 'hooks';
import { ReactNode } from 'react';
import {
  ButtonLoaderOnClickType,
  ContentResponseType,
  ContentsResponseType,
  EditCreateProblemType,
  HTTPMethod,
  KeyFileType,
  ProblemMode,
  ProblemTestCasesResponseDTO,
  Status,
} from 'types';
import Custom404 from '../../pages/404';
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
  problem: EditCreateProblemType,
  testCases: ProblemTestCasesResponseDTO
}

const ProblemTestCasesPage = ({ problem, testCases: problemTestCases }: ProblemTestCasesPageProps) => {
  
  const [ testCases, setTestCases ] = useState<{ [key: string]: NewTestCaseType }>(transform(problemTestCases));
  const [ newGroups, setNewGroups ] = useState([ 1 ]);
  const [ lock, setLock ] = useState(false);
  useEffect(() => {
    setTestCases(transform(problemTestCases));
  }, [ problemTestCases ]);
  const { notifyResponse } = useNotification();
  const { mutate } = useSWR();
  const [ modal, setModal ] = useState<ReactNode>(null);
  
  const handleServerDelete = (testCaseKey: string, keyFile: KeyFileType): ButtonLoaderOnClickType => async (setLoaderStatus) => {
    setLock(true);
    setLoaderStatus(Status.LOADING);
    const response = cleanRequest<ContentsResponseType<{}>>(
      await authorizedRequest(JUDGE_API_V1.PROBLEM.TEST_CASE_KEY_FILE(problem.key, testCaseKey, keyFile), {
        method: HTTPMethod.DELETE,
      }));
    await mutate(JUDGE_API_V1.PROBLEM.TEST_CASES(problem.key));
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
        groups: problem.settings.mode === ProblemMode.SUBTASK ? newGroups : [ 1 ],
        [(keyFile + 'NewFile') as 'outputNewFile']: file,
        [(keyFile + 'NewFileState') as 'outputNewFileState']: UploadState.NO_SAVED,
      } as NewTestCaseType;
    }
    setTestCases(newTestCases);
  };
  
  const groupsOptions = Object.values(problem.settings.pointsByGroups)
    .map(group => ({ value: group.group, label: group.group + '' }));
  
  const handleUpload = async (testCase: NewTestCaseType, formData: FormData, keyFile: KeyFileType) => {
    setTestCases(prevState => ({
      ...prevState,
      [testCase.testCaseKey]: { ...prevState[testCase.testCaseKey], [keyFile + 'NewFileState']: UploadState.UPLOADING },
    }));
    const result = cleanRequest<ContentsResponseType<{}>>(
      await authorizedRequest(JUDGE_API_V1.PROBLEM.TEST_CASE(problem.key), {
        method: HTTPMethod.POST,
        body: formData,
      }));
    if (result.success) {
      setTestCases(prevState => ({
        ...prevState,
        [testCase.testCaseKey]: { ...prevState[testCase.testCaseKey], [keyFile + 'NewFileState']: UploadState.SAVED },
      }));
    } else {
      setTestCases(prevState => ({
        ...prevState,
        [testCase.testCaseKey]: {
          ...prevState[testCase.testCaseKey],
          [keyFile + 'NewFIleState']: UploadState.ERROR_ON_UPLOAD,
        },
      }));
    }
  };
  
  return (
    <div className="jk-col gap nowrap stretch">
      <div className="jk-row gap block bc-we jk-pad-sm jk-br-ie">
        <ButtonLoader
          size="small"
          disabled={lock}
          type="light"
          icon={<ReloadIcon />}
          onClick={async (setLoaderStatus) => {
            setLock(true);
            setLoaderStatus(Status.LOADING);
            await mutate(JUDGE_API_V1.PROBLEM.TEST_CASES(problem.key));
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
            const result = await authorizedRequest(
              JUDGE_API_V1.PROBLEM.ALL_TEST_CASES(problem.key),
              { method: HTTPMethod.GET, responseType: 'blob' },
            );
            await downloadBlobAsFile(result, problem.key + '.zip');
            setLoaderStatus(Status.SUCCESS);
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
                        await authorizedRequest(JUDGE_API_V1.PROBLEM.TEST_CASE_KEY_FILE(problem.key, testCaseKey, keyFile), {
                          method: HTTPMethod.DELETE,
                        }));
                      notifyResponse(response);
                    }));
                    setLoaderStatus(Status.SUCCESS);
                  }
                  await mutate(JUDGE_API_V1.PROBLEM.TEST_CASES(problem.key));
                  setLock(false);
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
          {(problem.settings.mode === ProblemMode.SUBTASK || problem.settings.mode === ProblemMode.PARTIAL) && (
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
              {(problem.settings.mode === ProblemMode.SUBTASK || problem.settings.mode === ProblemMode.PARTIAL) && (
                <div className="jk-row nowrap">
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
                        await authorizedRequest(JUDGE_API_V1.PROBLEM.TEST_CASES_GROUPS(problem.key), {
                          method: HTTPMethod.PUT,
                          body: JSON.stringify({ testCases: { [testCase.testCaseKey]: { groups: testCase.groups } } }),
                        }));
                      notifyResponse(response, setLoaderStatus);
                      await mutate(JUDGE_API_V1.PROBLEM.TEST_CASES(problem.key));
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
                        <Tooltip
                          content={
                            <div className="jk-row center nowrap">
                              <T className="ws-np fw-bd tt-se">last updated</T>
                              <span className="ws-np">: {new Date(testCase[(keyPut + 'FileLastModified') as 'outputFileLastModified']).toLocaleString()}</span>
                            </div>
                          }
                        >
                          <div className="jk-row">{humanFileSize(testCase[(keyPut + 'FileSize') as 'outputFileSize'])}</div>
                        </Tooltip>
                        : '-'}
                    </div>
                    <div className="jk-row left" style={{ width: 70 }}>
                      {testCase[(keyPut + 'FileSize') as 'inputFileSize'] !== -1 && (
                        <>
                          <Tooltip content={<T className="ws-np tt-se">the changes will be lost</T>}>
                            <div className="jk-row">
                              <ButtonLoader
                                type="text"
                                size="small"
                                icon={<DeleteIcon />}
                                onClick={handleServerDelete(testCase.testCaseKey, keyPut)}
                                disabled={lock}
                              />
                            </div>
                          </Tooltip>
                          <ButtonLoader
                            type="text"
                            size="small"
                            icon={<CloudDownloadIcon />}
                            onClick={async (setLoaderStatus) => {
                              setLoaderStatus(Status.LOADING);
                              const result = await authorizedRequest(
                                JUDGE_API_V1.PROBLEM.TEST_CASE_KEY_FILE(problem.key, testCase.testCaseKey, keyPut),
                                { method: HTTPMethod.GET, responseType: 'blob' },
                              );
                              await downloadBlobAsFile(result, problem.key + '.zip');
                              setLoaderStatus(Status.SUCCESS);
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
                        <FileIcon /><T className="ws-np">on local</T>:
                      </div>
                      <div className="jk-row" style={{ width: 80 }}>
                        {testCase[(keyPut + 'NewFile') as 'outputNewFile']?.size ? humanFileSize(testCase[(keyPut + 'NewFile') as 'outputNewFile']?.size || 0) : '-'}
                      </div>
                      <div className="jk-row left gap" style={{ width: 70 }}>
                        {testCase[(keyPut + 'NewFile') as 'outputNewFile'] && (
                          <Button
                            type="text"
                            size="small"
                            icon={<DeleteIcon />}
                            onClick={handleDelete(testCase, keyPut)}
                            disabled={lock}
                          />
                        )}
                        {testCase[(keyPut + 'NewFileState') as 'outputNewFileState'] === UploadState.ERROR_ON_UPLOAD && (
                          <ExclamationIcon />
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
                      const formData = new FormData();
                      formData.append('testCaseKey', testCase.testCaseKey);
                      testCase.groups.forEach((group) => formData.append('groups[]', group + ''));
                      formData.append('file', testCase[(keyFile + 'NewFile') as 'outputNewFile'] as File);
                      formData.append('type', keyFile);
                      await handleUpload(testCase, formData, keyFile);
                    }
                  }));
                }
                await mutate(JUDGE_API_V1.PROBLEM.TEST_CASES(problem.key));
                setLoaderStatus(Status.SUCCESS);
                setLock(false);
              }}
            >
              <T>upload / replace files</T>
            </ButtonLoader>
          </div>
        </div>
        <div className="jk-table-inline-row jk-row block">
          {(problem.settings.mode === ProblemMode.SUBTASK || problem.settings.mode === ProblemMode.PARTIAL) && (
            <div className="jk-row">
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
              <div className="jk-button-primary jk-border-radius-inline">
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
              <div className="jk-button-primary jk-border-radius-inline">
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

export const ProblemTestCases = ({ problem }: { problem: EditCreateProblemType }) => {
  return (
    <FetcherLayer<ContentResponseType<ProblemTestCasesResponseDTO>>
      url={JUDGE_API_V1.PROBLEM.TEST_CASES(problem.key)}
      errorView={<Custom404 />}
      options={{ refreshInterval: 0, revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false }}
    >
      {({ data }) => {
        return <ProblemTestCasesPage problem={problem} testCases={data.content} />;
      }}
    </FetcherLayer>
  );
};
