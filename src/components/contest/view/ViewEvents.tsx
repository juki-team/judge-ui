'use client';

import { jukiApiManager } from '@juki-team/base-ui/settings';
import { Button, ButtonLoader, CodeViewer, DateLiteral, LineLoader, Modal, T, UserChip } from 'components';
import { useFetcher } from 'hooks';
import { useState } from 'react';
import { CodeLanguage, ContentResponseType, ContestDataResponseDTO, ContestEventsResponseDTO, Status } from 'types';

export const ViewEvents = ({ contest }: { contest: ContestDataResponseDTO }) => {
  
  const [ selectedDetails, setSelectedDetails ] = useState<Record<string, any> | null>(null);
  const {
    data,
    isLoading,
    mutate,
    isValidating,
  } = useFetcher<ContentResponseType<ContestEventsResponseDTO>>(jukiApiManager.API_V1.contest.getDataEvents({ params: { key: contest.key } }).url);
  
  const events = data?.success ? data.content.events : [];
  
  return (
    <div className="jk-col gap stretch left jk-pg-md nowrap jk-pg bc-we jk-br-ie">
      {isLoading || isValidating && <LineLoader />}
      <div className="jk-row">
        <ButtonLoader
          type="light"
          onClick={async (setLoader) => {
            setLoader(Status.LOADING);
            await mutate();
            setLoader(Status.SUCCESS);
          }}
        >
          <T className="tt-se">reload</T>
        </ButtonLoader>
      </div>
      <div className="jk-col gap left stretch">
        {events
          ?.sort((a, b) => b.timestamp - a.timestamp)
          .map(({ action, details, user, timestamp }, index) => (
            <div key={index} className="jk-col gap left stretch">
              <div className="jk-row gap">
                <div className="jk-tag">
                  <T className="tt-se">{action?.toLowerCase().split('_').join(' ')}</T>
                </div>
                <div>
                  <UserChip imageUrl={user.imageUrl} nickname={user.nickname} companyKey={user.company.key} />
                </div>
                <div>
                  <DateLiteral date={new Date(timestamp)} />
                </div>
                {Object.keys(details).length > 0 && (
                  <Button onClick={() => setSelectedDetails(details)} size="small" type="light">
                    <T>View details</T>
                  </Button>
                )}
              </div>
            </div>
          ))}
      </div>
      {selectedDetails && (
        <Modal onClose={() => setSelectedDetails(null)} isOpen>
          <div className="jk-row jk-pg">
            <CodeViewer code={JSON.stringify(selectedDetails, null, 2)} language={CodeLanguage.JSON} />
          </div>
        </Modal>
      )}
    </div>
  );
};
