'use client';

import {
  Button,
  ButtonLoader,
  DataViewer,
  FullscreenExitIcon,
  FullscreenIcon,
  GearsIcon,
  Image,
  Select,
  SnowflakeIcon,
  T,
} from 'components';
import { jukiApiSocketManager, jukiGlobalStore } from 'config';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1 } from 'config/constants';
import {
  authorizedRequest,
  cleanRequest,
  contestStateMap,
  downloadDataTableAsCsvFile,
  downloadSheetDataAsXlsxFile,
} from 'helpers';
import { useDataViewerRequester, useJukiNotification, useJukiRouter, useJukiUI, useJukiUser } from 'hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ContentResponseType,
  ContentsResponseType,
  ContestDataResponseDTO,
  DataViewerHeadersType,
  HTTPMethod,
  KeyedMutator,
  QueryParam,
  ScoreboardResponseDTO,
  Status,
} from 'types';
import { getContestTimeLiteral } from '../commons';
import { getNicknameColumn, getPointsColumn, getPositionColumn, getProblemScoreboardColumn } from './columns';
import { ViewDynamicScoreboard } from './ViewDynamicScoreboard';

interface DownloadButtonProps {
  data: ScoreboardResponseDTO[],
  contest: ContestDataResponseDTO,
  disabled: boolean
}

const DownloadButton = ({ data, contest, disabled }: DownloadButtonProps) => {
  const { t } = jukiGlobalStore.getI18n();
  
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
      options={[ { value: 'csv', label: <T>as csv</T> }, { value: 'xlsx', label: <T>as xlsx</T> } ]}
      selectedOption={{ value: 'x', label: <T>download</T> }}
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
      className="bc-sy jk-border-radius-inline jk-button light tiny"
    />
  );
};

