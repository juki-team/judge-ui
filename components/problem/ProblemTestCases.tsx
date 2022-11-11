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
  Popover,
  ReloadIcon,
  SaveIcon,
  T,
} from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, classNames, cleanRequest, downloadBlobAsFile, humanFileSize, notifyResponse } from 'helpers';
import { useNotification } from 'hooks';
import { useEffect, useState } from 'react';
import { useSWRConfig } from 'swr';
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
  
  inputNewFile: File,
  inputNewFileState: UploadState,
  outputNewFile: File,
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

const ProblemTestCasesPage = ({
  problem,
  testCases: problemTestCases,
}: { problem: EditCreateProblemType, testCases: ProblemTestCasesResponseDTO }) => {
  
  const [testCases, setTestCases] = useState<{ [key: string]: NewTestCaseType }>(transform(problemTestCases));
  const [newGroups, setNewGroups] = useState([1]);
  const [lock, setLock] = useState(false);
  useEffect(() => {
    setTestCases(transform(problemTestCases));
  }, [problemTestCases]);
  const { addNotification } = useNotification();
  const { mutate } = useSWRConfig();
  
  const handleServerDelete = (testCaseKey: string, keyFile: KeyFileType): ButtonLoaderOnClickType => async (setLoaderStatus) => {
    setLock(true);
    setLoaderStatus(Status.LOADING);
    const response = cleanRequest<ContentsResponseType<{}>>(
      await authorizedRequest(JUDGE_API_V1.PROBLEM.TEST_CASE_KEY_FILE(problem.key, testCaseKey, keyFile), {
        method: HTTPMethod.DELETE,
      }));
    await mutate(JUDGE_API_V1.PROBLEM.TEST_CASES(problem.key));
    if (notifyResponse(response, addNotification)) {
      setLoaderStatus(Status.SUCCESS);
    } else {
      setLoaderStatus(Status.ERROR);
    }
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
  
  const handleInputFiles = (keyFile: KeyFileType) => (fileList: FileList) => {
    const newTestCases: { [key: string]: NewTestCaseType } = { ...testCases };
    for (const file of Array.from(fileList)) {
      const testCaseKey = file.name.replace(/\.[^/.]+$/, '');
      newTestCases[testCaseKey] = {
        inputNewFileState: UploadState.NO_FILE,
        outputNewFileState: UploadState.NO_FILE,
        inputFileSize: -1,
        outputFileSize: -1,
        outputNewFile: null,
        inputNewFile: null,
        ...newTestCases[testCaseKey],
        testCaseKey,
        groups: problem.settings.mode === ProblemMode.SUBTASK ? newGroups : [1],
        [keyFile + 'NewFile']: file,
        [keyFile + 'NewFileState']: UploadState.NO_SAVED,
      };
    }
    setTestCases(newTestCases);
  };
  
  const groupsOptions = Object.values(problem.settings.pointsByGroups).map(group => ({ value: group.group, label: group.group + '' }));
  
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
        [testCase.testCaseKey]: { ...prevState[testCase.testCaseKey], [keyFile + 'NewFIleState']: UploadState.ERROR_ON_UPLOAD },
      }));
    }
  };
  
  return (
    <div className="jk-col gap extend stretch">
      <div className="jk-row gap block">
        <ButtonLoader
          size="small"
          disabled={lock}
          type="outline"
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
          type="outline"
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
        <ButtonLoader
          size="small"
          disabled={lock}
          type="outline"
          icon={<DeleteIcon className="cr-er" />}
          onClick={async (setLoaderStatus) => {
            setLock(true);
            for (const { testCaseKey } of Object.values(testCases)) {
              setLoaderStatus(Status.LOADING);
              const response1 = cleanRequest<ContentsResponseType<{}>>(
                await authorizedRequest(JUDGE_API_V1.PROBLEM.TEST_CASE_KEY_FILE(problem.key, testCaseKey, 'input'), {
                  method: HTTPMethod.DELETE,
                }));
              if (notifyResponse(response1, addNotification)) {
                setLoaderStatus(Status.SUCCESS);
              } else {
                setLoaderStatus(Status.ERROR);
              }
              setLoaderStatus(Status.LOADING);
              const response = cleanRequest<ContentsResponseType<{}>>(
                await authorizedRequest(JUDGE_API_V1.PROBLEM.TEST_CASE_KEY_FILE(problem.key, testCaseKey, 'output'), {
                  method: HTTPMethod.DELETE,
                }));
              if (notifyResponse(response, addNotification)) {
                setLoaderStatus(Status.SUCCESS);
              } else {
                setLoaderStatus(Status.ERROR);
              }
            }
            await mutate(JUDGE_API_V1.PROBLEM.TEST_CASES(problem.key));
            setLock(false);
          }}
        >
          <T className="cr-er">delete all test cases</T>
        </ButtonLoader>
      </div>
      <div className="jk-col stretch">
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
            <div className="jk-table-inline-row jk-row block">
              {(problem.settings.mode === ProblemMode.SUBTASK || problem.settings.mode === ProblemMode.PARTIAL) && (
                <div className="jk-row nowrap">
                  <MultiSelect
                    disabled={lock}
                    block
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
                      if (notifyResponse(response, addNotification)) {
                        setLoaderStatus(Status.SUCCESS);
                      } else {
                        setLoaderStatus(Status.ERROR);
                      }
                      await mutate(JUDGE_API_V1.PROBLEM.TEST_CASES(problem.key));
                      setLock(false);
                    }}
                  />
                </div>
              )}
              <div className="jk-row">
                {testCase.testCaseKey}
              </div>
              {['input', 'output'].map((keyPut: KeyFileType) => (
                <div className="jk-row center gap">
                  <div className={classNames('jk-row gap nowrap', { 'cr-ss': testCase[keyPut + 'FileSize'] !== -1 })}>
                    <div className="jk-row left" style={{ width: 110 }}>
                      <CloudUploadIcon /><T>on server</T>:
                    </div>
                    <div className="jk-row" style={{ width: 80 }}>
                      {testCase[keyPut + 'FileSize'] !== -1 ?
                        <Popover
                          content={<div className="jk-row center nowrap">
                            <T className="ws-np fw-bd tt-se">last updated</T>
                            <span className="ws-np">: {new Date(testCase[keyPut + 'FileLastModified']).toLocaleString()}</span>
                          </div>}
                          showPopperArrow
                        >
                          <div className="jk-row">{humanFileSize(testCase[keyPut + 'FileSize'])}</div>
                        </Popover>
                        : '-'}
                    </div>
                    <div className="jk-row left" style={{ width: 70 }}>
                      {testCase[keyPut + 'FileSize'] !== -1 && (
                        <>
                          <Popover
                            content={<T className="ws-np tt-se">the changes will be lost</T>}
                            showPopperArrow
                          >
                            <div className="jk-row">
                              <ButtonLoader
                                type="text"
                                size="small"
                                icon={<DeleteIcon />}
                                onClick={handleServerDelete(testCase.testCaseKey, keyPut)}
                                disabled={lock}
                              />
                            </div>
                          </Popover>
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
                  <div className={classNames('jk-row gap nowrap', { 'cr-er': !!testCase[keyPut + 'NewFile'] })}>
                    <div className="jk-row left" style={{ width: 110 }}>
                      <FileIcon /><T>on local</T>:
                    </div>
                    <div className="jk-row" style={{ width: 80 }}>
                      {!!testCase[keyPut + 'NewFile'] ? humanFileSize(testCase[keyPut + 'NewFile']?.size) : '-'}
                    </div>
                    <div className="jk-row left gap" style={{ width: 70 }}>
                      {testCase[keyPut + 'NewFile'] && (
                        <Button
                          type="text"
                          size="small"
                          icon={<DeleteIcon />}
                          onClick={handleDelete(testCase, keyPut)}
                          disabled={lock}
                        />
                      )}
                      {testCase[keyPut + 'NewFileState'] === UploadState.ERROR_ON_UPLOAD && <ExclamationIcon />}
                      {testCase[keyPut + 'NewFileState'] === UploadState.UPLOADING && <LoadingIcon />}
                      {testCase[keyPut + 'NewFileState'] === UploadState.SAVED && <CheckIcon />}
                    </div>
                  </div>
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
                  if (testCase.inputNewFile) {
                    const formData = new FormData();
                    formData.append('testCaseKey', testCase.testCaseKey);
                    testCase.groups.forEach((group) => formData.append('groups[]', group + ''));
                    formData.append('file', testCase.inputNewFile);
                    formData.append('type', 'input');
                    await handleUpload(testCase, formData, 'input');
                  }
                  if (testCase.outputNewFile) {
                    const formData = new FormData();
                    formData.append('testCaseKey', testCase.testCaseKey);
                    testCase.groups.forEach((group) => formData.append('groups[]', group + ''));
                    formData.append('file', testCase.outputNewFile);
                    formData.append('type', 'output');
                    await handleUpload(testCase, formData, 'output');
                  }
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
                block
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
                onChange={handleInputFiles('input')}
                className="width-120px"
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
                onChange={handleInputFiles('output')}
                className="width-120px"
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
    <div className="jk-pad-md">
      <FetcherLayer<ContentResponseType<ProblemTestCasesResponseDTO>>
        url={JUDGE_API_V1.PROBLEM.TEST_CASES(problem.key)}
        errorView={<Custom404 />}
        options={{ refreshInterval: 0, revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false }}
      >
        {({ data }) => {
          return <ProblemTestCasesPage problem={problem} testCases={data.content} />;
        }}
      </FetcherLayer>
    </div>
  );
};