import { PagedDataViewer } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { toFilterUrl, toSortUrl } from 'helpers';
import React, { useMemo } from 'react';
import { DataViewerHeadersType, ProblemResponseDTO, QueryParam, SubmissionResponseDTO } from 'types';
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

export const ProblemSubmissions = ({ problem }: { problem: ProblemResponseDTO }) => {
  const columns: DataViewerHeadersType<SubmissionResponseDTO>[] = useMemo(() => {
    return [
      submissionNickname(),
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
        JUDGE_API_V1.SUBMISSIONS.PROBLEM(
          problem?.judge,
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
