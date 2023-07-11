import { PagedDataViewer } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { getProblemJudgeKey, toFilterUrl, toSortUrl } from 'helpers';
import { useMemo } from 'react';
import { ContestResponseDTO, DataViewerHeadersType, QueryParam, SubmissionResponseDTO } from 'types';
import {
  submissionActionsColumn,
  submissionDateColumn,
  submissionLanguage,
  submissionMemoryUsed,
  submissionNickname,
  submissionProblemColumn,
  submissionTimeUsed,
  submissionVerdictColumn,
} from '../../submissions/helpers';

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
    ...(contest.user.isJudge || contest.user.isAdmin ? [ submissionActionsColumn({ canRejudge: true }) ] : []),
    submissionLanguage(),
    submissionTimeUsed(),
    submissionMemoryUsed(),
  ], [ contest.problems ]);
  
  return (
    <div className="pad-left-right pad-top-bottom">
      <PagedDataViewer<SubmissionResponseDTO, SubmissionResponseDTO>
        rows={{ height: 80 }}
        cards={{ width: 272, expanded: true }}
        headers={columns}
        getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
          JUDGE_API_V1.SUBMISSIONS.CONTEST(contest?.key, page, pageSize, toFilterUrl(filter), toSortUrl(sort))
        )}
        name={QueryParam.STATUS_TABLE}
        toRow={submission => submission}
        refreshInterval={60000}
        getRowKey={({ data, index }) => data[index].submitId}
      />
    </div>
  );
};
