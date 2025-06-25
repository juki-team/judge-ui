'use client';

import { Button, PlusIcon, T } from 'components';
import { jukiAppRoutes } from 'config';
import { useJukiUI } from 'hooks';

export const CreateContestButton = () => {
  
  const { components: { Link } } = useJukiUI();
  
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
