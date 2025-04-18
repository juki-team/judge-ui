'use client';

import { AutorenewIcon, Button, ButtonLoader, Modal, SpinIcon, T } from 'components';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useFetcher, useJukiNotification } from 'hooks';
import { JUDGE_API_V1 } from 'src/constants';
import { BasicModalProps, ContentResponseType, HTTPMethod, Status, SubmissionRunStatus } from 'types';

interface RejudgeConfirmationModalProps extends BasicModalProps {
  problemKey: string,
  onClose: () => void,
}

export const RejudgeConfirmationModal = ({ problemKey, ...props }: RejudgeConfirmationModalProps) => {
  
  const { addSuccessNotification, addErrorNotification } = useJukiNotification();
  const { data, isLoading } = useFetcher<ContentResponseType<{
    count: number
  }>>(props.isOpen ? JUDGE_API_V1.REJUDGE.PROBLEM_COUNT(problemKey) : null);
  
  if (isLoading) {
    return (
      <Modal {...props}>
        <div className="jk-pg-lg jk-row">
          <SpinIcon size="large" />
        </div>
      </Modal>
    );
  }
  
  return (
    <Modal {...props}>
      <div className="jk-pg-lg">
        <h1><T>rejudge</T></h1>
        <div className="jk-pg-tb cr-er">
          <T className="tt-se">there are</T>&nbsp;
          <span className="fw-bd">{data?.success && data.content.count}</span>&nbsp;
          <T>submissions that were made outside of a contest</T>,&nbsp;
          <T>Are you sure you want to rejudge all of those submissions?</T>
        </div>
        <div className="jk-row gap right">
          <Button type="light" onClick={props.onClose}>
            <T>cancel</T>
          </Button>
          <ButtonLoader
            data-tooltip-id="jk-tooltip"
            data-tooltip-content="only submissions that are not in a contest will be judged"
            data-tooltip-t-class-name="tt-se"
            icon={<AutorenewIcon />}
            onClick={async setLoaderStatus => {
              setLoaderStatus(Status.LOADING);
              const result = cleanRequest<ContentResponseType<{
                listCount: number,
                status: SubmissionRunStatus.RECEIVED
              }>>(
                await authorizedRequest(
                  JUDGE_API_V1.REJUDGE.PROBLEM(problemKey), { method: HTTPMethod.POST },
                ),
              );
              if (result.success) {
                addSuccessNotification(<div><T>rejudging</T>&nbsp;{result.content.listCount}&nbsp;
                  <T>submissions</T></div>);
                setLoaderStatus(Status.SUCCESS);
                props.onClose();
              } else {
                addErrorNotification(<T
                  className="tt-se"
                >{result.message ||
                  'something went wrong, please try again later'}</T>);
                setLoaderStatus(Status.ERROR);
              }
            }}
          >
            <T>rejudge</T>
          </ButtonLoader>,
        </div>
      </div>
    </Modal>
  );
};
