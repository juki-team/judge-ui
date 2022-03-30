import { DataViewer, DataViewerHeadersType, DateField, Field, T, TextHeadCell } from 'components';
import { ACCEPTED_PROGRAMMING_LANGUAGES, PROBLEM_VERDICT, PROGRAMMING_LANGUAGE, QueryParam } from 'config/constants';
import { JUDGE_API_V1 } from 'config/constants/judge';
import { replaceParamQuery, searchParamsObjectTypeToQuery } from 'helpers';
import { useRequester, useRouter } from 'hooks';
import { useCallback, useMemo, useRef } from 'react';
import { ContentsResponseType, ProblemVerdict, ProgrammingLanguage } from 'types';
import { SubmissionInfo } from './SubmissionInfo';
import { Memory, Time, Verdict } from './utils';

type ProblemSubmissionsTable = {
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

export const ProblemSubmissions = ({ problem }) => {
  const { queryObject, query, push } = useRouter();
  
  const columns: DataViewerHeadersType<ProblemSubmissionsTable>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T>nickname</T>} />,
      index: 'nickname',
      field: ({ record: { nickname, imageUrl }, isCard }) => (
        <Field className="jk-row center gap">
          <img src={imageUrl} className="jk-user-profile-img large" alt={nickname} />
          <div className="link" onClick={() => (
            push({ query: replaceParamQuery(query, QueryParam.OPEN_USER_PREVIEW, nickname) })
          )}>{nickname}</div>
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.nickname.localeCompare(rowB.nickname) },
      filter: { type: 'text-auto' },
      cardPosition: 'top',
      minWidth: 250,
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
      sort: { compareFn: () => (rowA, rowB) => rowA.verdict.localeCompare(rowB.verdict) },
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
        record: { language, verdict, submitPoints, nickname, memoryUsed, submitId, timeUsed, verdictByGroups, timestamp },
        isCard,
      }) => (
        <SubmissionInfo
          nickname={nickname}
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
      sort: { compareFn: () => (rowA, rowB) => rowA.language.localeCompare(rowB.language) },
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
      sort: { compareFn: () => (rowA, rowB) => rowA.timeUsed - rowB.timeUsed },
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
      sort: { compareFn: () => (rowA, rowB) => rowA.memoryUsed - rowB.memoryUsed },
      filter: { type: 'text-auto' },
      cardPosition: 'bottom',
      minWidth: 120,
    },
  ], [query]);
  const name = 'submissions';
  
  const {
    data: response,
    refresh,
    error,
  } = useRequester<ContentsResponseType<any>>(JUDGE_API_V1.PROBLEM.PROBLEM_STATUS(problem?.id, +queryObject[name + '.page']?.[0] - 1, +queryObject[name + '.pageSize']?.[0]));
  
  const lastTotalRef = useRef(0);
  lastTotalRef.current = response?.success ? response.meta.totalElements : lastTotalRef.current;
  
  const data: ProblemSubmissionsTable[] = (response?.success ? response.contents : []).map(submission => (
    {
      submitId: submission.submitId,
      nickname: submission.nickname,
      imageUrl: submission.imageUrl || '',
      timestamp: submission.when,
      verdict: submission.answer,
      submitPoints: submission.submitPoints,
      language: ProgrammingLanguage.CPP,
      timeUsed: submission.timeUsed,
      memoryUsed: submission.memoryUsed,
      verdictByGroups: submission.verdictByGroups,
    } as ProblemSubmissionsTable
  ));
  
  const setSearchParamsObject = useCallback(params => push({ query: searchParamsObjectTypeToQuery(params) }), []);
  
  return (
    <DataViewer<ProblemSubmissionsTable>
      headers={columns}
      data={data}
      rows={{ height: 68 }}
      request={refresh}
      name="submissions"
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