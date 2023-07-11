import { PagedDataViewer } from 'components';
import { JUDGE_API_V1, ROUTES } from 'config/constants';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useRouter } from 'hooks';
import { useMemo } from 'react';
import { ContestSummaryListResponseDTO, ContestTab, DataViewerHeadersType, QueryParam } from 'types';
import { contestantsColumn, contestEndDateColumn, contestNameColumn, contestStartDateColumn } from '../commons';

export const ContestsPastList = () => {
  
  const columns: DataViewerHeadersType<ContestSummaryListResponseDTO>[] = useMemo(() => [
    contestNameColumn(false),
    contestStartDateColumn(),
    contestEndDateColumn(),
    contestantsColumn(),
  ], []);
  const { push } = useRouter();
  
  return (
    <PagedDataViewer<ContestSummaryListResponseDTO, ContestSummaryListResponseDTO>
      getRecordStyle={() => ({ cursor: 'pointer' })}
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        JUDGE_API_V1.CONTEST.LIST(page, pageSize, toFilterUrl({ ...filter, state: 'past' }), toSortUrl(sort))
      )}
      name={QueryParam.PAST_CONTESTS_TABLE}
      refreshInterval={60000}
      cards={{ width: 320, expanded: true }}
      onRecordClick={async ({ data, index }) => {
        await push({ pathname: ROUTES.CONTESTS.VIEW(data[index].key, ContestTab.OVERVIEW) });
      }}
    />
  );
};
