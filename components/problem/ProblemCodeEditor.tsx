import { ButtonLoader, CodeEditorKeyMap, CodeEditorTestCasesType, CodeEditorTheme, CodeRunnerEditor, T } from 'components';
import { ACCEPTED_PROGRAMMING_LANGUAGES, OpenDialog, POST, PROGRAMMING_LANGUAGE, QueryParam } from 'config/constants';
import { JUDGE_API_V1 } from 'config/constants/judge';
import { addParamQuery, authorizedRequest, clean, isStringJson } from 'helpers';
import { useNotification, useRouter } from 'hooks';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useUserState } from 'store';
import { ContentResponseType, ProgrammingLanguage, Status, SubmissionRunStatus } from 'types';

const useSaveStorage = <T extends Object, >(storeKey: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] => {
  
  let storeRecovered = {};
  if (isStringJson(localStorage.getItem(storeKey))) {
    storeRecovered = JSON.parse(localStorage.getItem(storeKey));
  }
  const [value, setValue] = useState<T>({ ...defaultValue, ...storeRecovered });
  
  useEffect(() => {
    if (storeKey) {
      const stringValue = JSON.stringify(value);
      if (localStorage.getItem(storeKey) !== stringValue) {
        localStorage.setItem(storeKey, stringValue);
      }
    }
  }, [storeKey, value]);
  
  return [value, setValue];
};

/*
 if (result.content?.answer === ProblemVerdict.AC) {
 addSuccessNotification(
 <div className="jk-pad">
 <T className="text-capitalize">{PROBLEM_VERDICT[ProblemVerdict.AC].print}</T>
 </div>,
 );
 } else if (result.content?.answer === ProblemVerdict.PA) {
 addSuccessNotification(
 <div className="jk-pad">
 <T className="text-capitalize">{PROBLEM_VERDICT[ProblemVerdict.PA].print}</T>
 &bnsp;
 ({result.content?.submitPoints} <T>pnts</T>)
 </div>,
 );
 } else {
 if (Object.keys(PROBLEM_VERDICT).includes(result.content?.answer)) {
 addErrorNotification(
 <div className="jk-pad">
 <T className="text-capitalize">{PROBLEM_VERDICT[result.content?.answer].print}</T>
 </div>,
 );
 } else {
 addErrorNotification(<div className="jk-pad">{result.content?.answer}</div>);
 }
 }
 */
export const ProblemCodeEditor = ({ problem }) => {
  
  const initialTestCases: CodeEditorTestCasesType = {};
  problem.samples?.forEach((sample, index) => {
    const key = 'sample-' + index;
    initialTestCases[key] = {
      key,
      log: '',
      sample: true,
      status: SubmissionRunStatus.NONE,
      stderr: '',
      stdout: '',
      index,
      stdin: sample.input,
    };
  });
  const { nickname, isLogged, session } = useUserState();
  const { query, push } = useRouter();
  const editorStorageKey = 'jk-editor-settings-store/' + nickname;
  
  const storeKey = 'jk-problem-storage/' + nickname;
  const [editorSettings, setEditorSettings] = useSaveStorage(editorStorageKey, {
    theme: CodeEditorTheme.IDEA,
    keyMap: CodeEditorKeyMap.SUBLIME,
    lastLanguageUsed: ProgrammingLanguage.CPP,
    tabSize: 2,
  });
  
  const [language, setLanguage] = useState(editorSettings.lastLanguageUsed);
  const [testCases, setTestCases] = useState(initialTestCases);
  const defaultValue = { [problem.id]: {} };
  ACCEPTED_PROGRAMMING_LANGUAGES.forEach(key => {
    defaultValue[problem.id][PROGRAMMING_LANGUAGE[key].mime] = PROGRAMMING_LANGUAGE[key].templateSourceCode;
  });
  const [source, setSource] = useSaveStorage(storeKey, defaultValue);
  const { addSuccessNotification, addErrorNotification } = useNotification();
  
  console.log({ query });
  return (
    <CodeRunnerEditor
      theme={editorSettings.theme}
      key={editorSettings.keyMap}
      tabSize={editorSettings.tabSize}
      sourceCode={source[PROGRAMMING_LANGUAGE[language].mime] || ''}
      language={language}
      languages={ACCEPTED_PROGRAMMING_LANGUAGES}
      onChange={({ sourceCode, language: newLanguage, testCases, theme, keyMap, tabSize }) => {
        if (typeof sourceCode === 'string') {
          setSource(prevState => ({ ...prevState, [PROGRAMMING_LANGUAGE[language].mime]: sourceCode }));
        }
        if (newLanguage) {
          setLanguage(newLanguage);
          setEditorSettings(prevState => ({ ...prevState, lastLanguageUsed: newLanguage }));
        }
        if (testCases) {
          setTestCases(testCases);
        }
        if (theme) {
          setEditorSettings(prevState => ({ ...prevState, theme }));
        }
        if (keyMap) {
          setEditorSettings(prevState => ({ ...prevState, keyMap }));
        }
        if (tabSize) {
          setEditorSettings(prevState => ({ ...prevState, tabSize }));
        }
      }}
      middleButtons={() => {
        if (!isLogged) {
          return (
            <ButtonLoader
              type="secondary"
              onClick={() => push({ query: addParamQuery(query, QueryParam.OPEN_DIALOG, OpenDialog.SIGN_IN) })}
            >
              <T>to submit, first login</T>
            </ButtonLoader>
          );
        }
        return (
          <ButtonLoader
            type="secondary"
            onClick={async setLoaderStatus => {
              setLoaderStatus(Status.LOADING);
              const result = clean<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.PROBLEM.SUBMIT_V1(query.key + ''), POST, JSON.stringify({
                language,
                source: source[PROGRAMMING_LANGUAGE[language].mime] || '',
                session,
              })));
              new Array(1000).fill(1).forEach(() => {
                authorizedRequest(JUDGE_API_V1.PROBLEM.SUBMIT_V1('1000'), POST, JSON.stringify({
                  language,
                  source: source[PROGRAMMING_LANGUAGE[language].mime] || '',
                  session,
                }));
              });
              console.log({ result });
              if (result.success) {
                if (result?.content.submitId) {
                  addSuccessNotification(<T className="text-capitalize">submission received</T>);
                }
                setLoaderStatus(Status.SUCCESS);
              } else {
                addErrorNotification(<div className="jk-pad"><T>something went wrong, please try again later</T></div>);
                setLoaderStatus(Status.ERROR);
              }
            }}
          >
            <T>submit</T>
          </ButtonLoader>
        );
      }}
      // testCases={testCases}
    />
  );
};