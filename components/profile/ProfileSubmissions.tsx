import { PagedDataViewer } from 'components';
import { JUDGE_API_V1, QueryParam } from 'config/constants';
import { useRouter } from 'hooks';
import { DataViewerHeadersType, SubmissionResponseDTO } from 'types';
import {
  submissionDate,
  submissionLanguage,
  submissionMemoryUsed,
  submissionProblem,
  submissionTimeUsed,
  submissionVerdict,
} from '../Submissions';

const columns: DataViewerHeadersType<SubmissionResponseDTO>[] = [
  submissionProblem({ blankTarget: true }),
  submissionDate(),
  submissionVerdict(),
  submissionLanguage(),
  submissionTimeUsed(),
  submissionMemoryUsed(),
];

export function ProfileSubmissions() {
  
  const { query: { nickname } } = useRouter();
  const url = (page: number, size: number) => JUDGE_API_V1.SUBMISSIONS.NICKNAME(nickname as string, page, size);
  
  return (
    <PagedDataViewer<SubmissionResponseDTO, SubmissionResponseDTO>
      headers={columns}
      url={url}
      name={QueryParam.PROFILE_SUBMISSIONS_TABLE}
      toRow={submission => submission}
      refreshInterval={60000}
    />
  );
}