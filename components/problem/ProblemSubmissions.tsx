import { PagedDataViewer } from 'components';
import { JUDGE_API_V1, QueryParam } from 'config/constants';
import React, { useMemo } from 'react';
import { useUserState } from 'store';
import { DataViewerHeadersType, ProblemResponseDTO, SubmissionResponseDTO } from 'types';
import {
  submissionDate,
  submissionLanguage,
  submissionMemoryUsed,
  submissionNickname,
  submissionTimeUsed,
  submissionVerdict,
} from '../Submissions';

export const ProblemSubmissions = ({ problem, mySubmissions }: { problem: ProblemResponseDTO, mySubmissions?: boolean }) => {
  const { nickname } = useUserState();
  const columns: DataViewerHeadersType<SubmissionResponseDTO>[] = useMemo(() => {
    return [
      ...(!mySubmissions ? [submissionNickname()] : []),
      submissionDate(),
      submissionVerdict(problem.user.isEditor),
      submissionLanguage(),
      submissionTimeUsed(),
      submissionMemoryUsed(),
    ];
  }, [mySubmissions, problem.user.isEditor]);
  
  const url = (page: number, size: number) => {
    if (mySubmissions) {
      return JUDGE_API_V1.SUBMISSIONS.PROBLEM_NICKNAME(problem?.key, nickname, page, size);
    }
    return JUDGE_API_V1.SUBMISSIONS.PROBLEM(problem?.key, page, size);
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
