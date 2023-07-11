import { ButtonLoader, Input, Modal, PlusIcon, T } from 'components';
import { ROUTES } from 'config/constants';
import { getProblemJudgeKey } from 'helpers';
import { useRouter } from 'hooks';
import { useState } from 'react';
import { Judge, ProblemTab, Status } from 'types';

export const CrawlCodeforcesProblemModal = ({ onClose }: { onClose: () => void }) => {
  
  const [ key, setKey ] = useState('');
  const { push } = useRouter();
  
  return (
    <Modal isOpen={true} onClose={onClose} closeWhenClickOutside closeWhenKeyEscape closeIcon>
      <div className="jk-col gap jk-pad-md">
        <label>
          <T className="tt-se ws-np fw-bd">contest id</T>:&nbsp;
          <Input
            size={6}
            value={key.split('-')[0] || ''}
            onChange={(value) => setKey(prevState => `${value}-${key.split('-')[1] || ''}`)}
          />
        </label>
        <label className="jk-row nowrap">
          <T className="tt-se ws-np fw-bd">index</T>:&nbsp;
          <Input
            size="auto"
            value={key.split('-')[1] || ''}
            onChange={(value) => setKey(prevState => `${key.split('-')[0] || ''}-${value}`)}
          />
        </label>
        <ButtonLoader
          size="small"
          icon={<PlusIcon />}
          responsiveMobile
          onClick={async (setLoaderStatus) => {
            setLoaderStatus(Status.LOADING);
            await push(ROUTES.PROBLEMS.VIEW(getProblemJudgeKey(Judge.CODEFORCES, key), ProblemTab.STATEMENT));
            setLoaderStatus(Status.SUCCESS);
          }}
        >
          <T>crawl</T>
        </ButtonLoader>
      </div>
    </Modal>
  );
};
