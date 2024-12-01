'use client';

import { ButtonLoader, FetcherLayer, Input, Modal, PlusIcon, T } from 'components';
import { jukiApiSocketManager, jukiAppRoutes } from 'config';
import { useJukiRouter } from 'hooks';
import { useState } from 'react';
import { BasicModalProps, ContentResponseType, Judge, JudgeDataResponseDTO, Status } from 'types';

const Content = ({ judge }: { judge: JudgeDataResponseDTO }) => {
  
  const [ key, setKey ] = useState('');
  
  const { pushRoute } = useJukiRouter();
  
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
    <Modal isOpen={isOpen} onClose={onClose} closeWhenClickOutside closeWhenKeyEscape closeIcon>
      <div className="jk-col gap jk-pg-md">
        <FetcherLayer<ContentResponseType<JudgeDataResponseDTO>> url={jukiApiSocketManager.API_V1.judge.getData({ params: { key: Judge.JV_UMSA as string } }).url}>
          {({ data: { content } }) => (
            <Content judge={content} />
          )}
        </FetcherLayer>
      </div>
    </Modal>
  );
};
