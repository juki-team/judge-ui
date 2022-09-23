import { getProblemJudgeKey, Judge } from '@juki-team/commons';
import { ButtonLoader, CodeEditorKeyMap, CodeEditorTheme, CodeRunnerEditor, T } from 'components';
import {
  ACCEPTED_PROGRAMMING_LANGUAGES,
  JUDGE_API_V1,
  MY_STATUS,
  OpenDialog,
  PROGRAMMING_LANGUAGE,
  QueryParam,
  ROUTES,
} from 'config/constants';
import {
  addParamQuery,
  authorizedRequest,
  cleanRequest,
  getEditorSettingsStorageKey,
  getProblemsStoreKey,
  isStringJson,
} from 'helpers';
import { useContestRouter, useNotification, useRouter } from 'hooks';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTaskDispatch, useUserState } from 'store';
import { useSWRConfig } from 'swr';
import {
  CodeEditorTestCasesType,
  ContentResponseType,
  ContestTab,
  HTTPMethod,
  ProblemResponseDTO,
  ProblemTab,
  ProgrammingLanguage,
  Status,
  SubmissionRunStatus,
} from 'types';
import { SpectatorInformation } from '../contest/Information';

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

export const ProblemCodeEditor = ({
  problem,
  contest,
}: { problem: ProblemResponseDTO, contest?: { isAdmin: boolean, isJudge: boolean, isContestant: boolean, isGuest: boolean, isSpectator: boolean, problemIndex: string } }) => {
  
  const { addSuccessNotification, addErrorNotification } = useNotification();
  const { mutate } = useSWRConfig();
  const { listenSubmission } = useTaskDispatch();
  const initialTestCases: CodeEditorTestCasesType = {};
  problem.sampleCases?.forEach((sample, index) => {
    const key = 'sample-' + index;
    initialTestCases[key] = {
      key,
      log: '',
      sample: true,
      status: SubmissionRunStatus.NONE,
      err: '',
      out: '',
      index,
      in: sample.input,
    };
  });
  const { nickname, isLogged, session } = useUserState();
  const { query, push } = useRouter();
  const { pushTab } = useContestRouter();
  const { [`${MY_STATUS}.pageSize`]: myStatusPageSize } = query;
  
  const { key: problemKey, ...restQuery } = query;
  const editorSettingsStorageKey = getEditorSettingsStorageKey(nickname);
  const problemStoreKey = getProblemsStoreKey(nickname);
  
  const [editorSettings, setEditorSettings] = useSaveStorage(editorSettingsStorageKey, {
    theme: CodeEditorTheme.IDEA,
    keyMap: CodeEditorKeyMap.SUBLIME,
    lastLanguageUsed: ProgrammingLanguage.CPP,
    tabSize: 2,
  });
  const languages = useMemo(() => Object.values(problem?.languages || {}).map(language => language.language), [problem?.languages]);
  const [language, setLanguage] = useState(editorSettings.lastLanguageUsed);
  const [testCases, setTestCases] = useState(initialTestCases);
  useEffect(() => {
    if (languages.length && !languages.some(lang => lang === language)) {
      setLanguage(languages[0]);
    }
  }, [language, languages]);
  const problemJudgeKey = getProblemJudgeKey(problem.judge, problem.key);
  const defaultValue = { [problemJudgeKey]: {} };
  ACCEPTED_PROGRAMMING_LANGUAGES.forEach(key => {
    defaultValue[problemJudgeKey][PROGRAMMING_LANGUAGE[key].mime] = PROGRAMMING_LANGUAGE[key].templateSourceCode;
  });
  const [source, setSource] = useSaveStorage(problemStoreKey, defaultValue);
  
  return (
    <CodeRunnerEditor
      theme={editorSettings.theme}
      keyMap={editorSettings.keyMap}
      tabSize={editorSettings.tabSize}
      sourceCode={source[problemJudgeKey]?.[PROGRAMMING_LANGUAGE[language].mime] || ''}
      language={language}
      languages={languages}
      onChange={({ sourceCode, language: newLanguage, testCases, theme, keyMap, tabSize }) => {
        if (typeof sourceCode === 'string') {
          setSource(prevState => ({
            ...prevState,
            [problemJudgeKey]: { ...(prevState[problemJudgeKey] || {}), [PROGRAMMING_LANGUAGE[language].mime]: sourceCode },
          }));
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
              size="tiny"
              onClick={async () => {
                addSuccessNotification(<T className="text-sentence-case">to submit, first login</T>);
                await push({ query: addParamQuery(query, QueryParam.DIALOG, OpenDialog.SIGN_IN) });
              }}
            >
              <T>submit</T>
            </ButtonLoader>
          );
        }
        const sourceCode = source[problemJudgeKey]?.[PROGRAMMING_LANGUAGE[language].mime] || '';
        const validSubmit = (
          <ButtonLoader
            type="secondary"
            size="tiny"
            disabled={sourceCode === ''}
            onClick={async setLoaderStatus => {
              setLoaderStatus(Status.LOADING);
              const result = cleanRequest<ContentResponseType<any>>(await authorizedRequest(
                contest?.problemIndex
                  ? JUDGE_API_V1.CONTEST.SUBMIT_V1(query.key + '', problemJudgeKey)
                  : JUDGE_API_V1.PROBLEM.SUBMIT_V1(query.key + ''), {
                  method: HTTPMethod.POST,
                  body: JSON.stringify({
                    language,
                    source: sourceCode,
                    session,
                  }),
                }));
              if (result.success) {
                if (result?.content.submitId) {
                  if (problem.judge === Judge.JUKI_JUDGE) {
                    listenSubmission(result.content.submitId, contest?.problemIndex ? problem.key : query.key as string);
                  }
                  addSuccessNotification(<T className="text-sentence-case">submission received</T>);
                }
                setLoaderStatus(Status.SUCCESS);
              } else {
                addErrorNotification(<T
                  className="text-sentence-case">{result.message || 'something went wrong, please try again later'}</T>);
                setLoaderStatus(Status.ERROR);
              }
              
              if (contest?.problemIndex) {
                await pushTab(ContestTab.MY_SUBMISSIONS);
              } else {
                await mutate(JUDGE_API_V1.SUBMISSIONS.PROBLEM_NICKNAME(problem?.key, nickname, 1, +myStatusPageSize, session));
                await push({ pathname: ROUTES.PROBLEMS.VIEW('' + problemKey, ProblemTab.MY_SUBMISSIONS), query: restQuery });
              }
            }}
          >
            {contest?.isAdmin || contest?.isJudge ? <T>submit as judge</T> : <T>submit</T>}
          </ButtonLoader>
        );
        if (contest?.isJudge || contest?.isAdmin || contest?.isContestant) {
          return validSubmit;
        }
        if (contest?.isGuest) {
          return (
            <ButtonLoader
              type="secondary"
              size="tiny"
              onClick={async () => {
                addSuccessNotification(<T className="text-sentence-case">to submit, first register</T>);
                await pushTab(ContestTab.OVERVIEW);
              }}
            >
              <T>submit</T>
            </ButtonLoader>
          );
        }
        if (contest?.isSpectator) {
          return <SpectatorInformation />;
        }
        
        if (!contest) {
          return validSubmit;
        }
      }}
      testCases={testCases}
      expandPosition={{
        width: 'var(--screen-content-width)',
        height: 'calc(var(--content-height) - var(--pad-md) - var(--pad-md))',
        top: 'calc(var(--top-horizontal-menu-height) + var(--pad-md))',
        left: 'calc((100vw - var(--screen-content-width)) / 2)',
      }}
    />
  );
};