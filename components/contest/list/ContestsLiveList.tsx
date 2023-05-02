import { contestDateColumn, PagedDataViewer } from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useRouter } from 'hooks';
import { useMemo } from 'react';
import { ContestSummaryListResponseDTO, ContestTab, DataViewerHeadersType, QueryParam } from 'types';
import { contestantsColumn, contestNameColumn } from '../commons';

export const ContestsLiveList = () => {
  
  const columns: DataViewerHeadersType<ContestSummaryListResponseDTO>[] = useMemo(() => [
    contestNameColumn(false),
    contestDateColumn(),
    contestantsColumn(),
  ], []);
  const { push } = useRouter();
  
  return (
    <PagedDataViewer<ContestSummaryListResponseDTO, ContestSummaryListResponseDTO>
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        JUDGE_API_V1.CONTEST.LIST(page, pageSize, toFilterUrl({ ...filter, state: 'live' }), toSortUrl(sort))
      )}
      name={QueryParam.LIVE_CONTESTS_TABLE}
      refreshInterval={60000}
      cards={{ width: 320, expanded: true }}
      onRecordClick={async ({ isCard, data, index }) => {
        if (isCard) {
          await push({ pathname: ROUTES.CONTESTS.VIEW(data[index].key, ContestTab.OVERVIEW) });
        }
      }}
    />
  );
};
