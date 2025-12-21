'use client';

import {
  AcUnitIcon,
  Button,
  ButtonLoader,
  DataViewer,
  FrozenInformation,
  FullscreenExitIcon,
  FullscreenIcon,
  Input,
  InputCheckbox,
  LockIcon,
  Pagination,
  QuietInformation,
  Select,
  T,
  TimerDisplay,
} from 'components';
import { jukiApiManager } from 'config';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1 } from 'config/constants';
import {
  authorizedRequest,
  classNames,
  cleanRequest,
  downloadDataTableAsCsvFile,
  downloadSheetDataAsXlsxFile,
  getUserKey,
} from 'helpers';
import {
  useDataViewerRequester,
  useI18nStore,
  useJukiNotification,
  usePageStore,
  useStableState,
  useUIStore,
} from 'hooks';
import { useCallback, useMemo, useState } from 'react';
import {
  ContentResponseType,
  ContestDataResponseDTO,
  DataViewerHeadersType,
  QueryParam,
  ScoreboardHistoryResponseDTO,
  ScoreboardResponseDTO,
  Status,
} from 'types';
import { ScoreboardResponseDTOFocus } from '../types';
import { getNicknameColumn, getPointsColumn, getPositionColumn, getProblemScoreboardColumn } from './columns';
import { FullScreenScoreboard } from './FullScreenScoreboard';

interface DownloadButtonProps {
  data: ScoreboardResponseDTO[],
  contest: ContestDataResponseDTO,
  disabled: boolean
}

const DownloadButton = ({ data, contest, disabled }: DownloadButtonProps) => {
  const t = useI18nStore(state => state.i18n.t);
  
  const head = [ '#', t('nickname'), t('given name'), t('family name'), t('points'), t('penalty') ];
  for (const problem of Object.values(contest?.problems)) {
    head.push(problem.index);
  }
  
  const body = data.map(user => {
    const base = [
      user.position,
      user.user.nickname,
      user.user.givenName,
      user.user.familyName,
      (user.totalPoints).toFixed(2),
      Math.round(user.totalPenalty),
    ];
    
    if (contest?.problems) {
      for (const problem of Object.values(contest?.problems)) {
        const problemData = user.problems[problem.key];
        let text = '';
        if (problemData?.success || !!problemData?.points) {
          text = problemData?.points + ' ' + (problemData?.points === 1 ? t('point') : t('points'));
        }
        if (text) {
          text += ' ';
        }
        text += `${problemData?.attempts || '-'}/${problemData?.penalty ? Math.round(problemData?.penalty) : '-'}`;
        base.push(text);
      }
    }
    return base;
  });
  const dataCsv = [ head, ...body ];
  
  return (
    <Select
      disabled={disabled}
      options={[
        { value: 'csv', label: <T className="tt-se">as csv</T> },
        { value: 'xlsx', label: <T className="tt-se">as xlsx</T> },
      ]}
      selectedOption={{ value: 'x', label: <T className="tt-se">download</T> }}
      onChange={({ value }) => {
        switch (value) {
          case 'csv':
            downloadDataTableAsCsvFile(dataCsv, `${contest?.name} (${t('scoreboard')}).csv`);
            break;
          case 'xlsx':
            void downloadSheetDataAsXlsxFile(
              [ {
                name: t('scoreboard'),
                rows: { ...dataCsv.map(row => ({ cells: { ...row.map(cell => ({ text: cell })) } })) },
              } ],
              `${contest?.name} (${t('scoreboard')}).xlsx`,
            );
            break;
          case 'pdf':
            break;
          default:
        }
      }}
      className="jk-br-ie jk-button light tiny"
    />
  );
};

interface ViewScoreboardProps {
  contest: ContestDataResponseDTO,
  reloadContest: () => Promise<void>,
}

