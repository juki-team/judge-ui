'use client';

import { DateLiteral, T, UserChip } from 'components';
import React from 'react';
import { ContestDataResponseDTO } from 'types';

export const ViewEvents = ({ contest }: { contest: ContestDataResponseDTO }) => {
  
  return (
    <div className="jk-row stretch left jk-pg-md nowrap jk-pg bc-we jk-br-ie">
      <div className="jk-col gap left">
        {contest.events?.map(({ action, details, user, timestamp }, index) => (
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
            </div>
            {Object.keys(details).length > 0 && (
              <div className="jk-row left">
                {JSON.stringify(details)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
