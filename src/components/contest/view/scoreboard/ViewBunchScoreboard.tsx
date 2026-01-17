'use client';

import { DataViewer, InputToggle, Select, T, useContest } from 'components';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1 } from 'config/constants';
import { classNames, downloadDataTableAsCsvFile, downloadSheetDataAsXlsxFile, getUserKey } from 'helpers';
import { useDataViewerRequester, useI18nStore, usePageStore, useUIStore, useUserStore } from 'hooks';
import { useMemo, useState } from 'react';
import {
  ContentsResponseType,
  ContestDataResponseDTO,
  DataViewerHeadersType,
  DataViewerRequestType,
  QueryParam,
  ScoreboardResponseDTO,
} from 'types';
import { BunchScoreboardResponseDTOUI, ScoreboardResponseDTOUI } from '../types';
import { getNicknameColumn, getPointsColumn, getPositionColumn, getProblemScoreboardColumn } from './columns';

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
  contestKeys: string[],
}

const useScores = (contestsKeys: string[], unfrozen: boolean) => {
  const {
    data: response1,
    request: request1,
    isLoading: isLoading1,
  } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(() => contestsKeys[0] ? JUDGE_API_V1.CONTEST.SCOREBOARD(contestsKeys[0], unfrozen, true) : null);
  // const {
  //   data: responseUnofficial1,
  //   request: requestUnofficial1,
  //   isLoading: isLoadingUnofficial1,
  // } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(() => contestsKeys[0] ? JUDGE_API_V1.CONTEST.SCOREBOARD(contestsKeys[0], unfrozen, false) : null);
  
  const {
    data: response2,
    request: request2,
    isLoading: isLoading2,
  } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(() => contestsKeys[1] ? JUDGE_API_V1.CONTEST.SCOREBOARD(contestsKeys[1], unfrozen, true) : null);
  // const {
  //   data: responseUnofficial2,
  //   request: requestUnofficial2,
  //   isLoading: isLoadingUnofficial2,
  // } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(() => contestsKeys[1] ? JUDGE_API_V1.CONTEST.SCOREBOARD(contestsKeys[1], unfrozen, false) : null);
  
  const {
    data: response3,
    request: request3,
    isLoading: isLoading3,
  } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(() => contestsKeys[2] ? JUDGE_API_V1.CONTEST.SCOREBOARD(contestsKeys[2], unfrozen, true) : null);
  // const {
  //   data: responseUnofficial3,
  //   request: requestUnofficial3,
  //   isLoading: isLoadingUnofficial3,
  // } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(() => contestsKeys[2] ? JUDGE_API_V1.CONTEST.SCOREBOARD(contestsKeys[2], unfrozen, false) : null);
  
  const {
    data: response4,
    request: request4,
    isLoading: isLoading4,
  } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(() => contestsKeys[3] ? JUDGE_API_V1.CONTEST.SCOREBOARD(contestsKeys[3], unfrozen, true) : null);
  // const {
  //   data: responseUnofficial4,
  //   request: requestUnofficial4,
  //   isLoading: isLoadingUnofficial4,
  // } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(() => contestsKeys[3] ? JUDGE_API_V1.CONTEST.SCOREBOARD(contestsKeys[3], unfrozen, false) : null);
  
  const {
    data: response5,
    request: request5,
    isLoading: isLoading5,
  } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(() => contestsKeys[4] ? JUDGE_API_V1.CONTEST.SCOREBOARD(contestsKeys[4], unfrozen, true) : null);
  // const {
  //   data: responseUnofficial5,
  //   request: requestUnofficial5,
  //   isLoading: isLoadingUnofficial5,
  // } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(() => contestsKeys[4] ? JUDGE_API_V1.CONTEST.SCOREBOARD(contestsKeys[4], unfrozen, false) : null);
  
  const {
    data: response6,
    request: request6,
    isLoading: isLoading6,
  } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(() => contestsKeys[5] ? JUDGE_API_V1.CONTEST.SCOREBOARD(contestsKeys[5], unfrozen, true) : null);
  // const {
  //   data: responseUnofficial6,
  //   request: requestUnofficial6,
  //   isLoading: isLoadingUnofficial6,
  // } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(() => contestsKeys[5] ? JUDGE_API_V1.CONTEST.SCOREBOARD(contestsKeys[5], unfrozen, false) : null);
  
  const {
    data: response7,
    request: request7,
    isLoading: isLoading7,
  } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(() => contestsKeys[6] ? JUDGE_API_V1.CONTEST.SCOREBOARD(contestsKeys[6], unfrozen, true) : null);
  // const {
  //   data: responseUnofficial7,
  //   request: requestUnofficial7,
  //   isLoading: isLoadingUnofficial7,
  // } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(() => contestsKeys[6] ? JUDGE_API_V1.CONTEST.SCOREBOARD(contestsKeys[6], unfrozen, false) : null);
  
  const {
    data: response8,
    request: request8,
    isLoading: isLoading8,
  } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(() => contestsKeys[7] ? JUDGE_API_V1.CONTEST.SCOREBOARD(contestsKeys[7], unfrozen, true) : null);
  // const {
  //   data: responseUnofficial8,
  //   request: requestUnofficial8,
  //   isLoading: isLoadingUnofficial8,
  // } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(() => contestsKeys[7] ? JUDGE_API_V1.CONTEST.SCOREBOARD(contestsKeys[7], unfrozen, false) : null);
  
  const data: BunchScoreboardResponseDTOUI[] = useMemo(() => [
      ...([
        ...(response1?.success ? response1.contents : [])
          .map(a => ({ ...a, order: 1, label: 'Grupo 1', color: '#0062FF' })), // Rosa Neón Potente
        ...(response2?.success ? response2.contents : [])
          .map(a => ({ ...a, order: 2, label: 'Grupo 2', color: '#FF8800' })), // Naranja Eléctrico
        ...(response3?.success ? response3.contents : [])
          .map(a => ({ ...a, order: 3, label: 'Grupo 3', color: '#00B300' })), // Verde Lima Intenso
        ...(response4?.success ? response4.contents : [])
          .map(a => ({ ...a, order: 4, label: 'Grupo 4', color: '#00A1FF' })), // Azul Cielo Brillante
        ...(response5?.success ? response5.contents : [])
          .map(a => ({ ...a, order: 5, label: 'Grupo 5', color: '#9D00FF' })), // Violeta Eléctrico
        ...(response6?.success ? response6.contents : [])
          .map(a => ({ ...a, order: 6, label: 'Grupo 6', color: '#00CEC9' })), // Turquesa Oscuro
        ...(response7?.success ? response7.contents : [])
          .map(a => ({ ...a, order: 7, label: 'Grupo 7', color: '#E84393' })), // Fucsia
        ...(response8?.success ? response8.contents : [])
          .map(a => ({ ...a, order: 8, label: 'Grupo 8', color: '#2D3436' })), // Carbón (Para resaltar los otros)
      ]).map(d => ({ ...d, official: true })),
      // ...([
      //   ...(responseUnofficial1?.success ? responseUnofficial1.contents : []),
      //   ...(responseUnofficial2?.success ? responseUnofficial2.contents : []),
      //   ...(responseUnofficial3?.success ? responseUnofficial3.contents : []),
      //   ...(responseUnofficial4?.success ? responseUnofficial4.contents : []),
      //   ...(responseUnofficial5?.success ? responseUnofficial5.contents : []),
      //   ...(responseUnofficial6?.success ? responseUnofficial6.contents : []),
      //   ...(responseUnofficial7?.success ? responseUnofficial7.contents : []),
      //   ...(responseUnofficial8?.success ? responseUnofficial8.contents : []),
      // ])
      //   .filter(d => !!d.totalPoints)
      //   .map(d => ({ ...d, official: false, position: -1 })),
    ].sort((userA, userB) => {
      if (userA.order !== userB.order) {
        return userA.order - userB.order;
      }
      if (userA.totalPoints == userB.totalPoints) {
        return userA.totalPenalty - userB.totalPenalty;
      }
      return userB.totalPoints - userA.totalPoints;
    }),
    [ response1, response2, response3, response4, response5, response6, response7, response8 ]);
  
  const request: DataViewerRequestType = (props) => {
    void request1(props);
    // void requestUnofficial1(props);
    void request2(props);
    // void requestUnofficial2(props);
    void request3(props);
    // void requestUnofficial3(props);
    void request4(props);
    // void requestUnofficial4(props);
    void request5(props);
    // void requestUnofficial5(props);
    void request6(props);
    // void requestUnofficial6(props);
    void request7(props);
    // void requestUnofficial7(props);
    void request8(props);
    // void requestUnofficial8(props);
  };
  
  return {
    data,
    // isLoading: isLoading1 || isLoadingUnofficial1 || isLoading2 || isLoadingUnofficial2 || isLoading3 || isLoadingUnofficial3,
    isLoading: isLoading1 || isLoading2 || isLoading3 || isLoading4 || isLoading5 || isLoading6 || isLoading7 || isLoading8,
    request,
  };
};

