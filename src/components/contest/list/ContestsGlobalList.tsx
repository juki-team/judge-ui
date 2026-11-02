'use client';

import { getContestNameHeader, getContestTagsHeader, PagedDataViewer } from 'components';
import { jukiApiManager } from 'config';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useMemo } from 'react';
import {
  ContestSummaryListResponseDto,
  DataViewerHeadersType,
  EntityState,
  PagedDataViewerProps,
  QueryParam,
} from 'types';

export const ContestsGlobalList = (props: Partial<PagedDataViewerProps<ContestSummaryListResponseDto, ContestSummaryListResponseDto>>) => {
  
  const columns: DataViewerHeadersType<ContestSummaryListResponseDto>[] = useMemo(() => [
    getContestNameHeader(),
    // getContestDateHeader(),
    // getContestContestantsHeader(),
    getContestTagsHeader([]),
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
              state: EntityState.RELEASED,
              global: 'true',
            }),
            sortUrl: toSortUrl(sort),
          },
        }).url
      )}
      name={QueryParam.GLOBAL_CONTESTS_TABLE}
      {...props}
    />
  );
};
