import { ButtonLoader, ContentLayout, ContestOverview, ContestProblems, FetcherLayer, NotFound, T, Tabs } from 'components';
import { ROUTES } from 'config/constants';
import { useFetcher } from 'hooks';
import { useRouter } from 'next/router';
import { JUDGE_API_V1 } from 'config/constants/judge';
import { ContentResponseType, ContestTab, Status } from 'types';

function ContestView() {
  
  const { query, push } = useRouter();
  const { isLoading, data } = useFetcher<ContentResponseType<any>>(JUDGE_API_V1.CONTEST.CONTEST(query.key as string));
  
  const index = {
    [ContestTab.OVERVIEW]: 0,
    [ContestTab.PROBLEMS]: 1,
    [ContestTab.SCOREBOARD]: 2,
    [ContestTab.SUBMISSIONS]: 3,
    [ContestTab.CLARIFICATIONS]: 4,
  };
  
  const tabs = [ContestTab.OVERVIEW, ContestTab.PROBLEMS, ContestTab.SCOREBOARD, ContestTab.SUBMISSIONS, ContestTab.CLARIFICATIONS];
  
  return (
    <FetcherLayer<any>
      isLoading={isLoading}
      data={data}
      error={!data?.success ? <NotFound redirectAction={() => push(ROUTES.CONTESTS.LIST())} /> : null}
    >
      {data => (
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
      )}
    </FetcherLayer>
  );
}

export default ContestView;
