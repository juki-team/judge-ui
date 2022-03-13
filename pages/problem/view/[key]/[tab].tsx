import {
  ButtonLoader,
  ContentLayout,
  ExclamationIcon,
  LoadingIcon,
  NotFound,
  Popover,
  ProblemCodeEditor,
  ProblemInfo,
  ProblemStatement,
  ProblemSubmissions,
  T,
  Tabs,
} from 'components';
import { ROUTES } from 'config/constants';
import { useFetcher } from 'hooks';
import { useRouter } from 'next/router';
import { JUDGE_API_V1 } from 'services/judge';
import { ContentResponseType, ProblemTab, Status } from 'types';

const FetcherLayer = ({ isLoading, data, error, children }) => {
  
  const { push } = useRouter();
  
  if (isLoading) {
    return <div className="jk-row"><LoadingIcon /></div>;
  }
  
  if (error) {
    return <NotFound redirectAction={() => push(ROUTES.PROBLEMS.LIST())} />;
  }
  
  return (
    <div>
      {children?.(data)}
    </div>
  );
};

function ProblemView() {
  
  const { query, push } = useRouter();
  const { isLoading, data } = useFetcher<ContentResponseType<any>>(JUDGE_API_V1.PROBLEM.PROBLEM(query.key as string));
  
  const index = {
    [ProblemTab.STATEMENT]: 0,
    [ProblemTab.EDITOR]: 1,
    [ProblemTab.SUBMISSIONS]: 2,
  };
  
  const tabs = [ProblemTab.STATEMENT, ProblemTab.EDITOR, ProblemTab.SUBMISSIONS];
  
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
                <div className="jk-row center gap">
                  <h5>
                    {data.content.name}
                  </h5>
                  <Popover content={<ProblemInfo problem={data.content} />} triggerOn="click" placement="centerScreen">
                    <div><ExclamationIcon filledCircle className="screen sm color-primary" rotate={180} /></div>
                  </Popover>
                </div>
                <div className="screen md lg hg"><ProblemInfo problem={data.content} horizontal /></div>
              </div>
              <Tabs
                selectedTabIndex={index[query.tab as ProblemTab]}
                tabHeaders={[
                  { children: <T className="text-capitalize">statement</T> },
                  { children: <T className="text-capitalize">code editor</T> },
                  { children: <T className="text-capitalize">submissions</T> },
                ]}
                onChange={index => push(ROUTES.PROBLEMS.VIEW('' + query.key, tabs[index]))}
                actionsSection={
                  <ButtonLoader
                    onClick={async setLoaderStatus => {
                      setLoaderStatus(Status.LOADING);
                      await push(ROUTES.PROBLEMS.EDIT('' + query.key, ProblemTab.STATEMENT));
                      setLoaderStatus(Status.SUCCESS);
                    }}
                  >
                    <T>edit</T>
                  </ButtonLoader>
                }
              >
                <ProblemStatement problem={data.content} />
                <ProblemCodeEditor problem={data.content} />
                <ProblemSubmissions problem={data.content} />
              </Tabs>
            </ContentLayout>
          </div>
        );
      }}
    />
  );
}

export default ProblemView;
