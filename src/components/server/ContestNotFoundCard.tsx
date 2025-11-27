import { LinkLastPath, NotFoundCard, T } from 'components';
import { LastPathKey } from 'types';

export const ContestNotFoundCard = () => (
  <NotFoundCard
    title="contest not found"
    description="the contest does not exist or you do not have permissions to view it"
  >
    <LinkLastPath lastPathKey={LastPathKey.CONTESTS}>
      <T className="tt-se fw-bd">go to contest list</T>
    </LinkLastPath>
  </NotFoundCard>
);
