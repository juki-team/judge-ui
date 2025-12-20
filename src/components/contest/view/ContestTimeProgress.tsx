import {
  DateLiteral,
  FrozenInformation,
  ProgressMultiBar,
  ProgressSlide,
  QuietInformation,
  T,
  TimerDisplay,
} from 'components';
import { useEffect, useState } from 'hooks';
import { ContestTimeData } from 'types';
import { ContestTimeTimer } from './ContestTimeTimer';

export const ContestTimeProgress = ({ contest, reloadContest }: {
  contest: ContestTimeData,
  reloadContest?: () => void
}) => {
  
  const contestDuration = Math.max(contest.settings.endTimestamp - contest.settings.startTimestamp, 0);
  const normalDuration = Math.max(contest.settings.frozenTimestamp - contest.settings.startTimestamp, 0);
  const frozenDuration = Math.max(contest.settings.quietTimestamp - contest.settings.frozenTimestamp, 0);
  const quietDuration = Math.max(contest.settings.endTimestamp - contest.settings.quietTimestamp, 0);
  
  const quietPercentage = quietDuration * contestDuration === 0 ? 0 : Math.min(80, Math.max(10, quietDuration * 100 / contestDuration));
  const frozenPercentage = frozenDuration * contestDuration === 0 ? 0 : Math.min(80, Math.max(10, frozenDuration * 100 / contestDuration));
  const normalPercentage = 100 - quietPercentage - frozenPercentage;
  
  const [ now, setNow ] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
      // if (contest.isLive) {
      //   reloadContest?.();
      // }
    }, (contestDuration / 1000));
    return () => {
      clearInterval(interval);
    };
  }, [ reloadContest, contest.isLive, contestDuration ]);
  const nowDuration = Math.max(now.getTime() - contest.settings.startTimestamp, 0);
  const nowPercentage = Math.min(Math.max(nowDuration * 100 / contestDuration, 0), 100);
  
  const withLivePointer = contest.isLive && nowPercentage > 0 && nowPercentage < 100;
  
  return (
    <>
      <ProgressMultiBar
        height={8}
        tooltipPlacement="bottom"
        progress={[
          {
            label: (
              <div className="jk-col jk-pg-xsm">
                <T className="tt-se fw-bd">normal time</T>
                <div className="jk-row left">
                  <T className="tt-se">duration</T>:&nbsp;
                  <div className="jk-col left">
                    <TimerDisplay
                      counter={normalDuration}
                      type="weeks-days-hours-minutes-seconds"
                      literal
                      ignoreLeadingZeros
                      ignoreTrailingZeros
                    />
                  </div>
                </div>
              </div>
            ),
            percentage: normalPercentage,
            color: 'var(--cr-ss)',
          },
          {
            label: (
              <div className="jk-col jk-pg-xsm">
                <div className="jk-row">
                  <T className="tt-se fw-bd">frozen period</T>&nbsp;
                  <FrozenInformation />
                </div>
                <div className="jk-row left">
                  <T className="tt-se">duration</T>:&nbsp;
                  <div className="jk-col left">
                    <TimerDisplay
                      counter={frozenDuration}
                      type="weeks-days-hours-minutes-seconds"
                      literal
                      ignoreLeadingZeros
                      ignoreTrailingZeros
                    />
                  </div>
                </div>
              </div>
            ),
            percentage: frozenPercentage,
            color: 'var(--cr-io-lt)',
          },
          {
            label: (
              <div className="jk-col jk-pg-xsm">
                <div className="jk-row">
                  <T className="tt-se fw-bd">quiet period</T>&nbsp;
                  <QuietInformation />
                </div>
                <div className="jk-row left">
                  <T className="tt-se">duration</T>:&nbsp;
                  <div className="jk-col left">
                    <TimerDisplay
                      counter={quietDuration}
                      type="weeks-days-hours-minutes-seconds"
                      literal
                      ignoreLeadingZeros
                      ignoreTrailingZeros
                    />
                  </div>
                </div>
              </div>
            ),
            percentage: quietPercentage,
            color: 'var(--cr-io-dk)',
          },
        ]}
        points={[
          {
            label: (
              <div className="jk-col jk-pg-xsm">
                <T className="tt-se fw-bd">start date</T>
                <DateLiteral date={new Date(contest.settings.startTimestamp)} />
              </div>
            ),
            percentage: 0,
            color: 'var(--cr-ss)',
          },
          {
            label: (
              <div className="jk-col jk-pg-xsm">
                <div className="jk-row">
                  <T className="tt-se fw-bd">frozen date</T>
                </div>
                <DateLiteral date={new Date(contest.settings.frozenTimestamp)} />
              </div>
            ),
            percentage: normalPercentage,
            color: 'var(--cr-io-lt)',
          },
          {
            label: (
              <div className="jk-col jk-pg-xsm">
                <T className="tt-se fw-bd">quiet date</T>
                <DateLiteral date={new Date(contest.settings.quietTimestamp)} />
              </div>
            ),
            percentage: normalPercentage + frozenPercentage,
            color: 'var(--cr-io-dk)',
          },
          {
            label: (
              <div className="jk-col jk-pg-xsm">
                <T className="tt-se fw-bd">end date</T>
                <DateLiteral date={new Date(contest.settings.endTimestamp)} />
              </div>
            ),
            percentage: 100,
            color: 'var(--cr-bk)',
          },
          ...(withLivePointer ? [
            {
              label: (
                <div className="jk-col jk-pg-xsm">
                  <T className="tt-se fw-bd">current date</T>
                  <DateLiteral date={now} />
                  <ContestTimeTimer contest={contest} reloadContest={reloadContest} />
                  {contest.isQuietTime
                    ? <T className="tt-se cr-id fw-bd">quiet period</T>
                    : contest.isFrozenTime && <T className="tt-se cr-io fw-bd">frozen period</T>}
                </div>
              ),
              percentage: nowPercentage,
              color: 'var(--cr-er)',
            },
          ] : []),
        ]}
      />
      {withLivePointer && (
        <ProgressSlide
          progress={nowPercentage}
          className="expand-absolute pe-ne"
          height={8}
          color="rgba(255, 255, 255, 0.3)"
          // color="rgba(235, 87, 87, 0.3)"
          // color="var(--cr-er-lt)"
        />
      )}
    </>
  );
};
