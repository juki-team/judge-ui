'use client';

import { ButtonLoader, Input, Modal, PlusIcon, T } from 'components';
import { jukiApiManager } from 'config';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useJukiNotification } from 'hooks';
import { useState } from 'react';
import { BasicModalProps, ContentResponseType, Judge, Status } from 'types';

interface CrawlCodeforcesProblemModalProps extends BasicModalProps {
  judge: Judge.CODEFORCES | Judge.CODEFORCES_GYM,
}

export const CrawlCodeforcesProblemModal = ({ onClose, isOpen, judge }: CrawlCodeforcesProblemModalProps) => {
  
  const [ index, setIndex ] = useState('');
  const [ contestId, setContestId ] = useState('');
  const { notifyResponse } = useJukiNotification();
  // const pushRoute = useRouterStore(state => state.pushRoute);
  // const userSessionId = useUserStore(state => state.user.sessionId);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeIcon>
      <div className="jk-col stretch gap jk-pg">
        <h3><T className="tt-se">crawl codeforces problem</T></h3>
        <Input
          label={<T className="tt-se ws-np fw-bd">contest id</T>}
          labelPlacement="top"
          value={contestId}
          onChange={setContestId}
          expand
          type="number"
        />
        <Input
          label={<T className="tt-se ws-np fw-bd">index</T>}
          labelPlacement="top"
          size="auto"
          value={index}
          onChange={(value) => setIndex(value.toUpperCase())}
          expand
        />
        <ButtonLoader
          size="small"
          icon={<PlusIcon />}
          responsiveMobile
          onClick={async (setLoaderStatus) => {
            setLoaderStatus(Status.LOADING);
            const { url, ...options } = jukiApiManager.API_V1.problem.crawlStatement({
              body: {
                judgeKey: Judge.CODEFORCES,
                contestId,
                index,
              },
            });
            const response = cleanRequest<ContentResponseType<{ key: string }>>(
              await authorizedRequest(url, options),
            );
            if (notifyResponse(response)) {
              // TODO:
              // const problemKey = `PC-${contestId}-${index}`;
              // jukiApiManager.SOCKET.send({
              //   event: WebSocketActionEvent.SUBSCRIBE_PROBLEM_CRAWLED,
              //   sessionId: userSessionId,
              //   problemKey,
              // }, () => {
              //   setLoaderStatus(Status.SUCCESS);
              //   pushRoute(jukiAppRoutes.JUDGE().problems.view({ key: problemKey }));
              // });
            }
          }}
        >
          <T>crawl</T>
        </ButtonLoader>
      </div>
    </Modal>
  );
};
