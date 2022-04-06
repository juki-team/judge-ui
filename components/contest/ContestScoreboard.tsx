import { BalloonIcon, DataViewer, DataViewerHeadersType, Field, Popover, T, TextHeadCell } from 'components';
import { JUDGE_API_V1, QueryParam, ROUTES } from 'config/constants';
import { classNames, replaceParamQuery, searchParamsObjectTypeToQuery } from 'helpers';
import { useRequester, useRouter } from 'hooks';
import Link from 'next/link';
import { useCallback, useMemo, useRef } from 'react';
import { useUserState } from 'store';
import { ContentsResponseType, ContestState, ContestTab } from 'types';

type ContestProblemSubmissionsTable = {
  index: number,
  familyName: string,
  givenName: string
  imageUrl: string,
  nickname: string
  problems: {},
  totalPenalty: number,
  totalPoints: number,
}

export const ContestScoreboard = ({ contest }: { contest: ContestState }) => {
  
  const user = useUserState();
  const { queryObject, query: { key: contestKey, tab: contestTab, index: problemIndex, ...query }, push } = useRouter();
  const mySubmissions = false;
  const columns: DataViewerHeadersType<ContestProblemSubmissionsTable>[] = useMemo(() => {
    const base: DataViewerHeadersType<ContestProblemSubmissionsTable>[] = [
      {
        head: <TextHeadCell text={<T>#</T>} />,
        index: 'timestamp',
        field: ({ record: { index }, isCard }) => (
          <Field className="jk-row">{index}</Field>
        ),
        minWidth: 42,
        sticky: true,
      },
      {
        head: <TextHeadCell text={<T>nickname</T>} />,
        index: 'nickname',
        field: ({ record: { nickname, imageUrl }, isCard }) => (
          <Field className={classNames('jk-row center gap', { 'own': nickname === user.nickname })}>
            <img src={imageUrl} className="jk-user-profile-img large" alt={nickname} />
            <div
              className={classNames('jk-border-radius ', {
                'bg-color-primary color-white text-bold': nickname === user.nickname,
                'link': nickname !== user.nickname,
              })}
              onClick={() => push({ query: replaceParamQuery(query, QueryParam.OPEN_USER_PREVIEW, nickname) })}
            >
              {nickname}
            </div>
          </Field>
        ),
        minWidth: 250,
        sticky: true,
      },
      {
        head: <TextHeadCell text={<T>pts</T>} />,
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
                  className="text-xs">{problems[problem.index]?.time === -1 ? '-' : (problems[problem.index]?.time || '-')}</div>
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
  
  const {
    data: response,
    refresh,
    error,
  } = useRequester<ContentsResponseType<any>>(JUDGE_API_V1.CONTEST.SCOREBOARD(contest?.key), { refreshInterval: 60000 });
  
  const lastTotalRef = useRef(0);
  lastTotalRef.current = response?.success ? response.meta.totalElements : lastTotalRef.current;
  
  const data: ContestProblemSubmissionsTable[] = (response?.success ? response.contents : []).map((result, index) => (
    {
      index: index + 1,
      familyName: result.familyName,
      givenName: result.givenName,
      imageUrl: result.imageUrl,
      nickname: result.nickname,
      problems: result.problems,
      totalPenalty: result.totalPenalty,
      totalPoints: result.totalPoints,
    } as ContestProblemSubmissionsTable
  ));
  
  const setSearchParamsObject = useCallback(params => push({ query: searchParamsObjectTypeToQuery(params) }), []);
  
  return (
    <DataViewer<ContestProblemSubmissionsTable>
      headers={columns}
      data={data}
      rows={{ height: 68 }}
      request={refresh}
      name={name}
      extraButtons={() => (
        <div className="extra-buttons">
        </div>
      )}
      cardsView={false}
      searchParamsObject={queryObject}
      setSearchParamsObject={setSearchParamsObject}
      className="contest-scoreboard"
    />
  );
};
