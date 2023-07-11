import { ROUTES } from 'config/constants';
import { useEffect, useRouter } from 'hooks';

function View() {
  const { query, replace, isReady } = useRouter();
  useEffect(() => {
    if (isReady) {
      void replace(ROUTES.PROBLEMS.LIST());
    }
  }, [ replace, query, isReady ]);
  return null;
}

export default View;