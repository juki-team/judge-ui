import { contestDateColumn, PagedDataViewer } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useMemo } from 'react';
import { ContestSummaryListResponseDTO, DataViewerHeadersType, GetUrl, QueryParam } from 'types';
import { contestantsColumn, contestNameColumn } from '../commons';

export const ContestsUpcomingList = () => {
  
  const columns: DataViewerHeadersType<ContestSummaryListResponseDTO>[] = useMemo(() => [
    contestNameColumn(false),
    contestDateColumn(),
    contestantsColumn(),
  ], []);
  
  const url: GetUrl = ({ pagination: { page, pageSize }, filter, sort }) => (
    JUDGE_API_V1.CONTEST.LIST(page, pageSize, toFilterUrl({ ...filter, state: 'upcoming' }), toSortUrl(sort))
  );
  
  return (
    <PagedDataViewer<ContestSummaryListResponseDTO, ContestSummaryListResponseDTO>
      headers={columns}
      url={url}
      name={QueryParam.UPCOMING_CONTESTS_TABLE}
      refreshInterval={60000}
      cards={{ width: 320, expanded: true }}
    />
  );
};
