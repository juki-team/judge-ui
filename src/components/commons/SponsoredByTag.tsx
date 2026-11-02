'use client';

import { T } from 'components';
import { JUKI_APP_ORGANIZATION_KEY } from 'config/constants';
import { useUIStore, useUserStore } from 'hooks';

export const SponsoredByTag = () => {
  
  const organizationKey = useUserStore(state => state.organization.key);
  const { Link } = useUIStore(store => store.components);
  
  if (organizationKey === JUKI_APP_ORGANIZATION_KEY) {
    return null;
  }
  
  return (
    <div className="sponsored-by bc-pd cr-pt">
      <T className="tt-se">sponsored by</T>&nbsp;
      <Link href="https://juki.app" target="_blank" rel="noreferrer">Juki.app</Link>
    </div>
  );
};