export const ViewScoreboard = ({ contest, mutate }: { contest: ContestDataResponseDTO, mutate: KeyedMutator<any> }) => {
  
  const { user, company: { imageUrl, name } } = useJukiUser();
  const { notifyResponse } = useJukiNotification();
  const { pushRoute } = useJukiRouter();
  const [ dynamic, setDynamic ] = useState(false);
  const contestKey = contest.key;
  const { viewPortSize, components: { Link } } = useJukiUI();
  const [ fullscreen, setFullscreen ] = useState(false);
  const { t } = jukiGlobalStore.getI18n();
  const columns: DataViewerHeadersType<ScoreboardResponseDTO>[] = useMemo(() => {
    const base: DataViewerHeadersType<ScoreboardResponseDTO>[] = [
      getPositionColumn(),
      getNicknameColumn(viewPortSize, user.nickname),
      getPointsColumn(viewPortSize, contest.isEndless),
    ];
    
    if (contest?.problems) {
      for (const problem of Object.values(contest?.problems)) {
        base.push(getProblemScoreboardColumn(Link, contestKey as string, contest.isEndless, problem, t));
      }
    }
    return base;
  }, [ viewPortSize, user.nickname, contest.isEndless, contest?.problems, Link, contestKey, t ]);
  
  const [ unfrozen, setUnfrozen ] = useState(false);
  const {
    data: response,
    request,
    isLoading,
    setLoaderStatusRef,
    reload,
    reloadRef,
  } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(
    () => JUDGE_API_V1.CONTEST.SCOREBOARD(contest?.key, unfrozen), { refreshInterval: 60000 },
  );
  useEffect(() => {
    reload();
  }, [ reload, unfrozen ]);
  const data: ScoreboardResponseDTO[] = useMemo(() => (response?.success ? response.contents : []), [ response ]);
  
  const handleFullscreen = useCallback(() => setFullscreen(fullscreen => !fullscreen), []);
  
  const score = useMemo(() => (
    <DataViewer<ScoreboardResponseDTO>
      headers={columns}
      data={data}
      rows={{ height: 68 }}
      request={request}
      name={QueryParam.SCOREBOARD_TABLE}
      extraNodes={[
        !unfrozen && contest?.isFrozenTime && (
          <div
            data-tooltip-id="jk-tooltip"
            data-tooltip-content="scoreboard frozen"
            data-tooltip-t-class-name="ws-np"
            className="cr-io"
          >
            <SnowflakeIcon />
          </div>
        ),
        !unfrozen && contest?.isQuietTime && (
          <div
            data-tooltip-id="jk-tooltip"
            data-tooltip-content="scoreboard on quiet time"
            data-tooltip-t-class-name="ws-np"
            className="cr-er"
          >
            <GearsIcon />
          </div>
        ),
        ((contest?.user?.isAdministrator || contest?.user?.isManager) && (contest?.isFrozenTime || contest?.isQuietTime)) && (
          <div className="jk-row">
            <Button
              size="tiny"
              type="light"
              disabled={isLoading}
              onClick={() => setUnfrozen(!unfrozen)}
            >
              <T>{unfrozen ? 'view frozen' : 'view unfrozen'}</T>
            </Button>
          </div>
        ),
        (contest?.user?.isAdministrator) && (
          <div className="jk-row">
            <ButtonLoader
              size="tiny"
              type="light"
              disabled={isLoading}
              onClick={async (setLoaderStatus) => {
                setLoaderStatus(Status.LOADING);
                const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
                    contest?.settings.locked ? JUDGE_API_V1.CONTEST.UNLOCK_SCOREBOARD(contestKey as string) : JUDGE_API_V1.CONTEST.LOCK_SCOREBOARD(contestKey as string),
                    { method: HTTPMethod.POST },
                  ),
                );
                await mutate();
                notifyResponse(response, setLoaderStatus);
              }}
            >
              <T>{contest?.settings.locked ? 'unlock' : 'lock'}</T>
            </ButtonLoader>
          </div>
        ),
        (contest?.user?.isAdministrator || contest?.user?.isManager) && (
          <div className="jk-row">
            <ButtonLoader
              size="tiny"
              type="light"
              disabled={isLoading}
              onClick={async (setLoaderStatus) => {
                setLoaderStatus(Status.LOADING);
                const {
                  url,
                  ...options
                } = jukiApiSocketManager.API_V1.contest.recalculateScoreboard({ params: { key: contest.key } });
                const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(url, options));
                if (notifyResponse(response, setLoaderStatus)) {
                  reload();
                }
              }}
            >
              <T>recalculate</T>
            </ButtonLoader>
          </div>
        ),
        <div className="jk-row" key="download">
          <DownloadButton data={data} contest={contest} disabled={isLoading} />
        </div>,
        ...((contest.user.isAdministrator || contest.user.isManager || !contest.settings.locked) && !contest.isEndless && !contest.isFuture
          ? [
            <Button
              key="dynamic"
              onClick={() => setDynamic(true)}
              size="tiny"
              type="light"
            >
              <T>dynamic</T>
            </Button>,
          ]
          : [])
        ,
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
      ]}
      cardsView={false}
      setLoaderStatusRef={setLoaderStatusRef}
      className="contest-scoreboard"
      reloadRef={reloadRef}
      {...DEFAULT_DATA_VIEWER_PROPS}
    />
  ), [ columns, contest, contestKey, data, fullscreen, handleFullscreen, isLoading, mutate, notifyResponse, reload, reloadRef, request, setLoaderStatusRef, unfrozen ]);
  
  if (fullscreen) {
    const literal = getContestTimeLiteral(contest);
    const key = [ contest.isPast, contest.isLive, contest.isFuture, contest.isEndless ].toString();
    const statusLabel = contestStateMap[key].label;
    const tag = contestStateMap[key].color;
    const allLiteralLabel = contest.isEndless
      ? <div className={`jk-row center extend nowrap jk-tag ${tag}`}>
        <T>{statusLabel}</T></div>
      : <div className={`jk-row center extend nowrap jk-tag ${tag}`}>
        <T>{statusLabel}</T>,&nbsp;{literal}</div>;
    
    return (
      <div className="jk-full-screen-overlay">
        <div className="jk-row bc-pd" style={{ padding: 'var(--pad-xt)' }}>
          <Image
            src={imageUrl}
            alt={name}
            height={viewPortSize === 'md' ? 40 : 46}
            width={viewPortSize === 'md' ? 80 : 92}
          />
        </div>
        <div className="jk-pg-md">
          <div className="bc-wea">
            <div className="jk-row nowrap gap extend">
              <h2
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: 'calc(100vw - var(--pad-md) - var(--pad-md))',
                  textAlign: 'center',
                }}
              >
                {contest.name}
              </h2>
            </div>
            <div className="jk-row extend">{allLiteralLabel}</div>
          </div>
          <div
            style={{
              width: '100%',
              height: 'calc(var(--100VH) - 170px)',
            }}
          >
            {score}
          </div>
        </div>
      </div>
    );
  }
  
  if (dynamic) {
    return <ViewDynamicScoreboard contest={contest} onClose={() => setDynamic(false)} />;
  }
  
  return score;
};
