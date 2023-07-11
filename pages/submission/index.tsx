import { ROUTES } from 'config/constants';
import { useEffect, useRouter } from 'hooks';

function View() {
  const { query, isReady, replace } = useRouter();
  useEffect(() => {
    if (isReady) {
      void replace(ROUTES.HOME.PAGE());
    }
  }, [ replace, query, isReady ]);
  return null;
}

export default View;
