'use client';

import { getContestDateHeader, getContestNameHeader, PagedDataViewer } from 'components';
import { jukiApiManager } from 'config';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useUserStore } from 'hooks';
import { useMemo } from 'react';
import {
  ContestSummaryListResponseDto,
  DataViewerHeadersType,
  EntityState,
  PagedDataViewerProps,
  QueryParam,
} from 'types';

export const ContestsEndlessList = (props: Partial<PagedDataViewerProps<ContestSummaryListResponseDto, ContestSummaryListResponseDto>>) => {
  
  const organizationKey = useUserStore(state => state.organization.key);
  const columns: DataViewerHeadersType<ContestSummaryListResponseDto>[] = useMemo(() => [
    getContestNameHeader(),
    getContestDateHeader(),
    // getContestContestantsHeader(),
  ], []);
  
  return (
    <PagedDataViewer<ContestSummaryListResponseDto, ContestSummaryListResponseDto>
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        jukiApiManager.API_V2.contest.getSummaryList({
          params: {
            page,
            pageSize,
            filterUrl: toFilterUrl({
              ...filter,
              organizationKeys: organizationKey,
              state: EntityState.RELEASED,
              status: 'endless',
            }),
            sortUrl: toSortUrl(sort),
          },
        }).url
      )}
      name={QueryParam.ENDLESS_CONTESTS_TABLE}
      {...props}
    />
  );
};
