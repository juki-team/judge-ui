'use client';

import { PlusIcon } from '@juki-team/base-ui/server-components';
import { Button, T, useUIStore } from '@juki-team/base-ui';
import { jukiAppRoutes } from '@juki-team/base-ui/settings';

export const CreateContestButton = () => {
  
  const { Link } = useUIStore(store => store.components);
  
  return (
    <Link href={jukiAppRoutes.JUDGE().contests.new()}>
      <Button
        size="small"
        icon={<PlusIcon />}
        responsiveMobile
      >
        <T className="tt-se">create</T>
      </Button>
    </Link>
  );
};
