import { PagedDataViewer, submissionActionsColumn, submissionContestColumn } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { toFilterUrl, toSortUrl } from 'helpers';
import React, { useMemo } from 'react';
import { DataViewerHeadersType, GetUrl, ProblemResponseDTO, QueryParam, SubmissionResponseDTO } from 'types';
import {
  submissionDateColumn,
  submissionLanguage,
  submissionMemoryUsed,
  submissionNickname,
  submissionTimeUsed,
  submissionVerdictColumn,
} from '../submissions';

export const ProblemSubmissions = ({ problem }: { problem: ProblemResponseDTO }) => {
  const columns: DataViewerHeadersType<SubmissionResponseDTO>[] = useMemo(() => {
    return [
      submissionNickname(),
      submissionContestColumn(),
      submissionDateColumn(),
      submissionVerdictColumn(),
      ...(problem.user.isEditor ? [submissionActionsColumn({ canRejudge: true })] : []),
      submissionLanguage(),
      submissionTimeUsed(),
      submissionMemoryUsed(),
    ];
  }, [problem.user.isEditor]);
  
  const url: GetUrl = ({ pagination: { page, pageSize }, filter, sort }) => {
    const filterUrl = toFilterUrl(filter);
    const sortUrl = toSortUrl(sort);
    return JUDGE_API_V1.SUBMISSIONS.PROBLEM(problem?.judge, problem?.key, page, pageSize, filterUrl, sortUrl);
  };
  
  return (
    <PagedDataViewer<SubmissionResponseDTO, SubmissionResponseDTO>
      rows={{ height: 80 }}
      cards={{ expanded: true }}
      headers={columns}
      url={url}
      name={QueryParam.STATUS_TABLE}
      toRow={submission => submission}
      refreshInterval={60000}
    />
  );
};
