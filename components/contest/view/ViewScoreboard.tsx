import {
  BalloonIcon,
  ButtonLoader,
  contestStateMap,
  DataViewer,
  Field,
  FullscreenExitIcon,
  FullscreenIcon,
  GearsIcon,
  Image,
  Select,
  SnowflakeIcon,
  T,
  Tooltip,
  UserNicknameLink,
} from 'components';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1, ROUTES } from 'config/constants';
import {
  authorizedRequest,
  classNames,
  cleanRequest,
  downloadDataTableAsCsvFile,
  downloadXlsxAsFile,
  getProblemJudgeKey,
} from 'helpers';
import { useDataViewerRequester, useJukiRouter, useJukiUI, useJukiUser, useNotification, useT } from 'hooks';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ContentResponseType,
  ContentsResponseType,
  ContestResponseDTO,
  ContestTab,
  DataViewerHeadersType,
  HTTPMethod,
  QueryParam,
  ScoreboardResponseDTO,
  Status,
} from 'types';
import { getContestTimeLiteral } from '../commons';

interface DownloadButtonProps {
  data: ScoreboardResponseDTO[],
  contest: ContestResponseDTO,
  disabled: boolean
}

const DownloadButton = ({ data, contest, disabled }: DownloadButtonProps) => {
  const { t } = useT();
  
  const head = [ '#', t('nickname'), t('given name'), t('family name'), t('points'), t('penalty') ];
  for (const problem of Object.values(contest?.problems)) {
    head.push(problem.index);
  }
  
  const body = data.map(user => {
    const base = [
      user.position,
      user.userNickname,
      user.userGivenName,
      user.userFamilyName,
      (user.totalPoints).toFixed(2),
      Math.round(user.totalPenalty),
    ];
    
    if (contest?.problems) {
      for (const problem of Object.values(contest?.problems)) {
        const problemData = user.problems[getProblemJudgeKey(problem.judge, problem.key)];
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
      options={[ { value: 'csv', label: 'as csv' }, { value: 'xlsx', label: 'as xlsx' } ]}
      selectedOption={{ value: 'x', label: 'download' }}
      onChange={async ({ value }) => {
        switch (value) {
          case 'csv':
            downloadDataTableAsCsvFile(dataCsv, `${contest?.name} (${t('scoreboard')}).csv`);
            break;
          case 'xlsx':
            await downloadXlsxAsFile(dataCsv, `${contest?.name} (${t('scoreboard')}).xlsx`, t('scoreboard'));
            break;
          case 'pdf':
            break;
          default:
        }
      }}
      className="bc-sy jk-border-radius-inline jk-button-secondary tiny"
    />
  );
};

export const ViewScoreboard = ({ contest }: { contest: ContestResponseDTO }) => {
  
  const { user, company: { imageUrl, name } } = useJukiUser();
  const { notifyResponse } = useNotification();
  const { searchParams, routeParams: { key: contestKey, tab: contestTab, index: problemIndex } } = useJukiRouter();
  const { viewPortSize } = useJukiUI();
  const [ fullscreen, setFullscreen ] = useState(false);
  const columns: DataViewerHeadersType<ScoreboardResponseDTO>[] = useMemo(() => {
    const base: DataViewerHeadersType<ScoreboardResponseDTO>[] = [
      {
        head: '#',
        index: 'position',
        field: ({ record: { position } }) => (
          <Field className="jk-row">{position}</Field>
        ),
        minWidth: 64,
        sticky: true,
      },
      {
        head: 'nickname',
        index: 'nickname',
        field: ({ record: { userNickname, userImageUrl } }) => (
          <Field className={classNames('jk-row center gap', { 'own': userNickname === user.nickname })}>
            <Image src={userImageUrl} className="jk-user-profile-img large" alt={userNickname} height={38} width={38} />
            <UserNicknameLink nickname={userNickname}>
              <div
                className={classNames('jk-border-radius ', {
                  'bc-py cr-we fw-br': userNickname === user.nickname,
                  'link': userNickname !== user.nickname,
                })}
              >
                {userNickname}
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
        field: ({ record: { totalPenalty, totalPoints }, isCard }) => (
          <Field className="jk-col center">
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
          field: ({ record: { problems }, isCard }) => {
            const problemData = problems[getProblemJudgeKey(problem.judge, problem.key)];
            return (
              <Field className="jk-row center nowrap">
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
  }, [ viewPortSize, contest?.problems, contest.isEndless, user.nickname, contestKey, searchParams ]);
  
  const [ unfrozen, setUnfrozen ] = useState(false);
  const {
    data: response,
    request,
    isLoading,
    setLoaderStatusRef,
    reload,
    refreshRef,
  } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(
    () => JUDGE_API_V1.CONTEST.SCOREBOARD(contest?.key, unfrozen), { refreshInterval: 60000 },
  );
  useEffect(() => {
    reload();
  }, [ reload, unfrozen ]);
  const lastTotalRef = useRef(0);
  lastTotalRef.current = response?.success ? response.meta.totalElements : lastTotalRef.current;
  const data: ScoreboardResponseDTO[] = (response?.success ? response.contents : []);
  
  const handleFullscreen = () => setFullscreen(!fullscreen);
  
  const score = (
    <DataViewer<ScoreboardResponseDTO>
      headers={columns}
      data={data}
      rows={{ height: 68 }}
      request={request}
      name={QueryParam.SCOREBOARD_TABLE}
      extraNodes={[
        !unfrozen && contest?.isFrozenTime && (
          <Tooltip content={<T className="ws-np">scoreboard frozen</T>}>
            <div className="cr-io"><SnowflakeIcon /></div>
          </Tooltip>
        ),
        !unfrozen && contest?.isQuietTime && (
          <Tooltip content={<T className="ws-np">scoreboard on quiet time</T>}>
            <div className="cr-er"><GearsIcon /></div>
          </Tooltip>
        ),
        ((contest?.user?.isAdmin || contest?.user?.isJudge) && (contest?.isFrozenTime || contest?.isQuietTime)) && (
          <div className="jk-row">
            <ButtonLoader
              size="tiny"
              type="secondary"
              disabled={isLoading}
              onClick={() => setUnfrozen(!unfrozen)}
            >
              <T>{unfrozen ? 'view frozen' : 'view unfrozen'}</T>
            </ButtonLoader>
          </div>
        ),
        (contest?.user?.isAdmin || contest?.user?.isJudge) && (
          <div className="jk-row">
            <ButtonLoader
              size="tiny"
              type="secondary"
              disabled={isLoading}
              onClick={async (setLoaderStatus) => {
                setLoaderStatus(Status.LOADING);
                const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
                    JUDGE_API_V1.CONTEST.RECALCULATE_SCOREBOARD(contestKey as string),
                    { method: HTTPMethod.POST },
                  ),
                );
                notifyResponse(response, setLoaderStatus);
              }}
            >
              <T>recalculate</T>
            </ButtonLoader>
          </div>
        ),
        <div className="jk-row" key="download">
          <DownloadButton data={data} contest={contest} disabled={isLoading} />
        </div>,
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
      ]}
      cardsView={false}
      setLoaderStatusRef={setLoaderStatusRef}
      className="contest-scoreboard"
      refreshRef={refreshRef}
      {...DEFAULT_DATA_VIEWER_PROPS}
    />
  );
  
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
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 200,
          width: '100vw',
          height: 'var(--100VH)',
          background: 'var(--t-color-white-2)',
        }}
      >
        <div className="jk-row bc-pd" style={{ padding: 'var(--pad-xt)' }}>
          <Image
            src={imageUrl}
            alt={name}
            height={viewPortSize === 'md' ? 40 : 46}
            width={viewPortSize === 'md' ? 80 : 92}
          />
        </div>
        <div className="jk-pad-md">
          <div className="bc-wea">
            <div className="jk-row nowrap gap extend">
              <h2
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: 'calc(100vw - var(--pad-border) - var(--pad-border))',
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
