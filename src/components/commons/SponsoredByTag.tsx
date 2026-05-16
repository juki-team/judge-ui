'use client';

import { T, useUIStore, useUserStore } from '@juki-team/base-ui';
import { JUKI_APP_ORGANIZATION_KEY as JUKI_APP_COMPANY_KEY } from '@juki-team/commons/constants';

export const SponsoredByTag = () => {
  
  const companyKey = useUserStore(state => state.organization.key);
  const { Link } = useUIStore(store => store.components);
  
  if (companyKey === JUKI_APP_COMPANY_KEY) {
    return null;
  }
  
  return (
    <div className="sponsored-by bc-pd cr-pt">
      <T className="tt-se">sponsored by</T>&nbsp;
      <Link href="https://juki.app" target="_blank" rel="noreferrer">Juki.app</Link>
    </div>
  );
};
