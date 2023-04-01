import { ROUTES } from 'config/constants';
import { useRouter } from 'hooks';
import { useEffect } from 'react';
import { ProblemTab } from 'types';

function View() {
  const { query: { key }, replace, isReady } = useRouter();
  useEffect(() => {
    if (isReady) {
      void replace(ROUTES.PROBLEMS.VIEW(key as string, ProblemTab.STATEMENT));
    }
  }, [replace, isReady]);
  return null;
}

export default View;