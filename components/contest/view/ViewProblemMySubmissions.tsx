import { PagedDataViewer } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { getProblemJudgeKey, toFilterUrl, toSortUrl } from 'helpers';
import { useJukiUser } from 'hooks';
import { useMemo } from 'react';
import { ContestResponseDTO, DataViewerHeadersType, GetUrl, QueryParam, SubmissionResponseDTO } from 'types';
import {
  submissionDateColumn,
  submissionLanguage,
  submissionMemoryUsed,
  submissionProblemColumn,
  submissionTimeUsed,
  submissionVerdict,
} from '../../submissions';

export const ViewProblemMySubmissions = ({ contest }: { contest: ContestResponseDTO }) => {
  
  const { user: { nickname } } = useJukiUser();
  
  const columns: DataViewerHeadersType<SubmissionResponseDTO>[] = useMemo(() => [
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
    submissionVerdict(contest.user.isJudge || contest.user.isAdmin),
    submissionLanguage(),
    submissionTimeUsed(),
    submissionMemoryUsed(),
  ], [contest.problems]);
  
  const url: GetUrl = ({ pagination: { page, pageSize }, filter, sort }) => {
    const filterUrl = toFilterUrl(filter);
    const sortUrl = toSortUrl(sort);
    return JUDGE_API_V1.SUBMISSIONS.CONTEST_NICKNAME(contest?.key, nickname, page, pageSize, filterUrl, sortUrl);
  };
  
  return (
    <div className="pad-left-right pad-top-bottom">
      <PagedDataViewer<SubmissionResponseDTO, SubmissionResponseDTO>
        headers={columns}
        url={url}
        name={QueryParam.MY_STATUS_TABLE}
        toRow={submission => submission}
        refreshInterval={60000}
        getRowKey={({ data, index }) => data[index].submitId}
      />
    </div>
  );
};
