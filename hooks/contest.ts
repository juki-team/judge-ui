import { ROUTES } from 'config/constants';
import { useEffect, useState } from 'react';
import { ContestTab } from 'types';
import { useJukiRouter } from './commons';

export const useContestRouter = () => {
  
  const {
    searchParams,
    routeParams: { key: contestKey, index: problemIndex, tab: contestTab },
    pushRoute,
  } = useJukiRouter();
  
  const [ lastProblemVisited, setLastProblemVisited ] = useState('');
  
  const isReady = true;
  
  useEffect(() => {
    if (isReady && (contestTab === ContestTab.PROBLEMS || (contestTab === ContestTab.PROBLEM && !problemIndex))) {
      setLastProblemVisited('');
      if ((contestTab === ContestTab.PROBLEMS && problemIndex) || (contestTab === ContestTab.PROBLEM && !problemIndex)) {
        void pushRoute({
          pathname: ROUTES.CONTESTS.VIEW('' + contestKey, ContestTab.PROBLEMS, undefined),
          searchParams,
        });
      }
    } else if (isReady && contestTab === ContestTab.PROBLEM && problemIndex) {
      setLastProblemVisited(problemIndex as string);
    }
  }, [ isReady, problemIndex, contestTab, contestKey, searchParams, pushRoute ]);
  
  const pushTab = (tab: ContestTab) => pushRoute({
    pathname: ROUTES.CONTESTS.VIEW('' + contestKey, tab, lastProblemVisited || undefined),
    searchParams,
  });
  
  return {
    pushTab,
    contestKey: contestKey as string,
    problemIndex: lastProblemVisited,
    contestTab: contestTab as ContestTab,
  };
};
