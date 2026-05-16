'use client';

import { getContestDateHeader, getContestNameHeader, PagedDataViewer, useUserStore } from '@juki-team/base-ui';
import { jukiApiManager } from '@juki-team/base-ui/settings';
import { toFilterUrl, toSortUrl } from '@juki-team/base-ui/helpers';
import { useMemo } from 'react';
import { QueryParam } from 'types';
import { type DataViewerHeadersType, type PagedDataViewerProps } from '@juki-team/base-ui/types';
import { type ContestSummaryListResponseDTO } from '@juki-team/commons/dto';
import { EntityState } from '@juki-team/commons/enums';

export const ContestsLiveList = (props: Partial<PagedDataViewerProps<ContestSummaryListResponseDTO, ContestSummaryListResponseDTO>>) => {
  
  const companyKey = useUserStore(state => state.organization.key);
  const columns: DataViewerHeadersType<ContestSummaryListResponseDTO>[] = useMemo(() => [
    getContestNameHeader(),
    getContestDateHeader(),
    // getContestContestantsHeader(),
  ], []);
  
  return (
    <PagedDataViewer<ContestSummaryListResponseDTO, ContestSummaryListResponseDTO>
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        jukiApiManager.apiV2.contest.getSummaryList({
          params: {
            page,
            pageSize,
            filterUrl: toFilterUrl({ ...filter, companyKeys: companyKey, state: EntityState.RELEASED, status: 'live' }),
            sortUrl: toSortUrl(sort),
          },
        }).url
      )}
      name={QueryParam.LIVE_CONTESTS_TABLE}
      {...props}
    />
  );
};
