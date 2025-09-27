import { T, Timer } from 'components';
import React from 'react';
import { ContestDataResponseDTO } from 'types';

export const getContestTimeLiteral = (contest: ContestDataResponseDTO) => {
  let timeInterval = 0;
  if (contest.isEndless) {
    timeInterval = -1;
  } else if (contest.isPast) {
    timeInterval = new Date().getTime() - contest.settings.endTimestamp;
  } else if (contest.isFuture) {
    timeInterval = contest.settings.startTimestamp - new Date().getTime();
  } else if (contest.isLive) {
    timeInterval = contest.settings.endTimestamp - new Date().getTime();
  }
  
  return contest.isEndless
    ? <T className="ws-np">endless</T>
    : (
      <>
        {contest.isLive
          ? <T className="ws-np">ends in</T>
          : contest.isPast
            ? <T className="ws-np">ends ago</T>
            : <T className="ws-np">stars in</T>}
        &nbsp;
        <div><Timer currentTimestamp={timeInterval} type="hours-minutes" interval={-1000} literal /></div>
      </>
    );
};
