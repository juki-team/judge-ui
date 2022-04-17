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
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { can } from 'helpers';
import { useFetcher } from 'hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { useUserState } from 'store';
import { ContentResponseType, ProblemState, ProblemTab, Status } from 'types';
import { ArrowIcon } from '../../../../components';

const ProblemView = (): ReactNode => {
  
  const { query: { key, ...query }, push } = useRouter();
  const { isLoading, data } = useFetcher<ContentResponseType<ProblemState>>(JUDGE_API_V1.PROBLEM.PROBLEM(key as string));
  const user = useUserState();
  
  const index = {
    [ProblemTab.STATEMENT]: 0,
    [ProblemTab.EDITOR]: 1,
  };
  const tabs = [ProblemTab.STATEMENT, ProblemTab.EDITOR];
  const tabHeaders = [
    { children: <T className="text-capitalize">statement</T> },
    { children: <T className="text-capitalize">code editor</T> },
  ];
  const tabChildren = (problem) => {
    const tabs = [
      <ProblemStatement problem={problem} />,
      <ProblemCodeEditor problem={problem} />,
    ];
    if (user.isLogged) {
      tabs.push(<ProblemSubmissions problem={problem} mySubmissions />);
    }
    tabs.push(<ProblemSubmissions problem={problem} />);
    return tabs;
  };
  if (user.isLogged) {
    index[ProblemTab.MY_SUBMISSIONS] = tabs.length;
    tabs.push(ProblemTab.MY_SUBMISSIONS);
    tabHeaders.push({ children: <T className="text-capitalize">my submissions</T> });
  }
  index[ProblemTab.SUBMISSIONS] = tabs.length;
  tabs.push(ProblemTab.SUBMISSIONS);
  tabHeaders.push({ children: <T className="text-capitalize">submissions</T> });
  
  return (
    <FetcherLayer<ContentResponseType<ProblemState>>
      isLoading={isLoading}
      data={data}
      error={<NotFound redirectAction={() => push(ROUTES.PROBLEMS.LIST())} />}
    >
      {data => (
        <TwoContentLayout>
          <div className="jk-row center gap nowrap relative">
            <div className="jk-row color-primary back-link">
              <Link href={ROUTES.PROBLEMS.LIST()}>
                <a className="jk-row nowrap text-semi-bold link">
                  <ArrowIcon rotate={-90} />
                  <div className="screen md lg hg"><T className="text-sentence-case">problems</T></div>
                </a>
              </Link>
            </div>
            <h5>{data.content.name}</h5>
            <Popover content={<ProblemInfo problem={data.content} />} triggerOn="click" placement="bottom">
              <div className="jk-row link"><ExclamationIcon filledCircle className="color-primary" rotate={180} /></div>
            </Popover>
          </div>
          <Tabs
            selectedTabIndex={index[query.tab as ProblemTab]}
            tabHeaders={tabHeaders}
            onChange={index => push({ pathname: ROUTES.PROBLEMS.VIEW('' + key, tabs[index]), query })}
            actionsSection={
              can.updateProblem(user, data.content) ? (
                <ButtonLoader
                  onClick={async setLoaderStatus => {
                    setLoaderStatus(Status.LOADING);
                    await push(ROUTES.PROBLEMS.EDIT('' + key, ProblemTab.STATEMENT));
                    setLoaderStatus(Status.SUCCESS);
                  }}
                >
                  <T>edit</T>
                </ButtonLoader>
              ) : undefined
            }
          >
            {tabChildren(data.content)}
          </Tabs>
        </TwoContentLayout>
      )}
    </FetcherLayer>
  );
};

export default ProblemView;
