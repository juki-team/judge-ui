import { useEffect, useJkSocket, useJukiNotification, useJukiUser, useState } from 'hooks';
import { createContext } from 'react';
import { PropsWithChildren, SocketEvent, SocketEventSubmissionResponseDTO, SubmissionRunStatus } from 'types';

type Submissions = { [key: string]: SocketEventSubmissionResponseDTO };

// TODO: fix listen submissions
export const TaskContext = createContext<{
  listenSubmission: (submissionId: string, key: string) => void, submissions: Submissions,
}>({ submissions: {}, listenSubmission: () => null });

export const TaskProvider = ({ children }: PropsWithChildren<{}>) => {
  const { user: { nickname } } = useJukiUser();
  const { addErrorNotification, addSuccessNotification } = useJukiNotification();
  const [ submissions, setSubmissions ] = useState<Submissions>({});
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
  
  const listenSubmission = async (listenSubmissionId: string, problemKey: string) => {
  
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
