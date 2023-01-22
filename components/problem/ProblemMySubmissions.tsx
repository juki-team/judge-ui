import { PagedDataViewer, submissionContestColumn } from 'components';
import { JUDGE_API_V1, QueryParam } from 'config/constants';
import { useJukiBase } from 'hooks';
import React, { useMemo } from 'react';
import { DataViewerHeadersType, GetUrl, ProblemResponseDTO, SubmissionResponseDTO } from 'types';
import { toFilterUrl, toSortUrl } from '../../helpers';
import {
  submissionDateColumn,
  submissionLanguage,
  submissionMemoryUsed,
  submissionTimeUsed,
  submissionVerdict,
} from '../submissions';

export const ProblemMySubmissions = ({ problem }: { problem: ProblemResponseDTO }) => {
  const { user: { nickname } } = useJukiBase();
  const columns: DataViewerHeadersType<SubmissionResponseDTO>[] = useMemo(() => {
    return [
      submissionContestColumn(),
      submissionDateColumn(),
      submissionVerdict(problem.user.isEditor),
      submissionLanguage(),
      submissionTimeUsed(),
      submissionMemoryUsed(),
    ];
  }, [problem.user.isEditor]);
  
  const url: GetUrl = ({ pagination: { page, pageSize }, filter, sort }) => {
    const filterUrl = toFilterUrl(filter);
    const sortUrl = toSortUrl(sort);
    return JUDGE_API_V1.SUBMISSIONS.PROBLEM_NICKNAME(problem?.key, nickname, page, pageSize, filterUrl, sortUrl);
  };
  
  return (
    <PagedDataViewer<SubmissionResponseDTO, SubmissionResponseDTO>
      headers={columns}
      url={url}
      name={QueryParam.MY_STATUS_TABLE}
      toRow={submission => submission}
      refreshInterval={60000}
    />
  );
};
