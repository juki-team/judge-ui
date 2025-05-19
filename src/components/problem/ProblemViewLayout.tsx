'use client';

import {
  AutorenewIcon,
  Button,
  ButtonLoader,
  EditIcon,
  FirstLoginWrapper,
  ProblemInfo,
  ProblemView,
  T,
  TwoContentLayout,
} from 'components';
import { jukiApiSocketManager, jukiAppRoutes } from 'config';
import { authorizedRequest, cleanRequest } from 'helpers';
import {
  useEffect,
  useJukiNotification,
  useJukiTask,
  useMutate,
  useRouterStore,
  useState,
  useTrackLastPath,
  useUserStore,
} from 'hooks';
import {
  ContentResponseType,
  KeyedMutator,
  LastPathKey,
  ProblemDataResponseDTO,
  ProblemTab,
  ProfileSetting,
  Status,
  TabsType,
} from 'types';
import { ProblemMySubmissions } from './ProblemMySubmissions';
import { ProblemStatus } from './ProblemStatus';
import { ProblemSubmissions } from './ProblemSubmissions';
import { RejudgeConfirmationModal } from './RejudgeConfirmationModal';

export const ProblemViewLayout = ({ problem }: {
  problem: ProblemDataResponseDTO,
  reloadProblem: KeyedMutator<any>,
}) => {
  
  useTrackLastPath(LastPathKey.SECTION_PROBLEM);
  const searchParams = useRouterStore(state => state.searchParams);
  const pushRoute = useRouterStore(state => state.pushRoute);
  const userIsLogged = useUserStore(state => state.user.isLogged);
  const userSessionId = useUserStore(state => state.user.sessionId);
  const userLang = useUserStore(state => state.user.settings[ProfileSetting.LANGUAGE]);
  const { notifyResponse } = useJukiNotification();
  const { listenSubmission } = useJukiTask();
  const mutate = useMutate();
  const [ isOpenRejudgeModal, setIsOpenRejudgeModal ] = useState(false);
  
  useEffect(() => {
    const { url, ...options } = jukiApiSocketManager.API_V2.export.problem.statementToPdf({
      params: {
        key: problem.key,
        token: userSessionId,
        language: userLang,
      },
    });
    void authorizedRequest(url, options);
    const { url: url1, ...options1 } = jukiApiSocketManager.API_V2.export.problem.statementToPng({
      params: {
        key: problem.key,
        token: userSessionId,
        language: userLang,
      },
    });
    authorizedRequest(url1, options1).then((data) => {
      console.log({ data: cleanRequest(data) });
    });
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
            //       <InfoIcon
            //         data-tooltip-id="jk-tooltip"
            //         data-tooltip-content="it is not possible to submit to external judges at this time, we apologize for the inconvenience"
            //         data-tooltip-t-class-name="tt-se"
            //         className="cr-py"
            //       />
            //     </div>
            //   );
            // }
            
            return (
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
      body: <ProblemMySubmissions problem={problem} />,
    };
  }
  tabs[ProblemTab.SUBMISSIONS] = {
    key: ProblemTab.SUBMISSIONS,
    header: <T className="ws-np tt-ce">submissions</T>,
    body: <ProblemSubmissions problem={problem} />,
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
      <>
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
          <div className="jk-tag bc-hl">{problem.judge?.name}</div>
          <ProblemInfo problem={problem} />
          <ProblemStatus {...problem.user} />
        </div>
      </>
    </TwoContentLayout>
  );
};
