import { ArrowIcon, ContestOverview, ContestProblems, FetcherLayer, NotFound, T, Tabs, TwoContentLayout } from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { useFetcher } from 'hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ContentResponseType, ContestTab } from 'types';
import { ContestProblem } from './ContestProblem';
import { ContestProblemSubmissions } from './ContestProblemSubmissions';
import { ContestScoreboard } from './ContestScoreboard';

export function ContestView() {
  
  const { isReady, query: { key: contestKey, index: problemIndex, tab: contestTab, ...query }, push, asPath } = useRouter();
  const {
    isLoading,
    data,
  } = useFetcher<ContentResponseType<any>>(JUDGE_API_V1.CONTEST.CONTEST(contestKey as string), { refreshInterval: 60000 });
  const [lastProblemVisited, setLastProblemVisited] = useState('');
  
  useEffect(() => {
    if (isReady && problemIndex) {
      setLastProblemVisited(problemIndex as string);
    } else if (contestTab === ContestTab.PROBLEMS) {
      setLastProblemVisited('');
    }
  }, [isReady, problemIndex, contestTab]);
  
  const index = {
    [ContestTab.OVERVIEW]: 0,
    [ContestTab.PROBLEMS]: 1,
    [ContestTab.SCOREBOARD]: 2,
  };
  
  const tabs = [ContestTab.OVERVIEW, ContestTab.PROBLEMS, ContestTab.SCOREBOARD];
  
  const tabHeaders = [
    { children: <T className="text-capitalize">overview</T> },
    {
      children: (
        <div className="jk-row gap">
          {lastProblemVisited
            ? <T className="text-capitalize">problem</T>
            : <T className="text-capitalize">problems</T>} {lastProblemVisited}
        </div>
      ),
    },
    { children: <T className="text-capitalize">scoreboard</T> },
  ];
  
  if (data?.success && data?.content?.registered) {
    tabHeaders.push({ children: <T className="text-capitalize">my submissions</T> });
    tabs.push(ContestTab.SUBMISSIONS);
    index[ContestTab.SUBMISSIONS] = tabHeaders.length - 1;
  }
  tabHeaders.push({ children: <T className="text-capitalize">submissions</T> });
  tabs.push(ContestTab.STATUS);
  index[ContestTab.STATUS] = tabHeaders.length - 1;
  if (data?.success && data?.content?.settings.clarifications) {
    tabHeaders.push({ children: <T className="text-capitalize">clarifications</T> });
    index[ContestTab.CLARIFICATIONS] = tabHeaders.length - 1;
    tabs.push(ContestTab.CLARIFICATIONS);
  }
  
  const tabsChildren = (content: any) => {
    const t = [<ContestOverview contest={content} />];
    if (problemIndex) {
      t.push(<ContestProblem contest={content} />);
    } else {
      t.push(<ContestProblems contest={content} />);
    }
    t.push(<ContestScoreboard contest={content} />);
    if (data?.success && data?.content?.registered) {
      t.push(<ContestProblemSubmissions contest={content} mySubmissions />);
    }
    t.push(<ContestProblemSubmissions contest={content} />);
    return t;
  };
  
  return (
    <FetcherLayer<any>
      isLoading={isLoading}
      data={data}
      error={!data?.success ? <NotFound redirectAction={() => push(ROUTES.CONTESTS.LIST())} /> : null}
    >
      {data => (
        <TwoContentLayout>
          <div className="jk-col filled">
            <div className="jk-row center gap nowrap">
              <div className="jk-row color-primary back-link">
                <Link href={ROUTES.CONTESTS.LIST()}>
                  <a className="jk-row nowrap text-semi-bold link">
                    <ArrowIcon rotate={-90} />
                    <div className="screen md lg hg"><T className="text-sentence-case">contests</T></div>
                  </a>
                </Link>
              </div>
              <h3>
                {data.content.name}
              </h3>
            </div>
          </div>
          <Tabs
            selectedTabIndex={index[contestTab as ContestTab]}
            tabHeaders={tabHeaders}
            onChange={index => push({
              pathname: ROUTES.CONTESTS.VIEW('' + contestKey, tabs[index], lastProblemVisited || undefined),
              query,
            }, undefined, { shallow: true })}
            // actionsSection={
            //  <ButtonLoader
            // onClick={async setLoaderStatus => {
            //   setLoaderStatus(Status.LOADING);
            //   await push(ROUTES.CONTESTS.EDIT('' + query.key, ContestTab.OVERVIEW));
            //       setLoaderStatus(Status.SUCCESS);
            //     }}
            //   >
            //     <T>edit</T>
            //   </ButtonLoader>
            // }
            children={tabsChildren(data.content)}
          />
        </TwoContentLayout>
      )}
    </FetcherLayer>
  );
}