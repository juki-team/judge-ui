import { PagedDataViewer, submissionContestColumn } from 'components';
import { JUDGE_API_V1, QueryParam } from 'config/constants';
import React, { useMemo } from 'react';
import { useUserState } from 'store';
import { DataViewerHeadersType, GetUrl, ProblemResponseDTO, SubmissionResponseDTO } from 'types';
import { toFilterUrl, toSortUrl } from '../../helpers';
import {
  submissionDateColumn,
  submissionLanguage,
  submissionMemoryUsed,
  submissionNickname,
  submissionTimeUsed,
  submissionVerdict,
} from '../submissions';

export const ProblemSubmissions = ({ problem, mySubmissions }: { problem: ProblemResponseDTO, mySubmissions?: boolean }) => {
  const { nickname } = useUserState();
  const columns: DataViewerHeadersType<SubmissionResponseDTO>[] = useMemo(() => {
    return [
      ...(!mySubmissions ? [submissionNickname()] : []),
      submissionContestColumn(),
      submissionDateColumn(),
      submissionVerdict(problem.user.isEditor),
      submissionLanguage(),
      submissionTimeUsed(),
      submissionMemoryUsed(),
    ];
  }, [mySubmissions, problem.user.isEditor]);
  
  const url: GetUrl = ({ pagination: { page, pageSize }, filter, sort }) => {
    const filterUrl = toFilterUrl(filter);
    const sortUrl = toSortUrl(sort);
    if (mySubmissions) {
      return JUDGE_API_V1.SUBMISSIONS.PROBLEM_NICKNAME(problem?.key, nickname, page, pageSize, filterUrl, sortUrl);
    }
    return JUDGE_API_V1.SUBMISSIONS.PROBLEM(problem?.key, page, pageSize, filterUrl, sortUrl);
  };
  
  return (
    <PagedDataViewer<SubmissionResponseDTO, SubmissionResponseDTO>
      headers={columns}
      url={url}
      name={mySubmissions ? QueryParam.MY_STATUS_TABLE : QueryParam.STATUS_TABLE}
      toRow={submission => submission}
      refreshInterval={60000}
    />
  );
};
