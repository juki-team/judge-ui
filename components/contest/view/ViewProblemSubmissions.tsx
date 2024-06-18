import { ButtonLoader, PagedDataViewer, T } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, getProblemJudgeKey, toFilterUrl, toSortUrl } from 'helpers';
import { useJukiUI, useRef } from 'hooks';
import { useMemo } from 'react';
import { ContestResponseDTO, DataViewerHeadersType, QueryParam, Status, SubmissionDataResponseDTO } from 'types';
import { downloadBlobAsFile } from '../../../helpers';
import { HTTPMethod } from '../../../types';
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
  
  const { components: { Link, Image } } = useJukiUI();
  
  const columns: DataViewerHeadersType<SubmissionDataResponseDTO>[] = useMemo(() => [
    submissionNickname(Image),
    submissionProblemColumn(Link, {
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
  ], [ contest.problems, contest.user.isAdmin, contest.user.isJudge, Link, Image ]);
  
  const lastGetUrl = useRef({ filter: {}, sort: {} });
  
  return (
    <PagedDataViewer<SubmissionDataResponseDTO, SubmissionDataResponseDTO>
      rows={{ height: 80 }}
      cards={{ width: 272, expanded: true }}
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => {
        lastGetUrl.current = {
          filter,
          sort,
        };
        return JUDGE_API_V1.SUBMISSIONS.CONTEST(contest?.key, page, pageSize, toFilterUrl(filter), toSortUrl(sort));
      }}
      name={QueryParam.STATUS_TABLE}
      toRow={submission => submission}
      refreshInterval={60000}
      getRowKey={({ data, index }) => data[index].submitId}
      extraNodes={[
        <ButtonLoader
          key="export"
          type="light"
          size="tiny"
          onClick={async (setLoaderStatus) => {
            const url = JUDGE_API_V1.SUBMISSIONS.CONTEST_EXPORT(contest?.key, 1, 1000000, toFilterUrl(lastGetUrl.current.filter), toSortUrl(lastGetUrl.current.sort));
            setLoaderStatus(Status.LOADING);
            const result = await authorizedRequest(
              url,
              { method: HTTPMethod.GET, responseType: 'blob' },
            );
            downloadBlobAsFile(result, contest.name + ' - submissions.csv');
            setLoaderStatus(Status.SUCCESS);
          }}
        >
          <T>export as csv</T>
        </ButtonLoader>,
      ]}
    />
  );
};
