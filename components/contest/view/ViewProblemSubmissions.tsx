import { PagedDataViewer } from 'components';
import { JUDGE_API_V1, QueryParam } from 'config/constants';
import { useMemo } from 'react';
import { useUserState } from 'store';
import { ContestResponseDTO, DataViewerHeadersType, SubmissionResponseDTO } from 'types';
import {
  submissionDate,
  submissionLanguage,
  submissionMemoryUsed,
  submissionNickname,
  submissionProblem,
  submissionTimeUsed,
  submissionVerdict,
} from '../../Submissions';

export const ViewProblemSubmissions = ({ contest, mySubmissions }: { contest: ContestResponseDTO, mySubmissions?: boolean }) => {
  
  const { nickname } = useUserState();
  
  const columns: DataViewerHeadersType<SubmissionResponseDTO>[] = useMemo(() => [
    ...(!mySubmissions ? [submissionNickname()] : []),
    submissionProblem({
      header: {
        filter: {
          type: 'select-auto',
          options: Object.values(contest.problems)
            .map(({ index, name }) => ({ label: <div>{index ? `(${index})` : ''} {name}</div>, value: index })),
        },
      },
      onlyProblem: true,
    }),
    submissionDate(),
    submissionVerdict(),
    submissionLanguage(),
    submissionTimeUsed(),
    submissionMemoryUsed(),
  ], [contest.problems]);
  
  const url = (page: number, size: number) => {
    return mySubmissions
      ? JUDGE_API_V1.SUBMISSIONS.CONTEST_NICKNAME(contest?.key, nickname, page, size)
      : JUDGE_API_V1.SUBMISSIONS.CONTEST(contest?.key, page, size);
  };
  
  return (
    <PagedDataViewer<SubmissionResponseDTO, SubmissionResponseDTO>
      headers={columns}
      url={url}
      name={ mySubmissions ? QueryParam.MY_STATUS_TABLE : QueryParam.STATUS_TABLE}
      toRow={submission => submission}
      refreshInterval={60000}
      getRowKey={(data, index) => data[index].submitId}
    />
  );
};
