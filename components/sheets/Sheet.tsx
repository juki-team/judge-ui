import {
  AddIcon,
  ArrowDownwardIcon,
  ArrowUpwardIcon,
  Button,
  CodeIcon,
  CodeRunnerEditor,
  DeleteIcon,
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
        </div>
      )}
      <div style={{ height: '320px' }}>
        <CodeRunnerEditor
          readOnly
          sourceCode={sheet.sourceCode?.[languageEditor] || ''}
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
    <div className="jk-col gap stretch">
      <div className="jk-col stretch sheet-page">
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
              </>
            );
          },
        ))}
      </div>
      {setSheets && (
        <div className="jk-row gap extend nowrap">
          <Button
            icon={<NoteAddIcon />}
            extend
            onClick={() => setSheets([...sheets, { type: 'jkmd', content: '\n\n' }])}
          >
            <T>add Jk md</T>
          </Button>
          <Button
            icon={<CodeIcon />}
            extend
            onClick={() => {
              const newSheet: CodeEditorSheetType = {
                type: 'code-editor',
                sourceCode: {} as SourceCodeType,
                testCases: {},
                languages: RUNNER_ACCEPTED_PROGRAMMING_LANGUAGES,
              };
              setSheets([...sheets, newSheet]);
            }}
          >
            <T>add code editor</T>
          </Button>
        </div>
      )}
    </div>
  );
};
