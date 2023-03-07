import { PagedDataViewer, submissionActionsColumn } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { getProblemJudgeKey, toFilterUrl, toSortUrl } from 'helpers';
import { useMemo } from 'react';
import { ContestResponseDTO, DataViewerHeadersType, GetUrl, QueryParam, SubmissionResponseDTO } from 'types';
import {
  submissionDateColumn,
  submissionLanguage,
  submissionMemoryUsed,
  submissionNickname,
  submissionProblemColumn,
  submissionTimeUsed,
  submissionVerdictColumn,
} from '../../submissions';

export const ViewProblemSubmissions = ({ contest }: { contest: ContestResponseDTO }) => {
  
  const columns: DataViewerHeadersType<SubmissionResponseDTO>[] = useMemo(() => [
    submissionNickname(),
    submissionProblemColumn({
      header: {
        filter: {
          type: 'select',
          options: Object.values(contest.problems)
            .map(({ index, name, key, judge }) => ({
              label: <div>{index ? `(${index})` : ''} {name}</div>,
              value: getProblemJudgeKey(judge, key),
            })),
        },
      },
      onlyProblem: true,
    }),
    submissionDateColumn(),
    submissionVerdictColumn(),
    ...(contest.user.isJudge || contest.user.isAdmin ? [submissionActionsColumn({ canRejudge: true })] : []),
    submissionLanguage(),
    submissionTimeUsed(),
    submissionMemoryUsed(),
  ], [contest.problems]);
  
  const url: GetUrl = ({ pagination: { page, pageSize }, filter, sort }) => {
    const filterUrl = toFilterUrl(filter);
    const sortUrl = toSortUrl(sort);
    return JUDGE_API_V1.SUBMISSIONS.CONTEST(contest?.key, page, pageSize, filterUrl, sortUrl);
  };
  
  return (
    <div className="pad-left-right pad-top-bottom">
      <PagedDataViewer<SubmissionResponseDTO, SubmissionResponseDTO>
        headers={columns}
        url={url}
        name={QueryParam.STATUS_TABLE}
        toRow={submission => submission}
        refreshInterval={60000}
        getRowKey={({ data, index }) => data[index].submitId}
        cards={{ width: 272 }}
      />
    </div>
  );
};
