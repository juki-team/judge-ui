import { BalloonIcon, DataViewer, DataViewerHeadersType, Field, InputToggle, LoadingIcon, Popover, T, TextHeadCell } from 'components';
import { JUDGE_API_V1, QueryParam, ROUTES } from 'config/constants';
import { classNames, replaceParamQuery, searchParamsObjectTypeToQuery } from 'helpers';
import { useDataViewerRequester, useRouter } from 'hooks';
import Link from 'next/link';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useUserState } from 'store';
import { ContentsResponseType, ContestResponseDTO, ContestTab, ScoreboardResponseDTO } from 'types';

export const ContestScoreboard = ({ contest }: { contest: ContestResponseDTO }) => {
  
  const user = useUserState();
  const { queryObject, query: { key: contestKey, tab: contestTab, index: problemIndex, ...query }, push } = useRouter();
  const mySubmissions = false;
  const columns: DataViewerHeadersType<ScoreboardResponseDTO>[] = useMemo(() => {
    const base: DataViewerHeadersType<ScoreboardResponseDTO>[] = [
      {
        head: <TextHeadCell text={<T>#</T>} />,
        index: 'timestamp',
        field: ({ record: { position } }) => (
          <Field className="jk-row">{position}</Field>
        ),
        minWidth: 42,
        sticky: true,
      },
      {
        head: <TextHeadCell text={<T>nickname</T>} />,
        index: 'nickname',
        field: ({ record: { userNickname, userImageUrl } }) => (
          <Field className={classNames('jk-row center gap', { 'own': userNickname === user.nickname })}>
            <img src={userImageUrl} className="jk-user-profile-img large" alt={userNickname} />
            <div
              className={classNames('jk-border-radius ', {
                'bg-color-primary color-white text-bold': userNickname === user.nickname,
                'link': userNickname !== user.nickname,
              })}
              onClick={() => push({ query: replaceParamQuery(query, QueryParam.OPEN_USER_PREVIEW, userNickname) })}
            >
              {userNickname}
            </div>
          </Field>
        ),
        minWidth: 250,
        sticky: true,
      },
      {
        head: <TextHeadCell text={<T>points</T>} />,
        index: 'points',
        field: ({ record: { totalPenalty, totalPoints }, isCard }) => (
          <Field className="jk-col center">
            <div className="text-bold color-primary">{totalPoints}</div>
            <div className="color-gray-4">{totalPenalty}</div>
          </Field>
        ),
        minWidth: 128,
        sticky: true,
      },
    ];
    
    if (contest?.problems) {
      for (const problem of Object.values(contest?.problems)) {
        base.push({
          head: (
            <Popover content={<div className="text-nowrap">{problem.name}</div>}>
              <div className="jk-row">
                <Link href={{ pathname: ROUTES.CONTESTS.VIEW(contestKey as string, ContestTab.PROBLEMS, problem.index), query }}>
                  {problem.index}
                </Link>
              </div>
            </Popover>
          ),
          index: problem.index,
          field: ({ record: { totalPenalty, totalPoints, problems }, isCard }) => (
            <Field className="jk-row center nowrap">
              {problems[problem.index]?.success && (
                <div style={{ color: problem.color }}><BalloonIcon /></div>
              )}
              <div className="jk-row nowrap">
                <div className="text-xs">{problems[problem.index]?.attempts || '-'}</div>
                <span className="color-gray-3">/</span>
                <div
                  className="text-xs">{problems[problem.index]?.penalty || '-'}</div>
              </div>
            </Field>
          ),
          minWidth: 120,
        });
      }
    }
    return base;
  }, [query, user.nickname, contest]);
  const name = mySubmissions ? 'myStatus' : 'status';
  
  const [unfrozen, setUnfrozen] = useState(false);
  const {
    data: response,
    request,
    error,
    isLoading,
  } = useDataViewerRequester<ContentsResponseType<ScoreboardResponseDTO>>(JUDGE_API_V1.CONTEST.SCOREBOARD_V1(contest?.key, unfrozen, user.session), { refreshInterval: 60000 });
  
  const lastTotalRef = useRef(0);
  lastTotalRef.current = response?.success ? response.meta.totalElements : lastTotalRef.current;
  
  const data: ScoreboardResponseDTO[] = (response?.success ? response.contents : []).map(result => result);
  const setSearchParamsObject = useCallback(params => push({ query: searchParamsObjectTypeToQuery(params) }), []);
  
  return (
    <DataViewer<ScoreboardResponseDTO>
      headers={columns}
      data={data}
      rows={{ height: 68 }}
      request={request}
      name={name}
      extraButtons={() => (
        <div className="jk-row gap">
          <div />
          {contest?.isFrozenTime && <div className="jk-tag info">frozen time</div>}
          {contest?.isQuietTime && <div className="jk-tag info">quiet time</div>}
          {((contest?.isAdmin || contest?.isJudge) && (contest?.isFrozenTime || contest?.isQuietTime)) && (
            <div className="jk-row">
              {isLoading ? <LoadingIcon /> : <InputToggle checked={unfrozen} onChange={setUnfrozen} />}
              <T>{unfrozen ? 'scoreboard unfrozen' : 'scoreboard frozen'}</T>
            </div>
          )}
        </div>
      )}
      cardsView={false}
      searchParamsObject={queryObject}
      setSearchParamsObject={setSearchParamsObject}
      className="contest-scoreboard"
    />
  );
};
