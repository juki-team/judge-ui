import {
  ButtonLoader,
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
  TwoContentLayout,
} from 'components';
import { ROUTES } from 'config/constants';
import { JUDGE_API_V1 } from 'config/constants/judge';
import { useFetcher } from 'hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ContentResponseType, ProblemTab, Status } from 'types';
import { ArrowIcon } from '../../../../components';

function ProblemView() {
  
  const { query: { key, ...query }, push } = useRouter();
  const { isLoading, data } = useFetcher<ContentResponseType<any>>(JUDGE_API_V1.PROBLEM.PROBLEM(key as string));
  
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
        <TwoContentLayout>
          <div className="jk-col filled">
            <div className="jk-row center gap nowrap">
              <div className="jk-row color-primary">
                <Link href={ROUTES.PROBLEMS.LIST()}>
                  <a className="jk-row nowrap text-semi-bold link">
                    <ArrowIcon rotate={-90} />
                    <div className="screen md lg hg">Problems</div>
                  </a>
                </Link>
              </div>
              <div className="jk-row gap center nowrap flex-1">
                <h5>{data.content.name}</h5>
                <Popover content={<ProblemInfo problem={data.content} />} triggerOn="click" placement="bottom">
                  <div className="jk-row"><ExclamationIcon filledCircle className="screen sm md color-primary" rotate={180} /></div>
                </Popover>
              </div>
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
            onChange={index => push({ pathname: ROUTES.PROBLEMS.VIEW('' + key, tabs[index]), query })}
            actionsSection={
              <ButtonLoader
                onClick={async setLoaderStatus => {
                  setLoaderStatus(Status.LOADING);
                  await push(ROUTES.PROBLEMS.EDIT('' + key, ProblemTab.STATEMENT));
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
        </TwoContentLayout>
      )}
    </FetcherLayer>
  );
}

export default ProblemView;
