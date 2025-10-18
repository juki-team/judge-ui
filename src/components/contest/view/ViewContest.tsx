'use client';

import {
  isContestChangesWebSocketResponseEventDTO,
  SubscribeContestChangesWebSocketEventDTO,
} from '@juki-team/commons';
import {
  ButtonLoader,
  ContentCopyIcon,
  contestAccessProps,
  EditIcon,
  EditViewMembers,
  NavigateBeforeIcon,
  NavigateNextIcon,
  Popover,
  T,
  Timer,
  TwoContentLayout,
  ViewOverview,
  ViewProblems,
} from 'components';
import { jukiApiManager, jukiAppRoutes } from 'config';
import { authorizedRequest, contestStateMap, toUpsertContestDTOUI } from 'helpers';
import {
  useCallback,
  useEffect,
  useI18nStore,
  useJukiUI,
  useMutate,
  useRouterStore,
  useTrackLastPath,
  useUserStore,
  useWebsocketStore,
} from 'hooks';
import { JUDGE_API_V1, LS_INITIAL_CONTEST_KEY } from 'src/constants';
import {
  ContestDataResponseDTO,
  ContestTab,
  LastPathKey,
  ObjectIdType,
  ProfileSetting,
  Status,
  TabsType,
  UpsertContestDTOUI,
  WebSocketActionEvent,
  WebSocketResponseEventDTO,
} from 'types';
import { DocumentMembersButton } from '../../index';
import { getContestTimeLiteral } from '../commons';
import { ViewClarifications } from './ViewClarifications';
import { ViewEvents } from './ViewEvents';
import { ViewProblemContest } from './ViewProblemContest';
import { ViewScoreboard } from './ViewScoreboard';
import { ViewSubmissions } from './ViewSubmissions';

