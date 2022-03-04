import { useRouter } from 'next/router';
import { ContentLayout, LoadingIcon, NotFound, T, Tabs } from '../../../../components';
import { ProblemCodeEditor } from '../../../../components/problem/ProblemCodeEditor';
import { ProblemInfo } from '../../../../components/problem/ProblemInfo';
import { ProblemStatement } from '../../../../components/problem/ProblemStatement';
import { ROUTES } from '../../../../config/constants';
import { useFetcher } from '../../../../hooks';
import { JUDGE_API_V1 } from '../../../../services/judge';
import { ContentResponseType, ProblemTab } from '../../../../types';

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
  
  console.log({ query, data });
  
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
      error={!data.success}
      children={data => {
        return (
          <div className="main-content">
            <ContentLayout>
              <div className="jk-col filled">
                <h3>
                  {data.content.name}
                </h3>
                <div className="screen sm md"><ProblemInfo problem={data.content} horizontal /></div>
              </div>
              <Tabs
                selectedTabIndex={index[query.tab as ProblemTab]}
                tabHeaders={[
                  { children: <T className="text-capitalize">statement</T> },
                  { children: <T className="text-capitalize">code editor</T> },
                  { children: <T className="text-capitalize">submissions</T> },
                ]}
                onChange={index => push(ROUTES.PROBLEMS.VIEW('' + query.key, tabs[index]))}
              >
                <ProblemStatement problem={data.content} />
                <ProblemCodeEditor problem={data.content} />
                <div>
                
                </div>
                <div>
                
                </div>
              </Tabs>
            </ContentLayout>
          </div>
        );
      }}
    />
  );
}

export default ProblemView;
