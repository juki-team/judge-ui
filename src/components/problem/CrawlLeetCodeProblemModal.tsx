'use client';

import { PlusIcon } from '@juki-team/base-ui/server-components';
import { ButtonLoader, Input, Modal, T, useJukiNotification, useRouterStore, useSubscribe } from '@juki-team/base-ui';
import { jukiApiManager, jukiAppRoutes } from '@juki-team/base-ui/settings';
import { authorizedRequest } from '@juki-team/base-ui/helpers';
import { type SubscribeProblemCrawledWebSocketEventDTO } from '@juki-team/commons/dto';
import { Judge, Status, WebSocketSubscriptionEvent } from '@juki-team/commons/enums';
import { cleanRequest, isProblemCrawledWebSocketResponseEventDTO } from '@juki-team/commons/helpers';
import { type ContentResponse } from '@juki-team/commons/types';
import { useState } from 'react';
import { type BasicModalProps } from '@juki-team/base-ui/types';

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
            const { url, ...options } = jukiApiManager.apiV2.problem.crawl({
              body: {
                judgeKey: Judge.LEETCODE,
                key: slug,
              },
            });
            const response = cleanRequest<ContentResponse<{ key: string }>>(
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
