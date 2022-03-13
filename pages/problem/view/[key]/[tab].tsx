import {
  ButtonLoader,
  ContentLayout,
  ExclamationIcon,
  FetcherLayer,
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
import { JUDGE_API_V1 } from 'config/constants/judge';
import { ContentResponseType, ProblemTab, Status } from 'types';

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
    <FetcherLayer<any>
      isLoading={isLoading}
      data={data}
      error={!data?.success ? <NotFound redirectAction={() => push(ROUTES.PROBLEMS.LIST())} /> : null}
    >
      {data => (
        <div className="main-content">
          <ContentLayout>
            <div className="jk-col filled">
              <div className="jk-row center gap nowrap">
                <h5>
                  {data.content.name}
                </h5>
                <Popover content={<ProblemInfo problem={data.content} />} triggerOn="click" placement="bottomRight">
                  <div><ExclamationIcon filledCircle className="screen sm md color-primary" rotate={180} /></div>
                </Popover>
              </div>
              <div className="screen lg hg"><ProblemInfo problem={data.content} horizontal /></div>
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
      )}
    </FetcherLayer>
  );
}

export default ProblemView;
