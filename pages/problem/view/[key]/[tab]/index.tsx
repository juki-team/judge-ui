import {
  AutorenewIcon,
  Breadcrumbs,
  ButtonLoader,
  EditIcon,
  ExclamationIcon,
  FetcherLayer,
  LinkProblems,
  Popover,
  ProblemCodeEditor,
  ProblemInfo,
  ProblemMySubmissions,
  ProblemStatement,
  ProblemSubmissions,
  T,
  TabsInline,
  TwoContentSection,
} from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { authorizedRequest, cleanRequest, getProblemJudgeKey } from 'helpers';
import { useJukiUI, useJukiUser, useNotification, useTrackLastPath } from 'hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import {
  ContentResponseType,
  HTTPMethod,
  LastLinkKey,
  ProblemResponseDTO,
  ProblemTab,
  Status,
  SubmissionRunStatus,
} from 'types';
import Custom404 from '../../../../404';

const ProblemView = (): ReactNode => {
  
  useTrackLastPath(LastLinkKey.SECTION_PROBLEM);
  const { query: { key, ...query }, push, isReady } = useRouter();
  const { user } = useJukiUser();
  const { addSuccessNotification, addErrorNotification } = useNotification();
  const { viewPortSize } = useJukiUI();
  
  return (
    <FetcherLayer<ContentResponseType<ProblemResponseDTO>>
      url={isReady && JUDGE_API_V1.PROBLEM.DATA(key as string)}
      errorView={<Custom404 />}
    >
      {({ data }) => {
        const problem = data.content;
        const tabs = {
          [ProblemTab.STATEMENT]: {
            key: ProblemTab.STATEMENT,
            header: <T className="ws-np tt-ce">statement</T>,
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
          [ProblemTab.EDITOR]: {
            key: ProblemTab.EDITOR,
            header: <T className="ws-np tt-ce">code editor</T>,
            body: <div className="pad-top-bottom pad-left-right"><ProblemCodeEditor problem={problem} /></div>,
          },
        };
        
        if (user.isLogged) {
          tabs[ProblemTab.MY_SUBMISSIONS] = {
            key: ProblemTab.MY_SUBMISSIONS,
            header: <T className="ws-np tt-ce">my submissions</T>,
            body: <div className="pad-top-bottom pad-left-right"><ProblemMySubmissions problem={problem} /></div>,
          };
        }
        tabs[ProblemTab.SUBMISSIONS] = {
          key: ProblemTab.SUBMISSIONS,
          header: <T className="ws-np tt-ce">submissions</T>,
          body: <div className="pad-top-bottom pad-left-right"><ProblemSubmissions problem={problem} /></div>,
        };
        const breadcrumbs = [
          <Link href="/" className="link"><T className="tt-se">home</T></Link>,
          <LinkProblems><T className="tt-se">problems</T></LinkProblems>,
          <Link href={{ pathname: ROUTES.PROBLEMS.VIEW(problem.key, ProblemTab.STATEMENT), query }} className="link">
            <div className="ws-np">{problem.name}</div>
          </Link>,
          tabs[query.tab as string]?.header,
        ];
        
        const pushTab = (tabKey) => push({ pathname: ROUTES.PROBLEMS.VIEW('' + key, tabKey as ProblemTab), query });
        const extraNodes =
          data?.content?.user?.isEditor ? [
            <ButtonLoader
              size="small"
              icon={<EditIcon />}
              onClick={async setLoaderStatus => {
                setLoaderStatus(Status.LOADING);
                await push(ROUTES.PROBLEMS.EDIT('' + key));
                setLoaderStatus(Status.SUCCESS);
              }}
              responsiveMobile
            >
              {<T>edit</T>}
            </ButtonLoader>,
            <Popover
              content={<T className="ws-np tt-se">only submissions that are not in a contest will be judged</T>}
              placement="left"
              showPopperArrow
            >
              <div>
                <ButtonLoader
                  size={viewPortSize !== 'sm' ? 'small' : 'large'}
                  icon={<AutorenewIcon />}
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
                  {viewPortSize !== 'sm' && <T>rejudge</T>}
                </ButtonLoader>
              </div>
            </Popover>,
          ] : [];
        
        return (
          <TwoContentSection>
            <div className="jk-col stretch extend nowrap">
              <Breadcrumbs breadcrumbs={breadcrumbs} />
              <div className="jk-row gap left pad-left-right pad-top">
                <h2>{problem.name}</h2>
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
              <div className="pad-left-right">
                <TabsInline tabs={tabs} onChange={pushTab} selectedTabKey={query.tab} extraNodes={extraNodes} />
              </div>
            </div>
            {tabs[query.tab as string]?.body}
          </TwoContentSection>
        );
      }}
    </FetcherLayer>
  );
};

export default ProblemView;
