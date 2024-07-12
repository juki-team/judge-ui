import { useEffect, useState } from 'react';
import { ContestTab } from 'types';
import { useJukiRouter } from './commons';

export const useContestRouter = () => {
  
  const {
    searchParams,
    routeParams: { key: contestKey },
    pushRoute,
  } = useJukiRouter();
  
  const [ lastProblemVisited, setLastProblemVisited ] = useState('');
  
  const isReady = true;
  
  const contestTab = searchParams.get('tab') || ContestTab.OVERVIEW;
  const problemIndex = searchParams.get('subTab') || 'A';
  
  useEffect(() => {
    if (isReady && (contestTab === ContestTab.PROBLEMS || (contestTab === ContestTab.PROBLEM && !problemIndex))) {
      setLastProblemVisited('');
      if ((contestTab === ContestTab.PROBLEMS && problemIndex) || (contestTab === ContestTab.PROBLEM && !problemIndex)) {
        // void pushRoute({
        //   pathname: ROUTES.CONTESTS.VIEW('' + contestKey, ContestTab.PROBLEMS, undefined),
        //   searchParams,
        // });
      }
    } else if (isReady && contestTab === ContestTab.PROBLEM && problemIndex) {
      setLastProblemVisited(problemIndex as string);
    }
  }, [ isReady, problemIndex, contestTab, contestKey, searchParams, pushRoute ]);
  
  
  return {
    contestKey: contestKey as string,
    problemIndex: lastProblemVisited,
    contestTab: contestTab as ContestTab,
  };
};
