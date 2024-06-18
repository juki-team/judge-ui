import { PagedDataViewer } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useJukiRouter, useJukiUI, useMemo } from 'hooks';
import { DataViewerHeadersType, QueryParam, SubmissionDataResponseDTO } from 'types';
import {
  submissionDateColumn,
  submissionLanguage,
  submissionMemoryUsed,
  submissionProblemColumn,
  submissionTimeUsed,
  submissionVerdictColumn,
} from '../submissions/helpers';

export function ProfileSubmissions() {
  
  const { routeParams: { nickname } } = useJukiRouter();
  const { components: { Link } } = useJukiUI();
  
  const columns: DataViewerHeadersType<SubmissionDataResponseDTO>[] = useMemo(() => [
    submissionProblemColumn(Link, { blankTarget: true }),
    submissionDateColumn(),
    submissionVerdictColumn(),
    submissionLanguage(),
    submissionTimeUsed(),
    submissionMemoryUsed(),
  ], [ Link ]);
  
  return (
    <PagedDataViewer<SubmissionDataResponseDTO, SubmissionDataResponseDTO>
      rows={{ height: 80 }}
      cards={{ expanded: true }}
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        JUDGE_API_V1.SUBMISSIONS.NICKNAME(nickname as string, page, pageSize, toFilterUrl(filter), toSortUrl(sort))
      )}
      name={QueryParam.PROFILE_SUBMISSIONS_TABLE}
      toRow={submission => submission}
      refreshInterval={60000}
    />
  );
}
