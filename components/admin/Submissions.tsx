import { PagedDataViewer } from 'components';
import { JUDGE_API_V1, QueryParam } from 'config/constants';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useMemo } from 'react';
import { DataViewerHeadersType, GetUrl, SubmissionResponseDTO } from 'types';
import {
  submissionDateColumn,
  submissionLanguage,
  submissionMemoryUsed,
  submissionNickname,
  submissionProblemColumn,
  submissionTimeUsed,
  submissionVerdict,
} from '../submissions/';

export function AllSubmissions() {
  
  const url: GetUrl = ({ pagination: { page, pageSize }, filter, sort }) => (
    JUDGE_API_V1.SUBMISSIONS.LIST(page, pageSize, toFilterUrl(filter), toSortUrl(sort))
  );
  
  const columns: DataViewerHeadersType<SubmissionResponseDTO>[] = useMemo(() => [
    submissionNickname(),
    submissionProblemColumn(),
    submissionDateColumn(),
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
