import Link from 'next/link';
import { useRouter } from 'next/router';
import { JUDGE_API_V1, ROUTES } from '../../config/constants';
import { useFetcher } from '../../hooks';
import { ContentResponseType, ContestTab } from '../../types';
import { ArrowIcon, ContestOverview, ContestProblems, FetcherLayer, NotFound, T, Tabs, TwoContentLayout } from '../index';
import { ContestProblem } from './ContestProblem';
import { ContestProblemSubmissions } from './ContestProblemSubmissions';
import { ContestScoreboard } from './ContestScoreboard';

export function ContestView() {
  
  const { query, push } = useRouter();
  const { isLoading, data } = useFetcher<ContentResponseType<any>>(JUDGE_API_V1.CONTEST.CONTEST(query.key as string));
  
  const index = {
    [ContestTab.OVERVIEW]: 0,
    [ContestTab.PROBLEMS]: 1,
    [ContestTab.SCOREBOARD]: 2,
    [ContestTab.SUBMISSIONS]: 3,
    [ContestTab.STATUS]: 4,
  };
  
  const tabs = [ContestTab.OVERVIEW, ContestTab.PROBLEMS, ContestTab.SCOREBOARD];
  
  const tabHeaders = [
    { children: <T className="text-capitalize">overview</T> },
    { children: <T className="text-capitalize">problems</T> },
    { children: <T className="text-capitalize">scoreboard</T> },
  ];
  
  if (data?.success && data?.content?.registered) {
    tabHeaders.push({ children: <T className="text-capitalize">my submissions</T> });
    tabs.push(ContestTab.SUBMISSIONS);
  }
  tabHeaders.push({ children: <T className="text-capitalize">submissions</T> });
  tabs.push(ContestTab.STATUS);
  if (data?.success && data?.content?.settings.clarifications) {
    tabHeaders.push({ children: <T className="text-capitalize">clarifications</T> });
    index[ContestTab.CLARIFICATIONS] = tabHeaders.length - 1;
    tabs.push(ContestTab.CLARIFICATIONS);
  }
  
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
                    <div className="screen md lg hg"><T className="text-sentence-case">contest</T></div>
                  </a>
                </Link>
              </div>
              <h3>
                {data.content.name}
              </h3>
            </div>
          </div>
          <Tabs
            selectedTabIndex={index[query.tab as ContestTab]}
            tabHeaders={tabHeaders}
            onChange={index => {
              push(ROUTES.CONTESTS.VIEW('' + query.key, tabs[index]));
            }}
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
          >
            <ContestOverview contest={data.content} />
            {query.index && query.subTab ? <ContestProblem contest={data.content} /> : <ContestProblems contest={data.content} />}
            <ContestScoreboard contest={data.content} />
            {data?.success && data?.content?.registered && <ContestProblemSubmissions contest={data.content} mySubmissions />}
            <ContestProblemSubmissions contest={data.content} />
          </Tabs>
        </TwoContentLayout>
      )}
    </FetcherLayer>
  );
}