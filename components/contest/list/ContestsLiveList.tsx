import { PagedDataViewer } from 'components';
import { jukiSettings } from 'config';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useJukiUI } from 'hooks';
import { useMemo } from 'react';
import { ContestSummaryListResponseDTO, DataViewerHeadersType, QueryParam } from 'types';
import { contestantsColumn, contestEndDateColumn, contestNameColumn, contestStartDateColumn } from '../commons';

export const ContestsLiveList = () => {
  
  const { components: { Link } } = useJukiUI();
  
  const columns: DataViewerHeadersType<ContestSummaryListResponseDTO>[] = useMemo(() => [
    contestNameColumn(Link),
    contestStartDateColumn(),
    contestEndDateColumn(),
    contestantsColumn(),
  ], [ Link ]);
  
  return (
    <PagedDataViewer<ContestSummaryListResponseDTO, ContestSummaryListResponseDTO>
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        jukiSettings.API.contest.getSummaryList({
          params: {
            page,
            size: pageSize,
            filterUrl: toFilterUrl({ ...filter, state: 'live' }),
            sortUrl: toSortUrl(sort),
          },
        }).url
      )}
      name={QueryParam.LIVE_CONTESTS_TABLE}
      refreshInterval={60000}
      cards={{ width: 320, expanded: true }}
    />
  );
};
