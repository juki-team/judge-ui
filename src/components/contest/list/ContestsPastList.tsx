'use client';

import { getContestDateHeader, getContestNameHeader, PagedDataViewer } from 'components';
import { jukiApiSocketManager } from 'config';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useJukiUser } from 'hooks';
import { useMemo } from 'react';
import { ContestSummaryListResponseDTO, DataViewerHeadersType, EntityState, QueryParam } from 'types';

export const ContestsPastList = () => {
  
  const { company: { key: companyKey } } = useJukiUser();
  const columns: DataViewerHeadersType<ContestSummaryListResponseDTO>[] = useMemo(() => [
    getContestNameHeader(),
    getContestDateHeader(),
    // getContestContestantsHeader(),
  ], []);
  
  return (
    <PagedDataViewer<ContestSummaryListResponseDTO, ContestSummaryListResponseDTO>
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        jukiApiSocketManager.API_V1.contest.getSummaryList({
          params: {
            page,
            pageSize,
            filterUrl: toFilterUrl({ ...filter, companyKeys: companyKey, state: EntityState.RELEASED, status: 'past' }),
            sortUrl: toSortUrl(sort),
          },
        }).url
      )}
      name={QueryParam.PAST_CONTESTS_TABLE}
      refreshInterval={60000}
      cards={{ width: 320, expanded: true }}
    />
  );
};
