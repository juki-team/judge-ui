'use client';

import { SpinIcon } from '@juki-team/base-ui/server-components';
import { Button, ButtonLoader, Modal, T, useFetcher, useJukiNotification } from '@juki-team/base-ui';
import { authorizedRequest } from '@juki-team/base-ui/helpers';
import { HTTPMethod, Status, SubmissionRunStatus } from '@juki-team/commons/enums';
import { cleanRequest } from '@juki-team/commons/helpers';
import { type ContentResponse } from '@juki-team/commons/types';
import { JUDGE_API_V1 } from 'src/constants';
import { type BasicModalProps } from '@juki-team/base-ui/types';

interface RejudgeConfirmationModalProps extends BasicModalProps {
  problemKey: string,
  onClose: () => void,
}

export const RejudgeConfirmationModal = ({ problemKey, ...props }: RejudgeConfirmationModalProps) => {

  const { addSuccessNotification, addErrorNotification } = useJukiNotification();
  const { data, isLoading } = useFetcher<ContentResponse<{
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
        <h1><T className="tt-se">rejudge</T></h1>
        <div className="jk-pg-tb cr-er">
          <T className="tt-se">there are</T>&nbsp;
          <span className="fw-bd">{data?.success && data.content.count}</span>
          &nbsp;
          <T>submissions that were made outside of a contest</T>,&nbsp;
          <T>Are you sure you want to rejudge all of those submissions?</T>
        </div>
        <div className="jk-row-col gap right wh-100">
          <Button type="secondary" onClick={props.onClose}>
            <T className="tt-se">cancel</T>
          </Button>
          <ButtonLoader
            data-tooltip-id="jk-tooltip"
            data-tooltip-content="only submissions that are not in a contest will be judged"
            onClick={async setLoaderStatus => {
              setLoaderStatus(Status.LOADING);
              const result = cleanRequest<ContentResponse<{
                listCount: number,
                status: typeof SubmissionRunStatus.RECEIVED
              }>>(
                await authorizedRequest(
                  JUDGE_API_V1.REJUDGE.PROBLEM(problemKey), { method: HTTPMethod.POST },
                ),
              );
              if (result.success) {
                addSuccessNotification(
                  <div><T>rejudging</T>&nbsp;{result.content.listCount}&nbsp;<T>submissions</T></div>,
                );
                setLoaderStatus(Status.SUCCESS);
                props.onClose();
              } else {
                addErrorNotification(
                  <T className="tt-se">{result.message || 'something went wrong, please try again later'}</T>,
                );
                setLoaderStatus(Status.ERROR);
              }
            }}
          >
            <T className="tt-se">rejudge</T>
          </ButtonLoader>
        </div>
      </div>
    </Modal>
  );
};
