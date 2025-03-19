'use client';

import { getContestDateHeader, getContestNameHeader, PagedDataViewer } from 'components';
import { jukiApiSocketManager } from 'config';
import { toFilterUrl, toSortUrl } from 'helpers';
import { usePreload, useUserStore } from 'hooks';
import { useMemo } from 'react';
import { ContestSummaryListResponseDTO, DataViewerHeadersType, EntityState, QueryParam } from 'types';

export const ContestsEndlessList = () => {
  
  const companyKey = useUserStore(state => state.company.key);
  const columns: DataViewerHeadersType<ContestSummaryListResponseDTO>[] = useMemo(() => [
    getContestNameHeader(),
    getContestDateHeader(),
    // getContestContestantsHeader(),
  ], []);
  const preload = usePreload();
  
  return (
    <PagedDataViewer<ContestSummaryListResponseDTO, ContestSummaryListResponseDTO>
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        jukiApiSocketManager.API_V1.contest.getSummaryList({
          params: {
            page,
            pageSize,
            filterUrl: toFilterUrl({
              ...filter,
              companyKeys: companyKey,
              state: EntityState.RELEASED,
              status: 'endless',
            }),
            sortUrl: toSortUrl(sort),
          },
        }).url
      )}
      name={QueryParam.ENDLESS_CONTESTS_TABLE}
      refreshInterval={60000}
      cards={{ width: 320, expanded: true }}
      onRecordRender={({ data, index }) => {
        void preload(jukiApiSocketManager.API_V1.contest.getData({ params: { key: data[index].key, companyKey } }).url);
      }}
    />
  );
};
