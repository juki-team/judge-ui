import {
  ButtonLoader,
  ExclamationIcon,
  FetcherLayer,
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
import { authorizedRequest, cleanRequest, getProblemJudgeKey } from 'helpers';
import { useJukiBase, useNotification } from 'hooks';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { ContentResponseType, HTTPMethod, ProblemResponseDTO, ProblemTab, Status, SubmissionRunStatus } from 'types';
import Custom404 from '../../../../404';

const ProblemView = (): ReactNode => {
  
  const { query: { key, ...query }, push, isReady } = useRouter();
  const { user } = useJukiBase();
  const { addSuccessNotification, addErrorNotification } = useNotification();
  
  return (
    <FetcherLayer<ContentResponseType<ProblemResponseDTO>>
      url={isReady && JUDGE_API_V1.PROBLEM.DATA(key as string)}
      errorView={<Custom404 />}
    >
      {({ data }) => {
        const problem = data.content;
        const tabs = [
          {
            key: ProblemTab.STATEMENT,
            header: <T className="tt-ce">statement</T>,
            body: (
              <ProblemStatement
                problemKey={problem.key}
                author={problem.author}
                name={problem.name}
                sampleCases={problem.sampleCases}
                status={problem.status}
                statement={problem.statement}
                settings={problem.settings}
                tags={problem.tags}
              />
            ),
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
              <div className="jk-row gap center flex-1">
                <h5>{problem.name}</h5>
                <Popover
                  content={
                    <ProblemInfo
                      author={problem.author}
                      status={problem.status}
                      tags={problem.tags}
                      settings={problem.settings}
                    />
                  }
                  triggerOn="click"
                  placement="bottom"
                >
                  <div className="jk-row link"><ExclamationIcon filledCircle className="cr-py" rotate={180} /></div>
                </Popover>
              </div>
            </div>
            <Tabs
              selectedTabKey={query.tab as string}
              tabs={tabs}
              onChange={tabKey => push({ pathname: ROUTES.PROBLEMS.VIEW('' + key, tabKey as ProblemTab), query })}
              extraNodes={
                data?.content?.user?.isEditor ? [
                  <ButtonLoader
                    size="small"
                    onClick={async setLoaderStatus => {
                      setLoaderStatus(Status.LOADING);
                      await push(ROUTES.PROBLEMS.EDIT('' + key));
                      setLoaderStatus(Status.SUCCESS);
                    }}
                  >
                    <T>edit</T>
                  </ButtonLoader>,
                  <Popover
                    content={<T className="ws-np tt-se">only submissions that are not in a contest will be judged</T>}
                    placement="left"
                    showPopperArrow
                  >
                    <div>
                      <ButtonLoader
                        size="small"
                        onClick={async setLoaderStatus => {
                          setLoaderStatus(Status.LOADING);
                          const bodyProblem = { ...problem };
                          delete bodyProblem.key;
                          const result = cleanRequest<ContentResponseType<{ listCount: number, status: SubmissionRunStatus.RECEIVED }>>(await authorizedRequest(
                            JUDGE_API_V1.REJUDGE.PROBLEM(getProblemJudgeKey(problem.judge, problem.key)),
                            { method: HTTPMethod.POST },
                          ));
                          if (result.success) {
                            addSuccessNotification(
                              <div><T>rejudging</T>&nbsp;{result.content.listCount}&nbsp;<T>submissions</T></div>,
                            );
                            setLoaderStatus(Status.SUCCESS);
                          } else {
                            addErrorNotification(<T
                              className="tt-se">{result.message || 'something went wrong, please try again later'}</T>);
                            setLoaderStatus(Status.ERROR);
                          }
                        }}
                      >
                        <T>rejudge</T>
                      </ButtonLoader>
                    </div>
                  </Popover>,
                ] : []
              }
            />
          </TwoContentLayout>
        );
      }}
    </FetcherLayer>
  );
};

export default ProblemView;
