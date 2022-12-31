import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ROUTES } from '../config/constants';
import { ContestTab } from '../types';

export const useContestRouter = () => {
  const { isReady, query: { key: contestKey, index: problemIndex, tab: contestTab, ...query }, push } = useRouter();
  const [lastProblemVisited, setLastProblemVisited] = useState('');
  
  useEffect(() => {
    if (isReady && (contestTab === ContestTab.PROBLEMS || (contestTab === ContestTab.PROBLEM && !problemIndex))) {
      setLastProblemVisited('');
      if ((contestTab === ContestTab.PROBLEMS && problemIndex) || (contestTab === ContestTab.PROBLEM && !problemIndex)) {
        push({
          pathname: ROUTES.CONTESTS.VIEW('' + contestKey, ContestTab.PROBLEMS, undefined),
          query,
        }, undefined, { shallow: true });
      }
    } else if (isReady && contestTab === ContestTab.PROBLEM && problemIndex) {
      setLastProblemVisited(problemIndex as string);
    }
  }, [isReady, problemIndex, contestTab, contestKey]);
  
  const pushTab = (tab: ContestTab) => push({
    pathname: ROUTES.CONTESTS.VIEW('' + contestKey, tab, lastProblemVisited || undefined),
    query,
  }, undefined, { shallow: true });
  
  return { lastProblemVisited, pushTab, contestKey: contestKey as string, problemIndex, contestTab, query };
};
