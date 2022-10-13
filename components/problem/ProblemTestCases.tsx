import {
  ButtonLoader,
  CloudDownloadIcon,
  CloudUploadIcon,
  DeleteIcon,
  EditIcon,
  FetcherLayer,
  Input,
  InputCheckbox,
  Modal,
  PlusIcon,
  SaveIcon,
  Select,
  T,
} from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest, humanFileSize } from 'helpers';
import { useState } from 'react';
import {
  ContentResponseType,
  ContentsResponseType,
  EditCreateProblemType,
  HTTPMethod,
  ProblemMode,
  ProblemSettingsPointsByGroupsType,
  ProblemTestCasesResponseDTO,
} from 'types';
import Custom404 from '../../pages/404';

type newTestCaseType = { group: number, testCaseKey: string, inputFile: File, outputFile: File, state: 'no saved' };

const AddTestCasesModal = ({
  problemKey,
  problemMode,
  onClose,
  problemPointsByGroups,
}: { problemKey: string, problemMode: ProblemMode, problemPointsByGroups: ProblemSettingsPointsByGroupsType, onClose: () => void }) => {
  
  const [testCases, setTestCases] = useState<{ [key: string]: newTestCaseType }>({});
  const [newGroup, setNewGroup] = useState(1);
  return (
    <Modal isOpen onClose={onClose}>
      <div className="jk-pad-md jk-col stretch gap">
        <div className="jk-col stretch">
          <div className="jk-table-inline-header jk-row block">
            <div className="jk-row"><T>group</T></div>
            <div className="jk-row"><T>test case key</T></div>
            <div className="jk-row"><T>input</T></div>
            <div className="jk-row"><T>output</T></div>
            <div className="jk-row"><T>state</T></div>
          </div>
          {Object.values(testCases).map((testCase) => {
            return (
              <div className="jk-table-inline-row jk-row block">
                <div className="jk-row">
                  {problemMode === ProblemMode.SUBTASK ? (
                    <Select
                      options={Object.values(problemPointsByGroups)
                        .map(group => ({ value: group.group, label: group.group }))}
                      selectedOption={{ value: testCase.group }}
                      onChange={({ value }) => {
                        const newTestCases = { ...testCases };
                        newTestCases[testCase.testCaseKey] = { ...newTestCases[testCase.testCaseKey], group: value };
                        setTestCases(newTestCases);
                      }}
                    />
                  ) : testCase.group}
                </div>
                <div className="jk-row">
                  <Input
                    value={testCase.testCaseKey}
                    onChange={(testCaseKey) => {
                      const newTestCases = { ...testCases };
                      newTestCases[testCase.testCaseKey] = { ...newTestCases[testCase.testCaseKey], testCaseKey };
                      setTestCases(newTestCases);
                    }}
                  />
                </div>
                <div className="jk-row center gap">
                  {testCase.inputFile ? (
                    <>
                      {humanFileSize(testCase.inputFile?.size)}
                      <DeleteIcon
                        onClick={() => {
                          const newTestCases = { ...testCases };
                          newTestCases[testCase.testCaseKey] = { ...newTestCases[testCase.testCaseKey], inputFile: null };
                          if (!newTestCases[testCase.testCaseKey].inputFile && !newTestCases[testCase.testCaseKey].outputFile) {
                            delete newTestCases[testCase.testCaseKey];
                          }
                          setTestCases(newTestCases);
                        }}
                      />
                    </>
                  ) : <em><T className="tt-se">not uploaded</T></em>}
                </div>
                <div className="jk-row center gap">
                  {testCase.outputFile ? (
                    <>
                      {humanFileSize(testCase.outputFile?.size)}
                      <DeleteIcon
                        onClick={() => {
                          const newTestCases = { ...testCases };
                          newTestCases[testCase.testCaseKey] = { ...newTestCases[testCase.testCaseKey], outputFile: null };
                          if (!newTestCases[testCase.testCaseKey].inputFile && !newTestCases[testCase.testCaseKey].outputFile) {
                            delete newTestCases[testCase.testCaseKey];
                          }
                          setTestCases(newTestCases);
                        }}
                      />
                    </>
                  ) : <em><T className="tt-se">not uploaded</T></em>}
                </div>
                <div className="jk-row">
                  <T>{testCase.state}</T>
                </div>
              </div>
            );
          })}
          <div className="jk-table-inline-row jk-row block">
            <div className="jk-row">
              {problemMode === ProblemMode.SUBTASK ? (
                <Select
                  options={Object.values(problemPointsByGroups)
                    .map(group => ({ value: group.group, label: group.group }))}
                  selectedOption={{ value: newGroup }}
                  onChange={({ value }) => setNewGroup(value)}
                />
              ) : 1}
            </div>
            <div className="jk-row">
              <Input disabled />
            </div>
            <div className="jk-row">
              <Input
                type="files"
                onChange={(fileList: FileList) => {
                  const newTestCases: { [key: string]: newTestCaseType } = { ...testCases };
                  for (const file of Array.from(fileList)) {
                    const testCaseKey = file.name.replace(/\.[^/.]+$/, '');
                    newTestCases[testCaseKey] = {
                      outputFile: null,
                      ...newTestCases[testCaseKey],
                      testCaseKey,
                      group: problemMode === ProblemMode.SUBTASK ? newGroup : 1,
                      inputFile: file,
                      state: 'no saved',
                    };
                  }
                  setTestCases(newTestCases);
                }}
                className="width-120px"
              />
            </div>
            <div className="jk-row">
              <Input
                type="files"
                onChange={(fileList: FileList) => {
                  const newTestCases: { [key: string]: newTestCaseType } = { ...testCases };
                  for (const file of Array.from(fileList)) {
                    const testCaseKey = file.name.replace(/\.[^/.]+$/, '');
                    newTestCases[testCaseKey] = {
                      inputFile: null,
                      ...newTestCases[testCaseKey],
                      testCaseKey,
                      group: problemMode === ProblemMode.SUBTASK ? newGroup : 1,
                      outputFile: file,
                      state: 'no saved',
                    };
                  }
                  setTestCases(newTestCases);
                }}
                className="width-120px"
              />
            </div>
            <div />
          </div>
        </div>
        <ButtonLoader
          icon={<SaveIcon />}
          onClick={async () => {
            for (const testCase of Object.values(testCases)) {
              const formData = new FormData();
              formData.append('testCaseKey', testCase.testCaseKey);
              formData.append('group', testCase.group + '');
              if (testCase.inputFile) {
                formData.append('file', testCase.inputFile);
              }
              if (testCase.outputFile) {
                formData.append('file', testCase.outputFile);
              }
              const result = cleanRequest<ContentsResponseType<{}>>(
                await authorizedRequest(JUDGE_API_V1.PROBLEM.TEST_CASE(problemKey), {
                  method: HTTPMethod.POST,
                  body: formData,
                }));
              console.log({ result });
              break;
            }
          }}
        >
          <T>upload all files</T>
        </ButtonLoader>
      </div>
    </Modal>
  );
};

