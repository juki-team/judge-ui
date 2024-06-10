import { ButtonLoader, Input, Modal, PlusIcon, T } from 'components';
import { ROUTES } from 'config/constants';
import { getProblemJudgeKey } from 'helpers';
import { useJukiRouter } from 'hooks';
import { useState } from 'react';
import { BasicModalProps, Judge, ProblemTab, Status } from 'types';

interface CrawlCodeforcesProblemModalProps extends BasicModalProps {
  judge: Judge.CODEFORCES | Judge.CODEFORCES_GYM,
}

export const CrawlCodeforcesProblemModal = ({ onClose, isOpen, judge }: CrawlCodeforcesProblemModalProps) => {
  
  const [ key, setKey ] = useState('');
  
  const { pushRoute } = useJukiRouter();
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeWhenClickOutside closeWhenKeyEscape closeIcon>
      <div className="jk-col gap jk-pg-md">
        <label>
          <T className="tt-se ws-np fw-bd">contest id</T>:&nbsp;
          <Input
            size={6}
            value={key.split('-')[0] || ''}
            onChange={(value) => setKey(prevState => `${value.trim()}-${key.split('-')[1] || ''}`)}
          />
        </label>
        <label className="jk-row nowrap">
          <T className="tt-se ws-np fw-bd">index</T>:&nbsp;
          <Input
            size="auto"
            value={key.split('-')[1] || ''}
            onChange={(value) => setKey(prevState => `${key.split('-')[0] || ''}-${value.trim()}`)}
          />
        </label>
        <ButtonLoader
          size="small"
          icon={<PlusIcon />}
          responsiveMobile
          onClick={async (setLoaderStatus) => {
            setLoaderStatus(Status.LOADING);
            await pushRoute(ROUTES.PROBLEMS.VIEW(getProblemJudgeKey(judge, key), ProblemTab.STATEMENT));
            setLoaderStatus(Status.SUCCESS);
          }}
        >
          <T>crawl</T>
        </ButtonLoader>
      </div>
    </Modal>
  );
};
