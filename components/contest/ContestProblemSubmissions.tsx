import { DataViewer, DataViewerHeadersType, DateField, Field, T, TextHeadCell } from 'components';
import { ACCEPTED_PROGRAMMING_LANGUAGES, PROBLEM_VERDICT, PROGRAMMING_LANGUAGE, QueryParam, ROUTES } from 'config/constants';
import { JUDGE_API_V1 } from 'config/constants/judge';
import { replaceParamQuery, searchParamsObjectTypeToQuery } from 'helpers';
import { useRequester, useRouter } from 'hooks';
import Link from 'next/link';
import { useCallback, useMemo, useRef } from 'react';
import { ContentsResponseType, ContestTab, ProblemMode, ProblemVerdict, ProgrammingLanguage } from 'types';
import { useUserState } from '../../store';
import { SubmissionInfo } from '../problem/SubmissionInfo';
import { Memory, Time, Verdict } from '../problem/utils';

type ContestProblemSubmissionsTable = {
  indexProblem: string,
  problemName: string,
  settings: { mode: ProblemMode },
  submitId: string,
  nickname: string,
  imageUrl: string,
  timestamp: number,
  verdict: ProblemVerdict,
  submitPoints: number,
  language: ProgrammingLanguage,
  timeUsed: number,
  memoryUsed: number,
  verdictByGroups: {},
}

