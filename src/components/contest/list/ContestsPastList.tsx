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

export const ContestsPastList = (props: Partial<PagedDataViewerProps<ContestSummaryListResponseDto, ContestSummaryListResponseDto>>) => {
  
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
            filterUrl: toFilterUrl({ ...filter, organizationKeys: organizationKey, state: EntityState.RELEASED, status: 'past' }),
            sortUrl: toSortUrl(sort),
          },
        }).url
      )}
      name={QueryParam.PAST_CONTESTS_TABLE}
      {...props}
    />
  );
};
