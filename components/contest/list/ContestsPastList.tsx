import { PagedDataViewer } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useJukiUI } from 'hooks';
import { useMemo } from 'react';
import { ContestSummaryListResponseDTO, DataViewerHeadersType, QueryParam } from 'types';
import { contestantsColumn, contestEndDateColumn, contestNameColumn, contestStartDateColumn } from '../commons';

export const ContestsPastList = () => {
  
  const { components: { Link } } = useJukiUI();
  
  const columns: DataViewerHeadersType<ContestSummaryListResponseDTO>[] = useMemo(() => [
    contestNameColumn(Link),
    contestStartDateColumn(),
    contestEndDateColumn(),
    contestantsColumn(),
  ], [ Link ]);
  
  // const { pushRoute } = useJukiRouter();
  
  return (
    <PagedDataViewer<ContestSummaryListResponseDTO, ContestSummaryListResponseDTO>
      // getRecordStyle={() => ({ cursor: 'pointer' })}
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        JUDGE_API_V1.CONTEST.LIST(page, pageSize, toFilterUrl({ ...filter, state: 'past' }), toSortUrl(sort))
      )}
      name={QueryParam.PAST_CONTESTS_TABLE}
      refreshInterval={60000}
      cards={{ width: 320, expanded: true }}
      // onRecordClick={async ({ data, index }) => {
      //   await pushRoute({ pathname: ROUTES.CONTESTS.VIEW(data[index].key, ContestTab.OVERVIEW) });
      // }}
    />
  );
};
