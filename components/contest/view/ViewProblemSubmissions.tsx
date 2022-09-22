import { PagedDataViewer } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
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
  
  const user = useUserState();
  
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