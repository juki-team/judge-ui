import {
  AssignmentIcon,
  AutorenewIcon,
  Breadcrumbs,
  ButtonLoader,
  CustomHead,
  EditIcon,
  ExclamationIcon,
  FetcherLayer,
  HomeLink,
  LinkLastPath,
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
import { JUDGE, JUDGE_API_V1, JUKI_APP_COMPANY_KEY, ROUTES } from 'config/constants';
import {
  authorizedRequest,
  cleanRequest,
  getProblemJudgeKey,
  getSimpleProblemJudgeKey,
  renderReactNodeOrFunctionP1,
} from 'helpers';
import { useJukiRouter, useJukiUI, useJukiUser, useNotification, useTrackLastPath } from 'hooks';
import {
  ContentResponseType,
  HTTPMethod,
  Judge,
  Language,
  LastPathKey,
  ProblemResponseDTO,
  ProblemTab,
  ReactNode,
  Status,
  SubmissionRunStatus,
  TabsType,
} from 'types';
import Custom404 from '../../../../404';

const ProblemView = (): ReactNode => {
  
  useTrackLastPath(LastPathKey.SECTION_PROBLEM);
  const { searchParams, routeParams: { key: problemKey, tab: problemTab }, pushRoute } = useJukiRouter();
  const { user, company: { key: companyKey } } = useJukiUser();
  const { addSuccessNotification, addErrorNotification, notifyResponse } = useNotification();
  const { viewPortSize, components: { Link } } = useJukiUI();
  const breadcrumbs = [
    <HomeLink key="home" />,
    <LinkLastPath lastPathKey={LastPathKey.PROBLEMS} key="problems"><T className="tt-se">problems</T></LinkLastPath>,
    <Link
      href={{
        pathname: ROUTES.PROBLEMS.VIEW(problemKey as string, ProblemTab.STATEMENT),
        search: searchParams.toString(),
      }}
      className="link"
      key="key"
    >
      <div className="ws-np">{problemKey}</div>
    </Link>,
    <T className="ws-np tt-ce" key="statement">statement</T>,
  ];
  
  return (
    <FetcherLayer<ContentResponseType<ProblemResponseDTO>>
      url={JUDGE_API_V1.PROBLEM.DATA(problemKey as string)}
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
                {problemKey}
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
            <LinkLastPath lastPathKey={LastPathKey.PROBLEMS}>
              <div className="jk-row"><AssignmentIcon /><T className="tt-se">go to problem list</T></div>
            </LinkLastPath>
          </Custom404>
        </TwoContentSection>
      }
    >
      {({ data, mutate }) => {
        const problem = data.content;
        const tabs: TabsType<ProblemTab> = {
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
        const breadcrumbs: ReactNode[] = [
          <HomeLink key="home" />,
          <LinkLastPath
            lastPathKey={LastPathKey.PROBLEMS}
            key="problems"
          ><T className="tt-se">problems</T></LinkLastPath>,
          <Link
            href={{
              pathname: ROUTES.PROBLEMS.VIEW(
                getSimpleProblemJudgeKey(problem.judge, problem.key, companyKey === JUKI_APP_COMPANY_KEY),
                ProblemTab.STATEMENT,
              ),
              search: searchParams.toString(),
            }}
            className="link"
            key="problem.name"
          >
            <div className="ws-np">{problem.name}</div>
          </Link>,
          renderReactNodeOrFunctionP1(tabs[problemTab as string]?.header, { selectedTabKey: problemTab as ProblemTab }),
        ];
        
        const pushTab = (tabKey: ProblemTab) => pushRoute({
          pathname: ROUTES.PROBLEMS.VIEW(problemKey as string, tabKey),
          searchParams,
        });
        
        const extraNodes = [];
        if (data?.content?.user?.isEditor && (data?.content?.judge === Judge.JUKI_JUDGE || data?.content?.judge === Judge.CUSTOMER)) {
          extraNodes.push(
            <ButtonLoader
              size="small"
              icon={<EditIcon />}
              onClick={async setLoaderStatus => {
                setLoaderStatus(Status.LOADING);
                await pushRoute(ROUTES.PROBLEMS.EDIT(problemKey as string));
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
                    const result = cleanRequest<ContentResponseType<{
                      listCount: number,
                      status: SubmissionRunStatus.RECEIVED
                    }>>(
                      await authorizedRequest(
                        JUDGE_API_V1.REJUDGE.PROBLEM(getProblemJudgeKey(problem.judge, problem.key)), { method: HTTPMethod.POST },
                      ),
                    );
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
        } else if ([ Judge.CODEFORCES, Judge.JV_UMSA, Judge.CODEFORCES_GYM ].includes(data?.content?.judge) && user.isLogged) {
          extraNodes.push(
            <ButtonLoader
              size="small"
              type="light"
              icon={<AutorenewIcon />}
              onClick={async setLoaderStatus => {
                setLoaderStatus(Status.LOADING);
                const response = cleanRequest<ContentResponseType<string>>(
                  await authorizedRequest(
                    JUDGE_API_V1.PROBLEM.RE_CRAWL_PROBLEM(getProblemJudgeKey(problem.judge, problem.key)),
                    { method: HTTPMethod.POST },
                  ),
                );
                await mutate();
                notifyResponse(response, setLoaderStatus);
              }}
              responsiveMobile
            >
              <T className="tt-se ws-np">re crawl</T>
            </ButtonLoader>,
          );
        }
        
        return (
          <TwoContentSection>
            <div>
              <CustomHead title={problem.name} />
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
                {[ Judge.CODEFORCES, Judge.JV_UMSA ].includes(problem.judge) && (
                  <div className="jk-tag warning">{JUDGE[problem.judge].label}</div>
                )}
                <Popover
                  content={problem.judge === Judge.JUKI_JUDGE
                    ? (
                      <div className="jk-pad-sm">
                        <ProblemInfo
                          author={problem.author}
                          status={problem.status}
                          tags={problem.tags}
                          settings={problem.settings}
                        />
                      </div>
                    ) : [ Judge.CODEFORCES, Judge.JV_UMSA, Judge.CODEFORCES_GYM ].includes(problem.judge)
                      ? (
                        <div className="jk-row extend top">
                          <div
                            className={`${problem.judge}-statement only-info`}
                            dangerouslySetInnerHTML={{ __html: problem.statement.html[Language.EN] || problem.statement.html[Language.ES] }}
                          />
                        </div>
                      ) : <div></div>}
                  triggerOn="click"
                  placement="bottom"
                >
                  <div className="jk-row link">
                    <ExclamationIcon filledCircle className="cr-py" rotate={180} />
                  </div>
                </Popover>
              </div>
              <div className="pad-left-right">
                <TabsInline
                  tabs={tabs}
                  onChange={pushTab}
                  selectedTabKey={problemTab as ProblemTab}
                  extraNodes={extraNodes}
                  extraNodesPlacement={viewPortSize === 'sm' ? 'bottomRight' : undefined}
                />
              </div>
            </div>
            {renderReactNodeOrFunctionP1(tabs[problemTab as ProblemTab]?.body, { selectedTabKey: problemTab as ProblemTab })}
          </TwoContentSection>
        );
      }}
    </FetcherLayer>
  );
};

export default ProblemView;