export const ViewEventsScoreboard = ({ contest, reloadContest }: ViewScoreboardProps) => {
  
  const { notifyResponse } = useJukiNotification();
  const [ dynamic, setDynamic ] = useState(false);
  const onClose = useCallback(() => setDynamic(false), []);
  const contestKey = contest.key;
  const { Link } = useUIStore(store => store.components);
  const viewPortScreen = usePageStore(store => store.viewPort.screen);
  const [ fullscreen, setFullscreen ] = useState(false);
  const t = useI18nStore(state => state.i18n.t);
  const columns: DataViewerHeadersType<ScoreboardResponseDTOFocus>[] = useMemo(() => {
    const base: DataViewerHeadersType<ScoreboardResponseDTOFocus>[] = [
      getPositionColumn(),
      getNicknameColumn(viewPortScreen),
      getPointsColumn(viewPortScreen, contest.isEndless || contest.isGlobal),
    ];
    
    for (const problem of Object.values(contest?.problems ?? {})) {
      base.push({
        ...getProblemScoreboardColumn(Link, contestKey as string, contest.isEndless || contest.isGlobal, problem, t),
        group: problem.group,
      });
    }
    return base;
  }, [ viewPortScreen, contest, Link, contestKey, t ]);
  
  const [ unfrozen, setUnfrozen ] = useState(false);
  const {
    data: response,
    request,
    isLoading,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentResponseType<ScoreboardHistoryResponseDTO>>(() => JUDGE_API_V1.CONTEST.SCOREBOARD_HISTORY(contest?.key));
  const [ trigger, setTrigger ] = useState(0);
  const [ index, setIndex ] = useState(0);
  const max = Object.values(response?.success ? response.content.timelineEvents : []).length;
  const { finalTimestamp, data } = useMemo(() => {
    let finalTimestamp = 0;
    const finalDataByUsers: Record<string, ScoreboardResponseDTO> = {};
    let currentDataByUsers: Record<string, ScoreboardResponseDTO> = {};
    let nextDataByUsers: Record<string, ScoreboardResponseDTO> = {};
    let prevDataByUsers: Record<string, ScoreboardResponseDTO> = {};
    if (response?.success) {
      let i = 1;
      for (const {
        userKey,
        problemKey,
        attempts,
        points,
        success,
        penalty,
        indexAccepted,
        timestamp
      } of response.content.timelineEvents) {
        
        if (response.content.participants[userKey]) {
          
          finalDataByUsers[userKey] = {
            user: response.content.participants[userKey],
            totalPenalty: (finalDataByUsers[userKey]?.totalPenalty ?? 0),
            totalPoints: (finalDataByUsers[userKey]?.totalPoints ?? 0),
            position: -1,
            problems: {
              ...(finalDataByUsers[userKey]?.problems),
              [problemKey]: {
                attempts: attempts ?? 0,
                points: points ?? 0,
                success: success ?? false,
                penalty: penalty ?? 0,
                isFirstAccepted: indexAccepted === 0,
                indexAccepted: indexAccepted ?? -1,
              },
            },
          };
          if (dynamic) {
            if (i === index - 1) {
              prevDataByUsers = structuredClone(finalDataByUsers);
            }
            if (i === index) {
              currentDataByUsers = structuredClone(finalDataByUsers);
            }
            if (i <= index) {
              finalTimestamp = Math.max(timestamp ?? 0, finalTimestamp);
            }
            if (i === index + 1) {
              nextDataByUsers = structuredClone(finalDataByUsers);
            }
          } else {
            if (i === max - 1) {
              prevDataByUsers = structuredClone(finalDataByUsers);
            }
            finalTimestamp = Math.max(timestamp ?? 0, finalTimestamp);
          }
          i++;
        }
      }
    }
    
    const problemKeys = Object.keys(contest.problems);
    const dataByUsers = dynamic ? currentDataByUsers : finalDataByUsers;
    nextDataByUsers = dynamic ? nextDataByUsers : finalDataByUsers;
    const data: ScoreboardResponseDTOFocus[] = response?.success ? Object.keys(response.content.participants)
      .map(userKey => {
        const scoreUser = dataByUsers[userKey] || {
          user: response.content.participants[userKey],
          totalPenalty: 0,
          totalPoints: 0,
          position: -1,
          problems: {},
        };
        let totalPenalty = 0;
        let totalPoints = 0;
        const focus: ScoreboardResponseDTOFocus['focus'] = [];
        const diff: ScoreboardResponseDTOFocus['diff'] = [];
        for (const problemKey of problemKeys) {
          const problem = scoreUser?.problems[problemKey];
          if (JSON.stringify(problem) !== JSON.stringify(prevDataByUsers[userKey]?.problems[problemKey])) {
            focus.push({ problemKey, success: problem?.success || false, points: problem?.points || 0 });
          }
          const finalProblem = finalDataByUsers[userKey]?.problems[problemKey];
          if (JSON.stringify(problem) !== JSON.stringify(finalProblem)) {
            const nextFocus = JSON.stringify(problem) !== JSON.stringify(nextDataByUsers[userKey]?.problems[problemKey]);
            diff.push({
              problemKey,
              pendingAttempts: (finalProblem?.attempts ?? 0) - (problem?.attempts ?? 0),
              focus: nextFocus,
            });
          }
          if (problem) {
            if (contest.problems[problemKey].maxAcceptedUsers) {
              if (problem.indexAccepted < contest.problems[problemKey].maxAcceptedUsers) {
                totalPenalty += problem.points ? problem.penalty : 0;
                totalPoints += problem.points;
              }
            } else {
              totalPenalty += problem.points ? problem.penalty : 0;
              totalPoints += problem.points;
            }
          }
        }
        return {
          ...scoreUser,
          totalPenalty,
          totalPoints,
          focus,
          diff,
        };
      })
      .sort((a, b) => a.totalPoints === b.totalPoints ? a.totalPenalty - b.totalPenalty : b.totalPoints - a.totalPoints)
      .map((scoreUser, index) => ({ ...scoreUser, position: index + 1 })) : [];
    
    return { finalTimestamp, data };
  }, [ contest.problems, dynamic, index, response, max ]);
  
  const currentTimestamp = finalTimestamp - contest.settings.startTimestamp;
  const focusedRow = data.find(({ focus }) => (focus?.length ?? 0) > 0);
  const [ focusUserKey, setFocusUserKey ] = useStableState(focusedRow ? getUserKey(focusedRow.user.nickname, focusedRow.user.company.key) : '');
  
  const handleFullscreen = useCallback(() => setFullscreen(fullscreen => !fullscreen), []);
  
  const extraNodes = useMemo(() => [
    ((contest?.user?.isAdministrator || contest?.user?.isManager) && (contest?.isFrozenTime || contest?.isQuietTime)) && (
      <InputCheckbox
        className="tx-s bc-hl"
        checked={unfrozen}
        label={<><T className="tt-se">view final</T>&nbsp;</>}
        onChange={setUnfrozen}
      />
    ),
    (contest?.user?.isAdministrator || contest?.user?.isManager) && (
      <ButtonLoader
        size="tiny"
        type="light"
        disabled={isLoading}
        onClick={async (setLoaderStatus) => {
          setLoaderStatus(Status.LOADING);
          const {
            url,
            ...options
          } = jukiApiManager.API_V2.contest.recalculateScoreboard({ params: { key: contest.key } });
          const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(url, options));
          if (notifyResponse(response, setLoaderStatus)) {
            setTrigger(Date.now());
          }
        }}
        key="recalculate"
      >
        <T className="tt-se">recalculate</T>
      </ButtonLoader>
    ),
    <DownloadButton key="download" data={data} contest={contest} disabled={isLoading} />,
    ((contest.user.isAdministrator || contest.user.isManager || !contest.settings.scoreboardLocked) && !contest.isEndless && !contest.isFuture && (
      <Button
        key="dynamic"
        onClick={() => setDynamic(true)}
        size="tiny"
        type="light"
      >
        <T className="tt-se">dynamic</T>
      </Button>
    )),
    <div
      data-tooltip-id="jk-tooltip"
      data-tooltip-content={fullscreen ? 'exit full screen' : 'go to fullscreen'}
      data-tooltip-t-class-name="ws-np"
      className="jk-row"
      key="fullscreen"
    >
      {fullscreen
        ? <FullscreenExitIcon className="clickable jk-br-ie" onClick={handleFullscreen} />
        : <FullscreenIcon className="clickable jk-br-ie" onClick={handleFullscreen} />}
    </div>,
  ], [ contest, data, fullscreen, handleFullscreen, isLoading, notifyResponse, unfrozen ]);
  const [ focusDelay, setFocusDelay ] = useState(1000);
  
  const extraNodesDynamic = useMemo(() => [
    <Button key="exit" onClick={onClose} size="tiny" type="secondary">
      <T className="tt-se">exit</T>
    </Button>,
    <div
      data-tooltip-id="jk-tooltip"
      data-tooltip-content={fullscreen ? 'exit full screen' : 'go to fullscreen'}
      data-tooltip-t-class-name="ws-np"
      className="jk-row"
      key="fullscreen"
    >
      {fullscreen
        ?
        <FullscreenExitIcon className="clickable jk-br-ie" onClick={() => setFullscreen(prevState => !prevState)} />
        : <FullscreenIcon className="clickable jk-br-ie" onClick={() => setFullscreen(prevState => !prevState)} />}
    </div>,
    <div className="jk-row gap" key="buttons">
      <Button size="tiny" type="light" onClick={() => setIndex(0)}>
        <T className="tt-se">start</T>
      </Button>
      <Pagination
        dataLength={1}
        loading={false}
        initializing={false}
        pageSizeOptions={[ 1 ]}
        total={max}
        page={index}
        pageSize={1}
        jumpToPage={(page) => {
          const focusedRow = data.find(({ diff }) => (diff || []).some(({ focus }) => focus));
          if (focusedRow) {
            setFocusUserKey(getUserKey(focusedRow.user.nickname, focusedRow.user.company.key));
          }
          setTimeout(() => {
            setIndex(page);
            setFocusUserKey('');
          }, focusDelay);
        }}
        onPageSizeChange={() => null}
        isOnToolbar
        key="first-row-pagination"
      />
      <Button size="tiny" type="light" onClick={() => setIndex(max)}>
        <T className="tt-se">end</T>
      </Button>
      <Input
        key="slider"
        type="range"
        min={1}
        max={max}
        step={1}
        onChange={(value: string) => {
          const newIndex = Math.max(Math.min(max, +value), 1);
          setIndex(newIndex);
          setFocusUserKey('');
        }}
      />
    </div>,
    <div key="date" className="jk-row gap tx-s jk-br-ie bc-we jk-pg-xsm-l">
      <TimerDisplay
        counter={currentTimestamp}
        type="hours-minutes"
        literal
      />
      {contest.settings.startTimestamp + currentTimestamp >= contest.settings.quietTimestamp ?
        <QuietInformation
          icon={
            <div className="jk-row jk-tag bc-el">
              <LockIcon size="tiny" filledCircle className="cr-el" />
            </div>
          }
        />
        : contest.settings.startTimestamp + currentTimestamp >= contest.settings.frozenTimestamp && (
        <FrozenInformation
          icon={
            <div className="jk-row jk-tag bc-io">
              <AcUnitIcon size="tiny" filledCircle className="cr-io" />
            </div>
          }
        />
      )}
    </div>,
    <Input<number>
      label={<T className="tx-vt ws-np tt-se">revelation delay</T>}
      key="focus-delay-input"
      type="number"
      min={0}
      max={2000}
      step={50}
      value={focusDelay}
      onChange={(value) => {
        const v = Math.max(0, Math.min(5000, Number(value) || 0));
        setFocusDelay(v);
      }}
      className="tiny"
      placeholder="delay ms"
    />,
  ], [ contest.settings.frozenTimestamp, contest.settings.quietTimestamp, contest.settings.startTimestamp, currentTimestamp, data, focusDelay, fullscreen, index, max, onClose, setFocusUserKey ]);
  
  const groups = useMemo(
    () => Object
      .values(contest.groups)
      .map(({ value, label }) => ({ value, label: <div className="jk-row fw-bd">{label}</div> })),
    [ contest.groups ],
  );
  
  const score = (
    <DataViewer<ScoreboardResponseDTOFocus>
      headers={columns}
      data={data}
      rows={{ height: 68 }}
      requestRef={request}
      name={QueryParam.SCOREBOARD_TABLE}
      extraNodes={dynamic ? extraNodesDynamic : extraNodes}
      cardsView={false}
      setLoaderStatusRef={setLoaderStatusRef}
      className={classNames('contest-scoreboard', {
        'is-frozen': !dynamic && !unfrozen && contest.isFrozenTime && !contest.isQuietTime,
        'is-quiet': !dynamic && !unfrozen && contest.isQuietTime,
      })}
      groups={groups}
      getRecordKey={({ data, index }) => getUserKey(data?.[index]?.user.nickname, data?.[index]?.user.company.key)}
      getRecordStyle={({ data, index }) => {
        const userKey = getUserKey(data?.[index]?.user.nickname, data?.[index]?.user.company.key);
        if (focusUserKey === userKey) {
          const dataUser = data[index];
          if (dataUser?.focus) {
            const isSuccess = dataUser.focus.some((focus) => focus.success);
            return {
              outline: `4px solid ${!dataUser.focus.length ? 'var(--cr-at)' : isSuccess ? 'var(--cr-ss-lt)' : 'var(--cr-er-lt)'}`,
              borderRadius: 'var(--border-radius-inline)',
            };
          }
        }
        return {};
      }}
      deps={[ unfrozen, trigger ]}
      focusRowKey={focusUserKey}
      {...DEFAULT_DATA_VIEWER_PROPS}
    />
  );
  
  if (fullscreen) {
    return (
      <FullScreenScoreboard contest={contest} reloadContest={reloadContest}>
        {score}
      </FullScreenScoreboard>
    );
  }
  
  return score;
};
