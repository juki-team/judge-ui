'use client';

import { usePageStore } from '@juki-team/base-ui';
import { Button, ButtonLoader, DataViewer, FullscreenExitIcon, FullscreenIcon, T, Timer } from 'components';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest, getUserKey } from 'helpers';
import { useDataViewerRequester, useFetcher, useI18nStore, useJukiNotification, useUIStore } from 'hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getNicknameColumn,
  getPointsColumn,
  getPositionColumn,
  getProblemScoreboardColumn,
} from 'src/components/contest/view/columns';
import {
  ContentResponseType,
  ContentsResponseType,
  ContestDataResponseDTO,
  DataViewerHeadersType,
  HTTPMethod,
  QueryParam,
  ScoreboardResponseDTO,
  Status,
} from 'types';
import { FullScreenScoreboard } from './FullScreenScoreboard';
import { ScoreboardResponseDTOFocus } from './types';

interface ViewDynamicScoreboardProps {
  contest: ContestDataResponseDTO,
  onClose: () => void,
  reloadContest: () => Promise<void>,
}

const getKeyUser = (user: ScoreboardResponseDTOFocus['user']) => {
  return getUserKey(user.nickname, user.company.key);
};

export const ViewDynamicScoreboard = ({ contest, onClose, reloadContest }: ViewDynamicScoreboardProps) => {
  
  const contestKey = contest.key;
  const { Link } = useUIStore(store => store.components);
  const viewPortSize = usePageStore(store => store.viewPort.size);
  const [ fullscreen, setFullscreen ] = useState(false);
  const t = useI18nStore(state => state.i18n.t);
  const {
    data: responseScoreboardFinal,
    // request: requestScoreboardFinal,
    // isLoading: isLoadingScoreboardFinal,
    // reload: reloadScoreboardFinal,
  } = useFetcher<ContentsResponseType<ScoreboardResponseDTO>>(JUDGE_API_V1.CONTEST.SCOREBOARD(contest?.key, true));
  const scoreboardResponseFinal: ScoreboardResponseDTO[] = useMemo(() => (responseScoreboardFinal?.success ? responseScoreboardFinal.contents : []), [ responseScoreboardFinal ]);
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
  
  const {
    data: response,
    request,
    setLoaderStatusRef,
    reload,
    reloadRef,
  } = useDataViewerRequester<ContentResponseType<{ content: ScoreboardResponseDTO[], timestamp: number }[]>>(
    () => JUDGE_API_V1.CONTEST.SCOREBOARD_HISTORY(contest?.key),
  );
  useEffect(() => {
    reload();
  }, [ reload ]);
  const [ index, setIndex ] = useState(0);
  
  const [ data, setData ] = useState<ScoreboardResponseDTOFocus[]>([]);
  const [ timestamp, setTimestamp ] = useState(0);
  const { notifyResponse } = useJukiNotification();
  
  useEffect(() => {
    if (response?.success && response.content[index]) {
      setData(prevState => {
        const prevByUsers: { [key: string]: ScoreboardResponseDTO } = {};
        prevState.forEach(user => prevByUsers[getKeyUser(user.user)] = user);
        const nextBoard = (response.content[index + 1]?.content || []).map(scoreboard => {
          const finalUserScoreboard = scoreboardResponseFinal.find(s =>
            getKeyUser(s.user) === getKeyUser(scoreboard.user),
          );
          const focus: ScoreboardResponseDTOFocus['focus'] = [];
          const diff: ScoreboardResponseDTOFocus['diff'] = [];
          const problemKeys = new Set([ ...Object.keys(scoreboard.problems), ...Object.keys(finalUserScoreboard?.problems ?? {}) ]);
          for (const problemKey of Array.from(problemKeys)) {
            const problem = scoreboard.problems[problemKey];
            if (JSON.stringify(problem) !== JSON.stringify(prevByUsers[getKeyUser(scoreboard.user)]?.problems[problemKey])) {
              focus.push({ problemKey, success: problem?.success || false, points: problem?.points || 0 });
            }
            const finalProblem = finalUserScoreboard?.problems[problemKey];
            if (JSON.stringify(Object.entries(problem || {}).sort()) !== JSON.stringify(Object.entries(finalProblem || {}).sort())) {
              diff.push({
                problemKey,
                pendingAttempts: (finalProblem?.attempts ?? 0) - (problem?.attempts ?? 0),
                focus: false,
              });
            }
          }
          return {
            ...scoreboard,
            focus,
            diff,
          };
        });
        return response.content[index].content.map(scoreboard => {
          const finalUserScoreboard = scoreboardResponseFinal.find(s =>
            getKeyUser(s.user) === getKeyUser(scoreboard.user),
          );
          const focus: ScoreboardResponseDTOFocus['focus'] = [];
          const diff: ScoreboardResponseDTOFocus['diff'] = [];
          const problemKeys = new Set([ ...Object.keys(scoreboard.problems), ...Object.keys(finalUserScoreboard?.problems ?? {}) ]);
          for (const problemKey of Array.from(problemKeys)) {
            const problem = scoreboard.problems[problemKey];
            if (JSON.stringify(problem) !== JSON.stringify(prevByUsers[getKeyUser(scoreboard.user)]?.problems[problemKey])) {
              focus.push({ problemKey, success: problem?.success || false, points: problem?.points || 0 });
            }
            const finalProblem = finalUserScoreboard?.problems[problemKey];
            if (JSON.stringify(Object.entries(problem || {}).sort()) !== JSON.stringify(Object.entries(finalProblem || {}).sort())) {
              const currentDiff = {
                problemKey,
                pendingAttempts: (finalProblem?.attempts ?? 0) - (problem?.attempts ?? 0),
                focus: false,
              };
              const nextFocus = nextBoard.find(b => getKeyUser(b.user) === getKeyUser(scoreboard.user))?.focus?.find(d => d.problemKey === problemKey);
              diff.push({
                ...currentDiff,
                focus: !!nextFocus,
              });
            }
          }
          return {
            ...scoreboard,
            focus,
            diff,
          };
        });
      });
      setTimestamp(response.content[index].timestamp);
    }
  }, [ index, response, scoreboardResponseFinal ]);
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
            ? <FullscreenExitIcon className="clickable jk-br-ie" onClick={handleFullscreen} />
            : <FullscreenIcon className="clickable jk-br-ie" onClick={handleFullscreen} />}
        </div>,
        <div className="jk-row gap" key="buttons">
          <Button size="tiny" type="light" onClick={() => setIndex(0)}>
            <T className="tt-se">start</T>
          </Button>
          <Button size="tiny" onClick={() => setIndex(prevState => Math.max(prevState - 1, 0))}>
            <T className="tt-se">back</T>
          </Button>
          <Button size="tiny" onClick={() => setIndex(prevState => Math.min(prevState + 1, max))}>
            <T className="tt-se">next</T>
          </Button>
          <Button size="tiny" type="light" onClick={() => setIndex(max)}>
            <T className="tt-se">end</T>
          </Button>
        </div>,
        <div key="date" className="tx-s">
          <Timer
            currentTimestamp={currentTimestamp}
            interval={0}
            type="hours-minutes"
            literal
          />
        </div>,
        <ButtonLoader
          key="recalculate"
          type="secondary"
          size="tiny"
          onClick={async (setLoaderStatus) => {
            setLoaderStatus(Status.LOADING);
            const response = cleanRequest<ContentResponseType<string>>(
              await authorizedRequest(JUDGE_API_V1.CONTEST.RECALCULATE_SCOREBOARD_HISTORY(contest?.key), { method: HTTPMethod.POST }),
            );
            if (notifyResponse(response, setLoaderStatus)) {
              reload();
            }
          }}
        >
          <T className="tt-se">recalculate</T>
        </ButtonLoader>,
      ]}
      cardsView={false}
      setLoaderStatusRef={setLoaderStatusRef}
      className="contest-scoreboard"
      reloadRef={reloadRef}
      getRecordKey={({ data, index }) => getKeyUser(data?.[index]?.user)}
      {...DEFAULT_DATA_VIEWER_PROPS}
    />
  ), [ columns, currentTimestamp, data, fullscreen, handleFullscreen, max, onClose, reloadRef, request, setLoaderStatusRef, reload, contest?.key, notifyResponse ]);
  
  if (fullscreen) {
    return (
      <FullScreenScoreboard contest={contest} reloadContest={reloadContest}>
        {score}
      </FullScreenScoreboard>
    );
  }
  
  return score;
};
