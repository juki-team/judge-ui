'use client';

import { Button, PlusIcon, T } from 'components';
import { jukiAppRoutes } from 'config';
import { useUIStore } from 'hooks';

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
