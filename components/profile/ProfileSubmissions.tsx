import { PagedDataViewer } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { useRouter } from 'hooks';
import { useUserState } from 'store';
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
  
  const { session } = useUserState();
  const { query: { nickname } } = useRouter();
  const url = (page: number, size: number) => JUDGE_API_V1.SUBMISSIONS.NICKNAME(nickname as string, page, size, session);
  
  return (
    <PagedDataViewer<SubmissionResponseDTO, SubmissionResponseDTO>
      headers={columns}
      url={url}
      name="submissions"
      toRow={submission => submission}
      refreshInterval={60000}
    />
  );
}