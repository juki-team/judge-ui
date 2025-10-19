'use client';

import { SpinIcon, T, Timer } from 'components';
import { ONE_MINUTE, ONE_SECOND } from 'config/constants';
import { contestStateMap } from 'helpers';
import React, { useEffect, useState } from 'react';
import { ContestDataResponseDTO, TimeDisplayType } from 'types';

interface ContestTimeTimerProps {
  contest: ContestDataResponseDTO,
  reloadContest: () => void,
}

export const ContestTimeTimer = ({ contest, reloadContest }: ContestTimeTimerProps) => {
  let timeInterval = 0;
  let interval = 100;
  let type: TimeDisplayType = 'weeks-days-hours-minutes-seconds-milliseconds';
  if (contest.isEndless) {
    timeInterval = -1;
    interval = 0;
    type = 'weeks';
  } else if (contest.isPast) {
    timeInterval = Date.now() - contest.settings.endTimestamp;
    if (timeInterval < ONE_MINUTE) {
      type = 'weeks-days-hours-minutes-seconds';
      interval = ONE_SECOND;
    } else {
      type = 'weeks-days-hours-minutes';
      interval = ONE_MINUTE;
    }
  } else if (contest.isFuture) {
    timeInterval = contest.settings.startTimestamp - Date.now();
  } else if (contest.isLive) {
    timeInterval = contest.settings.endTimestamp - new Date().getTime();
  }
  
  if (contest.isFuture || contest.isLive) {
    if (timeInterval < ONE_MINUTE * 2) {
      type = 'weeks-days-hours-minutes-seconds';
      interval = -100;
    } else if (timeInterval < ONE_MINUTE * 5) {
      type = 'weeks-days-hours-minutes-seconds';
      interval = -ONE_SECOND;
    } else {
      type = 'weeks-days-hours-minutes';
      interval = -ONE_MINUTE;
    }
  }
  
  const [ loadingTimer, setLoadingTimer ] = useState(false);
  const [ _, setTrigger ] = useState(0);
  const key = [ contest.isPast, contest.isLive, contest.isFuture, contest.isEndless ].toString();
  const tagBc = contestStateMap[key].bc;
  useEffect(() => {
    const interval = setInterval(() => setTrigger(Date.now()), ONE_MINUTE);
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    setLoadingTimer(false);
  }, [ key ]);
  
  if (loadingTimer) {
    return <SpinIcon />;
  }
  
  return (
    <div className={`jk-tag tx-s cr-we ${tagBc} jk-row nowrap`}>
      {contest.isEndless
        ? <T className="ws-np tt-se">endless</T>
        : (
          <>
            {contest.isLive
              ? <T className="ws-np tt-se">ends in</T>
              : contest.isPast
                ? <T className="ws-np tt-se">ends ago</T>
                : <T className="ws-np tt-se">stars in</T>}
            &nbsp;
            <div className="ws-np">
              <Timer
                key={type + interval}
                currentTimestamp={timeInterval}
                type={type}
                interval={interval}
                literal
                ignoreTrailingZeros
                ignoreLeadingZeros
                abbreviated
                onTimeout={() => {
                  setLoadingTimer(true);
                  void reloadContest();
                }}
              />
            </div>
          </>
        )}
    </div>
  );
};
