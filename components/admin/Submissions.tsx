import { PagedDataViewer } from 'components';
import { JUDGE_API_V1, QueryParam } from 'config/constants';
import { useMemo } from 'react';
import { DataViewerHeadersType, GetUrl, SubmissionResponseDTO } from 'types';
import { toFilterUrl } from '../../helpers';
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
  
  const url: GetUrl = ({ pagination: { page, pageSize }, filter }) => (
    JUDGE_API_V1.SUBMISSIONS.LIST(page, pageSize, toFilterUrl(filter))
  );
  
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