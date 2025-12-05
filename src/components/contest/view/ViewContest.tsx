'use client';

import {
  contestAccessProps,
  DocumentMembersButton,
  EditIcon,
  EditViewMembers,
  FileCopyIcon,
  LineLoader,
  NavigateBeforeIcon,
  NavigateNextIcon,
  ShareIcon,
  T,
  TabsInlineButton,
  TabsInlineButtonLoader,
  TwoContentLayout,
  ViewOverview,
  ViewProblems,
} from 'components';
import { jukiApiManager, jukiAppRoutes } from 'config';
import { EMPTY_ENTITY_MEMBERS, JUDGE_API_V1, JUKI_SERVICE_V2_URL, LS_INITIAL_CONTEST_KEY } from 'config/constants';
import {
  authorizedRequest,
  consoleInfo,
  contentResponse,
  isContestChangesWebSocketResponseEventDTO,
  toUpsertContestDTOUI,
} from 'helpers';
import {
  useCallback,
  useEffect,
  useFetcher,
  useI18nStore,
  useMemo,
  useMutate,
  usePageStore,
  useRouterStore,
  useSubscribe,
  useTrackLastPath,
  useUIStore,
  useUserStore,
} from 'hooks';
import { type CSSProperties, type ReactNode } from 'react';
import {
  ContentResponseType,
  ContestClarificationsResponseDTO,
  ContestDataResponseDTO,
  ContestEventsResponseDTO,
  ContestMembersResponseDTO,
  ContestTab,
  LastPathKey,
  ProfileSetting,
  Status,
  SubscribeContestChangesWebSocketEventDTO,
  TabsType,
  UpsertContestDTOUI,
  WebSocketSubscriptionEvent,
} from 'types';
import { ContestTimeProgress } from './ContestTimeProgress';
import { ContestTimeTimer } from './ContestTimeTimer';
import { ContestDataUI } from './types';
import { ViewClarifications } from './ViewClarifications';
import { ViewEvents } from './ViewEvents';
import { ViewProblemContest } from './ViewProblemContest';
import { ViewScoreboard } from './ViewScoreboard';
import { ViewSubmissions } from './ViewSubmissions';

