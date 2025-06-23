'use client';

import { useTour } from '@reactour/tour';
import {
  AutorenewIcon,
  Button,
  ButtonLoader,
  DocumentMembersButton,
  EditIcon,
  FirstLoginWrapper,
  InfoIIcon,
  ProblemInfo,
  ProblemView,
  T,
  TwoContentLayout,
} from 'components';
import { jukiApiSocketManager, jukiAppRoutes } from 'config';
import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import {
  useEffect,
  useJukiNotification,
  useJukiTask,
  useJukiUI,
  useMutate,
  useRouterStore,
  useState,
  useTrackLastPath,
  useUserStore,
} from 'hooks';
import {
  ContentResponseType,
  HTTPMethod,
  KeyedMutator,
  LastPathKey,
  ProblemDataResponseDTO,
  ProblemTab,
  ProfileSetting,
  Status,
  TabsType,
} from 'types';
import { InfoTestCases } from './InfoTestCases';
import { ProblemMySubmissions } from './ProblemMySubmissions';
import { ProblemStatistics } from './ProblemStatistics';
import { ProblemStatus } from './ProblemStatus';
import { ProblemSubmissions } from './ProblemSubmissions';
import { RejudgeConfirmationModal } from './RejudgeConfirmationModal';

export const ProblemViewLayout = ({ problem, reloadProblem }: {
  problem: ProblemDataResponseDTO,
  reloadProblem: KeyedMutator<any>,
}) => {
  
  const { setIsOpen } = useTour();
  
  useTrackLastPath(LastPathKey.SECTION_PROBLEM);
  
  useEffect(() => {
    void authorizedRequest(JUDGE_API_V1.STATISTICS.PROBLEM(problem.key), { method: HTTPMethod.POST });
  }, [ problem.key ]);
  
  useEffect(() => {
    const hasSeen = localStorage.getItem('jk-seen-problem-statistics-tour');
    if (!hasSeen) {
      setIsOpen(true);
      localStorage.setItem('jk-seen-problem-statistics-tour', 'true');
    }
  }, [ setIsOpen ]);
  const searchParams = useRouterStore(state => state.searchParams);
  const pushRoute = useRouterStore(state => state.pushRoute);
  const userIsLogged = useUserStore(state => state.user.isLogged);
  const userSessionId = useUserStore(state => state.user.sessionId);
  const userLang = useUserStore(state => state.user.settings[ProfileSetting.LANGUAGE]);
  const { notifyResponse } = useJukiNotification();
  const { listenSubmission } = useJukiTask();
  const mutate = useMutate();
  const [ isOpenRejudgeModal, setIsOpenRejudgeModal ] = useState(false);
  const { components: { Link } } = useJukiUI();
  
  useEffect(() => {
    const { url, ...options } = jukiApiSocketManager.API_V2.export.problem.statementToPdf({
      params: {
        key: problem.key,
        token: userSessionId,
        language: userLang,
      },
    });
    void authorizedRequest(url, options);
  }, [ problem.key, userLang, userSessionId ]);
  
  const tabs: TabsType<ProblemTab> = {
    [ProblemTab.STATEMENT]: {
      key: ProblemTab.STATEMENT,
      header: <T className="ws-np tt-ce">statement</T>,
      body: (
        <ProblemView
          problem={problem}
          withoutName
          infoPlacement="name"
          codeEditorStoreKey={problem.key}
          codeEditorCenterButtons={({ sourceCode, language }) => {
            
            // if (problem.judge.isExternal && false) {
            //   return (
            //     <div className="jk-row">
            //       <InfoIIcon
            //         data-tooltip-id="jk-tooltip"
            //         data-tooltip-content="it is not possible to submit to external judges at this time, we apologize for the inconvenience"
            //         data-tooltip-t-class-name="tt-se"
            //         className="cr-py"
            //       />
            //     </div>
            //   );
            // }
            
            return (
              <div className="jk-row gap">
                <FirstLoginWrapper>
                  <ButtonLoader
                    type="secondary"
                    size="tiny"
                    disabled={sourceCode === ''}
                    onClick={async setLoaderStatus => {
                      setLoaderStatus(Status.LOADING);
                      const { url, ...options } = jukiApiSocketManager.API_V1.problem.submit({
                        params: { key: problem.key },
                        body: { language: language as string, source: sourceCode },
                      });
                      const response = cleanRequest<ContentResponseType<any>>(
                        await authorizedRequest(url, options),
                      );
                      
                      if (notifyResponse(response, setLoaderStatus)) {
                        listenSubmission({ id: response.content.submitId, problem: { name: problem.name } }, true);
                        await mutate(new RegExp(`${jukiApiSocketManager.SERVICE_API_V1_URL}/submission`, 'g'));
                        pushRoute(jukiAppRoutes.JUDGE().problems.view({
                          key: problem.key,
                          tab: ProblemTab.MY_SUBMISSIONS,
                        }));
                      }
                    }}
                  >
                    <T className="tt-se">submit</T>
                  </ButtonLoader>
                </FirstLoginWrapper>
                <Link
                  data-tooltip-id="jk-tooltip"
                  data-tooltip-content="how does it work?"
                  href="https://www.juki.app/docs?page=2&sub_page=2&focus=ef99389d-f48f-415f-b652-38cac0a065b8"
                  target="_blank"
                  className="cr-py"
                >
                  <div className="jk-row">
                    <InfoIIcon circle size="small" />
                  </div>
                </Link>
              </div>
            );
          }}
          // expandPosition={{
          //   top: 0,
          //   left: 0,
          //   width: '100vw',
          //   height: '100vh',
          // }}
        />
      ),
    },
  };
  
  if (userIsLogged) {
    tabs[ProblemTab.MY_SUBMISSIONS] = {
      key: ProblemTab.MY_SUBMISSIONS,
      header: <T className="ws-np tt-ce">my submissions</T>,
      body: <ProblemMySubmissions problem={problem} key="my-submissions" />,
    };
  }
  tabs[ProblemTab.SUBMISSIONS] = {
    key: ProblemTab.SUBMISSIONS,
    header: <T className="ws-np tt-ce">submissions</T>,
    body: <ProblemSubmissions problem={problem} />,
  };
  tabs[ProblemTab.STATISTICS] = {
    key: ProblemTab.STATISTICS,
    header: <T className="ws-np tt-ce tab-statistics">statistics</T>,
    body: <ProblemStatistics problem={problem} />,
  };
  
  // const breadcrumbs: TwoContentLayoutProps<ProblemTab>['breadcrumbs'] = ({ selectedTabKey }) => [
  //   <LinkLastPath
  //     lastPathKey={LastPathKey.PROBLEMS}
  //     key="problems"
  //   >
  //     <T className="tt-se">problems</T>
  //   </LinkLastPath>,
  //   <Link
  //     href={jukiAppRoutes.JUDGE().problems.view({ key: problem.key })}
  //     className="link"
  //     key="problem.name"
  //   >
  //     <div className="ws-np">{problem.name}</div>
  //   </Link>,
  //   renderReactNodeOrFunctionP1(tabs[selectedTabKey]?.header, { selectedTabKey }),
  // ];
  
  const extraNodes = [];
  if (problem.user?.isManager && !problem.judge?.isExternal) {
    extraNodes.push(
      <DocumentMembersButton
        documentMembers={problem.members}
        documentOwner={problem.owner}
        documentName={<T>problem</T>}
        saveUrl={JUDGE_API_V1.PROBLEM.PROBLEM(problem.key)}
        reloadDocument={reloadProblem}
        copyLink={() => jukiAppRoutes.JUDGE(typeof window !== 'undefined' ? window.location.origin : '').problems.view({ key: problem.key })}
      />,
      <Button
        data-tooltip-id="jk-tooltip"
        data-tooltip-content="only submissions that are not in a contest will be judged"
        data-tooltip-t-class-name="tt-se"
        size="small"
        icon={<AutorenewIcon />}
        onClick={() => setIsOpenRejudgeModal(true)}
        responsiveMobile
        type="light"
      >
        <T className="tt-se">rejudge</T>
      </Button>,
      <ButtonLoader
        size="small"
        icon={<EditIcon />}
        onClick={async setLoaderStatus => {
          setLoaderStatus(Status.LOADING);
          pushRoute(jukiAppRoutes.JUDGE().problems.edit({ key: problem.key as string }));
          setLoaderStatus(Status.SUCCESS);
        }}
        responsiveMobile
      >
        <T className="tt-se">edit</T>
      </ButtonLoader>,
    );
  } else if (problem.judge?.isExternal && userIsLogged) {
    // TODO:
    // extraNodes.push(
    //   <ButtonLoader
    //     size="small"
    //     type="light"
    //     icon={<AutorenewIcon />}
    //     onClick={async setLoaderStatus => {
    //       setLoaderStatus(Status.LOADING);
    //       const response = cleanRequest<ContentResponseType<string>>(
    //         await authorizedRequest(
    //           jukiApiSocketManager.API_V1.problem.reCrawl({ params: { key: problem.key } }).url,
    //           { method: HTTPMethod.POST },
    //         ),
    //       );
    //       await reloadProblem();
    //       notifyResponse(response, setLoaderStatus);
    //     }}
    //     responsiveMobile
    //   >
    //     <T className="tt-se ws-np">re crawl</T>
    //   </ButtonLoader>,
    // );
  }
  
  const problemTab = (searchParams.get('tab') || ProblemTab.STATEMENT) as ProblemTab;
  
  return (
    <TwoContentLayout
      tabs={tabs}
      // breadcrumbs={breadcrumbs}
      tabButtons={extraNodes}
      selectedTabKey={problemTab}
      getHrefOnTabChange={tab => jukiAppRoutes.JUDGE().problems.view({ key: problem.key, tab })}
    >
      <RejudgeConfirmationModal
        isOpen={isOpenRejudgeModal}
        onClose={() => setIsOpenRejudgeModal(false)}
        problemKey={problem.key}
      />
      {/*<CustomHead title={problem.name} />*/}
      <div className="jk-row gap left">
        <h2>
          {(problem.shortname ? `[${problem.shortname}] ` : '') + problem.name}&nbsp;
        </h2>
        <div className="jk-tag bc-hl tx-s">{problem.judge?.name}</div>
        <ProblemInfo problem={problem} />
        {problem.user.isManager && <InfoTestCases problem={problem} />}
        <ProblemStatus {...problem.user} />
      </div>
    </TwoContentLayout>
  );
};
