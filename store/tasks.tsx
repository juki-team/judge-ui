import { T } from 'components';
import { JUDGE_API_V1, PROBLEM_VERDICT } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useJkSocket, useJukiUser, useNotification } from 'hooks';
import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import {
  ContentsResponseType,
  HTTPMethod,
  Judge,
  ProblemVerdict,
  SocketEvent,
  SocketEventSubmissionResponseDTO,
  SubmissionRunStatus,
} from 'types';

export const TaskContext = createContext<{
  listenSubmission: (submissionId: string, judge: Judge, key: string) => void,
  submissions: { [key: string]: SocketEventSubmissionResponseDTO },
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
    const submitId = data?.content?.submitId;
    if (submitId) {
      setSubmissions((prevState) => {
        const submissionData = prevState[submitId];
        const currentStatus = prevState[submitId]?.status;
        const nextStatus = data.content.status;
        if (!submissionData) {
          return { ...prevState, [submitId]: data.content };
        }
        if (
          [ SubmissionRunStatus.COMPILING, SubmissionRunStatus.COMPILED, SubmissionRunStatus.FAILED ]
            .includes(nextStatus)
          && (data.content.messageTimestamp > submissionData.messageTimestamp)
        ) {
          return { ...prevState, [submitId]: data.content };
        }
        if (
          [
            SubmissionRunStatus.FETCHING_TEST_CASES,
            SubmissionRunStatus.RUNNING_SAMPLE_TEST_CASES,
            SubmissionRunStatus.RUNNING_TEST_CASES,
            SubmissionRunStatus.EXECUTED_TEST_CASE,
          ].includes(nextStatus) && (
            [
              SubmissionRunStatus.COMPILING,
              SubmissionRunStatus.COMPILED,
              SubmissionRunStatus.FAILED,
              SubmissionRunStatus.FETCHING_TEST_CASES,
              SubmissionRunStatus.RUNNING_SAMPLE_TEST_CASES,
              SubmissionRunStatus.RUNNING_TEST_CASES,
              SubmissionRunStatus.EXECUTED_TEST_CASE,
            ].includes(currentStatus)
          )
          && (data.content.messageTimestamp > submissionData.messageTimestamp)
        ) {
          return {
            ...prevState,
            [submitId]: {
              ...data.content,
              
            },
          };
        }
        
        if (
          [
            SubmissionRunStatus.GRADING,
            SubmissionRunStatus.COMPLETED,
          ].includes(nextStatus) && (
            [
              SubmissionRunStatus.RECEIVED,
              SubmissionRunStatus.COMPILING,
              SubmissionRunStatus.COMPILED,
              SubmissionRunStatus.FAILED,
              SubmissionRunStatus.FETCHING_TEST_CASES,
              SubmissionRunStatus.RUNNING_SAMPLE_TEST_CASES,
              SubmissionRunStatus.RUNNING_TEST_CASES,
              SubmissionRunStatus.EXECUTED_TEST_CASE,
              SubmissionRunStatus.GRADING,
            ].includes(currentStatus)
          )
        ) {
          return { ...prevState, [submitId]: data.content };
        }
        return prevState;
      });
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
