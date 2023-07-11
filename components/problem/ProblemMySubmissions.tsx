import { PagedDataViewer } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useJukiUser } from 'hooks';
import React, { useMemo } from 'react';
import { DataViewerHeadersType, ProblemResponseDTO, QueryParam, SubmissionResponseDTO } from 'types';
import {
  submissionActionsColumn,
  submissionContestColumn,
  submissionDateColumn,
  submissionLanguage,
  submissionMemoryUsed,
  submissionTimeUsed,
  submissionVerdictColumn,
} from '../submissions/helpers';

export const ProblemMySubmissions = ({ problem }: { problem: ProblemResponseDTO }) => {
  const { user: { nickname } } = useJukiUser();
  const columns: DataViewerHeadersType<SubmissionResponseDTO>[] = useMemo(() => {
    return [
      submissionContestColumn(),
      submissionDateColumn(),
      submissionVerdictColumn(),
      ...(problem.user.isEditor ? [ submissionActionsColumn({ canRejudge: true }) ] : []),
      submissionLanguage(),
      submissionTimeUsed(),
      submissionMemoryUsed(),
    ];
  }, [ problem.user.isEditor ]);
  
  return (
    <PagedDataViewer<SubmissionResponseDTO, SubmissionResponseDTO>
      rows={{ height: 80 }}
      cards={{ expanded: true }}
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        JUDGE_API_V1.SUBMISSIONS.PROBLEM_NICKNAME(
          problem?.judge,
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
