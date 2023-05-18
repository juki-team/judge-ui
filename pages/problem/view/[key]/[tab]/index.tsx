import { JUKI_APP_COMPANY_KEY } from '@juki-team/commons';
import {
  AssignmentIcon,
  AutorenewIcon,
  Breadcrumbs,
  ButtonLoader,
  EditIcon,
  ExclamationIcon,
  FetcherLayer,
  LinkProblems,
  LoadingIcon,
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
import { JUDGE, JUDGE_API_V1, ROUTES } from 'config/constants';
import { authorizedRequest, cleanRequest, getProblemJudgeKey, getSimpleProblemJudgeKey } from 'helpers';
import { useJukiUI, useJukiUser, useNotification, useRouter, useTrackLastPath } from 'hooks';
import Link from 'next/link';
import React, { ReactNode } from 'react';
import {
  ContentResponseType,
  HTTPMethod,
  Judge,
  Language,
  LastLinkKey,
  ProblemResponseDTO,
  ProblemTab,
  Status,
  SubmissionRunStatus,
} from 'types';
import Custom404 from '../../../../404';

const ProblemView = (): ReactNode => {
  
  useTrackLastPath(LastLinkKey.SECTION_PROBLEM);
  const { query: { key, tab: problemTab, ...query }, push, isReady } = useRouter();
  const { user, company: { key: companyKey } } = useJukiUser();
  const { addSuccessNotification, addErrorNotification, notifyResponse } = useNotification();
  const { viewPortSize, router: { setSearchParams } } = useJukiUI();
  const breadcrumbs = [
    <Link href="/" className="link"><T className="tt-se">home</T></Link>,
    <LinkProblems><T className="tt-se">problems</T></LinkProblems>,
    <Link
      href={{
        pathname: ROUTES.PROBLEMS.VIEW(key as string, ProblemTab.STATEMENT),
        query,
      }}
      className="link"
    >
      <div className="ws-np">{key}</div>
    </Link>,
    <T className="ws-np tt-ce">statement</T>,
  ];
  
  return (
    <FetcherLayer<ContentResponseType<ProblemResponseDTO>>
      url={isReady && JUDGE_API_V1.PROBLEM.DATA(key as string)}
      loadingView={
        <TwoContentSection>
          <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <div className="jk-row gap left pad-left-right">
              <h2
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 'calc(100vw - var(--pad-border) - var(--pad-border) - 64px - var(--left-vertical-menu-width))',
                }}
              >
                {key}
              </h2>
            </div>
            <div className="pad-left-right">
              <TabsInline
                tabs={{
                  [ProblemTab.STATEMENT]: {
                    key: ProblemTab.STATEMENT,
                    header: <T className="ws-np tt-ce">statement</T>,
                    body: '',
                  },
                  [ProblemTab.EDITOR]: {
                    key: ProblemTab.EDITOR,
                    header: <T className="ws-np tt-ce">code editor</T>,
                    body: '',
                  },
                  'loading': {
                    key: 'loading',
                    header: <div className="jk-row">
                      <div className="dot-flashing" />
                    </div>,
                    body: '',
                  },
                }}
                selectedTabKey={ProblemTab.STATEMENT}
                onChange={() => null}
              />
            </div>
          </div>
          <div className="jk-row jk-col extend">
            <LoadingIcon size="very-huge" className="cr-py" />
          </div>
        </TwoContentSection>
      }
      errorView={
        <TwoContentSection>
          <div>
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
          <Custom404>
            <h3><T className="tt-ue">problem not found</T></h3>
            <p>
              <T className="tt-se">the problem does not exist or you do not have permissions to view it</T>
            </p>
            <Link href={ROUTES.PROBLEMS.LIST()} className="link tt-ue">
              <div className="jk-row gap"><AssignmentIcon /><T>go to problems list</T></div>
            </Link>
          </Custom404>
        </TwoContentSection>
      }
    >
      {({ data }) => {
        const problem = data.content;
        const tabs = {
          [ProblemTab.STATEMENT]: {
            key: ProblemTab.STATEMENT,
            header: <T className="ws-np tt-ce">statement</T>,
            body: (
              <ProblemStatement
                judge={problem.judge}
                problemKey={problem.key}
                author={problem.author}
                name={problem.name}
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
          <Link
            href={{
              pathname: ROUTES.PROBLEMS.VIEW(
                getSimpleProblemJudgeKey(problem.judge, problem.key, companyKey === JUKI_APP_COMPANY_KEY),
                ProblemTab.STATEMENT,
              ),
              query,
            }}
            className="link"
          >
            <div className="ws-np">{problem.name}</div>
          </Link>,
          tabs[problemTab as string]?.header,
        ];
        
        const pushTab = (tabKey) => setSearchParams({ name: 'tab', value: tabKey });
        
        const extraNodes = [];
        if (data?.content?.user?.isEditor && (data?.content?.judge === Judge.JUKI_JUDGE || data?.content?.judge === Judge.CUSTOMER)) {
          extraNodes.push(
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
              content={<T className="ws-np tt-se">only submissions that are not in a contest will be
                judged</T>}
              placement="left"
              showPopperArrow
            >
              <div>
                <ButtonLoader
                  size="small"
                  icon={<AutorenewIcon />}
                  onClick={async setLoaderStatus => {
                    setLoaderStatus(Status.LOADING);
                    const bodyProblem = { ...problem };
                    delete bodyProblem.key;
                    const result = cleanRequest<ContentResponseType<{
                      listCount: number, status: SubmissionRunStatus.RECEIVED
                    }>>(await authorizedRequest(JUDGE_API_V1.REJUDGE.PROBLEM(getProblemJudgeKey(
                      problem.judge,
                      problem.key,
                    )), { method: HTTPMethod.POST }));
                    if (result.success) {
                      addSuccessNotification(<div><T>rejudging</T>&nbsp;{result.content.listCount}&nbsp;
                        <T>submissions</T></div>);
                      setLoaderStatus(Status.SUCCESS);
                    } else {
                      addErrorNotification(<T
                        className="tt-se"
                      >{result.message ||
                        'something went wrong, please try again later'}</T>);
                      setLoaderStatus(Status.ERROR);
                    }
                  }}
                  responsiveMobile
                >
                  <T>rejudge</T>
                </ButtonLoader>
              </div>
            </Popover>,
          );
        } else if (data?.content?.judge === Judge.CODEFORCES && user.isLogged) {
          extraNodes.push(<ButtonLoader
            size="small"
            icon={<AutorenewIcon />}
            onClick={async setLoaderStatus => {
              setLoaderStatus(Status.LOADING);
              const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
                JUDGE_API_V1.PROBLEM.RE_CRAWL_PROBLEM(getProblemJudgeKey(problem.judge, problem.key)),
                { method: HTTPMethod.POST },
              ));
              notifyResponse(response, setLoaderStatus);
            }}
            responsiveMobile
          >
            <T className="tt-se ws-np">re crawl</T>
          </ButtonLoader>);
        }
        
        return (
          <TwoContentSection>
            <div>
              <Breadcrumbs breadcrumbs={breadcrumbs} />
              <div className="jk-row gap left pad-left-right">
                <h2
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 'calc(100vw - var(--pad-border) - var(--pad-border) - 24px - var(--gap) - var(--left-vertical-menu-width, 0px))',
                  }}
                >
                  {problem.name}
                </h2>
                {problem.judge === Judge.CODEFORCES && (
                  <div className="jk-tag warning">{JUDGE[Judge.CODEFORCES].label}</div>
                )}
                <Popover
                  content={problem.judge === Judge.JUKI_JUDGE ? <ProblemInfo
                    author={problem.author}
                    status={problem.status}
                    tags={problem.tags}
                    settings={problem.settings}
                  /> : problem.judge === Judge.CODEFORCES ? <div className="jk-row extend top">
                    <div
                      className="codeforces-statement only-info"
                      dangerouslySetInnerHTML={{ __html: problem.statement.html[Language.EN] }}
                    />
                  </div> : <div></div>}
                  triggerOn="click"
                  placement="bottom"
                >
                  <div className="jk-row link"><ExclamationIcon
                    filledCircle className="cr-py"
                    rotate={180}
                  /></div>
                </Popover>
              </div>
              <div className="pad-left-right">
                <TabsInline
                  tabs={tabs}
                  onChange={pushTab}
                  selectedTabKey={problemTab}
                  extraNodes={extraNodes}
                  extraNodesPlacement={viewPortSize === 'sm' ? 'bottomRight' : undefined}
                />
              </div>
            </div>
            {tabs[problemTab as string]?.body}
          </TwoContentSection>
        );
      }}
    </FetcherLayer>
  );
};

export default ProblemView;
