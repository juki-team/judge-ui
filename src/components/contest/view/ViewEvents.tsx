'use client';

import { Button, CodeViewer, DateLiteral, Modal, T, UserChip } from 'components';
import { useState } from 'react';
import { CodeLanguage, ContestDataResponseDTO } from 'types';

export const ViewEvents = ({ contest }: { contest: ContestDataResponseDTO }) => {
  
  const [ selectedDetails, setSelectedDetails ] = useState<Record<string, any> | null>(null);
  
  return (
    <div className="jk-row stretch left jk-pg-md nowrap jk-pg bc-we jk-br-ie">
      <div className="jk-col gap left stretch">
        {contest.events
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
