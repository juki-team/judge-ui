import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest, notifyResponse } from 'helpers';
import { useNotification } from 'hooks';
import { ButtonLoaderOnClickType, ContentResponseType, HTTPMethod, Status, SubmissionRunStatus } from 'types';

export const useRejudgeServices = () => {
  
  const { addNotification } = useNotification();
  
  return {
    rejudgeSubmission: (submissionId: string): ButtonLoaderOnClickType => async (setLoaderStatus, loaderStatus, event) => {
      setLoaderStatus(Status.LOADING);
      const response = cleanRequest<ContentResponseType<{ listCount: number, status: SubmissionRunStatus.RECEIVED }>>(
        await authorizedRequest(JUDGE_API_V1.REJUDGE.SUBMISSION(submissionId), {
          method: HTTPMethod.POST,
        }));
      if (notifyResponse(response, addNotification)) {
        setLoaderStatus(Status.SUCCESS);
      } else {
        setLoaderStatus(Status.ERROR);
      }
    },
    
  };
};
