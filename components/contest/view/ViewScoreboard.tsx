import {
  BalloonIcon,
  ButtonLoader,
  DataViewer,
  Field,
  GearsIcon,
  Image,
  Popover,
  Select,
  SnowflakeIcon,
  T,
  TextHeadCell,
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
  searchParamsObjectTypeToQuery,
} from 'helpers';
import { useDataViewerRequester, useJukiUI, useJukiUser, useNotification, useRouter, useT } from 'hooks';
import Link from 'next/link';
import { useCallback, useMemo, useRef, useState } from 'react';
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

const DownloadButton = ({
  data,
  contest,
  disabled,
}: { data: ScoreboardResponseDTO[], contest: ContestResponseDTO, disabled: boolean }) => {
  const { t } = useT();
  
  const head = ['#', t('nickname'), t('given name'), t('family name'), t('points'), t('penalty')];
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
  const dataCsv = [head, ...body];
  
  return (
    <Select
      disabled={disabled}
      options={[{ value: 'csv', label: 'as csv' }, { value: 'xlsx', label: 'as xlsx' }]}
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
  
  const { user } = useJukiUser();
  const { notifyResponse } = useNotification();
  const { query: { key: contestKey, tab: contestTab, index: problemIndex, ...query }, push } = useRouter();
  const { viewPortSize } = useJukiUI();
  const columns: DataViewerHeadersType<ScoreboardResponseDTO>[] = useMemo(() => {
    const base: DataViewerHeadersType<ScoreboardResponseDTO>[] = [
      {
        head: <TextHeadCell text={<T>#</T>} />,
        index: 'position',
        field: ({ record: { position } }) => (
          <Field className="jk-row">{position}</Field>
        ),
        minWidth: 64,
        sticky: true,
      },
      {
        head: <TextHeadCell text={<T>nickname</T>} />,
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
        head: <TextHeadCell text={<T>points</T>} />,
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
            <Popover content={<div className="ws-np">{problem.name}</div>}>
              <div className="jk-col extend fw-bd">
                <Link href={{ pathname: ROUTES.CONTESTS.VIEW(contestKey as string, ContestTab.PROBLEM, problem.index), query }}>
                  {problem.index}
                </Link>
              </div>
            </Popover>
          ),
          index: problem.index,
          field: ({ record: { problems }, isCard }) => {
            const problemData = problems[getProblemJudgeKey(problem.judge, problem.key)];
            return (
              <Field className="jk-row center nowrap">
                {(problemData?.success || !!problemData?.points) && (
                  <Popover
                    content={
                      <div className="ws-np">
                        {problemData?.success ? problemData.points : <>{problemData.points}/{problem.points}</>}
                        &nbsp;
                        <T>{problem?.points === 1 ? 'point' : 'points'}</T>
                      </div>
                    }
                    popoverClassName="popover-padding-xt"
                    showPopperArrow
                  >
                    <div style={{ color: problem.color }}>
                      <BalloonIcon percent={(problemData.points / problem.points) * 100} />
                    </div>
                  </Popover>
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
  }, [query, user.nickname, contest, viewPortSize]);
  
  const [unfrozen, setUnfrozen] = useState(false);
  const {
    data: response,
    request,
    isLoading,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(JUDGE_API_V1.CONTEST.SCOREBOARD(contest?.key, unfrozen), { refreshInterval: 60000 });
  
  const lastTotalRef = useRef(0);
  lastTotalRef.current = response?.success ? response.meta.totalElements : lastTotalRef.current;
  const data: ScoreboardResponseDTO[] = (response?.success ? response.contents : []);
  
  return (
    <DataViewer<ScoreboardResponseDTO>
      headers={columns}
      data={data}
      rows={{ height: 68 }}
      request={request}
      name={QueryParam.SCOREBOARD_TABLE}
      extraNodes={[
        !unfrozen && contest?.isFrozenTime && (
          <Popover content={<T className="ws-np">scoreboard frozen</T>} showPopperArrow>
            <div className="cr-io"><SnowflakeIcon /></div>
          </Popover>
        ),
        !unfrozen && contest?.isQuietTime && (
          <Popover content={<T className="ws-np">scoreboard on quiet time</T>} showPopperArrow>
            <div className="cr-er"><GearsIcon /></div>
          </Popover>
        ),
        ((contest?.user?.isAdmin || contest?.user?.isJudge) && (contest?.isFrozenTime || contest?.isQuietTime)) && (
          <div className="jk-row">
            <ButtonLoader
              setLoaderStatusRef={setLoaderStatusRef}
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
                  { method: HTTPMethod.POST }),
                );
                notifyResponse(response, setLoaderStatus);
              }}
            >
              <T>recalculate</T>
            </ButtonLoader>
          </div>
        ),
        <div className="jk-row">
          <DownloadButton data={data} contest={contest} disabled={isLoading} />
        </div>,
      ]}
      cardsView={false}
      setLoaderStatusRef={setLoaderStatusRef}
      className="contest-scoreboard"
      {...DEFAULT_DATA_VIEWER_PROPS}
    />
  );
};