export function ContestViewLayout({ contest: fallbackData }: { contest: ContestDataResponseDTO }) {
  
  useTrackLastPath(LastPathKey.SECTION_CONTEST);
  
  const companyKey = useUserStore(state => state.company.key);
  
  const {
    data: dataContest,
    isLoading: isLoadingContest,
    isValidating: isValidatingContest,
  } = useFetcher<ContentResponseType<ContestDataResponseDTO>>(
    jukiApiManager.API_V2.contest.getData({ params: { key: fallbackData.key as string, companyKey } }).url,
    { fallbackData: JSON.stringify(contentResponse('fallback data', fallbackData)) });
  const contestReponse = dataContest?.success ? dataContest.content : fallbackData;
  
  const reloadRoute = useRouterStore(store => store.reloadRoute);
  useEffect(() => {
    if (!dataContest?.success) {
      reloadRoute();
    }
  }, [ dataContest?.success, reloadRoute ]);
  const {
    data: dataEvents,
    isLoading: isLoadingEvents,
    isValidating: isValidatingEvents,
  } = useFetcher<ContentResponseType<ContestEventsResponseDTO>>(
    jukiApiManager.API_V2.contest.getDataEvents({ params: { key: fallbackData.key, companyKey } }).url,
  );
  const {
    data: dataMembers,
    isLoading: isLoadingMembers,
    isValidating: isValidatingMembers,
  } = useFetcher<ContentResponseType<ContestMembersResponseDTO>>(
    jukiApiManager.API_V2.contest.getDataMembers({ params: { key: fallbackData.key, companyKey } }).url,
  );
  const {
    data: dataClarifications,
    isLoading: isLoadingClarifications,
    isValidating: isValidatingClarifications,
  } = useFetcher<ContentResponseType<ContestClarificationsResponseDTO>>(
    jukiApiManager.API_V2.contest.getDataClarifications({ params: { key: fallbackData.key, companyKey } }).url,
  );
  
  const contest: ContestDataUI = useMemo(() => {
    return {
      ...contestReponse,
      events: dataEvents?.success ? dataEvents.content.events : [],
      members: dataMembers?.success ? dataMembers.content.members : {
        ...EMPTY_ENTITY_MEMBERS(),
        administrators: {},
        managers: {},
        guests: {},
        spectators: {},
        participants: {},
      },
      clarifications: dataClarifications?.success ? dataClarifications.content.clarifications : [],
    };
  }, [ contestReponse, dataEvents, dataMembers, dataClarifications ]);
  
  const pushRoute = useRouterStore(state => state.pushRoute);
  const searchParams = useRouterStore(state => state.searchParams);
  const contestKey = contest.key;
  const contestTab = (searchParams.get('tab') || ContestTab.OVERVIEW) as ContestTab;
  const problemIndex = searchParams.get('subTab') || '';
  const { isSmallScreen, isMediumScreen, isHugeScreen, isLargeScreen } = usePageStore(store => store.viewPort);
  const { Link } = useUIStore(store => store.components);
  const userCanCreateContest = useUserStore(state => state.user.permissions.contests.create);
  const t = useI18nStore(state => state.i18n.t);
  const mutate = useMutate();
  const userPreferredLanguage = useUserStore(state => state.user.settings?.[ProfileSetting.LANGUAGE]);
  
  const reloadContest = useCallback(async () => {
    consoleInfo('reloading all contest');
    void mutate(new RegExp(`${JUKI_SERVICE_V2_URL}/contest`, 'g'));
    void mutate(new RegExp(`${JUKI_SERVICE_V2_URL}/submission`, 'g'));
  }, [ mutate ]);
  
  const event: Omit<SubscribeContestChangesWebSocketEventDTO, 'clientId'> = {
    event: WebSocketSubscriptionEvent.SUBSCRIBE_CONTEST_CHANGES,
    contestKey: contestKey,
  };
  useSubscribe(
    event,
    (data) => {
      if (isContestChangesWebSocketResponseEventDTO(data)) {
        void reloadContest();
      }
    },
  );
  
  useEffect(() => {
    const { url, ...options } = jukiApiManager.API_V2.export.contest.problems.statementsToPdf({
      params: {
        key: contest.key,
        language: userPreferredLanguage,
      },
    });
    void authorizedRequest(url, options);
  }, [ contest.key, userPreferredLanguage ]);
  
  const { user: { isAdministrator, isManager } } = contest;
  
  const tabHeaders: TabsType<ContestTab> = {
    [ContestTab.OVERVIEW]: {
      key: ContestTab.OVERVIEW,
      header: <T className="tt-ce ws-np">overview</T>,
      body: <ViewOverview contest={contest} reloadContest={reloadContest} />,
    },
  };
  
  const problems = Object.values(contest.problems);
  problems.sort((problemA, problemB) => problemA.index.localeCompare(problemB.index));
  const problemArrayIndex = problems.findIndex(problem => problem.index === problemIndex);
  const problem = problems[problemArrayIndex];
  
  const canViewContest = isAdministrator || isManager || contest.isLive || contest.isPast || contest.isEndless;
  
  if (canViewContest) {
    if (problemArrayIndex !== -1) {
      const previousProblemIndex = problems[(problemArrayIndex - 1 + problems.length) % problems.length]?.index;
      const prevUrl = jukiAppRoutes.JUDGE().contests.view({
        key: contest.key,
        tab: ContestTab.PROBLEMS,
        subTab: previousProblemIndex,
      });
      const nextProblemIndex = problems[(problemArrayIndex + 1) % problems.length]?.index;
      const nextUrl = jukiAppRoutes.JUDGE().contests.view({
        key: contest.key,
        tab: ContestTab.PROBLEMS,
        subTab: nextProblemIndex,
      });
      tabHeaders[ContestTab.PROBLEMS] = {
        key: ContestTab.PROBLEMS,
        header: (
          <div className="jk-row gap nowrap left">
            <Link href={jukiAppRoutes.JUDGE().contests.view({ key: contest.key, tab: ContestTab.PROBLEMS })}>
              <T className="tt-ce ws-np clickable jk-br-ie" style={{ padding: '2px 4px' }}>problems</T>
            </Link>
            <Link href={prevUrl} style={{ display: 'contents' }}>
              <NavigateBeforeIcon style={{ padding: 0 }} className="clickable jk-br-ie" />
            </Link>
            {problemIndex}
            <Link href={nextUrl} style={{ display: 'contents' }}>
              <NavigateNextIcon style={{ padding: 0 }} className="clickable jk-br-ie" />
            </Link>
          </div>
        ),
        body: (
          <ViewProblemContest problem={problem} contest={contest} reloadContest={reloadContest} />
        ),
      };
    } else {
      tabHeaders[ContestTab.PROBLEMS] = {
        key: ContestTab.PROBLEMS,
        header: (
          <div className="jk-row gap nowrap left">
            <T className="tt-ce ws-np">problems</T>
          </div>
        ),
        body: <ViewProblems key="problems-view" contest={contest} reloadContest={reloadContest} />,
      };
    }
    tabHeaders[ContestTab.SCOREBOARD] = {
      key: ContestTab.SCOREBOARD,
      header: <T className="tt-ce ws-np">scoreboard</T>,
      body: <ViewScoreboard key="scoreboard" contest={contest} reloadContest={reloadContest} />,
    };
  }
  
  tabHeaders[ContestTab.SUBMISSIONS] = {
    key: ContestTab.SUBMISSIONS,
    header: <T className="tt-ce ws-np">submissions</T>,
    body: <ViewSubmissions key="submissions" contest={contest} />,
  };
  
  if (contest.settings.clarifications && !contest.isGlobal) {
    tabHeaders[ContestTab.CLARIFICATIONS] = {
      key: ContestTab.CLARIFICATIONS,
      header: <T className="tt-ce ws-np">clarifications</T>,
      body: <ViewClarifications key="clarifications" contest={contest} />,
    };
  }
  
  if ((isAdministrator || isManager || contest.isPast || contest.isEndless || contest.isGlobal)) {
    tabHeaders[ContestTab.MEMBERS] = {
      key: ContestTab.MEMBERS,
      header: <T className="tt-ce">members</T>,
      body: (
        <EditViewMembers key="members" contest={contest as unknown as UpsertContestDTOUI} />
      ),
    };
    tabHeaders[ContestTab.EVENTS] = {
      key: ContestTab.EVENTS,
      header: <T className="tt-ce">events</T>,
      body: (
        <ViewEvents key="events" contest={contest} />
      ),
    };
  }
  
  const extraNodes = [];
  
  if (isHugeScreen) {
    extraNodes.push(<ContestTimeTimer key="contest-timer" contest={contest} reloadContest={reloadContest} />);
  }
  
  if (userCanCreateContest && (contest.isPast || contest.user.isAdministrator || contest.user.isManager)) {
    extraNodes.push(
      <TabsInlineButtonLoader
        key="contest-copy"
        onClick={async setLoaderStatus => {
          setLoaderStatus(Status.LOADING);
          const { name, ...parsedContest } = toUpsertContestDTOUI(contest);
          localStorage.setItem(LS_INITIAL_CONTEST_KEY, JSON.stringify({
            ...parsedContest,
            key: `${contest.key}-${t('copy')}`,
            name: `${name} (${t('COPY')})`,
          }));
          pushRoute(jukiAppRoutes.JUDGE().contests.new());
          setLoaderStatus(Status.SUCCESS);
        }}
        icon={<FileCopyIcon />}
        type="light"
        label="copy"
      />,
    );
  }
  
  extraNodes.push(
    <DocumentMembersButton
      key="contest-members"
      isAdministrator={contest.user.isAdministrator}
      members={contest.members}
      documentOwner={contest.owner}
      documentName={<T>contest</T>}
      saveUrl={JUDGE_API_V1.CONTEST.CONTEST_MEMBERS(contest.key)}
      reloadDocument={reloadContest}
      copyLink={() => jukiAppRoutes.JUDGE(typeof window !== 'undefined' ? window.location.origin : '').contests.view({ key: contest.key })}
      {...contestAccessProps(false)}
    >
      <TabsInlineButton icon={<ShareIcon />} label="share" />
    </DocumentMembersButton>,
  );
  
  if (isAdministrator) {
    extraNodes.push(
      <Link key="contest-edit" href={jukiAppRoutes.JUDGE().contests.edit({ key: contestKey })} className="jk-row">
        <TabsInlineButton icon={<EditIcon />} label="edit" />
      </Link>,
    );
  }
  
  const breadcrumbs: ReactNode[] = [
    <Link
      href={jukiAppRoutes.JUDGE().contests.list()}
      className="link"
      key="contests"
    >
      <T className="tt-se">contests</T>
    </Link>,
    <div className="jk-row gap left cr-th" key="contest-name">
      <div>
        {contest.name}
      </div>
      {(isMediumScreen || isLargeScreen) && (
        <ContestTimeTimer contest={contest} reloadContest={reloadContest} />
      )}
    </div>,
  ];
  
  return (
    <TwoContentLayout
      breadcrumbs={breadcrumbs}
      tabs={tabHeaders}
      tabButtons={extraNodes}
      selectedTabKey={contestTab}
      getHrefOnTabChange={tab => jukiAppRoutes.JUDGE().contests.view({ key: contestKey, tab, subTab: problemIndex })}
      tabsInlineClassName={isSmallScreen ? 'tx-s' : ''}
    >
      {(isLoadingContest || isValidatingContest || isLoadingEvents || isValidatingEvents || isLoadingMembers || isValidatingMembers || isLoadingClarifications || isValidatingClarifications) && (
        <LineLoader style={{ '--line-loader-color': 'var(--cr-io-lt)' } as CSSProperties} delay={1} />
      )}
      {!dataContest?.success && (
        <LineLoader style={{ '--line-loader-color': 'var(--cr-er)' } as CSSProperties} delay={1} />
      )}
      {isSmallScreen && (
        <>
          <div className="jk-row nowrap gap extend left">
            <h2
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              className="line-height-1"
            >
              {contest.name}
            </h2>
          </div>
          <ContestTimeTimer contest={contest} reloadContest={reloadContest} />
        </>
      )}
      {!contest.isEndless && !contest.isGlobal && (
        <div
          style={{
            width: 'calc(100% - var(--pad-md) - var(--pad-md))',
            bottom: -10,
            left: 'var(--pad-md)',
            position: 'absolute',
          }}
          className="display-on-hover-8"
        >
          <ContestTimeProgress contest={contest} reloadContest={reloadContest} />
        </div>
      )}
    </TwoContentLayout>
  );
}
