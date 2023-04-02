import { ButtonLoader, SpectatorInformation, T, UserCodeEditor } from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { addParamQuery, authorizedRequest, cleanRequest, getProblemJudgeKey } from 'helpers';
import { useContestRouter, useJukiUser, useNotification, useRouter, useSWR, useTask } from 'hooks';
import { useMemo, useState } from 'react';
import {
  CodeEditorTestCasesType,
  ContentResponseType,
  ContestTab,
  HTTPMethod,
  OpenDialog,
  ProblemResponseDTO,
  ProblemTab,
  ProgrammingLanguage,
  QueryParam,
  Status,
  SubmissionRunStatus,
} from 'types';

export const ProblemCodeEditor = ({
  problem,
  contest,
}: {
  problem: ProblemResponseDTO,
  contest?: {
    isAdmin: boolean,
    isJudge: boolean,
    isContestant: boolean,
    isGuest: boolean,
    isSpectator: boolean,
    problemIndex: string,
    key: string,
  }
}) => {
  
  const { addSuccessNotification, addErrorNotification } = useNotification();
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
    };
  });
  const { user: { nickname, isLogged } } = useJukiUser();
  const { query, push } = useRouter();
  const { pushTab } = useContestRouter();
  const {
    [`${QueryParam.MY_STATUS_TABLE}.${QueryParam.PAGE_SIZE_TABLE}`]: myStatusPageSize,
    [`${QueryParam.MY_STATUS_TABLE}.${QueryParam.FILTER_TABLE}`]: filter,
  } = query;
  const { key: problemKey, ...restQuery } = query;
  const languages = useMemo(
    () => Object.values(problem?.settings.languages || {}),
    [ JSON.stringify(problem?.settings.languages) ],
  );
  const [ language, setLanguage ] = useState(ProgrammingLanguage.TEXT);
  const problemJudgeKey = getProblemJudgeKey(problem.judge, problem.key);
  const [ sourceCode, setSourceCode ] = useState('');
  
  return (
    <UserCodeEditor
      className="br-g6"
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
      sourceStoreKey={problemJudgeKey}
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
                addSuccessNotification(<T className="tt-se">to submit, first login</T>);
                await push({ query: addParamQuery(query, QueryParam.DIALOG, OpenDialog.SIGN_IN) });
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
              const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(
                contest?.problemIndex
                  ? JUDGE_API_V1.CONTEST.SUBMIT(contest.key, problemJudgeKey)
                  : JUDGE_API_V1.PROBLEM.SUBMIT(problem.judge, problemJudgeKey), {
                  method: HTTPMethod.POST,
                  body: JSON.stringify({ language, source: sourceCode }),
                }));
              if (response.success) {
                if (response?.content.submitId) {
                  listenSubmission(
                    response.content.submitId,
                    problem.judge,
                    problem.key,
                  );
                  addSuccessNotification(<T className="tt-se">submission received</T>);
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
                  query.key as string,
                  nickname,
                  1,
                  +myStatusPageSize,
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
                  +myStatusPageSize,
                  '',
                  '',
                ));
                await push({
                  pathname: ROUTES.PROBLEMS.VIEW('' + problemKey, ProblemTab.MY_SUBMISSIONS),
                  query: restQuery,
                });
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
                addSuccessNotification(<T className="tt-se">to submit, first register</T>);
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
      initialTestCases={initialTestCases}
    />
  );
};
