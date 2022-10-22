import { T } from 'components';
import { JUDGE_API_V1, PROBLEM_VERDICT } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useNotification } from 'hooks';
import { createContext, PropsWithChildren, useContext } from 'react';
import { useUserState } from 'store';
import { ContentsResponseType, HTTPMethod, ProblemVerdict } from 'types';

export const TaskContext = createContext<{ listenSubmission: (submissionId: string, problem: string) => void }>({
  listenSubmission: () => null,
});

export const TaskProvider = ({ children }: PropsWithChildren<{}>) => {
  const { nickname } = useUserState();
  const { addErrorNotification, addSuccessNotification } = useNotification();
  
  const listenSubmission = async (listenSubmissionId, problemKey) => {
    const result = cleanRequest<ContentsResponseType<{ submitId: string, verdict: ProblemVerdict, points: number, contestName?: string, contestProblemIndex?: string, problemName: string }>>(
      await authorizedRequest(JUDGE_API_V1.SUBMISSIONS.PROBLEM_NICKNAME(problemKey, nickname, 1, 16, ''), {
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
              ({points} <T>pnts</T>)
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
        setTimeout(() => listenSubmission(listenSubmissionId, problemKey), 10000);
      }
    }
  };
  
  return (
    <TaskContext.Provider value={{
      listenSubmission,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskState = () => {
  const {} = useContext(TaskContext);
  
  return {};
};

export const useTaskDispatch = () => {
  const { listenSubmission } = useContext(TaskContext);
  
  return {
    listenSubmission,
  };
};
