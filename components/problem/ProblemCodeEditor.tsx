import { ButtonLoader, SpectatorInformation, T, UserCodeEditor } from 'components';
import { JUDGE_API_V1, PAGE_SIZE_OPTIONS, PROGRAMMING_LANGUAGE, ROUTES } from 'config/constants';
import { authorizedRequest, cleanRequest, getProblemJudgeKey } from 'helpers';
import { useContestRouter, useFetcher, useJukiRouter, useJukiUser, useNotification, useSWR, useTask } from 'hooks';
import { useMemo, useState } from 'react';
import {
  CodeEditorTestCasesType,
  ContentResponseType,
  ContestTab,
  HTTPMethod,
  Judge,
  JudgeResponseDTO,
  ProblemResponseDTO,
  ProblemTab,
  ProgrammingLanguage,
  QueryParam,
  QueryParamKey,
  Status,
  SubmissionRunStatus,
} from 'types';

interface ProblemCodeEditorProps {
  problem: ProblemResponseDTO,
  contest?: {
    isAdmin: boolean,
    isJudge: boolean,
    isContestant: boolean,
    isGuest: boolean,
    isSpectator: boolean,
    problemIndex: string,
    key: string,
    languages: { [key in Judge]: ProgrammingLanguage[] },
  }
}

