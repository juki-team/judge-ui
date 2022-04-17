import { ROUTES } from 'config/constants';
import { useRouter } from 'hooks';
import { useEffect } from 'react';
import { ProblemTab } from '../../../../types';

function View() {
  const { query, push, isReady } = useRouter();
  useEffect(() => {
    if (isReady) {
      push(ROUTES.PROBLEMS.VIEW(query.key as string, ProblemTab.STATEMENT));
    }
  }, [push, query, isReady]);
  return null;
}

export default View;
