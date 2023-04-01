import { PagedDataViewer, submissionActionsColumn } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useMemo } from 'react';
import { DataViewerHeadersType, GetUrl, QueryParam, SubmissionResponseDTO } from 'types';
import {
  submissionDateColumn,
  submissionLanguage,
  submissionMemoryUsed,
  submissionNickname,
  submissionProblemColumn,
  submissionTimeUsed,
  submissionVerdictColumn,
} from '../submissions';

export function AllSubmissions() {
  
  const url: GetUrl = ({ pagination: { page, pageSize }, filter, sort }) => (
    JUDGE_API_V1.SUBMISSIONS.LIST(page, pageSize, toFilterUrl(filter), toSortUrl(sort))
  );
  
  const columns: DataViewerHeadersType<SubmissionResponseDTO>[] = useMemo(() => [
    submissionNickname(),
    submissionProblemColumn(),
    submissionDateColumn(),
    submissionVerdictColumn(),
    submissionActionsColumn({ canRejudge: true }),
    submissionLanguage(),
    submissionTimeUsed(),
    submissionMemoryUsed(),
  ], []);
  
  return (
    <PagedDataViewer<SubmissionResponseDTO, SubmissionResponseDTO>
      rows={{ height: 80 }}
      cards={{ expanded: true }}
      headers={columns}
      url={url}
      name={QueryParam.ALL_SUBMISSIONS_TABLE}
      toRow={submission => submission}
      refreshInterval={60000}
    />
  );
}
