import { useEffect, useState } from 'react';
import { CodeEditorKeyMap, CodeEditorTestCasesType, CodeEditorTheme, CodeRunnerEditor } from '../../components';
import { PROGRAMMING_LANGUAGES } from '../../config/constants';
import { useUserState } from '../../store';
import { ProgrammingLanguage, SubmissionRunStatus } from '../../types';

export type EditorStorageType = {
  theme: CodeEditorTheme,
  keyMap: CodeEditorKeyMap,
  lastLanguageUsed: ProgrammingLanguage,
}

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
  const { nickname } = useUserState();
  const editorStorageKey = 'jk-editor-settings-store/' + nickname;
  const initial = JSON.parse(localStorage.getItem(editorStorageKey) || '{}');
  const [editorStorage, setEditorStorage] = useState<EditorStorageType>({
    theme: initial.theme ?? CodeEditorTheme.IDEA,
    keyMap: initial.keyMap ?? CodeEditorKeyMap.SUBLIME,
    lastLanguageUsed: initial.lastLanguageUsed ?? ProgrammingLanguage.CPP,
  });
  const [sourceCodeStorage, setSourceCodeStorage] = useState<{ [key: string]: string }>(JSON.parse(localStorage.getItem(storeKey || '') || '{}'));
  const [testCases, setTestCases] = useState(initialTestCases);
  
  const storeKey = '';
  const language = ProgrammingLanguage.CPP;
  const sourceCode = '';
  
  useEffect(() => localStorage.setItem(editorStorageKey, JSON.stringify(editorStorage)), [editorStorage, editorStorageKey]);
  useEffect(() => storeKey ? localStorage.setItem(storeKey, JSON.stringify(sourceCodeStorage)) : undefined, [
    storeKey,
    sourceCodeStorage,
  ]);
  useEffect(() => {
    console.log({ language, sourceCode });
    setSourceCodeStorage(prevState => {
      // if (prevState[language]) {
      return {
        ...prevState,
        [PROGRAMMING_LANGUAGES[language].mime]: sourceCode,
      };
      // }
      // return prevState;
    });
  }, [language, sourceCode]);
  
  return (
    <CodeRunnerEditor
      sourceCode={''}
      language={ProgrammingLanguage.C}
      languages={[ProgrammingLanguage.C, ProgrammingLanguage.CPP]}
      onChange={(...props) => {
        console.log(props);
      }}
      middleButtons={() => {
        return <div>Holiw</div>;
      }}
      testCases={testCases}
    />
  );
};