'use client';

import { jukiAppRoutes } from 'config';
import { useEffect, useRouterStore } from 'hooks';

export default function Page() {
  
  const replaceRoute = useRouterStore(state => state.replaceRoute);
  
  useEffect(() => {
    void replaceRoute(jukiAppRoutes.JUDGE().contests.list());
  }, [ replaceRoute ]);
  
  return null;
}
