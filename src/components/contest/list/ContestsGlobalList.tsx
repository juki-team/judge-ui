'use client';

import { getContestNameHeader, getContestTagsHeader, PagedDataViewer } from '@juki-team/base-ui';
import { jukiApiManager } from '@juki-team/base-ui/settings';
import { toFilterUrl, toSortUrl } from '@juki-team/base-ui/helpers';
import { useMemo } from 'react';
import { QueryParam } from 'types';
import { type DataViewerHeadersType, type PagedDataViewerProps } from '@juki-team/base-ui/types';
import { type ContestSummaryListResponseDTO } from '@juki-team/commons/dto';
import { EntityState } from '@juki-team/commons/enums';

export const ContestsGlobalList = (props: Partial<PagedDataViewerProps<ContestSummaryListResponseDTO, ContestSummaryListResponseDTO>>) => {
  
  const columns: DataViewerHeadersType<ContestSummaryListResponseDTO>[] = useMemo(() => [
    getContestNameHeader(),
    // getContestDateHeader(),
    // getContestContestantsHeader(),
    getContestTagsHeader([]),
  ], []);
  
  return (
    <PagedDataViewer<ContestSummaryListResponseDTO, ContestSummaryListResponseDTO>
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        jukiApiManager.apiV2.contest.getSummaryList({
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
