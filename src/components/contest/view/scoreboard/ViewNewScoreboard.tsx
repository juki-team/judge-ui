'use client';

import {
  Button,
  ButtonLoader,
  DataViewer,
  FullscreenExitIcon,
  FullscreenIcon,
  InputCheckbox,
  Pagination,
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
import { useDataViewerRequester, useI18nStore, useJukiNotification, usePageStore, useUIStore } from 'hooks';
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

export const ViewNewScoreboard = ({ contest, reloadContest }: ViewScoreboardProps) => {
  
  const { notifyResponse } = useJukiNotification();
  const [ dynamic, setDynamic ] = useState(false);
  const onClose = useCallback(() => setDynamic(false), []);
  const contestKey = contest.key;
  const { Link } = useUIStore(store => store.components);
  const viewPortScreen = usePageStore(store => store.viewPort.screen);
  const [ fullscreen, setFullscreen ] = useState(false);
  const t = useI18nStore(state => state.i18n.t);
  const columns: DataViewerHeadersType<ScoreboardResponseDTO>[] = useMemo(() => {
    const base: DataViewerHeadersType<ScoreboardResponseDTO>[] = [
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
  const currentTimestamp = 0;
  const max = Object.values(response?.success ? response.content.userProblemTimelineRefs : {}).flat().length;
  const data: ScoreboardResponseDTO[] = useMemo(() => {
    const dataByUsers: Record<string, ScoreboardResponseDTO> = {};
    if (response?.success) {
      let i = 0;
      for (const [ userProblemKey, indexes ] of Object.entries(response.content.userProblemTimelineRefs)) {
        const lastBar = userProblemKey.lastIndexOf('|');
        const userKey = userProblemKey.slice(0, lastBar);     // "Ivan-Cayllan|juki-app"
        const problemKey = userProblemKey.slice(lastBar + 1);
        
        if (response.content.participants[userKey]) {
          for (const idx of indexes) {
            if (dynamic && i > index) {
              break;
            }
            i++;
            const lastEvent = response.content.timelineEvents[idx];
            
            dataByUsers[userKey] = {
              user: response.content.participants[userKey],
              totalPenalty: (dataByUsers[userKey]?.totalPenalty ?? 0),
              totalPoints: (dataByUsers[userKey]?.totalPoints ?? 0),
              position: -1,
              problems: {
                ...(dataByUsers[userKey]?.problems),
                [problemKey]: {
                  attempts: lastEvent?.attempts ?? 0,
                  points: lastEvent?.points ?? 0,
                  success: lastEvent?.success ?? false,
                  penalty: lastEvent?.penalty ?? 0,
                  isFirstAccepted: lastEvent?.indexAccepted === 0,
                  indexAccepted: lastEvent?.indexAccepted ?? -1,
                },
              },
            };
          }
        }
        
        if (dynamic && i > index) {
          break;
        }
      }
    }
    
    const data: ScoreboardResponseDTO[] = Object.values(dataByUsers)
      .map(scoreUser => {
        let totalPenalty = 0;
        let totalPoints = 0;
        for (const [ problemKey, problem ] of Object.entries(scoreUser.problems)) {
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
        return {
          ...scoreUser,
          totalPenalty,
          totalPoints,
        };
      })
      .sort((a, b) => a.totalPoints === b.totalPoints ? a.totalPenalty - b.totalPenalty : b.totalPoints - a.totalPoints)
      .map((scoreUser, index) => ({ ...scoreUser, position: index + 1 }));
    
    return data;
  }, [ contest.problems, dynamic, index, response ]);
  
  const handleFullscreen = useCallback(() => setFullscreen(fullscreen => !fullscreen), []);
  
  const extraNodes = useMemo(() => [
    ((contest?.user?.isAdministrator || contest?.user?.isManager) && (contest?.isFrozenTime || contest?.isQuietTime)) && (
      <InputCheckbox
        className="tx-s bc-hl"
        checked={unfrozen}
        label={<><T className="tt-se">final scoreboard</T>&nbsp;</>}
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
    ((contest.user.isAdministrator || contest.user.isManager || !contest.settings.locked) && !contest.isEndless && !contest.isFuture && (
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
        jumpToPage={setIndex}
        onPageSizeChange={() => null}
        isOnToolbar
        key="first-row-pagination"
      />
      <Button size="tiny" type="light" onClick={() => setIndex(max)}>
        <T className="tt-se">end</T>
      </Button>
    </div>,
    <div key="date" className="tx-s">
      <TimerDisplay
        counter={currentTimestamp}
        type="hours-minutes"
        literal
      />
    </div>,
  ], [ fullscreen, index, max, onClose ]);
  
  const groups = useMemo(
    () => Object
      .values(contest.groups)
      .map(({ value, label }) => ({ value, label: <div className="jk-row fw-bd">{label}</div> })),
    [ contest.groups ],
  );
  
  const score = (
    <DataViewer<ScoreboardResponseDTO>
      headers={columns}
      data={data}
      rows={{ height: 68 }}
      requestRef={request}
      name={QueryParam.SCOREBOARD_TABLE}
      extraNodes={dynamic ? extraNodesDynamic : extraNodes}
      cardsView={false}
      setLoaderStatusRef={setLoaderStatusRef}
      className={classNames('contest-scoreboard', {
        'is-frozen': !unfrozen && contest.isFrozenTime && !contest.isQuietTime,
        'is-quiet': !unfrozen && contest.isQuietTime,
      })}
      groups={groups}
      getRecordKey={({ data, index }) => getUserKey(data?.[index]?.user.nickname, data?.[index]?.user.company.key)}
      deps={[ unfrozen, trigger ]}
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
  
  // if (dynamic) {
  //   return <ViewDynamicScoreboard contest={contest} onClose={onClose} reloadContest={reloadContest} />;
  // }
  
  return score;
};
