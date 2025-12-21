'use client';

import {
  AcUnitIcon,
  FitnessCenterIcon,
  FrozenInformation,
  LockIcon,
  QuietInformation,
  SpinIcon,
  T,
  Timer,
  UpsolvingInformation,
} from 'components';
import { ONE_MINUTE, ONE_SECOND } from 'config/constants';
import { getContestState } from 'helpers';
import { useEffect, useJukiNotification, useMemo, useState } from 'hooks';
import { ContestTimeData, TimeDisplayType } from 'types';

interface ContestTimeTimerProps {
  contest: ContestTimeData,
  reloadContest?: () => void,
}

export const ContestTimeTimer = ({ contest, reloadContest }: ContestTimeTimerProps) => {
  
  const { addWarningNotification } = useJukiNotification();
  const { type, interval, timeInterval } = useMemo(() => {
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
    return { interval, type, timeInterval };
  }, [ contest.isEndless, contest.isFuture, contest.isLive, contest.isPast, contest.settings.endTimestamp, contest.settings.startTimestamp ]);
  
  const [ loadingTimer, setLoadingTimer ] = useState(false);
  const [ _, setTrigger ] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTrigger(Date.now()), ONE_MINUTE);
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    setLoadingTimer(false);
  }, [ contest.isGlobal, contest.isEndless, contest.isPast, contest.isLive, contest.isFuture ]);
  
  if (loadingTimer) {
    return <SpinIcon />;
  }
  
  return (
    <>
      <div className={`jk-tag tx-s cr-we ${getContestState(contest).bc} jk-row nowrap fw-rr`}>
        {contest.isGlobal
          ? <T className="ws-np tt-se">global</T>
          : contest.isEndless
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
                    // timerKey="contest-timer"
                    key={type + interval + timeInterval}
                    remaining={timeInterval}
                    type={type}
                    interval={interval}
                    literal
                    ignoreTrailingZeros
                    ignoreLeadingZeros
                    abbreviated
                    maxSplit={2}
                    onTimeout={() => {
                      setLoadingTimer(true);
                      void reloadContest?.();
                      addWarningNotification(<T className="tt-se">reloading contest</T>);
                    }}
                  />
                </div>
              </>
            )}
      </div>
      {contest.isLive && contest.isQuietTime ?
        <QuietInformation
          icon={
            <div className="jk-row jk-tag bc-el">
              <LockIcon size="small" filledCircle className="cr-el" />
            </div>
          }
        />
        : contest.isLive && contest.isFrozenTime && (
        <FrozenInformation
          icon={
            <div className="jk-row jk-tag bc-io">
              <AcUnitIcon size="small" filledCircle className="cr-io" />
            </div>
          }
        />
      )}
      {contest.isPast && contest.settings.upsolvingEnabled && (
        <UpsolvingInformation
          icon={
            <div className="jk-row jk-tag bc-ss">
              <FitnessCenterIcon size="small" filledCircle className="cr-ss" />
            </div>
          }
        />
      )}
    </>
  );
};
