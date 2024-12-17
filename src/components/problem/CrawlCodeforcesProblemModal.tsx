'use client';

import { ButtonLoader, Input, Modal, PlusIcon, T } from 'components';
import { jukiApiSocketManager, jukiAppRoutes } from 'config';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useJukiNotification, useJukiRouter } from 'hooks';
import { useState } from 'react';
import { BasicModalProps, ContentResponseType, Judge, Status } from 'types';

interface CrawlCodeforcesProblemModalProps extends BasicModalProps {
  judge: Judge.CODEFORCES | Judge.CODEFORCES_GYM,
}

export const CrawlCodeforcesProblemModal = ({ onClose, isOpen, judge }: CrawlCodeforcesProblemModalProps) => {
  
  const [ index, setIndex ] = useState('');
  const [ contestId, setContestId ] = useState('');
  const { notifyResponse } = useJukiNotification();
  const { pushRoute } = useJukiRouter();
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeIcon>
      <div className="jk-col stretch gap jk-pg">
        <h3><T>crawl codeforces problem</T></h3>
        <Input
          label={<T className="tt-se ws-np fw-bd">contest id</T>}
          labelPlacement="top"
          value={contestId}
          onChange={setContestId}
          extend
          type="number"
        />
        <Input
          label={<T className="tt-se ws-np fw-bd">index</T>}
          labelPlacement="top"
          size="auto"
          value={index}
          onChange={(value) => setIndex(value.toUpperCase())}
          extend
        />
        <ButtonLoader
          size="small"
          icon={<PlusIcon />}
          responsiveMobile
          onClick={async (setLoaderStatus) => {
            setLoaderStatus(Status.LOADING);
            const {
              url,
              ...options
            } = jukiApiSocketManager.API_V2.webScraping.codeforces.problemStatement({
              params: {
                contestId,
                index,
              },
            });
            const response = cleanRequest<ContentResponseType<{ key: string }>>(
              await authorizedRequest(url, options),
            );
            if (notifyResponse(response)) {
              pushRoute(jukiAppRoutes.JUDGE().problems.view({ key: response.content.key }));
            }
            setLoaderStatus(Status.SUCCESS);
          }}
        >
          <T>crawl</T>
        </ButtonLoader>
      </div>
    </Modal>
  );
};
