import { PagedDataViewer } from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useJukiRouter } from 'hooks';
import { useMemo } from 'react';
import { ContestSummaryListResponseDTO, ContestTab, DataViewerHeadersType, QueryParam } from 'types';
import { contestantsColumn, contestEndDateColumn, contestNameColumn, contestStartDateColumn } from '../commons';

export const ContestsEndlessList = () => {
  
  const columns: DataViewerHeadersType<ContestSummaryListResponseDTO>[] = useMemo(() => [
    contestNameColumn(false),
    contestStartDateColumn(),
    contestEndDateColumn(),
    contestantsColumn(),
  ], []);
  
  const { pushRoute } = useJukiRouter();
  
  return (
    <PagedDataViewer<ContestSummaryListResponseDTO, ContestSummaryListResponseDTO>
      getRecordStyle={() => ({ cursor: 'pointer' })}
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        JUDGE_API_V1.CONTEST.LIST(page, pageSize, toFilterUrl({ ...filter, state: 'endless' }), toSortUrl(sort))
      )}
      name={QueryParam.ENDLESS_CONTESTS_TABLE}
      refreshInterval={60000}
      cards={{ width: 320, expanded: true }}
      onRecordClick={async ({ data, index }) => {
        await pushRoute({ pathname: ROUTES.CONTESTS.VIEW(data[index].key, ContestTab.OVERVIEW) });
      }}
    />
  );
};
