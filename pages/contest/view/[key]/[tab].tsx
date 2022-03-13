import { ButtonLoader, ContentLayout, LoadingIcon, NotFound, T, Tabs, UpIcon } from 'components';
import { ROUTES } from 'config/constants';
import { useFetcher } from 'hooks';
import { useRouter } from 'next/router';
import { JUDGE_API_V1 } from 'services/judge';
import { ContentResponseType, ContestTab, Status } from 'types';
import { ContestOverview } from '../../../../components/contest/ContestOverview';
import { ContestProblems } from '../../../../components/contest/ContestProblems';

const FetcherLayer = ({ isLoading, data, error, children }) => {
  
  const { push } = useRouter();
  
  if (isLoading) {
    return <div className="jk-row"><LoadingIcon /></div>;
  }
  
  if (error) {
    return <NotFound redirectAction={() => push(ROUTES.CONTESTS.LIST())} />;
  }
  
  return (
    <div>
      {children?.(data)}
    </div>
  );
};

function ProblemView() {
  
  const { query, push } = useRouter();
  const { isLoading, data } = useFetcher<ContentResponseType<any>>(JUDGE_API_V1.CONTEST.CONTEST(query.key as string));
  
  console.log({ query, data });
  
  const index = {
    [ContestTab.OVERVIEW]: 0,
    [ContestTab.PROBLEMS]: 1,
    [ContestTab.SCOREBOARD]: 2,
    [ContestTab.SUBMISSIONS]: 3,
    [ContestTab.CLARIFICATIONS]: 4,
  };
  
  const tabs = [ContestTab.OVERVIEW, ContestTab.PROBLEMS, ContestTab.SCOREBOARD, ContestTab.SUBMISSIONS, ContestTab.CLARIFICATIONS];
  
  return (
    <FetcherLayer
      isLoading={isLoading}
      data={data}
      error={!data?.success}
      children={data => {
        return (
          <div className="main-content">
            <ContentLayout>
              <div className="jk-col filled">
                <h3>
                  {data.content.name}
                </h3>
              </div>
              <Tabs
                selectedTabIndex={index[query.tab as ContestTab]}
                tabHeaders={[
                  { children: <T className="text-capitalize">overview</T> },
                  { children: <T className="text-capitalize">problems</T> },
                  { children: <T className="text-capitalize">scoreboard</T> },
                  { children: <T className="text-capitalize">submissions</T> },
                  { children: <T className="text-capitalize">clarifications</T> },
                ]}
                onChange={index => push(ROUTES.CONTESTS.VIEW('' + query.key, tabs[index]))}
                actionsSection={
                  <ButtonLoader
                    onClick={async setLoaderStatus => {
                      setLoaderStatus(Status.LOADING);
                      await push(ROUTES.CONTESTS.EDIT('' + query.key, ContestTab.OVERVIEW));
                      setLoaderStatus(Status.SUCCESS);
                    }}
                  >
                    <T>edit</T>
                  </ButtonLoader>
                }
              >
                <ContestOverview contest={data.content} />
                <ContestProblems contest={data.content} />
                <div>1</div>
                <div>2</div>
              </Tabs>
            </ContentLayout>
          </div>
        );
      }}
    />
  );
}

export default ProblemView;
