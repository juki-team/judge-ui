import { ButtonLoader, Input, Modal, PlusIcon, T } from 'components/index';
import { ROUTES } from 'config/constants';
import { getProblemJudgeKey } from 'helpers';
import { useRouter } from 'hooks';
import { useState } from 'react';
import { Judge, ProblemTab, Status } from 'types';

export const CrawlJvumsaProblemModal = ({ onClose }: { onClose: () => void }) => {
  
  const [ key, setKey ] = useState('');
  const { push } = useRouter();
  
  return (
    <Modal isOpen={true} onClose={onClose} closeWhenClickOutside closeWhenKeyEscape closeIcon>
      <div className="jk-col gap jk-pad-md">
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
            await push(ROUTES.PROBLEMS.VIEW(getProblemJudgeKey(Judge.JV_UMSA, key), ProblemTab.STATEMENT));
            setLoaderStatus(Status.SUCCESS);
          }}
        >
          <T>crawl</T>
        </ButtonLoader>
      </div>
    </Modal>
  );
};
