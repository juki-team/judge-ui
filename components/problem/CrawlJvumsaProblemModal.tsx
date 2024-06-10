import { ButtonLoader, Input, Modal, PlusIcon, T } from 'components';
import { ROUTES } from 'config/constants';
import { getProblemJudgeKey } from 'helpers';
import { useJukiRouter } from 'hooks';
import { useState } from 'react';
import { BasicModalProps, Judge, ProblemTab, Status } from 'types';

export const CrawlJvumsaProblemModal = ({ onClose, isOpen }: BasicModalProps) => {
  
  const [ key, setKey ] = useState('');
  
  const { pushRoute } = useJukiRouter();
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeWhenClickOutside closeWhenKeyEscape closeIcon>
      <div className="jk-col gap jk-pg-md">
        <label className="jk-row nowrap">
          <T className="tt-se ws-np fw-bd">index</T>:&nbsp;
          <Input
            size="auto"
            value={key}
            onChange={setKey}
          />
        </label>
        <ButtonLoader
          size="small"
          icon={<PlusIcon />}
          responsiveMobile
          onClick={async (setLoaderStatus) => {
            setLoaderStatus(Status.LOADING);
            await pushRoute(ROUTES.PROBLEMS.VIEW(getProblemJudgeKey(Judge.JV_UMSA, key.trim()), ProblemTab.STATEMENT));
            setLoaderStatus(Status.SUCCESS);
          }}
        >
          <T>crawl</T>
        </ButtonLoader>
      </div>
    </Modal>
  );
};
