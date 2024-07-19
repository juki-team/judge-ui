import {
  getSubmissionDateHeader,
  getSubmissionLanguageHeader,
  getSubmissionMemoryHeader,
  getSubmissionNicknameHeader,
  getSubmissionProblemHeader,
  getSubmissionRejudgeHeader,
  getSubmissionTimeHeader,
  getSubmissionVerdictHeader,
  PagedDataViewer,
} from 'components';
import { jukiSettings } from 'config';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useMemo } from 'hooks';
import { DataViewerHeadersType, ProblemDataResponseDTO, QueryParam, SubmissionSummaryListResponseDTO } from 'types';

export const ProblemSubmissions = ({ problem }: { problem: ProblemDataResponseDTO }) => {
  
  const columns: DataViewerHeadersType<SubmissionSummaryListResponseDTO>[] = useMemo(() => {
    return [
      getSubmissionNicknameHeader(),
      getSubmissionProblemHeader(),
      getSubmissionDateHeader(),
      getSubmissionVerdictHeader(),
      ...(problem.user.isManager ? [ getSubmissionRejudgeHeader() ] : []),
      getSubmissionLanguageHeader(),
      getSubmissionTimeHeader(),
      getSubmissionMemoryHeader(),
    ];
  }, [ problem.user.isManager ]);
  
  return (
    <PagedDataViewer<SubmissionSummaryListResponseDTO, SubmissionSummaryListResponseDTO>
      rows={{ height: 80 }}
      cards={{ expanded: true }}
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        jukiSettings.API.submission.getSummaryList({
          params: {
            page,
            pageSize,
            filterUrl: toFilterUrl({ ...filter, problemKeys: problem.key }),
            sortUrl: toSortUrl(sort),
          },
        }).url
      )}
      name={QueryParam.STATUS_TABLE}
      toRow={submission => submission}
      refreshInterval={60000}
    />
  );
};