export function ContestView({ contest }: { contest: ContestDataResponseDTO, }) {
  
  useTrackLastPath(LastPathKey.SECTION_CONTEST);
  const pushRoute = useRouterStore(state => state.pushRoute);
  const searchParams = useRouterStore(state => state.searchParams);
  const contestKey = contest.key;
  const contestTab = (searchParams.get('tab') || ContestTab.OVERVIEW) as ContestTab;
  const problemIndex = searchParams.get('subTab') || '';
  const { viewPortSize, components: { Link } } = useJukiUI();
  const userCanCreateContest = useUserStore(state => state.user.permissions.contests.create);
  const t = useI18nStore(state => state.i18n.t);
  const mutate = useMutate();
  const userPreferredLanguage = useUserStore(state => state.user.settings?.[ProfileSetting.LANGUAGE]);
  const websocket = useWebsocketStore(store => store.websocket);
  const userSessionId = useUserStore(state => state.user.sessionId);
  
  const reloadContest = useCallback(async () => {
    console.info('reloading all contest');
    await mutate(new RegExp(`${jukiApiManager.SERVICE_API_V1_URL}/contest`, 'g'));
    await mutate(new RegExp(`${jukiApiManager.SERVICE_API_V1_URL}/submission`, 'g'));
  }, [ mutate ]);
  
  useEffect(() => {
    const event: SubscribeContestChangesWebSocketEventDTO = {
      event: WebSocketActionEvent.SUBSCRIBE_CONTEST_CHANGES,
      sessionId: userSessionId as ObjectIdType,
      contestKey: contestKey,
    };
    const fun = (data: WebSocketResponseEventDTO) => {
      if (isContestChangesWebSocketResponseEventDTO(data)) {
        void reloadContest();
      }
    };
    
    void websocket.subscribe(event, fun);
    
    return () => {
      websocket.unsubscribe(event, fun);
    };
  }, [ contestKey, userSessionId, websocket, reloadContest, mutate ]);
  
  useEffect(() => {
    const { url, ...options } = jukiApiManager.API_V2.export.contest.problems.statementsToPdf({
      params: {
        key: contest.key,
        token: jukiApiManager.getToken(),
        language: userPreferredLanguage,
      },
    });
    void authorizedRequest(url, options);
  }, [ contest.key, userPreferredLanguage ]);
  
  const { user: { isAdministrator, isManager } } = contest;
  const key = [ contest.isPast, contest.isLive, contest.isFuture, contest.isEndless ].toString();
  const statusLabel = contestStateMap[key].label;
  const tagBc = contestStateMap[key].bc;
  const literal = getContestTimeLiteral(contest);
  
  const allLiteralLabel = contest.isEndless
    ? <div className={`jk-row center extend nowrap jk-tag ${tagBc}`}>
      <T>{statusLabel}</T></div>
    : <div className={`jk-row center extend nowrap jk-tag ${tagBc}`}>
      <T>{statusLabel}</T>,&nbsp;{literal}</div>;
  
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
          <div className="jk-row gap nowrap">
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
          <div className="jk-row gap nowrap">
            <T className="tt-ce ws-np">problems</T>
          </div>
        ),
        body: <ViewProblems key="problems-view" contest={contest} reloadContest={reloadContest} />,
      };
    }
    tabHeaders[ContestTab.SCOREBOARD] = {
      key: ContestTab.SCOREBOARD,
      header: <T className="tt-ce ws-np">scoreboard</T>,
      body: <ViewScoreboard key="scoreboard" contest={contest} mutate={reloadContest} />,
    };
  }
  
  if (canViewContest && !contest.isGlobal) {
    tabHeaders[ContestTab.SUBMISSIONS] = {
      key: ContestTab.SUBMISSIONS,
      header: <T className="tt-ce ws-np">submissions</T>,
      body: <ViewSubmissions key="submissions" contest={contest} />,
    };
  }
  
  if (contest.settings.clarifications && !contest.isGlobal) {
    tabHeaders[ContestTab.CLARIFICATIONS] = {
      key: ContestTab.CLARIFICATIONS,
      header: <T className="tt-ce ws-np">clarifications</T>,
      body: <ViewClarifications key="clarifications" contest={contest} />,
    };
  }
  
  if ((isAdministrator || isManager || contest.isPast || contest.isEndless) && !contest.isGlobal) {
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
  
  if (viewPortSize === 'hg') {
    extraNodes.push(
      <div className={`jk-row nowrap jk-tag ${tagBc}`} key="status-label">
        {contest.isEndless
          ? <T className="ws-np">{statusLabel}</T>
          : <><T className="ws-np">{statusLabel}</T>,&nbsp;{literal}</>}
      </div>,
    );
  }
  
  if (userCanCreateContest && (contest.isPast || contest.user.isAdministrator || contest.user.isManager)) {
    extraNodes.push(
      <ButtonLoader
        size="small"
        onClick={async setLoaderStatus => {
          setLoaderStatus(Status.LOADING);
          const { name, ...parsedContest } = toUpsertContestDTOUI(contest);
          localStorage.setItem(LS_INITIAL_CONTEST_KEY, JSON.stringify({
            ...parsedContest,
            key: `${key}-${t('copy')}`,
            name: `${name} (${t('COPY')})`,
          }));
          pushRoute(jukiAppRoutes.JUDGE().contests.new());
          setLoaderStatus(Status.SUCCESS);
        }}
        icon={<ContentCopyIcon />}
        responsiveMobile
        type="light"
        key="copy"
      >
        <T className="ws-np tt-se">copy</T>
      </ButtonLoader>,
    );
  }
  
  extraNodes.push(
    <DocumentMembersButton
      isAdministrator={contest.user.isAdministrator}
      members={contest.members}
      documentOwner={contest.owner}
      documentName={<T>contest</T>}
      saveUrl={JUDGE_API_V1.CONTEST.CONTEST_MEMBERS(contest.key)}
      reloadDocument={reloadContest}
      copyLink={() => jukiAppRoutes.JUDGE(typeof window !== 'undefined' ? window.location.origin : '').contests.view({ key: contest.key })}
      {...contestAccessProps(false)}
    />,
  );
  
  if (isAdministrator) {
    extraNodes.push(
      <Link href={jukiAppRoutes.JUDGE().contests.edit({ key: contestKey })}>
        <ButtonLoader
          size="small"
          icon={<EditIcon />}
          responsiveMobile
          key="edit"
        >
          <T className="tt-se">edit</T>
        </ButtonLoader>
      </Link>,
    );
  }
  
  // const breadcrumbs: ReactNode[] = [
  //   <Link
  //     href={jukiAppRoutes.JUDGE().contests.list()}
  //     className="link"
  //     key="contest.name"
  //   >
  //     <T className="tt-se">contests</T>
  //   </Link>,
  //   <Link
  //     href={jukiAppRoutes.JUDGE().contests.view({ key: contestKey, tab: ContestTab.OVERVIEW, subTab: problemIndex })}
  //     className="link"
  //     key="contest.name"
  //   >
  //     <div className="ws-np">{contest.name}</div>
  //   </Link>,
  // ];
  // if (contestTab === ContestTab.PROBLEMS && problemArrayIndex !== -1) {
  //   breadcrumbs.push(
  //     <Link
  //       href={jukiAppRoutes.JUDGE().contests.view({
  //         key: contestKey,
  //         tab: ContestTab.PROBLEMS,
  //       })}
  //       className="link"
  //     >
  //       <T className="tt-se">problems</T>
  //     </Link>,
  //   );
  //   breadcrumbs.push(<div>{problemIndex}</div>);
  // } else {
  //   breadcrumbs.push(renderReactNodeOrFunctionP1(tabHeaders[contestTab]?.header, { selectedTabKey: contestTab }));
  // }
  
  return (
    <TwoContentLayout
      // breadcrumbs={breadcrumbs}
      tabs={tabHeaders}
      tabButtons={extraNodes}
      selectedTabKey={contestTab}
      getHrefOnTabChange={tab => jukiAppRoutes.JUDGE().contests.view({ key: contestKey, tab, subTab: problemIndex })}
    >
      {/*<CustomHead title={contest.name} />*/}
      <div className="jk-row nowrap gap extend left">
        {/*{viewPortSize !== 'sm' && (*/}
        {/*  <>*/}
        {/*    <LinkLastPath lastPathKey={LastPathKey.CONTESTS} key="contests">*/}
        {/*      <T className="tt-se">contests</T>*/}
        {/*    </LinkLastPath>*/}
        {/*    /*/}
        {/*  </>*/}
        {/*)}*/}
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
        <Popover
          content={<div>{literal}</div>}
          placement="bottom"
          popoverClassName="bc-we jk-br-ie elevation-1 jk-pg-xsm"
        >
          <div className={`jk-tag tx-s cr-we ${tagBc} screen md lg jk-row`}>
            <T className="ws-np tt-se">{statusLabel}</T>,&nbsp;
            {Date.now() - contest.settings.startTimestamp < 0
              ? (
                <Timer
                  currentTimestamp={contest.settings.startTimestamp - Date.now()}
                  interval={-1000}
                  type="weeks-days-hours-minutes-seconds"
                  abbreviated
                  ignoreLeadingZeros
                  ignoreTrailingZeros
                  literal
                  onTimeout={reloadContest}
                />
              ) : (
                <Timer
                  currentTimestamp={Date.now() - contest.settings.startTimestamp}
                  interval={1000}
                  type="weeks-days-hours-minutes-seconds"
                  abbreviated
                  ignoreLeadingZeros
                  ignoreTrailingZeros
                  literal
                  onTimeout={reloadContest}
                />
              )}
          
          </div>
        </Popover>
      </div>
      <div className="screen sm jk-row extend">{allLiteralLabel}</div>
    </TwoContentLayout>
  );
}
