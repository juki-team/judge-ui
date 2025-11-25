'use client';

import { getContestDateHeader, getContestNameHeader, getContestStatusHeader, PagedDataViewer } from 'components';
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

export const ContestsAllList = (props: Partial<PagedDataViewerProps<ContestSummaryListResponseDTO, ContestSummaryListResponseDTO>>) => {
  
  const companyKey = useUserStore(state => state.company.key);
  const columns = useMemo(() => [
    getContestStatusHeader(),
    getContestNameHeader(),
    getContestDateHeader(),
    // getContestContestantsHeader(),
  ] as DataViewerHeadersType<ContestSummaryListResponseDTO>[], []);
  
  return (
    <PagedDataViewer<ContestSummaryListResponseDTO, ContestSummaryListResponseDTO>
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        jukiApiManager.API_V2.contest.getSummaryList({
          params: {
            page,
            pageSize,
            filterUrl: toFilterUrl({ ...filter, companyKeys: companyKey, state: EntityState.RELEASED }),
            sortUrl: toSortUrl(sort),
          },
        }).url
      )}
      name={QueryParam.ALL_CONTESTS_TABLE}
      {...props}
    />
  );
};
