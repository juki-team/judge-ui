import { Judge, SocketEvent } from '@juki-team/commons';
import { T } from 'components';
import { JUDGE_API_V1, PROBLEM_VERDICT } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useJkSocket, useJukiUser, useNotification } from 'hooks';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { ContentsResponseType, HTTPMethod, ProblemVerdict, SubmissionRunStatus } from 'types';

export const TaskContext = createContext<{
  listenSubmission: (submissionId: string, judge: Judge, key: string) => void,
  submissions: { [key: string]: { submitId: string, status: SubmissionRunStatus } },
}>({
  submissions: {},
  listenSubmission: () => null,
});

export const TaskProvider = ({ children }: PropsWithChildren<{}>) => {
  const { user: { nickname } } = useJukiUser();
  const { addErrorNotification, addSuccessNotification } = useNotification();
  const [ submissions, setSubmissions ] = useState({});
  const { pop } = useJkSocket(SocketEvent.SUBMISSION);
  
  useEffect(() => {
    const data = pop();
    if (data?.content?.submitId) {
      setSubmissions((prevState) => ({ ...prevState, [data?.content?.submitId]: data.content }));
    }
  }, [ pop ]);
  
  const listenSubmission = async (listenSubmissionId: string, problemJudge: Judge, problemKey: string) => {
    const result = cleanRequest<ContentsResponseType<{
      submitId: string,
      verdict: ProblemVerdict,
      points: number,
      contestName?: string,
      contestProblemIndex?: string,
      problemName: string
    }>>(
      await authorizedRequest(JUDGE_API_V1.SUBMISSIONS.PROBLEM_NICKNAME(
        problemJudge,
        problemKey,
        nickname,
        1,
        16,
        '',
        '',
      ), {
        method: HTTPMethod.GET,
      }));
    if (result.success) {
      const submission = result.contents?.find(submission => submission?.submitId === listenSubmissionId);
      const verdict = submission?.verdict || null;
      const points = submission?.points || 0;
      if (verdict !== null && verdict !== ProblemVerdict.PENDING) {
        if (verdict === ProblemVerdict.AC) {
          addSuccessNotification(
            <div className="jk-pad-md">
              {(submission?.contestName && submission.contestProblemIndex) ?
                <>
                  <div><T className="tt-se">contest</T>: {submission?.contestName}</div>
                  <div>({submission.contestProblemIndex}) {submission.problemName}</div>
                </>
                : <div>{submission.problemName}</div>
              }
              <T className="tt-ce">{PROBLEM_VERDICT[ProblemVerdict.AC].label}</T>
            </div>,
          );
        } else if (verdict === ProblemVerdict.PA) {
          addSuccessNotification(
            <div className="jk-pad-md">
              {(submission?.contestName && submission.contestProblemIndex) ?
                <>
                  <div><T className="tt-se">contest</T>: {submission?.contestName}</div>
                  <div>({submission.contestProblemIndex}) {submission.problemName}</div>
                </>
                : <div>{submission.problemName}</div>
              }
              <T className="tt-ce">{PROBLEM_VERDICT[ProblemVerdict.PA].label}</T>
              &bnsp;
              ({points} <T>pts.</T>)
            </div>,
          );
        } else if (Object.keys(PROBLEM_VERDICT).includes(verdict)) {
          addErrorNotification(
            <div className="jk-pad-md">
              {(submission?.contestName && submission.contestProblemIndex) ?
                <>
                  <div><T className="tt-se">contest</T>: {submission?.contestName}</div>
                  <div>({submission.contestProblemIndex}) {submission.problemName}</div>
                </>
                : <div>{submission.problemName}</div>
              }
              <T className="tt-ce">{PROBLEM_VERDICT[verdict].label}</T>
            </div>,
          );
        } else {
          addErrorNotification(<div className="jk-pad-md">{verdict}</div>);
        }
      } else {
        setTimeout(() => listenSubmission(listenSubmissionId, problemJudge, problemKey), 10000);
      }
    }
  };
  
  return (
    <TaskContext.Provider
      value={{
        listenSubmission,
        submissions,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
