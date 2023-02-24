import {
  AddIcon,
  ArrowDownwardIcon,
  ArrowUpwardIcon,
  Button,
  CodeIcon,
  CodeRunnerEditor,
  DeleteIcon,
  Input,
  InputCheckbox,
  MdMathEditor,
  MdMathViewer,
  Modal,
  MultiSelect,
  NoteAddIcon,
  Popover,
  T,
  TabsInline,
  TextArea,
} from 'components';
import { PROGRAMMING_LANGUAGE, RUNNER_ACCEPTED_PROGRAMMING_LANGUAGES } from 'config/constants';
import { mex, renderReactNodeOrFunctionP1 } from 'helpers';
import React, { Children, Dispatch, useEffect, useState } from 'react';
import {
  BodySheetType,
  CodeEditorSheetType,
  CodeEditorTestCaseType,
  JkmdSheetType,
  ProgrammingLanguage,
  SourceCodeType,
  SubmissionRunStatus,
  TabType,
} from 'types';
import { v4 } from 'uuid';

const EditInputTestsButton = ({ sheet, setSheet }: { sheet: CodeEditorSheetType, setSheet: Dispatch<CodeEditorSheetType> }) => {
  const [open, setOpen] = useState(false);
  const [testCaseKey, setTestCaseKey] = useState('');
  
  const tabs: { [key: string]: TabType<string> } = {};
  const testCasesValues = Object.values(sheet.testCases);
  testCasesValues.sort((a, b) => a.index - b.index).forEach(testCaseValue => {
    tabs[testCaseValue.key] = {
      key: testCaseValue.key,
      header: testCaseValue.key === testCaseKey
        ? <div className="jk-row ws-np nowrap tx-s">
          <T className="tt-se">sample</T>
          &nbsp;{testCaseValue.index + 1}&nbsp;
          {testCasesValues.length > 1 && (
            <DeleteIcon
              size="small"
              className="clickable br-50-pc"
              onClick={() => {
                const newTestCases = { ...sheet.testCases };
                delete newTestCases[testCaseValue.key];
                setSheet({ ...sheet, testCases: newTestCases });
              }}
            />
          )}
        </div>
        : <div className="jk-row ws-np nowrap tx-s"><T className="tt-se">s.</T>{testCaseValue.index + 1}</div>,
      body: (
        <TextArea
          key={testCaseValue.key}
          value={testCaseValue.in}
          onChange={(value) => {
            const newTestCases = { ...sheet.testCases };
            newTestCases[testCaseValue.key] = {
              ...testCaseValue,
              in: value,
              sample: true,
            } as CodeEditorTestCaseType;
            setSheet({ ...sheet, testCases: newTestCases });
          }}
        />
      ),
    };
  });
  
  const actionSection = (
    <Popover content={<T className="ws-np tt-se tx-s">add sample test case</T>} placement="bottomRight">
      <div className="jk-row">
        <AddIcon
          size="small"
          className="clickable br-50-pc"
          onClick={() => {
            const key = v4();
            const index = mex(testCasesValues?.map(testCaseValue => testCaseValue.index));
            setSheet?.({
              ...sheet,
              testCases: {
                ...sheet.testCases,
                [key]: { key, index, in: '', out: '', err: '', log: '', sample: true, status: SubmissionRunStatus.NONE },
              },
            });
          }}
        />
      </div>
    </Popover>
  );
  
  return (
    <>
      <Button onClick={() => setOpen(true)} size="small"><T>edit input tests</T></Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} closeIcon closeWhenClickOutside>
        <div className="jk-pad-lg">
          <div><T className="tt-se fw-bd tx-l">input test cases</T></div>
          <div className="jk-col extend stretch nowrap">
            <div className="jk-row nowrap" style={{ margin: '0 var(--gap)' }}>
              <div className="flex-1">
                <TabsInline
                  tabs={tabs}
                  selectedTabKey={testCaseKey}
                  onChange={tabKey => setTestCaseKey(tabKey)}
                />
              </div>
              <div>
                {actionSection}
              </div>
            </div>
            <div className="flex-1">
              {renderReactNodeOrFunctionP1(tabs[testCaseKey]?.body, { selectedTabKey: testCaseKey })}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

const Runner = ({
  sheet,
  setSheet,
}: {
  sheet: CodeEditorSheetType, setSheet?: Dispatch<CodeEditorSheetType>
}) => {
  const [languageEditor, setLanguageEditor] = useState(ProgrammingLanguage.CPP17);
  const [testCases, setTestCases] = useState(sheet.testCases);
  
  useEffect(() => {
    setTestCases(sheet.testCases);
  }, [sheet.testCases]);
  
  const sourceCode = sheet.sourceCode?.[languageEditor] || '';
  return (
    <div className="jk-col stretch flex-1 gap">
      {setSheet && (
        <div className="jk-row gap">
          <div className="flex-1">
            <T className="fw-bd tt-se">languages</T>:
            <MultiSelect
              options={Object.keys(PROGRAMMING_LANGUAGE)
                .map((key) => ({ value: key, label: PROGRAMMING_LANGUAGE[key].label }))}
              selectedOptions={sheet.languages?.map(language => ({ value: language }))}
              onChange={(options) => setSheet({
                ...sheet,
                languages: options.map(option => option.value as ProgrammingLanguage),
              })}
              extend
            />
          </div>
          <div>
            <EditInputTestsButton sheet={sheet} setSheet={setSheet} />
          </div>
          <div>
            <div className="jk-row gap space-between">
              <div><T className="fw-bd tt-se">height</T>:</div>
              <InputCheckbox
                checked={sheet.height === 'auto'}
                label={<T>auto</T>}
                onChange={(value) => setSheet({
                  ...sheet,
                  height: value ? 'auto' : 320,
                })}
              />
            </div>
            {sheet.height !== 'auto' && (
              <div className="jk-row">
                <Input
                  type="number"
                  value={sheet.height}
                  onChange={(value) => setSheet({
                    ...sheet,
                    height: Math.max(value, 320),
                  })}
                  size="auto"
                />
                <T>px</T>
              </div>
            )}
          </div>
        </div>
      )}
      <div
        style={{ height: typeof sheet.height === 'number' ? sheet.height + 'px' : Math.max(sourceCode.split('\n').length * 20 + 60, 320) }}
      >
        <CodeRunnerEditor
          readOnly
          sourceCode={sourceCode}
          onChange={({ sourceCode, language, testCases }) => {
            if (sourceCode !== undefined) {
              setSheet?.({ ...sheet, sourceCode: { ...sheet.sourceCode, [languageEditor]: sourceCode || '' } });
            }
            if (language) {
              setLanguageEditor(language);
            }
            if (testCases) {
              if (setSheet) {
                setSheet({ ...sheet, testCases });
              } else {
                setTestCases(testCases);
              }
            }
          }}
          language={languageEditor}
          testCases={testCases}
          languages={sheet.languages}
        />
      </div>
    </div>
  );
};

export const SheetPage = ({ sheets, setSheets }: { sheets: BodySheetType[], setSheets?: Dispatch<BodySheetType[]> }) => {
  
  return (
    <div className="jk-col stretch sheet-page nowrap">
      {Children.toArray(sheets.map((sheet, index) => {
          const upButton = (
            <Button
              icon={<ArrowUpwardIcon />}
              disabled={index === 0}
              onClick={() => {
                const newSheets = [...sheets];
                [newSheets[index], newSheets[index - 1]] = [newSheets[index - 1], newSheets[index]];
                setSheets(newSheets);
              }}
            />
          );
          const downButton = (
            <Button
              icon={<ArrowDownwardIcon />}
              disabled={index === sheets.length - 1}
              onClick={() => {
                const newSheets = [...sheets];
                [newSheets[index], newSheets[index + 1]] = [newSheets[index + 1], newSheets[index]];
                setSheets(newSheets);
              }}
            />
          );
          const deleteButton = (
            <Button
              icon={<DeleteIcon />}
              onClick={() => {
                setSheets(sheets.filter((s, i) => i !== index));
              }}
            />
          );
          return (
            <>
              {setSheets && (
                <div className="jk-divider tiny">
                  {sheet.type === 'jkmd' ? <T>jkmd editor</T> : <T>code runner</T>}
                </div>
              )}
              {sheet.type === 'jkmd' ? (
                <div className="jk-row gap extent nowrap">
                  <div className="jk-row stretch extent flex-1">
                    {setSheets ? (
                      <MdMathEditor
                        uploadImageButton
                        informationButton
                        initEditMode={!!setSheets}
                        source={sheet.content}
                        onChange={(content) => {
                          const newSheets = [...sheets];
                          newSheets[index] = { ...sheets[index], content } as JkmdSheetType;
                          setSheets(newSheets);
                        }}
                      />
                    ) : (
                      <MdMathViewer source={sheet.content} />
                    )}
                  </div>
                  {setSheets && (
                    <div className="jk-col gap">
                      {upButton}
                      {deleteButton}
                      {downButton}
                    </div>
                  )}
                </div>
              ) : (
                <div className="jk-row gap extent">
                  <Runner
                    sheet={sheet}
                    setSheet={setSheets ? (sheet) => {
                      const newSheets = [...sheets];
                      newSheets[index] = sheet;
                      setSheets?.(newSheets);
                    } : undefined}
                  />
                  {setSheets && (
                    <div className="jk-col gap">
                      {upButton}
                      {deleteButton}
                      {downButton}
                    </div>
                  )}
                </div>
              )}
              {setSheets && (
                <div className="jk-row gap extend nowrap center">
                  <Button
                    icon={<NoteAddIcon />}
                    size="small"
                    type="outline"
                    onClick={() => {
                      const newSheets = [...sheets];
                      newSheets.splice(index + 1, 0, { type: 'jkmd', content: '' });
                      setSheets(newSheets);
                    }}
                  >
                    <T>add jk md</T>
                  </Button>
                  <Button
                    icon={<CodeIcon />}
                    size="small"
                    type="outline"
                    onClick={() => {
                      const newSheet: CodeEditorSheetType = {
                        type: 'code-editor',
                        sourceCode: {} as SourceCodeType,
                        testCases: {},
                        languages: RUNNER_ACCEPTED_PROGRAMMING_LANGUAGES,
                        height: 'auto',
                      };
                      const newSheets = [...sheets];
                      newSheets.splice(index + 1, 0, newSheet);
                      setSheets(newSheets);
                    }}
                  >
                    <T>add code editor</T>
                  </Button>
                </div>
              )}
            </>
          );
        },
      ))}
    </div>
  );
};
