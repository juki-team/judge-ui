'use client';

import { Button, DataViewer, FullscreenExitIcon, FullscreenIcon, T, Timer } from 'components';
import { useDataViewerRequester, useI18nStore, useJukiUI } from 'hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getNicknameColumn,
  getPointsColumn,
  getPositionColumn,
  getProblemScoreboardColumn,
} from 'src/components/contest/view/columns';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1 } from 'src/constants';
import {
  ContentResponseType,
  ContestDataResponseDTO,
  DataViewerHeadersType,
  QueryParam,
  ScoreboardResponseDTO,
} from 'types';
import { FullScreenScoreboard } from './FullScreenScoreboard';
import { ScoreboardResponseDTOFocus } from './types';

export const ViewDynamicScoreboard = ({ contest, onClose }: {
  contest: ContestDataResponseDTO,
  onClose: () => void,
}) => {
  
  const contestKey = contest.key;
  const { viewPortSize, components: { Link } } = useJukiUI();
  const [ fullscreen, setFullscreen ] = useState(false);
  const t = useI18nStore(state => state.i18n.t);
  const columns: DataViewerHeadersType<ScoreboardResponseDTOFocus>[] = useMemo(() => {
    const base: DataViewerHeadersType<ScoreboardResponseDTOFocus>[] = [
      getPositionColumn(),
      getNicknameColumn(viewPortSize),
      getPointsColumn(viewPortSize, contest.isEndless),
    ];
    
    if (contest?.problems) {
      for (const problem of Object.values(contest?.problems)) {
        base.push(getProblemScoreboardColumn(Link, contestKey as string, contest.isEndless, problem, t));
      }
    }
    return base;
  }, [ viewPortSize, contest.isEndless, contest?.problems, Link, contestKey, t ]);
  
  const [ unfrozen ] = useState(false);
  const {
    data: response,
    request,
    setLoaderStatusRef,
    reload,
    reloadRef,
  } = useDataViewerRequester<ContentResponseType<{ content: ScoreboardResponseDTO[], timestamp: number }[]>>(
    () => JUDGE_API_V1.CONTEST.SCOREBOARD_HISTORY(contest?.key),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      refreshInterval: 0,
      refreshWhenHidden: false,
      revalidateOnMount: false,
    },
  );
  useEffect(() => {
    reload();
  }, [ reload, unfrozen ]);
  const [ index, setIndex ] = useState(0);
  
  const [ data, setData ] = useState<ScoreboardResponseDTOFocus[]>([]);
  const [ timestamp, setTimestamp ] = useState(0);
  
  useEffect(() => {
    if (response?.success && response.content[index]) {
      setData(prevState => {
        const prevByUsers: { [key: string]: ScoreboardResponseDTO } = {};
        prevState.forEach(user => prevByUsers[user.user.nickname] = user);
        return response.content[index].content.map(user => {
          const focus: string[] = [];
          for (const problemKey in user.problems) {
            if (JSON.stringify(user.problems[problemKey]) !== JSON.stringify(prevByUsers[user.user.nickname]?.problems[problemKey])) {
              focus.push(problemKey);
            }
          }
          return {
            ...user,
            focus,
          };
        });
      });
      setTimestamp(response.content[index].timestamp);
    }
  }, [ index, response ]);
  const max = (response?.success ? response.content : []).length - 1;
  
  const handleFullscreen = useCallback(() => setFullscreen(prevState => !prevState), []);
  
  const currentTimestamp = timestamp - contest.settings.startTimestamp;
  
  const score = useMemo(() => (
    <DataViewer<ScoreboardResponseDTOFocus>
      headers={columns}
      data={data}
      rows={{ height: 68 }}
      request={request}
      name={QueryParam.SCOREBOARD_TABLE}
      extraNodes={[
        <Button key="exit" onClick={onClose} size="tiny" type="secondary">exit</Button>,
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
        <div className="jk-row gap" key="buttons">
          <Button size="tiny" type="light" onClick={() => setIndex(0)}>
            <T>start</T>
          </Button>
          <Button size="tiny" onClick={() => setIndex(prevState => Math.max(prevState - 1, 0))}>
            <T>back</T>
          </Button>
          <Button size="tiny" onClick={() => setIndex(prevState => Math.min(prevState + 1, max))}>
            <T>next</T>
          </Button>
          <Button size="tiny" type="light" onClick={() => setIndex(max)}>
            <T>end</T>
          </Button>
        </div>,
        <div key="date" className="tx-s">
          <Timer
            currentTimestamp={currentTimestamp}
            interval={0}
            laps={2}
            literal
          />
        </div>,
      ]}
      cardsView={false}
      setLoaderStatusRef={setLoaderStatusRef}
      className="contest-scoreboard"
      reloadRef={reloadRef}
      {...DEFAULT_DATA_VIEWER_PROPS}
    />
  ), [ columns, currentTimestamp, data, fullscreen, handleFullscreen, max, onClose, reloadRef, request, setLoaderStatusRef ]);
  
  if (fullscreen) {
    return (
      <FullScreenScoreboard contest={contest}>
        {score}
      </FullScreenScoreboard>
    );
  }
  
  return score;
};