export const ProblemCodeEditor = ({ problem, contest }: ProblemCodeEditorProps) => {
  const { appendSearchParams, searchParams, routeParams, pushRoute } = useJukiRouter();
  const { addErrorNotification, addInfoNotification, addWarningNotification } = useNotification();
  const { mutate } = useSWR();
  const { listenSubmission } = useTask();
  const initialTestCases: CodeEditorTestCasesType = {};
  problem.statement.sampleCases?.forEach((sample, index) => {
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
      withPE: problem.settings.withPE,
      testOut: sample.output,
      hidden: false,
    };
  });
  const { user: { nickname, isLogged }, company: { key: companyKey } } = useJukiUser();
  const { pushTab } = useContestRouter();
  const myStatusPageSize = searchParams.get(`${QueryParam.MY_STATUS_TABLE}.${QueryParam.PAGE_SIZE_TABLE}`);
  const filter = searchParams.get(`${QueryParam.MY_STATUS_TABLE}.${QueryParam.FILTER_TABLE}`);
  const { key: problemKey, ...restQuery } = routeParams;
  const { data: virtualJudgeData } = useFetcher<ContentResponseType<JudgeResponseDTO>>(
    [ Judge.CODEFORCES, Judge.JV_UMSA, Judge.CODEFORCES_GYM ].includes(problem.judge) ? JUDGE_API_V1.JUDGE.GET(problem.judge, companyKey) : null,
  );
  const languages = useMemo(
    () => {
      let languages = [];
      if ([ Judge.CODEFORCES, Judge.JV_UMSA, Judge.CODEFORCES_GYM ].includes(problem.judge)) {
        languages = ((virtualJudgeData?.success && virtualJudgeData.content.languages) || [])
          .filter(lang => lang.enabled)
          .map(lang => ({
            value: lang.value,
            label: lang.label || lang.value,
          }));
      } else if (problem.judge === Judge.CUSTOMER || problem.judge === Judge.JUKI_JUDGE) {
        languages = Object.values(problem?.settings.byProgrammingLanguage || {})
          .filter(
            contest ? ({ language }) => contest.languages[problem.judge].some(lang => lang === language)
              : () => true,
          )
          .map(({ language }) => ({
            value: language,
            label: PROGRAMMING_LANGUAGE[language]?.label || language,
          }));
      } else {
        languages = Object.values(problem?.settings.byProgrammingLanguage || {}).map(({ language }) => ({
          value: language,
          label: PROGRAMMING_LANGUAGE[language]?.label || language,
        }));
      }
      if (!languages.length) {
        languages = [ {
          value: ProgrammingLanguage.TEXT,
          label: PROGRAMMING_LANGUAGE[ProgrammingLanguage.TEXT]?.label,
        } ];
      }
      return languages;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ JSON.stringify(problem?.settings.byProgrammingLanguage), virtualJudgeData, problem.judge, JSON.stringify(contest?.languages) ],
  );
  
  const [ language, setLanguage ] = useState<string>(ProgrammingLanguage.TEXT);
  const [ sourceCode, setSourceCode ] = useState('');
  
  const problemJudgeKey = getProblemJudgeKey(problem.judge, problem.key);
  
  return (
    <UserCodeEditor
      expandPosition={{
        // width: 'var(--screen-content-width)',
        // height: 'calc(var(--content-height) - var(--pad-md) - var(--pad-md))',
        width: '100vw',
        height: 'calc(100vh - 41px)',
        // top: 'calc(var(--top-horizontal-menu-height) + var(--pad-md))',
        top: '41px',
        left: '0',
        // left: 'calc((100vw - var(--screen-content-width)) / 2)',
      }}
      sourceStoreKey={(contest ? contest.key + '/' : '') + problemJudgeKey}
      languages={languages}
      onSourceChange={setSourceCode}
      onLanguageChange={setLanguage}
      middleButtons={() => {
        if (!isLogged) {
          return (
            <ButtonLoader
              type="secondary"
              size="tiny"
              onClick={async () => {
                addWarningNotification(<T className="tt-se">to submit, first login</T>);
                appendSearchParams({ name: QueryParamKey.SIGN_IN, value: '1' });
              }}
            >
              <T>submit</T>
            </ButtonLoader>
          );
        }
        const validSubmit = (
          <ButtonLoader
            type="secondary"
            size="tiny"
            disabled={sourceCode === ''}
            onClick={async setLoaderStatus => {
              setLoaderStatus(Status.LOADING);
              const response = cleanRequest<ContentResponseType<any>>(
                await authorizedRequest(
                  contest?.problemIndex ? JUDGE_API_V1.CONTEST.SUBMIT(contest.key, problemJudgeKey) : JUDGE_API_V1.PROBLEM.SUBMIT(problem.judge, problem.key),
                  { method: HTTPMethod.POST, body: JSON.stringify({ language, source: sourceCode }) },
                ),
              );
              if (response.success) {
                if (response?.content.submitId) {
                  listenSubmission(
                    response.content.submitId,
                    problem.judge,
                    problem.key,
                  );
                  addInfoNotification(<T className="tt-se">submission received</T>);
                }
                setLoaderStatus(Status.SUCCESS);
              } else {
                addErrorNotification(<T
                  className="tt-se"
                >{response.message || 'something went wrong, please try again later'}</T>);
                setLoaderStatus(Status.ERROR);
              }
              
              if (contest?.problemIndex) {
                await pushTab(ContestTab.MY_SUBMISSIONS);
                // TODO fix the filter Url param
                await mutate(JUDGE_API_V1.SUBMISSIONS.CONTEST_NICKNAME(
                  routeParams.key as string,
                  nickname,
                  1,
                  +(myStatusPageSize || PAGE_SIZE_OPTIONS[0]),
                  '',
                  '',
                ));
              } else {
                // TODO fix the filter Url param
                await mutate(JUDGE_API_V1.SUBMISSIONS.PROBLEM_NICKNAME(
                  problem.judge,
                  problem.key,
                  nickname,
                  1,
                  +(myStatusPageSize || PAGE_SIZE_OPTIONS[0]),
                  '',
                  '',
                ));
                pushRoute({
                  pathname: ROUTES.PROBLEMS.VIEW('' + problemKey, ProblemTab.MY_SUBMISSIONS),
                  searchParams,
                });
              }
            }}
          >
            {contest?.isAdmin || contest?.isJudge ? <T>submit as judge</T> : <T>submit</T>}
          </ButtonLoader>
        );
        if (contest?.isAdmin || contest?.isJudge || contest?.isContestant) {
          return validSubmit;
        }
        if (contest?.isGuest) {
          return (
            <ButtonLoader
              type="secondary"
              size="tiny"
              onClick={() => {
                addWarningNotification(<T className="tt-se">to submit, first register</T>);
                pushTab(ContestTab.OVERVIEW);
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
      initialTestCases={(problem.judge === Judge.JUKI_JUDGE || problem.judge === Judge.CUSTOMER)
        ? initialTestCases
        : undefined}
      enableAddCustomSampleCases
    />
  );
};
