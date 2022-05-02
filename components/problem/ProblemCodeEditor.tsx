import { SubmissionResponseDTO } from '@juki-team/commons';
import { ButtonLoader, CodeEditorKeyMap, CodeEditorTestCasesType, CodeEditorTheme, CodeRunnerEditor, T } from 'components';
import {
  ACCEPTED_PROGRAMMING_LANGUAGES,
  JUDGE_API_V1,
  MY_STATUS,
  OpenDialog,
  PROBLEM_VERDICT,
  PROGRAMMING_LANGUAGE,
  QueryParam,
  ROUTES,
  STATUS,
} from 'config/constants';
import { addParamQuery, authorizedRequest, cleanRequest, isStringJson } from 'helpers';
import { useNotification, useRouter } from 'hooks';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useUserState } from 'store';
import { useSWRConfig } from 'swr';
import {
  ContentResponseType,
  ContentsResponseType,
  ContestTab,
  HTTPMethod,
  ProblemResponseDTO,
  ProblemTab,
  ProblemVerdict,
  ProgrammingLanguage,
  Status,
  SubmissionRunStatus,
} from 'types';
import { useContestRouter } from '../../hooks';

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
}: { problem: ProblemResponseDTO, contest?: { isAdmin: boolean, isJudge: boolean, isContestant: boolean, problemIndex: string } }) => {
  
  const [listenSubmissionId, setListenSubmissionId] = useState('');
  const { mutate } = useSWRConfig();
  useEffect(() => {
    let interval;
    if (listenSubmissionId) {
      interval = setInterval(async () => {
        const result = cleanRequest<ContentsResponseType<SubmissionResponseDTO>>(await mutate(JUDGE_API_V1.SUBMISSIONS.PROBLEM_NICKNAME(problem.key, nickname, 1, 16, session)));
        if (result.success) {
          const submission = result.contents?.find(submission => submission?.submitId === listenSubmissionId);
          const verdict = submission?.verdict || null;
          const points = submission?.points || 0;
          if (verdict !== null && verdict !== ProblemVerdict.PENDING) {
            if (verdict === ProblemVerdict.AC) {
              addSuccessNotification(
                <div className="jk-pad">
                  <T className="text-capitalize">{PROBLEM_VERDICT[ProblemVerdict.AC].label}</T>
                </div>,
              );
            } else if (verdict === ProblemVerdict.PA) {
              addSuccessNotification(
                <div className="jk-pad">
                  <T className="text-capitalize">{PROBLEM_VERDICT[ProblemVerdict.PA].label}</T>
                  &bnsp;
                  ({points} <T>pnts</T>)
                </div>,
              );
            } else if (Object.keys(PROBLEM_VERDICT).includes(verdict)) {
              addErrorNotification(
                <div className="jk-pad">
                  <T className="text-capitalize">{PROBLEM_VERDICT[verdict].label}</T>
                </div>,
              );
            } else {
              addErrorNotification(<div className="jk-pad">{verdict}</div>);
            }
            setListenSubmissionId('');
          }
        }
      }, 10000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [listenSubmissionId]);
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
  const { [`${MY_STATUS}.pageSize`]: myStatusPageSize, [`${STATUS}.pageSize`]: statusPageSize } = query;
  
  const { key: problemKey, ...restQuery } = query;
  
  const editorStorageKey = 'jk-editor-settings-store/' + nickname;
  
  const storeKey = 'jk-problem-storage/' + (contest?.problemIndex ? contest?.problemIndex : '') + nickname;
  
  const [editorSettings, setEditorSettings] = useSaveStorage(editorStorageKey, {
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
  
  const defaultValue = { [problem.key]: {} };
  ACCEPTED_PROGRAMMING_LANGUAGES.forEach(key => {
    defaultValue[problem.key][PROGRAMMING_LANGUAGE[key].mime] = PROGRAMMING_LANGUAGE[key].templateSourceCode;
  });
  const [source, setSource] = useSaveStorage(storeKey, defaultValue);
  const { addSuccessNotification, addErrorNotification } = useNotification();
  return (
    <CodeRunnerEditor
      theme={editorSettings.theme}
      keyMap={editorSettings.keyMap}
      tabSize={editorSettings.tabSize}
      sourceCode={source[problem.key]?.[PROGRAMMING_LANGUAGE[language].mime] || ''}
      language={language}
      languages={languages}
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
        if (contest && !contest.isJudge && !contest.isAdmin && !contest.isContestant) {
          return (
            <ButtonLoader
              type="secondary"
              onClick={() => push({ query: addParamQuery(query, QueryParam.OPEN_DIALOG, OpenDialog.SIGN_IN) })}
              disabled
            >
              <T>to submit, first register</T>
            </ButtonLoader>
          );
        }
        
        const sourceCode = source[PROGRAMMING_LANGUAGE[language].mime] || '';
        return (
          <ButtonLoader
            type="secondary"
            disabled={sourceCode === ''}
            onClick={async setLoaderStatus => {
              setLoaderStatus(Status.LOADING);
              const result = cleanRequest<ContentResponseType<any>>(await authorizedRequest(
                contest?.problemIndex
                  ? JUDGE_API_V1.CONTEST.SUBMIT_V1(query.key + '', contest?.problemIndex)
                  : JUDGE_API_V1.PROBLEM.SUBMIT_V1(query.key + ''), {
                  method: HTTPMethod.POST,
                  body: JSON.stringify({
                    language,
                    source: sourceCode,
                    session,
                  }),
                }));
              /*new Array(1000).fill(1).forEach(() => {
               authorizedRequest(JUDGE_API_V1.PROBLEM.SUBMIT_V1(query.key + ''), {
               method: POST,
               body: JSON.stringify({
               language,
               source: source[PROGRAMMING_LANGUAGE[language].mime] || '',
               session,
               }),
               });
               });*/
              if (result.success) {
                if (result?.content.submitId) {
                  setListenSubmissionId(result.content.submitId);
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