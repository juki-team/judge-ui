'use client';

import { ButtonLoader, Input, Modal, PlusIcon, T } from 'components';
import { jukiApiManager, jukiAppRoutes } from 'config';
import { authorizedRequest, cleanRequest, isProblemCrawledWebSocketResponseEventDTO } from 'helpers';
import { useJukiNotification, useRouterStore, useSubscribe } from 'hooks';
import { useState } from 'react';
import {
  BasicModalProps,
  ContentResponseType,
  Judge,
  Status,
  SubscribeProblemCrawledWebSocketEventDTO,
  WebSocketSubscriptionEvent,
} from 'types';

interface CrawlLeetCodeProblemModalProps extends BasicModalProps {
}

export const CrawlLeetCodeProblemModal = ({ onClose, isOpen }: CrawlLeetCodeProblemModalProps) => {
  
  const [ slug, setSlug ] = useState('');
  const { notifyResponse } = useJukiNotification();
  const pushRoute = useRouterStore(store => store.pushRoute);
  
  const problemKey = `PL-${slug}`;
  
  const event: Omit<SubscribeProblemCrawledWebSocketEventDTO, 'clientId'> = {
    event: WebSocketSubscriptionEvent.SUBSCRIBE_PROBLEM_CRAWLED,
    problemKey,
  };
  useSubscribe(
    event,
    (data) => {
      if (isProblemCrawledWebSocketResponseEventDTO(data)) {
        void pushRoute(jukiAppRoutes.JUDGE().problems.view({ key: problemKey }));
      }
    },
  );
  
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
            const { url, ...options } = jukiApiManager.API_V2.problem.crawl({
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
