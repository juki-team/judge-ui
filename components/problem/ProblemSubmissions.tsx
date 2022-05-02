import { DataViewerHeadersType, DateField, Field, PagedDataViewer, T, TextHeadCell } from 'components';
import {
  ACCEPTED_PROGRAMMING_LANGUAGES,
  JUDGE_API_V1,
  MY_STATUS,
  PROBLEM_VERDICT,
  PROGRAMMING_LANGUAGE,
  QueryParam,
  STATUS,
} from 'config/constants';
import { replaceParamQuery } from 'helpers';
import { useFetcher, useRouter } from 'hooks';
import { useMemo } from 'react';
import { ContentResponseType, ProblemMode, SubmissionResponseDTO } from 'types';
import { useUserState } from '../../store';
import { SubmissionInfo } from './SubmissionInfo';
import { Memory, Time, Verdict } from './utils';

type  ProblemSubmissionsTable = SubmissionResponseDTO;

export const ProblemSubmissions = ({ problem, mySubmissions }: { problem: any, mySubmissions?: boolean }) => {
  const { query, push } = useRouter();
  const { data: problemData } = useFetcher<ContentResponseType<any>>(JUDGE_API_V1.PROBLEM.PROBLEM(query.key as string));
  const isSubtaskProblem = problemData?.success && problemData?.content?.settings?.mode === ProblemMode.SUBTASK;
  const { session, nickname } = useUserState();
  const columns: DataViewerHeadersType<ProblemSubmissionsTable>[] = useMemo(() => [
    ...(!mySubmissions ? [
      {
        head: <TextHeadCell text={<T>nickname</T>} />,
        index: 'nickname',
        field: ({ record: { userNickname, userImageUrl }, isCard }) => (
          <Field className="jk-row center gap">
            <img src={userImageUrl} className="jk-user-profile-img large" alt={userNickname} />
            <div className="link" onClick={() => (
              push({ query: replaceParamQuery(query, QueryParam.OPEN_USER_PREVIEW, userNickname) })
            )}>{userNickname}</div>
          </Field>
        ),
        sort: { compareFn: () => (rowA, rowB) => rowA.userNickname.localeCompare(rowB.userNickname) },
        filter: { type: 'text-auto' },
        cardPosition: 'top',
        minWidth: 250,
      } as DataViewerHeadersType<ProblemSubmissionsTable>,
    ] : []),
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
          problemTimeLimit,
          problemMemoryLimit,
          problemMode,
          timestamp,
        },
        isCard,
      }) => (
        <SubmissionInfo
          problem={{
            mode: problemMode,
            timeLimit: problemTimeLimit,
            memoryLimit: problemMemoryLimit,
          }}
          language={language}
          submitId={submitId}
          timeUsed={timeUsed}
          verdict={verdict}
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
  ], [query, isSubtaskProblem]);
  const url = (page: number, size: number) => {
    if (mySubmissions) {
      return JUDGE_API_V1.SUBMISSIONS.PROBLEM_NICKNAME(problem?.id, nickname, page, size, session);
    }
    return JUDGE_API_V1.SUBMISSIONS.PROBLEM(problem?.id, page, size, session);
  };
  
  return (
    <PagedDataViewer<ProblemSubmissionsTable, SubmissionResponseDTO>
      headers={columns}
      url={url}
      name={mySubmissions ? MY_STATUS : STATUS}
      toRow={submission => submission}
      refreshInterval={60000}
    />
  );
};