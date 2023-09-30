import { ContentCopyIcon, CopyToClipboard, Modal, OpenInNewIcon, SubmitView, T } from 'components';
import { ROUTES } from 'config/constants';
import { useJukiUI } from 'hooks';
import Link from 'next/link';
import React from 'react';
import { QueryParam } from 'types';

interface SubmissionModalProps {
  submitId: string;
}

export const SubmissionModal = ({ submitId }: SubmissionModalProps) => {
  
  const { router: { deleteSearchParams }, viewPortSize } = useJukiUI();
  const handleClose = () => deleteSearchParams({ name: QueryParam.SUBMISSION_VIEW });
  
  
  return (
    <Modal isOpen={true} onClose={handleClose} closeIcon closeWhenClickOutside expand={viewPortSize === 'sm'}>
      <section className="jk-pad-md">
        <div className="fw-bd tx-l jk-row left gap">
          <div className="jk-row">
            <T className="tt-se">submission</T>&nbsp;
            <div className="tx-s fw-nl">{submitId}</div>
          </div>
          <Link href={ROUTES.SUBMISSIONS.VIEW(submitId)} target="_blank">
            <div className="jk-row link"><OpenInNewIcon size="small" /></div>
          </Link>
          <CopyToClipboard text={submitId}>
            <div className="jk-row link"><ContentCopyIcon size="small" /></div>
          </CopyToClipboard>
        </div>
        <SubmitView submitId={submitId} />
      </section>
    </Modal>
  );
};
