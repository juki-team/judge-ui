import { getContestDateHeader, getContestNameHeader, getContestStatusHeader, PagedDataViewer } from 'components';
import { jukiSettings } from 'config';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useJukiUser } from 'hooks';
import { useMemo } from 'react';
import { ContestSummaryListResponseDTO, DataViewerHeadersType, EntityState, QueryParam } from 'types';

export const ContestsAllList = () => {
  
  const { company: { key: companyKey } } = useJukiUser();
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
        jukiSettings.API.contest.getSummaryList({
          params: {
            page,
            pageSize,
            filterUrl: toFilterUrl({
              ...filter,
              companyKeys: companyKey,
              state: EntityState.RELEASED,
            }),
            sortUrl: toSortUrl(sort),
          },
        }).url
      )}
      name={QueryParam.ALL_CONTESTS_TABLE}
      refreshInterval={60000}
      cards={{ width: 320, expanded: true }}
    />
  );
};
