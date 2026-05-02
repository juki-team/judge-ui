'use client';

import { PlusIcon } from '@juki-team/base-ui/server-components';
import { ButtonLoader, FetcherLayer, Input, Modal, T, useRouterStore } from '@juki-team/base-ui';
import { jukiApiManager, jukiAppRoutes } from '@juki-team/base-ui/settings';
import { useState } from 'react';
import { type BasicModalProps } from '@juki-team/base-ui/types';
import { type JudgeDataResponseDTO } from '@juki-team/commons/dto';
import { Judge, Status } from '@juki-team/commons/enums';
import { type ContentResponse } from '@juki-team/commons/types';

const Content = ({ judge }: { judge: JudgeDataResponseDTO }) => {

  const [ key, setKey ] = useState('');
  const pushRoute = useRouterStore(state => state.pushRoute);

  return (
    <>
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
          pushRoute(jukiAppRoutes.JUDGE().problems.view({ key: `${judge.keyPrefix}-${key}` }));
          setLoaderStatus(Status.SUCCESS);
        }}
      >
        <T>crawl</T>
      </ButtonLoader>
    </>
  );
};

export const CrawlJvumsaProblemModal = ({ onClose, isOpen }: BasicModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeIcon>
      <div className="jk-col gap jk-pg-md">
        <FetcherLayer<ContentResponse<JudgeDataResponseDTO>> url={jukiApiManager.apiV2.judge.getData({ params: { key: Judge.JV_UMSA as string } }).url}>
          {({ data: { content } }) => (
            <Content judge={content} />
          )}
        </FetcherLayer>
      </div>
    </Modal>
  );
};
