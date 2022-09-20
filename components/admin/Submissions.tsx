import { DataViewerHeadersType, DateField, ExternalIcon, Field, PagedDataViewer, T, TextHeadCell } from 'components';
import { ACCEPTED_PROGRAMMING_LANGUAGES, JUDGE_API_V1, PROBLEM_VERDICT, PROGRAMMING_LANGUAGE, ROUTES } from 'config/constants';
import { useMemo } from 'react';
import { useUserState } from 'store';
import { ContestTab, ProblemTab, SubmissionResponseDTO } from 'types';
import { SubmissionInfo } from '../problem/SubmissionInfo';
import { Memory, Time, Verdict } from '../problem/utils';

type ProblemSubmissionsTable = SubmissionResponseDTO;

export function AllSubmissions() {
  
  const { session } = useUserState();
  
  const columns: DataViewerHeadersType<ProblemSubmissionsTable>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<><T>problem</T> / <T className="text-sentence-case">contest</T></>} />,
      index: 'problem',
      field: ({ record: { problemKey, problemName, contestName, contestKey, contestProblemIndex }, isCard }) => (
        <Field className="jk-row">
          {contestKey ? (
            <a href={ROUTES.CONTESTS.VIEW(contestKey, ContestTab.PROBLEM, contestProblemIndex)} target="_blank">
              <div className="jk-row link">{contestName} ({contestProblemIndex}) <ExternalIcon size="small" /></div>
            </a>
          ) : (
            <a href={ROUTES.PROBLEMS.VIEW(problemKey + '', ProblemTab.STATEMENT)} target="_blank">
              <div className="jk-row link">{problemKey} {problemName} <ExternalIcon size="small" /></div>
            </a>
          )}
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => +rowA.timestamp - +rowB.timestamp },
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
      field: ({ record: { verdict, points, status }, isCard }) => (
        <Field className="jk-row">
          <Verdict verdict={verdict} points={points} status={status} />
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.verdict.localeCompare(rowB.verdict) },
      filter: {
        type: 'select-auto',
        options: Object.values(PROBLEM_VERDICT)
          .map(({ value, label }) => ({ label: <T className="text-sentence-case">{label}</T>, value })),
      },
      cardPosition: 'center',
      minWidth: 120,
    },
    {
      head: <TextHeadCell text={<T>lang</T>} />,
      index: 'language',
      field: ({
        record: {
          language,
          verdict,
          status,
          points,
          canViewSourceCode,
          memoryUsed,
          submitId,
          timeUsed,
          timestamp,
          problemMode,
          problemTimeLimit,
          problemMemoryLimit,
          contestKey,
          contestProblemIndex,
          contestName,
        },
        isCard,
      }) => (
        <SubmissionInfo
          language={language}
          submitId={submitId}
          timeUsed={timeUsed}
          verdict={verdict}
          problem={{
            mode: problemMode,
            timeLimit: problemTimeLimit,
            memoryLimit: problemMemoryLimit,
          }}
          contest={contestKey ? {
            key: contestKey,
            problemIndex: contestProblemIndex,
            name: contestName,
          } : undefined}
          memoryUsed={memoryUsed}
          date={new Date(timestamp)}
          points={points}
          canViewSourceCode={canViewSourceCode}
          status={status}
        >
          <div>{PROGRAMMING_LANGUAGE[language]?.label || language}</div>
        </SubmissionInfo>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.language.localeCompare(rowB.language) },
      filter: {
        type: 'select-auto',
        options: ACCEPTED_PROGRAMMING_LANGUAGES.map(language => ({ label: PROGRAMMING_LANGUAGE[language].label, value: language })),
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
  ], []);
  const url = (page: number, size: number) => JUDGE_API_V1.SUBMISSIONS.LIST(page, size, session);
  
  return (
    <PagedDataViewer<ProblemSubmissionsTable, SubmissionResponseDTO>
      headers={columns}
      url={url}
      name="submissions"
      toRow={submission => submission}
      refreshInterval={60000}
    />
  );
}