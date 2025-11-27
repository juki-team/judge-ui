import { LinkLastPath, NotFoundCard, T } from 'components';
import { LastPathKey } from 'types';

export const ProblemNotFoundCard = () => (
  <NotFoundCard
    title="problem not found"
    description="the problem does not exist or you do not have permissions to view it"
  >
    <LinkLastPath lastPathKey={LastPathKey.PROBLEMS}>
      <T className="tt-se fw-bd">go to problem list</T>
    </LinkLastPath>
  </NotFoundCard>
);
