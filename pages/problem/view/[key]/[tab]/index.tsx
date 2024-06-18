import {
  AssignmentIcon,
  AutorenewIcon,
  Button,
  ButtonLoader,
  CustomHead,
  EditIcon,
  FetcherLayer,
  FirstLoginWrapper,
  LinkLastPath,
  Popover,
  ProblemInfo,
  ProblemMySubmissions,
  ProblemSubmissions,
  ProblemView,
  T,
  TwoContentLayout,
} from 'components';
import { JUDGE, JUDGE_API_V1, JUKI_APP_COMPANY_KEY, ROUTES } from 'config/constants';
import {
  authorizedRequest,
  cleanRequest,
  getProblemJudgeKey,
  getSimpleProblemJudgeKey,
  oneTab,
  renderReactNodeOrFunctionP1,
} from 'helpers';
import { useJukiRouter, useJukiUI, useJukiUser, useNotification, useTask, useTrackLastPath } from 'hooks';
import {
  ContentResponseType,
  HTTPMethod,
  Judge,
  LastPathKey,
  ProblemResponseDTO,
  ProblemTab,
  ReactNode,
  Status,
  SubmissionRunStatus,
  TabsType,
} from 'types';
import Custom404 from '../../../../404';

const ProblemViewPage = (): ReactNode => {
  
  useTrackLastPath(LastPathKey.SECTION_PROBLEM);
  const { searchParams, routeParams: { key: problemKey, tab: problemTab }, pushRoute } = useJukiRouter();
  const { user, company: { key: companyKey } } = useJukiUser();
  const { addSuccessNotification, addErrorNotification, notifyResponse } = useNotification();
  const { listenSubmission } = useTask();
  const { components: { Link } } = useJukiUI();
  const breadcrumbs = [
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
        <TwoContentLayout breadcrumbs={breadcrumbs} loading>
          <h2
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 'calc(100vw - var(--pad-md) - var(--pad-md) - 64px - var(--left-vertical-menu-width))',
            }}
          >
            {problemKey}
          </h2>
        </TwoContentLayout>
      }
      errorView={
        <TwoContentLayout
          breadcrumbs={breadcrumbs}
          tabs={oneTab(
            <Custom404>
              <p>
                <T className="tt-se">the problem does not exist or you do not have permissions to view it</T>
              </p>
              <LinkLastPath lastPathKey={LastPathKey.PROBLEMS}>
                <Button icon={<AssignmentIcon />} type="light">
                  <T className="tt-se">go to problem list</T>
                </Button>
              </LinkLastPath>
            </Custom404>,
          )}
        >
          <h2><T>problem not found</T></h2>
        </TwoContentLayout>
      }
    >
      {({ data, mutate }) => {
        const problem = data.content;
        const tabs: TabsType<ProblemTab> = {
          [ProblemTab.STATEMENT]: {
            key: ProblemTab.STATEMENT,
            header: <T className="ws-np tt-ce">statement</T>,
            body: (
              <ProblemView
                problem={problem}
                withoutName
                infoPlacement="name"
                codeEditorSourceStoreKey={getProblemJudgeKey(problem.judge, problem.key)}
                codeEditorCenterButtons={({ sourceCode, language }) => {
                  return (
                    <FirstLoginWrapper>
                      <ButtonLoader
                        type="secondary"
                        size="tiny"
                        disabled={sourceCode === ''}
                        onClick={async setLoaderStatus => {
                          setLoaderStatus(Status.LOADING);
                          const response = cleanRequest<ContentResponseType<any>>(
                            await authorizedRequest(
                              JUDGE_API_V1.PROBLEM.SUBMIT(problem.judge, problem.key),
                              { method: HTTPMethod.POST, body: JSON.stringify({ language, source: sourceCode }) },
                            ),
                          );
                          
                          if (notifyResponse(response, setLoaderStatus)) {
                            listenSubmission(
                              response.content.submitId,
                              problem.judge,
                              problem.key,
                            );
                            // TODO fix the filter Url param
                            // await mutate(JUDGE_API_V1.SUBMISSIONS.PROBLEM_NICKNAME(
                            //   problem.judge,
                            //   problem.key,
                            //   nickname,
                            //   1,
                            //   +(myStatusPageSize || PAGE_SIZE_OPTIONS[0]),
                            //   '',
                            //   '',
                            // ));
                            pushRoute({
                              pathname: ROUTES.PROBLEMS.VIEW('' + problemKey, ProblemTab.MY_SUBMISSIONS),
                              searchParams,
                            });
                          }
                        }}
                      >
                        <T>submit</T>
                      </ButtonLoader>
                    </FirstLoginWrapper>
                  );
                }}
              />
            ),
          },
        };
        
        if (user.isLogged) {
          tabs[ProblemTab.MY_SUBMISSIONS] = {
            key: ProblemTab.MY_SUBMISSIONS,
            header: <T className="ws-np tt-ce">my submissions</T>,
            body: <ProblemMySubmissions problem={problem} />,
          };
        }
        tabs[ProblemTab.SUBMISSIONS] = {
          key: ProblemTab.SUBMISSIONS,
          header: <T className="ws-np tt-ce">submissions</T>,
          body: <ProblemSubmissions problem={problem} />,
        };
        const breadcrumbs: ReactNode[] = [
          <LinkLastPath
            lastPathKey={LastPathKey.PROBLEMS}
            key="problems"
          >
            <T className="tt-se">problems</T>
          </LinkLastPath>,
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
        
        const extraNodes = [];
        if (data?.content?.user?.isEditor && (data?.content?.judge === Judge.JUKI_JUDGE || data?.content?.judge === Judge.CUSTOMER)) {
          extraNodes.push(
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
                  type="light"
                >
                  <T>rejudge</T>
                </ButtonLoader>
              </div>
            </Popover>,
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
          <TwoContentLayout
            tabs={tabs}
            breadcrumbs={breadcrumbs}
            selectedTabKey={problemTab as ProblemTab}
            getPathname={tabKey => ROUTES.PROBLEMS.VIEW(problemKey as string, tabKey)}
            tabButtons={extraNodes}
          >
            <div>
              <CustomHead title={problem.name} />
              <div className="jk-row gap left">
                <h2
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 'calc(100vw - var(--pad-md) - var(--pad-md) - 24px - var(--gap) - var(--left-vertical-menu-width, 0px))',
                  }}
                >
                  {problem.name}
                </h2>
                {[ Judge.CODEFORCES, Judge.JV_UMSA ].includes(problem.judge) && (
                  <div className="jk-tag warning">{JUDGE[problem.judge].label}</div>
                )}
                <ProblemInfo problem={problem} />
              </div>
            </div>
          </TwoContentLayout>
        );
      }}
    </FetcherLayer>
  );
};

export default ProblemViewPage;
