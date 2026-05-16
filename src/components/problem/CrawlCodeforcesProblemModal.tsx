'use client';

import { PlusIcon } from '@juki-team/base-ui/server-components';
import { ButtonLoader, Input, Modal, T, useJukiNotification } from '@juki-team/base-ui';
import { jukiApiManager } from '@juki-team/base-ui/settings';
import { authorizedRequest } from '@juki-team/base-ui/helpers';
import { Judge, Status } from '@juki-team/commons/enums';
import { cleanRequest } from '@juki-team/commons/helpers';
import { type ContentResponse } from '@juki-team/commons/types';
import { useState } from 'react';
import { type BasicModalProps } from '@juki-team/base-ui/types';

interface CrawlCodeforcesProblemModalProps extends BasicModalProps {
  judge: typeof Judge.CODEFORCES | typeof Judge.CODEFORCES_GYM,
}

export const CrawlCodeforcesProblemModal = ({ onClose, isOpen }: CrawlCodeforcesProblemModalProps) => {

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
            const { url, ...options } = jukiApiManager.apiV2.problem.crawl({
              body: {
                judgeKey: Judge.CODEFORCES,
                key: `${contestId}-${index}`,
              },
            });
            const response = cleanRequest<ContentResponse<{ key: string }>>(
              await authorizedRequest(url, options),
            );
            if (notifyResponse(response)) {
              // TODO:
              // const problemKey = `PC-${contestId}-${index}`;
              // jukiApiManager.SOCKET.send({
              //   event: WebSocketSubscriptionEvent.SUBSCRIBE_PROBLEM_CRAWLED,
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
