'use client';

import { jukiAppRoutes } from 'config';
import { useEffect, useJukiRouter } from 'hooks';

export default function Page() {
  
  const { replaceRoute } = useJukiRouter();
  
  useEffect(() => {
    void replaceRoute(jukiAppRoutes.JUDGE().contests.list());
  }, [ replaceRoute ]);
  
  return null;
}
