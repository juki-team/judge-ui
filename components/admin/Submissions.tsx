import { PagedDataViewer } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { useMemo } from 'react';
import { useUserState } from 'store';
import { DataViewerHeadersType, SubmissionResponseDTO } from 'types';
import {
  submissionDate,
  submissionLanguage,
  submissionMemoryUsed,
  submissionNickname,
  submissionProblem,
  submissionTimeUsed,
  submissionVerdict,
} from '../Submissions/';

export function AllSubmissions() {
  
  const { session } = useUserState();
  const url = (page: number, size: number) => JUDGE_API_V1.SUBMISSIONS.LIST(page, size, session);
  
  const columns: DataViewerHeadersType<SubmissionResponseDTO>[] = useMemo(() => [
    submissionNickname(),
    submissionProblem(),
    submissionDate(),
    submissionVerdict(),
    submissionLanguage(),
    submissionTimeUsed(),
    submissionMemoryUsed(),
  ], []);
  
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