export const ViewBunchScoreboard = ({ contestKeys }: ViewScoreboardProps) => {
  
  const { contest } = useContest();
  
  const contestKey = contestKeys[0];
  const user = useUserStore(store => store.user);
  const { Link } = useUIStore(store => store.components);
  const viewPortScreen = usePageStore(store => store.viewPort.screen);
  const t = useI18nStore(state => state.i18n.t);
  const columns: DataViewerHeadersType<ScoreboardResponseDTOUI>[] = useMemo(() => {
    const base: DataViewerHeadersType<ScoreboardResponseDTOUI>[] = [
      getPositionColumn(),
      getNicknameColumn(viewPortScreen),
      getPointsColumn(viewPortScreen, false),
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
  
  const { data, isLoading, request } = useScores(contestKeys, unfrozen);
  
  const extraNodes = useMemo(() => [
    ((contest?.user?.isAdministrator || contest?.user?.isManager || !contest.settings.scoreboardLocked) && (contest?.isFrozenTime || contest?.isQuietTime)) && (
      <InputToggle
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
    <DownloadButton key="download" data={data} contest={contest} disabled={isLoading} />,
    // ((contest.user.isAdministrator || contest.user.isManager || !contest.settings.scoreboardLocked) && !contest.isEndless && !contest.isFuture && (
    //   <Button
    //     key="dynamic"
    //     onClick={() => setDynamic(true)}
    //     size="tiny"
    //     type="light"
    //   >
    //     <T className="tt-se">dynamic</T>
    //   </Button>
    // )),
  ], [ contest, data, isLoading, unfrozen ]);
  
  const groups = useMemo(
    () => Object
      .values(contest.groups)
      .map(({ value, label }) => ({ value, label: <div className="jk-row fw-bd">{label}</div> })),
    [ contest.groups ],
  );
  
  return (
    <DataViewer<BunchScoreboardResponseDTOUI>
      headers={columns as [] as DataViewerHeadersType<BunchScoreboardResponseDTOUI>[]}
      data={data}
      rows={{ height: 68 }}
      requestRef={request}
      name={QueryParam.SCOREBOARD_TABLE}
      extraNodes={extraNodes}
      cardsView={false}
      // setLoaderStatusRef={setLoaderStatusRef}
      className={classNames('contest-scoreboard', {
        'is-frozen': !unfrozen && contest.isFrozenTime && !contest.isQuietTime,
        'is-quiet': !unfrozen && contest.isQuietTime,
      })}
      groups={groups}
      getRecordKey={({ data, index }) => (
        getUserKey(data?.[index]?.user.nickname, data?.[index]?.user.company.key) + (data?.[index]?.official ? '' : '_')
      )}
      deps={[ unfrozen ]}
      getRecordClassName={() => 'top-label'}
      getRecordStyle={({
                         data,
                         index,
                       }) => ({
        
        ...(
          getUserKey(data?.[index]?.user.nickname, data?.[index]?.user.company.key) === getUserKey(user.nickname, user.company.key) ? {
            borderBottom: '2px solid var(--cr-at)',
            borderTop: '2px solid var(--cr-at)',
            borderRadius: 'var(--border-radius-inline)',
          } : {}),
        '--top-label': `"${data[index]?.label}"`,
        '--top-label-color': data[index]?.color,
      })}
      {...DEFAULT_DATA_VIEWER_PROPS}
    />
  );
};
