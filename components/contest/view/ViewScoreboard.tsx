import {
  BalloonIcon,
  Button,
  ButtonLoader,
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
import { jukiSettings } from 'config';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1 } from 'config/constants';
import {
  authorizedRequest,
  classNames,
  cleanRequest,
  contestStateMap,
  downloadDataTableAsCsvFile,
  downloadSheetDataAsXlsxFile,
} from 'helpers';
import { useDataViewerRequester, useJukiNotification, useJukiRouter, useJukiUI, useJukiUser, useT } from 'hooks';
import { useEffect, useMemo, useState } from 'react';
import {
  ContentResponseType,
  ContentsResponseType,
  ContestDataResponseDTO,
  ContestTab,
  DataViewerHeadersType,
  HTTPMethod,
  KeyedMutator,
  QueryParam,
  ScoreboardResponseDTO,
  Status,
} from 'types';
import { getContestTimeLiteral } from '../commons';

interface DownloadButtonProps {
  data: ScoreboardResponseDTO[],
  contest: ContestDataResponseDTO,
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
      options={[ { value: 'csv', label: 'as csv' }, { value: 'xlsx', label: 'as xlsx' } ]}
      selectedOption={{ value: 'x', label: 'download' }}
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
      className="bc-sy jk-border-radius-inline jk-button secondary tiny"
    />
  );
};

export const ViewScoreboard = ({ contest, mutate }: { contest: ContestDataResponseDTO, mutate: KeyedMutator<any> }) => {
  
  const { user, company: { imageUrl, name } } = useJukiUser();
  const { notifyResponse } = useJukiNotification();
  const { searchParams, routeParams: { key: contestKey, tab: contestTab, index: problemIndex } } = useJukiRouter();
  const { viewPortSize, components: { Link } } = useJukiUI();
  const [ fullscreen, setFullscreen ] = useState(false);
  const columns: DataViewerHeadersType<ScoreboardResponseDTO>[] = useMemo(() => {
    const base: DataViewerHeadersType<ScoreboardResponseDTO>[] = [
      {
        head: '#',
        index: 'position',
        Field: ({ record: { position } }) => (
          <Field className="jk-row">{position}</Field>
        ),
        minWidth: 64,
        sticky: true,
      },
      {
        head: 'nickname',
        index: 'nickname',
        Field: ({ record: { user: { nickname, imageUrl } } }) => (
          <Field className={classNames('jk-row center gap', { 'own': nickname === user.nickname })}>
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
        Field: ({ record: { totalPenalty, totalPoints }, isCard }) => (
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
                  href={jukiSettings.ROUTES.contests().view({
                    key: contestKey as string,
                    tab: ContestTab.PROBLEM,
                    subTab: problem.index,
                  })}
                >
                  {problem.index}
                </Link>
              </div>
            </Tooltip>
          ),
          index: problem.index,
          Field: ({ record: { problems }, isCard }) => {
            const problemData = problems[problem.key];
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
  }, [ viewPortSize, contest?.problems, contest.isEndless, user.nickname, Link, contestKey ]);
  
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
        ((contest?.user?.isAdministrator || contest?.user?.isManager) && (contest?.isFrozenTime || contest?.isQuietTime)) && (
          <div className="jk-row">
            <Button
              size="tiny"
              type="secondary"
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
              type="secondary"
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
      reloadRef={reloadRef}
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
