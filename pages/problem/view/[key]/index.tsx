import { ROUTES } from 'config/constants';
import { useRouter } from 'hooks';
import { useEffect } from 'react';
import { ProblemTab } from 'types';

function View() {
  const { query: { key }, push, isReady } = useRouter();
  useEffect(() => {
    if (isReady) {
      push(ROUTES.PROBLEMS.VIEW(key as string, ProblemTab.STATEMENT));
    }
  }, [push, isReady]);
  return null;
}

export default View;
