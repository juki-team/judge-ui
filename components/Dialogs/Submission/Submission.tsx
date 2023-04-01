import { Modal, OpenInNewIcon, SubmitView, T } from 'components';
import { removeParamQuery } from 'helpers';
import { useRouter } from 'next/router';
import React from 'react';
import { QueryParam } from 'types';
import { ROUTES } from 'config/constants';
import Link from 'next/link';

export const SubmissionModal = ({ submitId }: { submitId: string }) => {
  
  const { push, query } = useRouter();
  const handleClose = () => push({ query: removeParamQuery(query, QueryParam.SUBMISSION_VIEW, null) });
  
  return (
    <Modal isOpen={true} onClose={handleClose} closeIcon closeWhenClickOutside>
      <section className="jk-pad-md">
        <Link href={ROUTES.SUBMISSIONS.VIEW(submitId)} className="link" target="_blank">
          <div className="fw-bd tx-l jk-row left">
            <T>submission</T>&nbsp;
            <div className="tx-s fw-nl">{submitId}</div>
            &nbsp;
            <div className="jk-row"><OpenInNewIcon size="small" /></div>
          </div>
        </Link>
        <SubmitView submitId={submitId} />
      </section>
    </Modal>
  );
};
