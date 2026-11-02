'use client';

import { getContestDateHeader, getContestNameHeader, getContestStatusHeader, PagedDataViewer } from 'components';
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

export const ContestsClassicList = (props: Partial<PagedDataViewerProps<ContestSummaryListResponseDto, ContestSummaryListResponseDto>>) => {
  
  const organizationKey = useUserStore(state => state.organization.key);
  const columns = useMemo(() => [
    getContestStatusHeader(),
    getContestNameHeader(),
    getContestDateHeader(),
    // getContestContestantsHeader(),
  ] as DataViewerHeadersType<ContestSummaryListResponseDto>[], []);
  
  return (
    <PagedDataViewer<ContestSummaryListResponseDto, ContestSummaryListResponseDto>
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        jukiApiManager.API_V2.contest.getSummaryList({
          params: {
            page,
            pageSize,
            filterUrl: toFilterUrl({ ...filter, companyKeys: organizationKey, state: EntityState.RELEASED }),
            sortUrl: toSortUrl(sort),
          },
        }).url
      )}
      name={QueryParam.CLASSIC_CONTESTS_TABLE}
      {...props}
    />
  );
};
