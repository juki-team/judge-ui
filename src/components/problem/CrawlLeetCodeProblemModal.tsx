'use client';

import { ButtonLoader, Input, Modal, PlusIcon, T } from 'components';
import { jukiApiManager, jukiAppRoutes } from 'config';
import { authorizedRequest, cleanRequest, isProblemCrawledWebSocketResponseEventDTO } from 'helpers';
import { useJukiNotification, useRouterStore, useUserStore, useWebsocketStore } from 'hooks';
import { useEffect, useState } from 'react';
import {
  BasicModalProps,
  ContentResponseType,
  Judge,
  ObjectIdType,
  Status,
  SubscribeProblemCrawledWebSocketEventDTO,
  WebSocketSubscriptionEvent,
} from 'types';

interface CrawlLeetCodeProblemModalProps extends BasicModalProps {
}

export const CrawlLeetCodeProblemModal = ({ onClose, isOpen }: CrawlLeetCodeProblemModalProps) => {
  
  const [ slug, setSlug ] = useState('');
  const { notifyResponse } = useJukiNotification();
  const userSessionId = useUserStore(state => state.user.sessionId);
  const pushRoute = useRouterStore(store => store.pushRoute);
  
  const problemKey = `PL-${slug}`;
  
  const subscribeToEvent = useWebsocketStore(store => store.subscribeToEvent);
  
  useEffect(() => {
    const event: SubscribeProblemCrawledWebSocketEventDTO = {
      event: WebSocketSubscriptionEvent.SUBSCRIBE_PROBLEM_CRAWLED,
      sessionId: userSessionId as ObjectIdType,
      problemKey,
    };
    return subscribeToEvent(event, ({ data }) => {
      if (isProblemCrawledWebSocketResponseEventDTO(data)) {
        void pushRoute(jukiAppRoutes.JUDGE().problems.view({ key: problemKey }));
      }
    });
  }, [ problemKey, pushRoute, subscribeToEvent, userSessionId ]);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeIcon>
      <div className="jk-col stretch gap jk-pg">
        <h3><T className="tt-se">crawl LeetCode problem</T></h3>
        <Input
          label={<T className="tt-se ws-np fw-bd">slug</T>}
          labelPlacement="top"
          value={slug}
          onChange={setSlug}
          expand
        />
        <ButtonLoader
          size="small"
          icon={<PlusIcon />}
          responsiveMobile
          onClick={async (setLoaderStatus) => {
            setLoaderStatus(Status.LOADING);
            const { url, ...options } = jukiApiManager.API_V1.problem.crawl({
              body: {
                judgeKey: Judge.LEETCODE,
                key: slug,
              },
            });
            const response = cleanRequest<ContentResponseType<{ key: string }>>(
              await authorizedRequest(url, options),
            );
            notifyResponse(response);
          }}
        >
          <T>crawl</T>
        </ButtonLoader>
      </div>
    </Modal>
  );
};
