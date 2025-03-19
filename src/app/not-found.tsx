'use client';

import { PageNotFound, T } from 'components';
import { jukiAppRoutes } from 'config';
import { useEffect, useRouterStore } from 'hooks';

export default function NotFound() {
  
  const replaceRoute = useRouterStore(state => state.replaceRoute);
  
  useEffect(() => {
    setTimeout(() => replaceRoute(jukiAppRoutes.JUDGE().home()), 2000);
  }, [ replaceRoute ]);
  
  return (
    <PageNotFound>
      <h1><T>page not found</T></h1>
      <div className="jk-row" style={{ alignItems: 'baseline' }}>
        <T className="tt-se tx-l">redirecting to home</T>&nbsp;
        <div className="dot-flashing" />
      </div>
    </PageNotFound>
  );
}
