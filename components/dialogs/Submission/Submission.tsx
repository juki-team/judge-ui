import {
  ButtonLoader,
  ContentCopyIcon,
  CopyToClipboard,
  Modal,
  OpenInNewIcon,
  RefreshIcon,
  SubmitView,
  T,
  Tooltip,
} from 'components';
import { ROUTES } from 'config/constants';
import { useJukiRouter, useJukiUI, useState } from 'hooks';
import React from 'react';
import { QueryParam, Status } from 'types';

interface SubmissionModalProps {
  submitId: string;
}

export const SubmissionModal = ({ submitId }: SubmissionModalProps) => {
  
  const { components: { Link } } = useJukiUI();
  const { deleteSearchParams } = useJukiRouter();
  const [ triggerFetch, setTriggerFetch ] = useState(0);
  
  const handleClose = () => deleteSearchParams({ name: QueryParam.SUBMISSION_VIEW });
  
  return (
    <Modal isOpen={true} onClose={handleClose} closeIcon closeWhenClickOutside>
      <section className="jk-pad-md">
        <div className="fw-bd tx-l jk-row-col left gap">
          <h3><T>submission</T></h3>
          <div className="jk-row gap">
            <Link href={ROUTES.SUBMISSIONS.VIEW(submitId)} target="_blank">
              <Tooltip content={<T>open submission in new tab</T>}>
                <div className="jk-button light only-icon small link"><OpenInNewIcon /></div>
              </Tooltip>
            </Link>
            <CopyToClipboard text={submitId}>
              <Tooltip content={<T>copy id</T>}>
                <div className="jk-button light only-icon small"><ContentCopyIcon /></div>
              </Tooltip>
            </CopyToClipboard>
            <Tooltip content={<T>reload</T>}>
              <ButtonLoader
                size="small"
                icon={<RefreshIcon />}
                onClick={async (setLoaderStatus) => {
                  setLoaderStatus(Status.LOADING);
                  setTriggerFetch(Date.now());
                  setLoaderStatus(Status.SUCCESS);
                }}
              />
            </Tooltip>
          </div>
        </div>
        <SubmitView submitId={submitId} triggerFetch={triggerFetch} />
      </section>
    </Modal>
  );
};
