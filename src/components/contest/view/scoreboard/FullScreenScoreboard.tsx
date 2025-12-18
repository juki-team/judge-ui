'use client';

import { Portal } from 'components';
import { usePageStore, useResizeDetector, useUIStore, useUserStore } from 'hooks';
import { PropsWithChildren } from 'react';
import { ContestDataResponseDTO } from 'types';
import { ContestTimeTimer } from '../ContestTimeTimer';

export const FullScreenScoreboard = ({ contest, children, reloadContest }: PropsWithChildren<{
  contest: ContestDataResponseDTO,
  reloadContest: () => Promise<void>
}>) => {
  
  const isSmallMediumScreen = usePageStore(store => store.viewPort.isSmallScreen || store.viewPort.isMediumScreen);
  const { Image } = useUIStore(store => store.components);
  const companyName = useUserStore(state => state.company.name);
  const companyImageUrl = useUserStore(state => state.company.imageUrl);
  
  const { height = 0, ref } = useResizeDetector();
  
  return (
    <Portal>
      <div className="jk-overlay jk-overlay-backdrop">
        <div className="jk-full-screen-overlay elevation-1 ow-hn jk-col stretch top nowrap wh-100 ht-100">
          <div className="jk-col stretch" ref={ref}>
            <div className="jk-row bc-pd jk-pg-xsm">
              <Image
                src={companyImageUrl}
                alt={companyName}
                height={isSmallMediumScreen ? 40 : 46}
                width={isSmallMediumScreen ? 80 : 92}
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
            <div className="jk-row extend jk-pg-sm-rl">
              <ContestTimeTimer contest={contest} reloadContest={reloadContest} />
            </div>
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
