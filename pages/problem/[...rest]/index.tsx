import { ROUTES } from 'config/constants';
import { useRouter } from 'hooks';
import { useEffect } from 'react';

function View() {
  const { query, isReady, replace } = useRouter();
  useEffect(() => {
    if (isReady) {
      void replace(ROUTES.PROBLEMS.LIST());
    }
  }, [replace, query, isReady]);
  return null;
}

export default View;