export const ContestProblemSubmissions = ({ contest, mySubmissions }: { contest: any, mySubmissions?: boolean }) => {
  
  const user = useUserState();
  const { queryObject, query: { key: contestKey, tab, index: problemIndex, ...query }, push, pathname } = useRouter();
  
  const columns: DataViewerHeadersType<ContestProblemSubmissionsTable>[] = useMemo(() => [
    ...(!mySubmissions ? [
      {
        head: <TextHeadCell text={<T>nickname</T>} />,
        index: 'nickname',
        field: ({ record: { nickname, imageUrl }, isCard }) => (
          <Field className="jk-row center gap">
            <img src={imageUrl} className="jk-user-profile-img large" alt={nickname} />
            <Link href={{
              pathname: ROUTES.CONTESTS.VIEW(contestKey as string, ContestTab.STATUS),
              query: replaceParamQuery(query, QueryParam.OPEN_USER_PREVIEW, nickname),
            }}>
              <div className="link">
                {nickname}
              </div>
            </Link>
          </Field>
        ),
        sort: { compareFn: () => (rowA, rowB) => rowB.nickname.localeCompare(rowA.nickname) },
        filter: { type: 'text-auto' },
        cardPosition: 'top',
        minWidth: 250,
      } as DataViewerHeadersType<ContestProblemSubmissionsTable>,
    ] : []),
    {
      head: <TextHeadCell text={<T>problem</T>} />,
      index: 'problem',
      field: ({ record: { problemName, indexProblem }, isCard }) => (
        <Field className="jk-row link">
          <Link href={{ pathname: ROUTES.CONTESTS.VIEW(contestKey as string, ContestTab.PROBLEMS, indexProblem), query }}>
            <a>{indexProblem} {problemName}</a>
          </Link>
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowB.indexProblem.localeCompare(rowA.indexProblem) },
      filter: { type: 'date-range-auto' },
      cardPosition: 'center',
      minWidth: 280,
    },
    {
      head: <TextHeadCell text={<T>date</T>} />,
      index: 'timestamp',
      field: ({ record: { timestamp }, isCard }) => (
        <DateField className="jk-row" date={new Date(timestamp)} label={<T>date</T>} />
      ),
      sort: { compareFn: () => (rowA, rowB) => +rowA.timestamp - +rowB.timestamp },
      filter: { type: 'date-range-auto' },
      cardPosition: 'center',
      minWidth: 280,
    },
    {
      head: <TextHeadCell text={<T>verdict</T>} />,
      index: 'verdict',
      field: ({ record: { verdict, submitPoints }, isCard }) => (
        <Field className="jk-row">
          <Verdict verdict={verdict} submitPoints={submitPoints} />
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowB.verdict.localeCompare(rowA.verdict) },
      filter: {
        type: 'select-auto',
        options: Object.values(PROBLEM_VERDICT)
          .map(({ value, print }) => ({ label: <T className="text-sentence-case">{print}</T>, value })),
      },
      cardPosition: 'center',
      minWidth: 120,
    },
    {
      head: <TextHeadCell text={<T>lang</T>} />,
      index: 'language',
      field: ({
        record: { language, settings, verdict, submitPoints, nickname, memoryUsed, submitId, timeUsed, verdictByGroups, timestamp },
        isCard,
      }) => (
        <SubmissionInfo
          isSubtaskProblem={settings?.mode === ProblemMode.SUBTASK}
          contest={contest}
          nickname={mySubmissions ? user.nickname : nickname}
          language={language}
          submitId={submitId}
          timeUsed={timeUsed}
          verdictByGroups={verdictByGroups}
          verdict={verdict}
          memoryUsed={memoryUsed}
          date={new Date(timestamp)}
          submitPoints={submitPoints}
        >
          <div>{PROGRAMMING_LANGUAGE[language]?.name || language}</div>
        </SubmissionInfo>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowB.language.localeCompare(rowA.language) },
      filter: {
        type: 'select-auto',
        options: ACCEPTED_PROGRAMMING_LANGUAGES.map(language => ({ label: PROGRAMMING_LANGUAGE[language].name, value: language })),
      },
      cardPosition: 'center',
      minWidth: 120,
    },
    {
      head: <TextHeadCell text={<T>time</T>} />,
      index: 'timeUsed',
      field: ({ record: { timeUsed, verdict, memoryUsed }, isCard }) => (
        <Field className="jk-row center">
          <Time timeUsed={timeUsed} verdict={verdict} />
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowB.timeUsed - rowA.timeUsed },
      filter: { type: 'text-auto' },
      cardPosition: 'bottom',
      minWidth: 120,
    },
    {
      head: <TextHeadCell text={<T>memory</T>} />,
      index: 'memoryUsed',
      field: ({ record: { memoryUsed, verdict }, isCard }) => (
        <Field className="jk-row center">
          <Memory memoryUsed={memoryUsed} verdict={verdict} />
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowB.memoryUsed - rowA.memoryUsed },
      filter: { type: 'text-auto' },
      cardPosition: 'bottom',
      minWidth: 120,
    },
  ], [contestKey, query, user.nickname, pathname]);
  
  const name = mySubmissions ? 'myStatus' : 'status';
  
  const {
    data: response,
    refresh,
    error,
  } = useRequester<ContentsResponseType<any>>(mySubmissions
      ? JUDGE_API_V1.CONTEST.MY_STATUS(contest?.key, (+queryObject[name + '.page']?.[0] - 1) || 0, +queryObject[name + '.pageSize']?.[0] || 32)
      : JUDGE_API_V1.CONTEST.STATUS(contest?.key, (+queryObject[name + '.page']?.[0] - 1) || 0, +queryObject[name + '.pageSize']?.[0] || 32),
    { refreshInterval: 60000 });
  
  const lastTotalRef = useRef(0);
  lastTotalRef.current = response?.success ? response.meta.totalElements : lastTotalRef.current;
  
  const data: ContestProblemSubmissionsTable[] = (response?.success ? response.contents : []).map(submission => (
    {
      settings: contest?.problems[problemIndex as string]?.settings,
      indexProblem: submission.indexProblem || '',
      problemName: submission.problemName || '',
      submitId: submission.submitId,
      nickname: submission.nickname,
      imageUrl: submission.imageUrl || '',
      timestamp: submission.when,
      verdict: submission.answer,
      submitPoints: submission.submitPoints,
      language: submission.language,
      timeUsed: submission.timeUsed,
      memoryUsed: submission.memoryUsed,
      verdictByGroups: submission.verdictByGroups,
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
      searchParamsObject={queryObject}
      setSearchParamsObject={setSearchParamsObject}
      pagination={{ total: lastTotalRef.current, pageSizeOptions: [32, 64, 128, 256, 512] }}
    />
  );
};