const ProblemTestCasesPage = ({ problem, testCases }: { problem: EditCreateProblemType, testCases: ProblemTestCasesResponseDTO }) => {
  const groups = {};
  const getKey = (testCase) => testCase.testCaseId + '/' + testCase.testCaseKey;
  testCases.forEach(testCase => {
    groups[getKey(testCase)] = testCase.group;
  });
  const [changeGroups, setChangeGroups] = useState(groups);
  
  const [addTestCasesModal, setAddTestCasesModal] = useState(false);
  
  return (
    <div>
      <div className="jk-table-inline-header jk-row block">
        <div className="jk-row"><InputCheckbox checked={false} /></div>
        {problem.settings.mode === ProblemMode.SUBTASK && (
          <div className="jk-row">
            <div className="jk-col">
              <T>group</T>
              <ButtonLoader
                size="tiny"
                disabled={!testCases.some((testCase) => changeGroups[getKey(testCase)] !== testCase.group)}
                icon={<SaveIcon />}><T>save</T></ButtonLoader>
            </div>
          </div>
        )}
        <div className="jk-row"><T>test case id</T>/<T>test case key</T></div>
        <div className="jk-row"><T>input</T></div>
        <div className="jk-row"><T>output</T></div>
        <div className="jk-row"><T>operations</T></div>
      </div>
      {testCases.map(testCase => {
        return (
          <div className="jk-table-inline-row jk-row block">
            <div className="jk-row"><InputCheckbox checked={false} /></div>
            <div className="jk-row" style={{ backgroundColor: changeGroups[getKey(testCase)] !== testCase.group ? 'red' : '' }}>
              <Select
                options={Object.values(problem.settings.pointsByGroups)
                  .map(group => ({ value: group.group, label: group.group }))}
                selectedOption={{ value: changeGroups[getKey(testCase)] }}
                onChange={({ value }) => {
                  console.log({ value });
                  setChangeGroups({ ...changeGroups, [getKey(testCase)]: value });
                }}
              />
            </div>
            <div className="jk-row">{testCase.testCaseId}/{testCase.testCaseKey}</div>
            <div className="jk-row">
              {humanFileSize(testCase.inputFileSize)}
              <EditIcon />
              <CloudDownloadIcon />
              <CloudUploadIcon />
            </div>
            <div className="jk-row">
              {humanFileSize(testCase.outputFileSize)}
              <EditIcon />
              <CloudDownloadIcon />
              <CloudUploadIcon />
            </div>
            <div className="jk-row">
              <DeleteIcon />
            </div>
          </div>
        );
      })}
      <div className="jk-table-inline-row jk-row block">
        <div className="jk-row"></div>
        {problem.settings.mode === ProblemMode.SUBTASK && <div className="jk-row" />}
        <div className="jk-row">new group</div>
        <div className="jk-row gap center">
          <PlusIcon onClick={() => setAddTestCasesModal(true)} />
        </div>
        <div className="jk-row gap center">
          <PlusIcon onClick={() => setAddTestCasesModal(true)} />
        </div>
        <div className="jk-row">
        </div>
        {addTestCasesModal && (
          <AddTestCasesModal
            problemKey={problem.key}
            onClose={() => setAddTestCasesModal(false)}
            problemMode={problem.settings.mode}
            problemPointsByGroups={problem.settings.pointsByGroups}
          />
        )}
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
          console.log({ data });
          return <ProblemTestCasesPage problem={problem} testCases={data.content} />;
        }}
      </FetcherLayer>
    </div>
  );
};