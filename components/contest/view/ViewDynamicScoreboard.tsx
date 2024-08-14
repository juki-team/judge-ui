import { Button, DataViewer, FullscreenExitIcon, FullscreenIcon, Image, T, Timer, Tooltip } from 'components';
import {
  getNicknameColumn,
  getPointsColumn,
  getPositionColumn,
  getProblemScoreboardColumn,
} from 'components/contest/view/columns';
import { ScoreboardResponseDTOFocus } from 'components/contest/view/types';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1 } from 'config/constants';
import { contestStateMap } from 'helpers';
import { useDataViewerRequester, useJukiRouter, useJukiUI, useJukiUser } from 'hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ContentResponseType,
  ContestDataResponseDTO,
  DataViewerHeadersType,
  KeyedMutator,
  QueryParam,
  ScoreboardResponseDTO,
} from 'types';
import { getContestTimeLiteral } from '../commons';

export const ViewDynamicScoreboard = ({ contest, mutate }: {
  contest: ContestDataResponseDTO,
  mutate: KeyedMutator<any>
}) => {
  
  const { user, company: { imageUrl, name } } = useJukiUser();
  const { searchParams, routeParams: { key: contestKey, tab: contestTab, index: problemIndex } } = useJukiRouter();
  const { viewPortSize, components: { Link } } = useJukiUI();
  const [ fullscreen, setFullscreen ] = useState(false);
  const columns: DataViewerHeadersType<ScoreboardResponseDTOFocus>[] = useMemo(() => {
    const base: DataViewerHeadersType<ScoreboardResponseDTOFocus>[] = [
      getPositionColumn(),
      getNicknameColumn(viewPortSize, user.nickname),
      getPointsColumn(viewPortSize, contest.isEndless),
    ];
    
    if (contest?.problems) {
      for (const problem of Object.values(contest?.problems)) {
        base.push(getProblemScoreboardColumn(Link, contestKey as string, contest.isEndless, problem));
      }
    }
    return base;
  }, [ viewPortSize, contest?.problems, contest.isEndless, user.nickname, Link, contestKey ]);
  
  const [ unfrozen, setUnfrozen ] = useState(false);
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
        <Tooltip
          content={fullscreen
            ? <T className="ws-np">exit full screen</T>
            : <T className="ws-np">go to fullscreen</T>}
          key="fullscreen"
        >
          <div className="jk-row">
            {fullscreen
              ? <FullscreenExitIcon className="clickable jk-br-ie" onClick={handleFullscreen} />
              : <FullscreenIcon className="clickable jk-br-ie" onClick={handleFullscreen} />}
          </div>
        </Tooltip>,
        <div className="jk-row gap" key="buttons">
          <Button size="small" type="light" onClick={() => setIndex(0)}>
            <T>begin</T>
          </Button>
          <Button size="small" onClick={() => setIndex(prevState => Math.max(prevState - 1, 0))}>
            <T>back</T>
          </Button>
          <Button size="small" onClick={() => setIndex(prevState => Math.min(prevState + 1, max))}>
            <T>next</T>
          </Button>
          <Button size="small" type="light" onClick={() => setIndex(max)}>
            <T>end</T>
          </Button>
        </div>,
        <div key="date">
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
  ), [ columns, currentTimestamp, data, fullscreen, handleFullscreen, max, reloadRef, request, setLoaderStatusRef ]);
  
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
  
  return score;
};
