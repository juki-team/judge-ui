import { PagedDataViewer } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useJukiUI, useJukiUser } from 'hooks';
import React, { useMemo } from 'react';
import { DataViewerHeadersType, ProblemDataResponseDTO, QueryParam, SubmissionDataResponseDTO } from 'types';
import {
  submissionActionsColumn,
  submissionContestColumn,
  submissionDateColumn,
  submissionLanguage,
  submissionMemoryUsed,
  submissionTimeUsed,
  submissionVerdictColumn,
} from '../submissions/helpers';

export const ProblemMySubmissions = ({ problem }: { problem: ProblemDataResponseDTO }) => {
  
  const { user: { nickname } } = useJukiUser();
  const { components: { Link } } = useJukiUI();
  const columns: DataViewerHeadersType<SubmissionDataResponseDTO>[] = useMemo(() => {
    return [
      submissionContestColumn(Link),
      submissionDateColumn(),
      submissionVerdictColumn(),
      ...(problem.user.isManager ? [ submissionActionsColumn({ canRejudge: true }) ] : []),
      submissionLanguage(),
      submissionTimeUsed(),
      submissionMemoryUsed(),
    ];
  }, [ problem.user.isManager, Link ]);
  
  return (
    <PagedDataViewer<SubmissionDataResponseDTO, SubmissionDataResponseDTO>
      rows={{ height: 80 }}
      cards={{ expanded: true }}
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        JUDGE_API_V1.SUBMISSIONS.PROBLEM_NICKNAME(
          problem?.key,
          nickname,
          page,
          pageSize,
          toFilterUrl(filter),
          toSortUrl(sort),
        )
      )}
      name={QueryParam.MY_STATUS_TABLE}
      toRow={submission => submission}
      refreshInterval={60000}
    />
  );
};
