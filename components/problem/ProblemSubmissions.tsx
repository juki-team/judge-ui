import { DataViewer, DataViewerHeadersType, DateField, Field, Popover, T, TextHeadCell } from 'components';
import { PROBLEM_VERDICT, PROGRAMMING_LANGUAGES, QueryParam } from 'config/constants';
import { replaceParamQuery, searchParamsObjectTypeToQuery } from 'helpers';
import { useRequester, useRouter } from 'hooks';
import { useMemo } from 'react';
import { JUDGE_API_V1 } from 'config/constants/judge';
import { ContentsResponseType, ProblemVerdict, ProgrammingLanguage } from 'types';

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
      head: <TextHeadCell text={<T className="text-uppercase">nickname</T>} />,
      index: 'nickname',
      field: ({ record: { nickname, imageUrl }, isCard }) => (
        <Field className="jk-row center gap">
          <img src={imageUrl} className="jk-user-profile-img" alt={nickname} />
          <div className="jk-link" onClick={() => (
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
      head: <TextHeadCell text={<T className="text-uppercase">date</T>} />,
      index: 'timestamp',
      field: ({ record: { timestamp }, isCard }) => (
        <DateField className="jk-row" date={new Date(timestamp)} label={<T>date</T>} />
      ),
      sort: { compareFn: () => (rowA, rowB) => +rowA.timestamp - +rowB.timestamp },
      filter: { type: 'date-range-auto' },
      cardPosition: 'center',
      minWidth: 260,
    },
    {
      head: <TextHeadCell text={<T className="text-uppercase">verdict</T>} />,
      index: 'verdict',
      field: ({ record: { verdict, verdictByGroups }, isCard }) => (
        <Field className="jk-row">
          <Popover
            content={<div>{PROBLEM_VERDICT[verdict].print}</div>}
            triggerOn="hover"
            placement="top"
            showPopperArrow
          >
            <div className="jk-tag" style={{ backgroundColor: PROBLEM_VERDICT[verdict].color }}>{verdict}</div>
          </Popover>
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.verdict.localeCompare(rowB.verdict) },
      filter: {
        type: 'select-auto',
        options: [],
      },
      cardPosition: 'center',
      minWidth: 120,
    },
    {
      head: <TextHeadCell text={<T className="text-uppercase">lang</T>} />,
      index: 'language',
      field: ({ record: { language }, isCard }) => (
        <Field className="jk-row">
          <div>{PROGRAMMING_LANGUAGES[language].name}</div>
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.language.localeCompare(rowB.language) },
      filter: {
        type: 'select-auto',
        options: [],
      },
      cardPosition: 'center',
      minWidth: 120,
    },
    {
      head: <TextHeadCell text={<T className="text-uppercase">time</T>} />,
      index: 'timeUsed',
      field: ({ record: { timeUsed }, isCard }) => (
        <Field className="jk-row center">{timeUsed} <T>ms</T></Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.timeUsed - rowB.timeUsed },
      filter: {
        type: 'text-auto',
        options: [],
      },
      cardPosition: 'bottom',
      minWidth: 120,
    },
    {
      head: <TextHeadCell text={<T className="text-uppercase">memory</T>} />,
      index: 'memoryUsed',
      field: ({ record: { memoryUsed }, isCard }) => (
        <Field className="jk-row center">{memoryUsed} <T>kb</T></Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.memoryUsed - rowB.memoryUsed },
      filter: {
        type: 'text-auto',
      },
      cardPosition: 'bottom',
      minWidth: 120,
    },
  ], [query]);
  
  const { data: response, refresh } = useRequester<ContentsResponseType<any>>(JUDGE_API_V1.PROBLEM.PROBLEM_STATUS(problem?.id));
  
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
  
  return (
    <div style={{ height: '100%' }}>
      <DataViewer<ProblemSubmissionsTable>
        headers={columns}
        data={data}
        rows={{ height: 68 }}
        request={refresh}
        name="users"
        extraButtons={() => (
          <div className="extra-buttons">
          </div>
        )}
        searchParamsObject={queryObject}
        setSearchParamsObject={(params) => push({ query: searchParamsObjectTypeToQuery(params) })}
      />
    </div>
  );
};