'use client';

import { useTour } from '@reactour/tour';
import { AutorenewIcon, Button, DocumentMembersButton, EditIcon, ProblemInfo, T, TwoContentLayout } from 'components';
import { jukiApiManager, jukiAppRoutes } from 'config';
import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest } from 'helpers';
import { useEffect, useJukiUI, useRef, useRouterStore, useState, useTrackLastPath, useUserStore } from 'hooks';
import {
  HTTPMethod,
  KeyedMutator,
  LastPathKey,
  ProblemDataResponseDTO,
  ProblemTab,
  ProfileSetting,
  TabsType,
} from 'types';
import { InfoTestCases } from './InfoTestCases';
import { problemAccessProps } from './ProblemAccess';
import { ProblemMySubmissions } from './ProblemMySubmissions';
import { ProblemStatistics } from './ProblemStatistics';
import { ProblemStatus } from './ProblemStatus';
import { ProblemSubmissions } from './ProblemSubmissions';
import { ProblemViewTab } from './ProblemViewTab';
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
  const userIsLogged = useUserStore(state => state.user.isLogged);
  const userSessionId = useUserStore(state => state.user.sessionId);
  const userLang = useUserStore(state => state.user.settings[ProfileSetting.LANGUAGE]);
  const [ isOpenRejudgeModal, setIsOpenRejudgeModal ] = useState(false);
  const { components: { Link } } = useJukiUI();
  
  const lastSourceRef = useRef('');
  const lastLanguageRef = useRef('');
  const submissionTimestampsRef = useRef<number[]>([]);
  
  useEffect(() => {
    const { url, ...options } = jukiApiManager.API_V2.export.problem.statementToPdf({
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
      body: <ProblemViewTab
        problem={problem}
        key="statement"
        historyRefs={{ lastLanguageRef, lastSourceRef, submissionTimestampsRef }}
      />,
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
  extraNodes.push(
    <DocumentMembersButton
      isAdministrator={problem.user.isAdministrator}
      members={problem.members}
      documentOwner={problem.owner}
      documentName={<T>problem</T>}
      saveUrl={JUDGE_API_V1.PROBLEM.PROBLEM_MEMBERS(problem.key)}
      reloadDocument={reloadProblem}
      copyLink={() => jukiAppRoutes.JUDGE(typeof window !== 'undefined' ? window.location.origin : '').problems.view({ key: problem.key })}
      {...problemAccessProps}
    />,
  );
  if (problem.user?.isAdministrator) {
    if (!problem.judge.isExternal) {
      extraNodes.push(<Button
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
      );
    }
    extraNodes.push(
      <Link href={jukiAppRoutes.JUDGE().problems.edit({ key: problem.key as string })}>
        <Button
          size="small"
          icon={<EditIcon />}
          responsiveMobile
        >
          <T className="tt-se">edit</T>
        </Button>
      </Link>,
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
        <h2 className="jk-row line-height-1">
          {!!problem.shortname && <div className="tx-m">{`[${problem.shortname}] `}&nbsp;</div>} {problem.name}&nbsp;
        </h2>
        <div className="jk-tag bc-hl tx-s">{problem.judge?.name}</div>
        <ProblemInfo problem={problem} />
        {problem.user.isManager && !problem.judge.isExternal && <InfoTestCases problem={problem} />}
        <ProblemStatus {...problem.user} />
      </div>
    </TwoContentLayout>
  );
};
