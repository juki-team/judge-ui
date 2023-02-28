import { ROUTES } from 'config/constants';
import { useRouter } from 'hooks';
import { useEffect } from 'react';

function View() {
  const { query, push, isReady } = useRouter();
  useEffect(() => {
    if (isReady) {
      void push(ROUTES.PROBLEMS.LIST());
    }
  }, [push, query, isReady]);
  return null;
}

export default View;
