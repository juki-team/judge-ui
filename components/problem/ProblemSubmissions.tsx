import { PagedDataViewer } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useJukiUI } from 'hooks';
import React, { useMemo } from 'react';
import { DataViewerHeadersType, ProblemDataResponseDTO, QueryParam, SubmissionDataResponseDTO } from 'types';
import {
  submissionActionsColumn,
  submissionContestColumn,
  submissionDateColumn,
  submissionLanguage,
  submissionMemoryUsed,
  submissionNickname,
  submissionTimeUsed,
  submissionVerdictColumn,
} from '../submissions/helpers';

export const ProblemSubmissions = ({ problem }: { problem: ProblemDataResponseDTO }) => {
  
  const { components: { Link, Image } } = useJukiUI();
  const columns: DataViewerHeadersType<SubmissionDataResponseDTO>[] = useMemo(() => {
    return [
      submissionNickname(Image),
      submissionContestColumn(Link),
      submissionDateColumn(),
      submissionVerdictColumn(),
      ...(problem.user.isManager ? [ submissionActionsColumn({ canRejudge: true }) ] : []),
      submissionLanguage(),
      submissionTimeUsed(),
      submissionMemoryUsed(),
    ];
  }, [ problem.user.isManager, Link, Image ]);
  
  return (
    <PagedDataViewer<SubmissionDataResponseDTO, SubmissionDataResponseDTO>
      rows={{ height: 80 }}
      cards={{ expanded: true }}
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        JUDGE_API_V1.SUBMISSIONS.PROBLEM(
          problem?.key,
          page,
          pageSize,
          toFilterUrl(filter),
          toSortUrl(sort),
        )
      )}
      name={QueryParam.STATUS_TABLE}
      toRow={submission => submission}
      refreshInterval={60000}
    />
  );
};
