'use client';

import { FullscreenExitIcon, FullscreenIcon } from '@juki-team/base-ui/server-components';
import { ButtonLoader, DataViewer, InputToggle, Select, T, useDataViewerRequester, useT, useJukiNotification, usePageStore, useUIStore, useUserStore } from '@juki-team/base-ui';
import { jukiApiManager } from '@juki-team/base-ui/settings';
import { JUDGE_API_V1 } from 'config/constants';
import { DEFAULT_DATA_VIEWER_PROPS } from '@juki-team/base-ui/constants';
import { authorizedRequest, classNames, downloadDataTableAsCsvFile, downloadSheetDataAsXlsxFile } from '@juki-team/base-ui/helpers';
import { type ContestDataResponseDTO, type ScoreboardResponseDTO } from '@juki-team/commons/dto';
import { Status } from '@juki-team/commons/enums';
import { cleanRequest, getUserKey } from '@juki-team/commons/helpers';
import { type ContentResponse, type ContentsResponse } from '@juki-team/commons/types';
import { useCallback, useMemo, useState } from 'react';
import { QueryParam } from 'types';
import { type DataViewerHeadersType } from '@juki-team/base-ui/types';
import { ScoreboardResponseDTOUI } from '../types';
import { getNicknameColumn, getPointsColumn, getPositionColumn, getProblemScoreboardColumn } from './columns';
import { FullScreenScoreboard } from './FullScreenScoreboard';
import { ViewDynamicScoreboard } from './ViewDynamicScoreboard';

interface DownloadButtonProps {
  data: ScoreboardResponseDTO[],
  contest: ContestDataResponseDTO,
  disabled: boolean
}

const DownloadButton = ({ data, contest, disabled }: DownloadButtonProps) => {
  const t = useT();

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
  const user = useUserStore(store => store.user);
  const { Link } = useUIStore(store => store.components);
  const viewPortScreen = usePageStore(store => store.viewPort.screen);
  const [ fullscreen, setFullscreen ] = useState(false);
  const t = useT();
  const columns: DataViewerHeadersType<ScoreboardResponseDTOUI>[] = useMemo(() => {
    const base: DataViewerHeadersType<ScoreboardResponseDTOUI>[] = [
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

  const [ unfrozen, setUnfrozen ] = useState(!contest.settings.scoreboardLocked);
  const {
    data: response,
    request,
    isLoading,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponse<ScoreboardResponseDTO>>(() => JUDGE_API_V1.CONTEST.SCOREBOARD(contest?.key, unfrozen, true));
  const {
    data: responseUnofficial,
    request: requestUnofficial,
    // isLoading: isLoadingUnofficial,
    // setLoaderStatusRef: setLoaderUnofficial,
  } = useDataViewerRequester<ContentsResponse<ScoreboardResponseDTO>>(() => JUDGE_API_V1.CONTEST.SCOREBOARD(contest?.key, unfrozen, false));
  const [ trigger, setTrigger ] = useState(0);

  const data: ScoreboardResponseDTOUI[] = useMemo(() => [
      ...(response?.success ? response.contents : []).map(d => ({ ...d, official: true })),
      ...(responseUnofficial?.success ? responseUnofficial.contents : [])
        .filter(d => !!d.totalPoints)
        .map(d => ({ ...d, official: false, position: -1 })),
    ].sort((userA, userB) => {
      if (userA.totalPoints == userB.totalPoints) {
        return userA.totalPenalty - userB.totalPenalty;
      }
      return userB.totalPoints - userA.totalPoints;
    }),
    [ response, responseUnofficial ]);

  const handleFullscreen = useCallback(() => setFullscreen(fullscreen => !fullscreen), []);

  const extraNodes = useMemo(() => [
    ((contest?.user?.isAdministrator || contest?.user?.isManager || !contest.settings.scoreboardLocked) && (contest?.isFrozenTime || contest?.isQuietTime)) && (
      <InputToggle
        key="unfrozen-toggle"
        size="tiny"
        checked={unfrozen}
        onChange={setUnfrozen}
        leftLabel={
          <div className="tx-t jk-br-ie  tiny light">
            <T className={classNames('tt-se fw-br cr-pd', { 'oy-04': unfrozen })}>frozen</T>
          </div>
        }
        rightLabel={
          <div className="tx-t jk-br-ie  tiny light ">
            <T className={classNames('tt-se fw-br cr-pd', { 'oy-04': !unfrozen })}>unfrozen</T>
          </div>
        }
      />
    ),
    (contest?.user?.isAdministrator || contest?.user?.isManager) && (
      <ButtonLoader
        size="tiny"
        type="secondary"
        disabled={isLoading}
        onClick={async (setLoaderStatus) => {
          setLoaderStatus(Status.LOADING);
          const {
            url,
            ...options
          } = jukiApiManager.apiV2.contest.recalculateScoreboard({ params: { key: contest.key, official: false } });
          const response = cleanRequest<ContentResponse<string>>(await authorizedRequest(url, options));
          if (notifyResponse(response, setLoaderStatus)) {
            setTrigger(Date.now());
          }
          setLoaderStatus(Status.LOADING);
          {
            const {
              url,
              ...options
            } = jukiApiManager.apiV2.contest.recalculateScoreboard({ params: { key: contest.key, official: true } });
            const response = cleanRequest<ContentResponse<string>>(await authorizedRequest(url, options));
            if (notifyResponse(response, setLoaderStatus)) {
              setTrigger(Date.now());
            }
          }
        }}
        key="recalculate"
      >
        <T className="tt-se">recalculate</T>
      </ButtonLoader>
    ),
    <DownloadButton key="download" data={data} contest={contest} disabled={isLoading} />,
    // ((contest.user.isAdministrator || contest.user.isManager || !contest.settings.scoreboardLocked) && !contest.isEndless && !contest.isFuture && (
    //   <Button
    //     key="dynamic"
    //     onClick={() => setDynamic(true)}
    //     size="tiny"
    //     type="secondary"
    //   >
    //     <T className="tt-se">dynamic</T>
    //   </Button>
    // )),
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
    <DataViewer<ScoreboardResponseDTOUI>
      headers={columns}
      data={data}
      rows={{ height: 68 }}
      requestRef={(props) => {
        void request(props);
        void requestUnofficial(props);
      }}
      name={QueryParam.SCOREBOARD_TABLE}
      extraNodes={extraNodes}
      cardsView={false}
      setLoaderStatusRef={setLoaderStatusRef}
      className={classNames('contest-scoreboard', {
        'is-frozen': !unfrozen && contest.isFrozenTime && !contest.isQuietTime,
        'is-quiet': !unfrozen && contest.isQuietTime,
      })}
      groups={groups}
      getRecordKey={({ data, index }) => (
        getUserKey(data?.[index]?.user.nickname, data?.[index]?.user.organization.key) + (data?.[index]?.official ? '' : '_')
      )}
      deps={[ unfrozen, trigger ]}
      getRecordStyle={({
                         data,
                         index,
                       }) => (getUserKey(data?.[index]?.user.nickname, data?.[index]?.user.organization.key) === getUserKey(user.nickname, user.organization.key) ? {
        borderBottom: '2px solid var(--cr-at)',
        borderTop: '2px solid var(--cr-at)',
        borderRadius: 'var(--border-radius-inline)',
      } : {})}
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
