import { DataViewerHeadersType, DateField, Field, PagedDataViewer, T, TextHeadCell, UserNicknameLink } from 'components';
import { ACCEPTED_PROGRAMMING_LANGUAGES, JUDGE_API_V1, PROBLEM_VERDICT, PROGRAMMING_LANGUAGE, ROUTES } from 'config/constants';
import { useRouter } from 'hooks';
import Link from 'next/link';
import { useMemo } from 'react';
import { useUserState } from 'store';
import { ContestResponseDTO, ContestTab, SubmissionResponseDTO } from 'types';
import { SubmissionInfo } from '../../problem/SubmissionInfo';
import { Memory, Time, Verdict } from '../../problem/utils';

type ContestProblemSubmissionsTable = SubmissionResponseDTO;

export const ViewProblemSubmissions = ({ contest, mySubmissions }: { contest: ContestResponseDTO, mySubmissions?: boolean }) => {
  
  const user = useUserState();
  const { queryObject, query: { key: contestKey, tab, index: problemIndex, ...query }, push, pathname } = useRouter();
  
  const columns: DataViewerHeadersType<ContestProblemSubmissionsTable>[] = useMemo(() => [
    ...(!mySubmissions ? [
      {
        head: <TextHeadCell text={<T>nickname</T>} />,
        index: 'nickname',
        field: ({ record: { userNickname, userImageUrl }, isCard }) => (
          <Field className="jk-row center gap">
            <img src={userImageUrl} className="jk-user-profile-img large" alt={userNickname} />
            <UserNicknameLink nickname={userNickname}>
              <div className="link">
                {userNickname}
              </div>
            </UserNicknameLink>
          </Field>
        ),
        sort: { compareFn: () => (rowA, rowB) => rowB.userNickname.localeCompare(rowA.userNickname) },
        filter: { type: 'text-auto' },
        cardPosition: 'top',
        minWidth: 250,
      } as DataViewerHeadersType<ContestProblemSubmissionsTable>,
    ] : []),
    {
      head: <TextHeadCell text={<T>problem</T>} />,
      index: 'contestProblemIndex',
      field: ({ record: { problemName, contestProblemIndex }, isCard }) => (
        <Field className="jk-row link">
          <Link href={{ pathname: ROUTES.CONTESTS.VIEW(contestKey as string, ContestTab.PROBLEM, contestProblemIndex), query }}>
            <a>{contestProblemIndex ? `(${contestProblemIndex})` : ''} {problemName}</a>
          </Link>
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowB.contestProblemIndex.localeCompare(rowA.contestProblemIndex) },
      filter: {
        type: 'select-auto',
        options: Object.values(contest.problems)
          .map(({ index, name }) => ({ label: <div>{index ? `(${index})` : ''} {name}</div>, value: index })),
      },
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
      field: ({ record: { verdict, points }, isCard }) => (
        <Field className="jk-row">
          <Verdict verdict={verdict} points={points} />
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowB.verdict.localeCompare(rowA.verdict) },
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
          canViewSourceCode,
          status,
          verdict,
          contestKey,
          problemMemoryLimit,
          problemTimeLimit,
          problemMode,
          contestName,
          problemKey,
          points,
          userNickname,
          memoryUsed,
          submitId,
          timeUsed,
          timestamp,
          contestProblemIndex,
        },
        isCard,
      }) => (
        <SubmissionInfo
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
      sort: { compareFn: () => (rowA, rowB) => rowB.language.localeCompare(rowA.language) },
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
  ], [contestKey, query, user.nickname, pathname, contest.problems]);
  
  const name = mySubmissions ? 'myStatus' : 'status';
  
  const url = (page: number, size: number) => {
    return mySubmissions
      ? JUDGE_API_V1.SUBMISSIONS.CONTEST_NICKNAME(contest?.key, user.nickname, page, size, user.session)
      : JUDGE_API_V1.SUBMISSIONS.CONTEST(contest?.key, page, size, user.session);
  };
  
  return (
    <PagedDataViewer<SubmissionResponseDTO, SubmissionResponseDTO>
      headers={columns}
      url={url}
      name={name}
      toRow={submission => submission}
      refreshInterval={60000}
    />
  );
};