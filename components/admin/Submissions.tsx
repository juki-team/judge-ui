import { PagedDataViewer } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useJukiUI } from 'hooks';
import { useMemo } from 'react';
import { CompanyUserPermissionsResponseDTO, DataViewerHeadersType, QueryParam, SubmissionDataResponseDTO } from 'types';
import {
  submissionActionsColumn,
  submissionDateColumn,
  submissionLanguage,
  submissionMemoryUsed,
  submissionNickname,
  submissionProblemColumn,
  submissionTimeUsed,
  submissionVerdictColumn,
} from '../submissions/helpers';

export function AllSubmissions({ company }: { company: CompanyUserPermissionsResponseDTO }) {
  
  const { components: { Link, Image } } = useJukiUI();
  
  const columns: DataViewerHeadersType<SubmissionDataResponseDTO>[] = useMemo(() => [
    submissionNickname(Image),
    submissionProblemColumn(Link),
    submissionDateColumn(),
    submissionVerdictColumn(),
    submissionActionsColumn({ canRejudge: true }),
    submissionLanguage(),
    submissionTimeUsed(),
    submissionMemoryUsed(),
  ], [ Link, Image ]);
  
  return (
    <PagedDataViewer<SubmissionDataResponseDTO, SubmissionDataResponseDTO>
      rows={{ height: 80 }}
      cards={{ expanded: true }}
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        JUDGE_API_V1.SUBMISSIONS.LIST(
          page,
          pageSize,
          toFilterUrl({ ...filter, companyKey: company.key }),
          toSortUrl(sort),
        )
      )}
      name={QueryParam.ALL_SUBMISSIONS_TABLE}
      toRow={submission => submission}
      refreshInterval={60000}
      dependencies={[ company.key ]}
    />
  );
}
