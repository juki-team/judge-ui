import { ButtonLoader, SpectatorInformation, T, UserCodeEditor } from 'components';
import { JUDGE_API_V1, OpenDialog, QueryParam, ROUTES } from 'config/constants';
import { addParamQuery, authorizedRequest, cleanRequest, getProblemJudgeKey } from 'helpers';
import { useContestRouter, useNotification, useRouter } from 'hooks';
import { useMemo, useState } from 'react';
import { useTaskDispatch, useUserState } from 'store';
import { useSWRConfig } from 'swr';
import {
  CodeEditorTestCasesType,
  ContentResponseType,
  ContestTab,
  HTTPMethod,
  Judge,
  ProblemResponseDTO,
  ProblemTab,
  ProgrammingLanguage,
  Status,
  SubmissionRunStatus,
} from 'types';

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
  const { nickname, isLogged } = useUserState();
  const { query, push } = useRouter();
  const { pushTab } = useContestRouter();
  const { [`${QueryParam.MY_STATUS_TABLE}.${QueryParam.PAGE_SIZE_TABLE}`]: myStatusPageSize } = query;
  const { key: problemKey, ...restQuery } = query;
  const languages = useMemo(() => Object.values(problem?.settings.languages || {}), [JSON.stringify(problem?.settings.languages)]);
  const [language, setLanguage] = useState(ProgrammingLanguage.TEXT);
  const problemJudgeKey = getProblemJudgeKey(problem.judge, problem.key);
  const [sourceCode, setSourceCode] = useState('');
  
  return (
    <UserCodeEditor
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
              const result = cleanRequest<ContentResponseType<any>>(await authorizedRequest(
                contest?.problemIndex
                  ? JUDGE_API_V1.CONTEST.SUBMIT(query.key + '', problemJudgeKey)
                  : JUDGE_API_V1.PROBLEM.SUBMIT(query.key + ''), {
                  method: HTTPMethod.POST,
                  body: JSON.stringify({ language, source: sourceCode }),
                }));
              if (result.success) {
                if (result?.content.submitId) {
                  if (problem.judge === Judge.JUKI_JUDGE) {
                    listenSubmission(result.content.submitId, contest?.problemIndex ? problem.key : query.key as string);
                  }
                  addSuccessNotification(<T className="tt-se">submission received</T>);
                }
                setLoaderStatus(Status.SUCCESS);
              } else {
                addErrorNotification(<T
                  className="tt-se">{result.message || 'something went wrong, please try again later'}</T>);
                setLoaderStatus(Status.ERROR);
              }
              
              if (contest?.problemIndex) {
                await pushTab(ContestTab.MY_SUBMISSIONS);
                await mutate(JUDGE_API_V1.SUBMISSIONS.CONTEST_NICKNAME(query.key as string, nickname, 1, +myStatusPageSize));
              } else {
                await mutate(JUDGE_API_V1.SUBMISSIONS.PROBLEM_NICKNAME(problem?.key, nickname, 1, +myStatusPageSize));
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