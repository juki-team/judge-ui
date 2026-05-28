'use client';

import { PageNotFound, T } from '@juki-team/base-ui';
import { jukiAppRoutes } from '@juki-team/base-ui/settings';
import { useEffect } from 'hooks';
import { useRouter } from 'next/navigation';

export default function NotFound() {

  const { replace } = useRouter();

  useEffect(() => {
    const id = setTimeout(() => replace(jukiAppRoutes.COACH().home()), 1000);
    return () => clearTimeout(id);
  }, [ replace ]);
  
  return (
    <PageNotFound style={{ height: 'var(--100VH) !important' }}>
      <h1><T className="tt-se">page not found</T></h1>
      <div className="jk-row" style={{ alignItems: 'baseline' }}>
        <T className="tt-se tx-l">redirecting to home</T>&nbsp;
        <div className="dot-flashing" />
      </div>
    </PageNotFound>
  );
}
