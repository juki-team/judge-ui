import {
  AutorenewIcon,
  ButtonLoader,
  CustomHead,
  EditIcon,
  FirstLoginWrapper,
  LinkLastPath,
  Portal,
  ProblemInfo,
  ProblemView,
  T,
  TwoContentLayout,
} from 'components';
import { jukiSettings } from 'config';
import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest, renderReactNodeOrFunctionP1 } from 'helpers';
import {
  useJukiNotification,
  useJukiRouter,
  useJukiTask,
  useJukiUI,
  useJukiUser,
  useSWR,
  useTrackLastPath,
} from 'hooks';
import { KeyedMutator } from 'swr';
import {
  ContentResponseType,
  HTTPMethod,
  LastPathKey,
  ProblemDataResponseDTO,
  ProblemTab,
  QueryParam,
  Status,
  SubmissionRunStatus,
  TabsType,
  TwoContentLayoutProps,
} from 'types';
import { ProblemMySubmissions } from './ProblemMySubmissions';
import { ProblemStatus } from './ProblemStatus';
import { ProblemSubmissions } from './ProblemSubmissions';

export const ProblemViewLayout = ({ problem, reloadProblem }: {
  problem: ProblemDataResponseDTO,
  reloadProblem: KeyedMutator<any>,
}) => {
  
  useTrackLastPath(LastPathKey.SECTION_PROBLEM);
  const { searchParams, routeParams: { key: problemKey }, pushRoute } = useJukiRouter();
  const { user, company: { key: companyKey } } = useJukiUser();
  const { addSuccessNotification, addErrorNotification, notifyResponse } = useJukiNotification();
  const { listenSubmission } = useJukiTask();
  const { components: { Link } } = useJukiUI();
  const { matchMutate } = useSWR();
  const printMode = searchParams.get(QueryParam.PRINT_MODE);
  
  if (printMode === 'asProblemset') {
    return (
      <Portal className="">
        <div
          style={{
            // position: 'fixed',
            // zIndex: 100000,
            width: '100vw',
            height: '100vh',
            // top: 0,
            // left: 0,
            background: 'white',
            padding: 'var(--pad-md)',
            boxSizing: 'border-box',
          }}
        >
          <ProblemView
            problem={problem}
            infoPlacement="none"
            codeEditorSourceStoreKey={problem.key}
            forPrinting
          />
        </div>
      </Portal>
    );
  }
  
  const tabs: TabsType<ProblemTab> = {
    [ProblemTab.STATEMENT]: {
      key: ProblemTab.STATEMENT,
      header: <T className="ws-np tt-ce">statement</T>,
      body: (
        <ProblemView
          problem={problem}
          withoutName
          infoPlacement="name"
          codeEditorSourceStoreKey={problem.key}
          codeEditorCenterButtons={({ sourceCode, language }) => {
            return (
              <FirstLoginWrapper>
                <ButtonLoader
                  type="secondary"
                  size="tiny"
                  disabled={sourceCode === ''}
                  onClick={async setLoaderStatus => {
                    setLoaderStatus(Status.LOADING);
                    const { url, ...options } = jukiSettings.API.problem.submit({
                      params: { key: problem.key },
                      body: { language: language as string, source: sourceCode },
                    });
                    const response = cleanRequest<ContentResponseType<any>>(
                      await authorizedRequest(url, options),
                    );
                    
                    if (notifyResponse(response, setLoaderStatus)) {
                      listenSubmission({ id: response.content.submitId, problem: { name: problem.name } }, true);
                      await matchMutate(new RegExp(`^${jukiSettings.SERVICE_API_URL}/submission`, 'g'));
                      pushRoute({
                        pathname: jukiSettings.ROUTES.problems().view({ key: problemKey as string }),
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
  const breadcrumbs: TwoContentLayoutProps<ProblemTab>['breadcrumbs'] = ({ selectedTabKey }) => [
    <LinkLastPath
      lastPathKey={LastPathKey.PROBLEMS}
      key="problems"
    >
      <T className="tt-se">problems</T>
    </LinkLastPath>,
    <Link
      href={jukiSettings.ROUTES.problems().view({ key: problem.key })}
      className="link"
      key="problem.name"
    >
      <div className="ws-np">{problem.name}</div>
    </Link>,
    renderReactNodeOrFunctionP1(tabs[selectedTabKey]?.header, { selectedTabKey }),
  ];
  
  const extraNodes = [];
  if (problem.user?.isManager && !problem.judge?.isExternal) {
    extraNodes.push(
      <ButtonLoader
        data-tooltip-id="jk-tooltip"
        data-tooltip-content="only submissions that are not in a contest will be judged"
        data-tooltip-t-class-name="ws-np tt-se"
        size="small"
        icon={<AutorenewIcon />}
        onClick={async setLoaderStatus => {
          setLoaderStatus(Status.LOADING);
          const result = cleanRequest<ContentResponseType<{
            listCount: number,
            status: SubmissionRunStatus.RECEIVED
          }>>(
            await authorizedRequest(
              JUDGE_API_V1.REJUDGE.PROBLEM(problem.key), { method: HTTPMethod.POST },
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
      </ButtonLoader>,
      <ButtonLoader
        size="small"
        icon={<EditIcon />}
        onClick={async setLoaderStatus => {
          setLoaderStatus(Status.LOADING);
          pushRoute(jukiSettings.ROUTES.problems().edit({ key: problemKey as string }));
          setLoaderStatus(Status.SUCCESS);
        }}
        responsiveMobile
      >
        {<T>edit</T>}
      </ButtonLoader>,
    );
  } else if (problem.judge?.isExternal && user.isLogged) {
    extraNodes.push(
      <ButtonLoader
        size="small"
        type="light"
        icon={<AutorenewIcon />}
        onClick={async setLoaderStatus => {
          setLoaderStatus(Status.LOADING);
          const response = cleanRequest<ContentResponseType<string>>(
            await authorizedRequest(
              jukiSettings.API.problem.reCrawl({ params: { key: problem.key } }).url,
              { method: HTTPMethod.POST },
            ),
          );
          await reloadProblem();
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
          <div className="jk-tag gray-6">{problem.judge?.name}</div>
          <ProblemInfo problem={problem} />
          <ProblemStatus {...problem.user} />
        </div>
      </div>
    </TwoContentLayout>
  );
};
