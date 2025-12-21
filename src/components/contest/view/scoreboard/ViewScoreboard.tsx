'use client';

import {
  Button,
  ButtonLoader,
  DataViewer,
  FullscreenExitIcon,
  FullscreenIcon,
  InputToggle,
  Select,
  T,
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
  ContentsResponseType,
  ContestDataResponseDTO,
  DataViewerHeadersType,
  QueryParam,
  ScoreboardResponseDTO,
  Status,
} from 'types';
import { getNicknameColumn, getPointsColumn, getPositionColumn, getProblemScoreboardColumn } from './columns';
import { FullScreenScoreboard } from './FullScreenScoreboard';
import { ViewDynamicScoreboard } from './ViewDynamicScoreboard';

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

export const ViewScoreboard = ({ contest, reloadContest }: ViewScoreboardProps) => {
  
  const { notifyResponse } = useJukiNotification();
  const [ dynamic, setDynamic ] = useState(false);
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
  } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(() => JUDGE_API_V1.CONTEST.SCOREBOARD(contest?.key, unfrozen, true));
  const [ trigger, setTrigger ] = useState(0);
  
  const data: ScoreboardResponseDTO[] = useMemo(() => (response?.success ? response.contents : []), [ response ]);
  
  const handleFullscreen = useCallback(() => setFullscreen(fullscreen => !fullscreen), []);
  
  const extraNodes = useMemo(() => [
    ((contest?.user?.isAdministrator || contest?.user?.isManager || !contest.settings.scoreboardLocked) && (contest?.isFrozenTime || contest?.isQuietTime)) && (
      <InputToggle
        size="tiny"
        checked={unfrozen}
        onChange={setUnfrozen}
        leftLabel={<div className="tx-t jk-br-ie jk-button tiny light"><T className="tt-se">frozen</T></div>}
        rightLabel={<div className="tx-t jk-br-ie jk-button tiny light "><T className="tt-se">unfrozen</T></div>}
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
          const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(url + '?official=true', options));
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
      extraNodes={extraNodes}
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
  
  const onClose = useCallback(() => setDynamic(false), []);
  
  if (fullscreen) {
    return (
      <FullScreenScoreboard contest={contest} reloadContest={reloadContest}>
        {score}
      </FullScreenScoreboard>
    );
  }
  
  if (dynamic) {
    return <ViewDynamicScoreboard contest={contest} onClose={onClose} reloadContest={reloadContest} />;
  }
  
  return score;
};
