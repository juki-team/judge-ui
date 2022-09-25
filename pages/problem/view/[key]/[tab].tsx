import {
  ArrowIcon,
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
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { useUserState } from 'store';
import { ContentResponseType, ProblemResponseDTO, ProblemTab } from 'types';

const ProblemView = (): ReactNode => {
  
  const { query: { key, ...query }, push, isReady } = useRouter();
  const user = useUserState();
  
  return (
    <FetcherLayer<ContentResponseType<ProblemResponseDTO>>
      url={isReady && JUDGE_API_V1.PROBLEM.DATA(key as string)}
      errorView={<NotFound redirectAction={() => push(ROUTES.PROBLEMS.LIST())} />}
    >
      {({ data }) => {
        const problem = data.content;
        const tabs = [
          {
            key: ProblemTab.STATEMENT,
            header: <T className="tt-ce">statement</T>,
            body: <ProblemStatement problem={problem} />,
          },
          {
            key: ProblemTab.EDITOR,
            header: <T className="tt-ce">code editor</T>,
            body: <ProblemCodeEditor problem={problem} />,
          },
        ];
        
        if (user.isLogged) {
          tabs.push({
            key: ProblemTab.MY_SUBMISSIONS,
            header: <T className="tt-ce">my submissions</T>,
            body: <ProblemSubmissions problem={problem} mySubmissions />,
          });
        }
        tabs.push({
          key: ProblemTab.SUBMISSIONS,
          header: <T className="tt-ce">submissions</T>,
          body: <ProblemSubmissions problem={problem} />,
        });
        return (
          <TwoContentLayout>
            <div className="jk-row nowrap gap extend">
              <div className="jk-row cr-py back-link">
                <Link href={ROUTES.PROBLEMS.LIST()}>
                  <a className="jk-row nowrap fw-bd link">
                    <ArrowIcon rotate={-90} />
                    <div className="screen lg hg"><T className="tt-se">problems</T></div>
                  </a>
                </Link>
              </div>
              <div className="jk-row gap center flex-1">
                <h5>{problem.name}</h5>
                <Popover content={<ProblemInfo problem={problem} />} triggerOn="click" placement="bottom">
                  <div className="jk-row link"><ExclamationIcon filledCircle className="cr-py" rotate={180} /></div>
                </Popover>
              </div>
            </div>
            <Tabs
              selectedTabKey={query.tab as string}
              tabs={tabs}
              onChange={tabKey => push({ pathname: ROUTES.PROBLEMS.VIEW('' + key, tabKey as ProblemTab), query })}
              // actionsSection={
              //   can.updateProblem(user, data.content) ? [
              //     (
              //       <ButtonLoader
              //         onClick={async setLoaderStatus => {
              //           setLoaderStatus(Status.LOADING);
              //           await push(ROUTES.PROBLEMS.EDIT('' + key, ProblemTab.STATEMENT));
              //           setLoaderStatus(Status.SUCCESS);
              //         }}
              //       >
              //         <T>edit</T>
              //       </ButtonLoader>
              //     ),
              //   ] : []
              // }
            />
          </TwoContentLayout>
        );
      }}
    </FetcherLayer>
  );
};

export default ProblemView;
