import { authorizedRequest, cleanRequest, notifyResponse, useNotification } from '@juki-team/base-ui';
import { ContentResponseType, HTTPMethod, ProgrammingLanguage } from '@juki-team/commons';
import {
  ArrowDownwardIcon,
  ArrowUpwardIcon,
  Button,
  ButtonLoader,
  CodeRunnerEditor,
  DeleteIcon,
  MdMathEditor,
  MdMathViewer,
  T,
} from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { useRouter } from 'hooks';
import React, { Children, Dispatch, SetStateAction, useEffect, useState } from 'react';

const Runner = ({ sheet, setSheet, editable }) => {
  const [languageEditor, setLanguageEditor] = useState(ProgrammingLanguage.CPP17);
  const [testCases, setTestCases] = useState({});
  const languages: ProgrammingLanguage[] = [];
  for (const lang in sheet.sourceCode) {
    if (sheet.sourceCode[lang] && !!sheet.sourceCode[lang]?.trim()) {
      languages.push(lang as ProgrammingLanguage);
    }
  }
  useEffect(() => {
    const testCases = sheet.cases;
    for (const key in testCases) {
      testCases[key].sample = !editable;
    }
    setTestCases(sheet.cases);
  }, [sheet.cases, editable]);
  return (
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
            setSheet({ ...sheet, cases: testCases });
          } else {
            setTestCases(testCases);
          }
        }
      }}
      language={languageEditor}
      testCases={testCases}
      languages={languages}
    />
  );
};

export const SheetPage = ({
  sheets,
  setSheets,
  sheetId,
}: { sheets: any[], setSheets?: Dispatch<SetStateAction<any[]>>, sheetId?: string }) => {
  
  const { addNotification } = useNotification();
  const { push } = useRouter();
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
            return sheet.type === 'jkmd' ? (
              <div className="jk-row gap extent">
                <div className="jk-row stretch extent flex-1">
                  {setSheets ? (
                    <MdMathEditor
                      uploadImageButton
                      informationButton
                      initEditMode={!!setSheets}
                      source={sheet.content}
                      onChange={(content) => {
                        const newSheets = [...sheets];
                        newSheets[index] = { ...sheets[index], content };
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
                <div className="jk-row stretch extent flex-1" style={{ height: '320px' }}>
                  <Runner
                    sheet={sheet}
                    editable={!!setSheets}
                    setSheet={setSheets ? (sheet) => {
                      const newSheets = [...sheets];
                      newSheets[index] = sheet;
                      setSheets?.(newSheets);
                    } : undefined}
                  />
                </div>
                {setSheets && (
                  <div className="jk-col gap">
                    {upButton}
                    {deleteButton}
                    {downButton}
                  </div>
                )}
              </div>
            );
          },
        ))}
      </div>
      {setSheets && (
        <div className="jk-row gap extend nowrap">
          <Button
            extend
            onClick={() => {
              setSheets(prevState => [
                ...prevState, {
                  type: 'jkmd',
                  content: '\n\n',
                },
              ]);
            }}
          >
            <T>add Jk md</T>
          </Button>
          <Button
            extend
            onClick={() => {
              setSheets(prevState => [
                ...prevState, {
                  type: 'code-editor-with-test-cases',
                  sourceCode: {},
                  cases: [],
                },
              ]);
            }}
          >
            <T>add code editor</T>
          </Button>
        </div>
      )}
      {setSheets && (
        <ButtonLoader
          onClick={async (setLoaderStatus) => {
            const response = cleanRequest<ContentResponseType<any>>(
              await authorizedRequest(sheetId ? JUDGE_API_V1.SHEET.SHEET(sheetId) : JUDGE_API_V1.SHEET.CREATE(),
                {
                  method: sheetId ? HTTPMethod.PUT : HTTPMethod.POST,
                  body: JSON.stringify({ body: sheets }),
                },
              ));
            if (notifyResponse(response, addNotification, setLoaderStatus)) {
              if (!sheetId) {
                push(`/sheet/${response.content.id}`);
              }
            }
          }}
        >
          <T>{sheetId ? 'update' : 'create'}</T>
        </ButtonLoader>
      )}
    </div>
  );
};
