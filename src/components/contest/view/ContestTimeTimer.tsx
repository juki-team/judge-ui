'use client';

import { FrozenInformation, QuietInformation, SpinIcon, T, Timer, UpsolvingInformation } from 'components';
import { ONE_MINUTE, ONE_SECOND } from 'config/constants';
import { getContestState } from 'helpers';
import { useEffect, useJukiNotification, useMemo, useState } from 'hooks';
import { ContestTimeData, TimeDisplayType } from 'types';

// When the countdown ends the contest is reloaded until the server reports the new state (started, ended). The countdown
// runs on the clock of the computer: one that is ahead reached zero before the server, and the spinner stayed forever.
// The first reload waits a random delay (every open tab reaches zero at the same time); then it is retried every 3s,
// and every 15s after a minute.
const TIMEOUT_RELOAD_MAX_DELAY_MS = ONE_SECOND * 2;
const TIMEOUT_RELOAD_RETRY_MS = ONE_SECOND * 3;
const TIMEOUT_RELOAD_SLOW_RETRY_MS = ONE_SECOND * 15;
const TIMEOUT_RELOAD_FAST_RETRIES = 20;

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
      timeInterval = Date.now() - contest.settings.endsAt;
      if (timeInterval < ONE_MINUTE) {
        type = 'weeks-days-hours-minutes-seconds';
        interval = ONE_SECOND;
      } else {
        type = 'weeks-days-hours-minutes';
        interval = ONE_MINUTE;
      }
    } else if (contest.isFuture) {
      timeInterval = contest.settings.startsAt - Date.now();
    } else if (contest.isLive) {
      timeInterval = contest.settings.endsAt - new Date().getTime();
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
  }, [ contest.isEndless, contest.isFuture, contest.isLive, contest.isPast, contest.settings.endsAt, contest.settings.startsAt ]);
  
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
  useEffect(() => {
    if (!loadingTimer) {
      return;
    }
    let retries = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const reload = () => {
      void reloadContest?.();
      retries++;
      timeout = setTimeout(reload, retries < TIMEOUT_RELOAD_FAST_RETRIES ? TIMEOUT_RELOAD_RETRY_MS : TIMEOUT_RELOAD_SLOW_RETRY_MS);
    };
    timeout = setTimeout(reload, Math.random() * TIMEOUT_RELOAD_MAX_DELAY_MS);
    return () => {
      clearTimeout(timeout);
    };
  }, [ loadingTimer, reloadContest ]);
  
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
                      addWarningNotification(<T className="tt-se">reloading contest</T>);
                    }}
                  />
                </div>
              </>
            )}
      </div>
      {contest.isLive && contest.isQuietTime ?
        <QuietInformation />
        : contest.isLive && contest.isFrozenTime && (
        <FrozenInformation />
      )}
      {contest.isPast && contest.settings.upsolvingEnabled && (
        <UpsolvingInformation />
      )}
    </>
  );
};
