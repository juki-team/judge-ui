import { useCallback, useMemo, useRef } from 'react';
import {
  ACCEPTED_PROGRAMMING_LANGUAGES,
  JUDGE_API_V1,
  PROBLEM_VERDICT,
  PROGRAMMING_LANGUAGE,
  QueryParam,
} from '../../config/constants';
import { replaceParamQuery, searchParamsObjectTypeToQuery } from '../../helpers';
import { useFetcher, useRequester, useRouter } from '../../hooks';
import { useUserState } from '../../store';
import {
  ContentResponseType,
  ContentsResponseType,
  ProblemMode,
  ProblemVerdict,
  ProgrammingLanguage,
  SubmissionRunStatus,
} from '../../types';
import { DataViewerHeadersType, DateField, Field, PagedDataViewer, T, TextHeadCell } from '../index';
import { SubmissionInfo } from '../problem/SubmissionInfo';
import { Memory, Time, Verdict } from '../problem/utils';

type ProblemSubmissionsTable = {
  submitId: string,
  userNickname: string,
  userImageUrl: string,
  timestamp: number,
  verdict: ProblemVerdict,
  submitPoints: number,
  language: ProgrammingLanguage,
  timeUsed: number,
  memoryUsed: number,
  verdictByGroups: {},
  canViewSourceCode: boolean,
  status: SubmissionRunStatus,
}

export function ProfileSubmissions() {
  const { query, push } = useRouter();
  const { data: problemData } = useFetcher<ContentResponseType<any>>(JUDGE_API_V1.PROBLEM.PROBLEM(query.key as string));
  const isSubtaskProblem = problemData?.success && problemData?.content?.settings?.mode === ProblemMode.SUBTASK;
  const { session, nickname } = useUserState();
  const columns: DataViewerHeadersType<ProblemSubmissionsTable>[] = useMemo(() => [
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
      field: ({ record: { verdict, submitPoints, status }, isCard }) => (
        <Field className="jk-row">
          <Verdict verdict={verdict} submitPoints={submitPoints} status={status} />
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
        record: {
          language,
          verdict,
          status,
          submitPoints,
          canViewSourceCode,
          memoryUsed,
          submitId,
          timeUsed,
          verdictByGroups,
          timestamp,
        },
        isCard,
      }) => (
        <SubmissionInfo
          isSubtaskProblem={isSubtaskProblem}
          language={language}
          submitId={submitId}
          timeUsed={timeUsed}
          verdictByGroups={verdictByGroups}
          verdict={verdict}
          memoryUsed={memoryUsed}
          date={new Date(timestamp)}
          submitPoints={submitPoints}
          canViewSourceCode={canViewSourceCode}
          status={status}
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
  ], [query, isSubtaskProblem]);
  const url = (page: number, size: number) => JUDGE_API_V1.SUBMISSIONS.NICKNAME(nickname, page, size, session);
  const mySubmissions= true;
  return (
    <PagedDataViewer<ProblemSubmissionsTable>
      headers={columns}
      url={url}
      name={mySubmissions ? 'myStatus' : 'status'}
      toRow={submission => ({
        submitId: submission.submitId,
        userNickname: submission.userNickname,
        userImageUrl: submission.userImageUrl || '',
        timestamp: submission.timestamp,
        verdict: submission.verdict,
        submitPoints: submission.submitPoints,
        language: submission.language,
        timeUsed: submission.timeUsed,
        memoryUsed: submission.memoryUsed,
        verdictByGroups: submission.verdictByGroups,
        canViewSourceCode: submission.canViewSourceCode,
        status: submission.status,
      } as ProblemSubmissionsTable)}
      refreshInterval={60000}
    />
  );
}