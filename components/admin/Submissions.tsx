import { PagedDataViewer } from 'components';
import { JUDGE_API_V1, QueryParam } from 'config/constants';
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
} from '../submissions/';

export function AllSubmissions() {
  
  const url = (page: number, size: number) => JUDGE_API_V1.SUBMISSIONS.LIST(page, size);
  
  const columns: DataViewerHeadersType<SubmissionResponseDTO>[] = useMemo(() => [
    submissionNickname(),
    submissionProblem(),
    submissionDate(),
    submissionVerdict(true),
    submissionLanguage(),
    submissionTimeUsed(),
    submissionMemoryUsed(),
  ], []);
  
  return (
    <PagedDataViewer<SubmissionResponseDTO, SubmissionResponseDTO>
      headers={columns}
      url={url}
      name={QueryParam.ALL_SUBMISSIONS_TABLE}
      toRow={submission => submission}
      refreshInterval={60000}
    />
  );
}