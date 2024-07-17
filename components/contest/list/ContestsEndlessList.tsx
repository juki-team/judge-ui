import { getContestDateHeader, getContestNameHeader, PagedDataViewer } from 'components';
import { jukiSettings } from 'config';
import { toFilterUrl, toSortUrl } from 'helpers';
import { useJukiUser } from 'hooks';
import { useMemo } from 'react';
import { ContestSummaryListResponseDTO, DataViewerHeadersType, QueryParam } from 'types';

export const ContestsEndlessList = () => {
  
  const { company: { key: companyKey } } = useJukiUser();
  const columns: DataViewerHeadersType<ContestSummaryListResponseDTO>[] = useMemo(() => [
    getContestNameHeader(),
    getContestDateHeader(),
    // getContestContestantsHeader(),
  ], []);
  
  return (
    <PagedDataViewer<ContestSummaryListResponseDTO, ContestSummaryListResponseDTO>
      headers={columns}
      getUrl={({ pagination: { page, pageSize }, filter, sort }) => (
        jukiSettings.API.contest.getSummaryList({
          params: {
            page,
            size: pageSize,
            filterUrl: toFilterUrl({ ...filter, companyKeys: companyKey, status: 'endless' }),
            sortUrl: toSortUrl(sort),
          },
        }).url
      )}
      name={QueryParam.ENDLESS_CONTESTS_TABLE}
      refreshInterval={60000}
      cards={{ width: 320, expanded: true }}
    />
  );
};
