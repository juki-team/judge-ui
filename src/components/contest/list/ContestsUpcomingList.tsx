'use client';

import { getContestDateHeader, getContestNameHeader, PagedDataViewer } from 'components';
import { jukiApiManager } from 'config';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useUserStore } from 'hooks';
import { useMemo } from 'react';
import {
  ContestSummaryListResponseDTO,
  DataViewerHeadersType,
  EntityState,
  PagedDataViewerProps,
  QueryParam,
} from 'types';

export const ContestsUpcomingList = (props: Partial<PagedDataViewerProps<ContestSummaryListResponseDTO, ContestSummaryListResponseDTO>>) => {
  
  const companyKey = useUserStore(state => state.company.key);
  const columns: DataViewerHeadersType<ContestSummaryListResponseDTO>[] = useMemo(() => [
    getContestNameHeader(),
    getContestDateHeader(),
    // getContestContestantsHeader(),
  ], []);
  
  return (
    <PagedDataViewer<ContestSummaryListResponseDTO, ContestSummaryListResponseDTO>
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        jukiApiManager.API_V2.contest.getSummaryList({
          params: {
            page,
            pageSize,
            filterUrl: toFilterUrl({
              ...filter,
              companyKeys: companyKey,
              state: EntityState.RELEASED,
              status: 'upcoming',
            }),
            sortUrl: toSortUrl(sort),
          },
        }).url
      )}
      name={QueryParam.UPCOMING_CONTESTS_TABLE}
      {...props}
    />
  );
};
