import { Portal, T } from 'components';
import { contestStateMap } from 'helpers';
import { useJukiUI, useResizeDetector, useUserStore } from 'hooks';
import { PropsWithChildren } from 'react';
import { ContestDataResponseDTO } from 'types';
import { getContestTimeLiteral } from '../commons';

export const FullScreenScoreboard = ({ contest, children }: PropsWithChildren<{ contest: ContestDataResponseDTO }>) => {
  
  const { viewPortSize, components: { Image } } = useJukiUI();
  const companyName = useUserStore(state => state.company.name);
  const companyImageUrl = useUserStore(state => state.company.imageUrl);
  
  const literal = getContestTimeLiteral(contest);
  const key = [ contest.isPast, contest.isLive, contest.isFuture, contest.isEndless ].toString();
  const statusLabel = contestStateMap[key].label;
  const tagBc = contestStateMap[key].bc;
  const allLiteralLabel = contest.isEndless
    ? <div className={`jk-row center extend nowrap jk-tag ${tagBc}`}>
      <T>{statusLabel}</T></div>
    : <div className={`jk-row center extend nowrap jk-tag ${tagBc}`}>
      <T>{statusLabel}</T>,&nbsp;{literal}</div>;
  
  const { height = 0, ref } = useResizeDetector();
  
  return (
    <Portal>
      <div className="jk-overlay jk-overlay-backdrop">
        <div className="jk-full-screen-overlay elevation-1 jk-br-ie ow-hn jk-col stretch top nowrap">
          <div className="jk-col stretch" ref={ref}>
            <div className="jk-row bc-pd jk-pg-xsm">
              <Image
                src={companyImageUrl}
                alt={companyName}
                height={viewPortSize === 'md' ? 40 : 46}
                width={viewPortSize === 'md' ? 80 : 92}
              />
            </div>
            <div className="jk-row nowrap gap extend jk-pg-sm-rl">
              <h2
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: 'calc(100vw - (var(--pad-sm) * 2) - (var(--pad-md) * 2))',
                  textAlign: 'center',
                }}
              >
                {contest.name}
              </h2>
            </div>
            <div className="jk-row extend jk-pg-sm-rl">{allLiteralLabel}</div>
          </div>
          <div
            className="jk-pg-sm-rl"
            style={{
              width: '100%',
              height: `calc(var(--100VH) - ${height}px - var(--pad-sm) - var(--pad-sm) - var(--pad-sm))`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
};
