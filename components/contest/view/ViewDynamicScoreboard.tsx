import {
  BalloonIcon,
  Button,
  contestStateMap,
  DataViewer,
  Field,
  FullscreenExitIcon,
  FullscreenIcon,
  Image,
  T,
  Timer,
  Tooltip,
  UserNicknameLink,
} from 'components';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1, ROUTES } from 'config/constants';
import { classNames } from 'helpers';
import { useDataViewerRequester, useJukiRouter, useJukiUI, useJukiUser } from 'hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ContentResponseType,
  ContestDataResponseDTO,
  ContestTab,
  DataViewerHeadersType,
  KeyedMutator,
  QueryParam,
  ScoreboardResponseDTO,
} from 'types';
import { getContestTimeLiteral } from '../commons';

interface ScoreboardResponseDTOFocus extends ScoreboardResponseDTO {
  focus: string[];
}

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
      {
        head: '#',
        index: 'position',
        Field: ({ record: { position, focus } }) => (
          <Field className={classNames('jk-row', { highlight: !!focus?.length })}>{position}</Field>
        ),
        minWidth: 64,
        sticky: true,
      },
      {
        head: 'nickname',
        index: 'nickname',
        Field: ({ record: { user: { nickname, imageUrl, companyKey }, focus } }) => (
          <Field
            className={classNames('jk-row center gap', {
              'own': nickname === user.nickname,
              highlight: !!focus?.length,
            })}
          >
            <Image src={imageUrl} className="jk-user-profile-img large" alt={nickname} height={38} width={38} />
            <UserNicknameLink nickname={nickname}>
              <div
                className={classNames('jk-border-radius ', {
                  'bc-py cr-we fw-br': nickname === user.nickname,
                  'link': nickname !== user.nickname,
                })}
              >
                {nickname}
              </div>
            </UserNicknameLink>
          </Field>
        ),
        minWidth: 250,
        sticky: viewPortSize !== 'sm',
      },
      {
        head: 'points',
        index: 'points',
        Field: ({ record: { focus, totalPenalty, totalPoints }, isCard }) => (
          <Field className={classNames('jk-col center', { highlight: !!focus?.length })}>
            <div className="fw-br cr-py">{+totalPoints.toFixed(2)}</div>
            {!contest.isEndless && <div className="cr-g4">{Math.round(totalPenalty)}</div>}
          </Field>
        ),
        minWidth: 128,
        sticky: viewPortSize !== 'sm',
      },
    ];
    
    if (contest?.problems) {
      for (const problem of Object.values(contest?.problems)) {
        base.push({
          head: (
            <Tooltip
              content={
                <div className="jk-row nowrap gap">
                  <div className="fw-bd">{problem.index}</div>
                  <div className="ws-np">{problem.name}</div>
                </div>
              }
            >
              <div className="jk-col extend fw-bd">
                <Link
                  href={{
                    pathname: ROUTES.CONTESTS.VIEW(contestKey as string, ContestTab.PROBLEM, problem.index),
                    query: searchParams.toString(),
                  }}
                >
                  {problem.index}
                </Link>
              </div>
            </Tooltip>
          ),
          index: problem.index,
          Field: ({ record: { problems, focus }, isCard }) => {
            const problemData = problems[problem.key];
            return (
              <Field className={classNames('jk-row center nowrap', { highlight: focus?.includes(problem.key) })}>
                {(problemData?.success || !!problemData?.points) && (
                  <Tooltip
                    content={
                      <div className="ws-np">
                        {problemData?.success ? problemData.points : <>{problemData.points}/{problem.points}</>}
                        &nbsp;
                        <T>{problem?.points === 1 ? 'point' : 'points'}</T>
                      </div>
                    }
                  >
                    <div style={{ color: problem.color }}>
                      <BalloonIcon percent={(problemData.points / problem.points) * 100} />
                    </div>
                  </Tooltip>
                )}
                <div className="jk-row nowrap">
                  <div className="tx-xs">{problemData?.attempts || '-'}</div>
                  {!contest.isEndless && (
                    <>
                      <span className="cr-g3">/</span>
                      <div className="tx-xs">{problemData?.penalty ? Math.round(problemData?.penalty) : '-'}</div>
                    </>
                  )}
                </div>
              </Field>
            );
          },
          minWidth: 120,
        });
      }
    }
    return base;
  }, [ viewPortSize, contest?.problems, contest.isEndless, user.nickname, Link, contestKey, searchParams ]);
  
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
