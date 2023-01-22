import { DataViewer } from 'components';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1, QueryParam } from 'config/constants';
import { searchParamsObjectTypeToQuery } from 'helpers';
import { useDataViewerRequester, useJukiBase, useRouter } from 'hooks';
import { useMemo } from 'react';
import { ContentsResponseType, ContestSummaryListResponseDTO, DataViewerHeadersType } from 'types';
import { contestantsColumn, contestNameColumn } from '../commons';

export const CompetitionsList = () => {
  const { user: { canCreateContest } } = useJukiBase();
  const {
    data: response,
    request,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponseType<ContestSummaryListResponseDTO>>(JUDGE_API_V1.CONTEST.LIST_ENDLESS());
  
  const columns: DataViewerHeadersType<ContestSummaryListResponseDTO>[] = useMemo(() => [
    contestNameColumn(true),
    contestantsColumn(),
  ], []);
  
  const { queryObject, push } = useRouter();
  
  const data: ContestSummaryListResponseDTO[] = (response?.success ? response?.contents : []);
  
  return (
    <DataViewer<ContestSummaryListResponseDTO>
      headers={columns}
      data={data}
      rows={{ height: 72 }}
      request={request}
      setLoaderStatusRef={setLoaderStatusRef}
      name={QueryParam.ENDLESS_CONTESTS_TABLE}
      searchParamsObject={queryObject}
      setSearchParamsObject={(params) => push({ query: searchParamsObjectTypeToQuery(params) })}
      extraNodesFloating
      {...DEFAULT_DATA_VIEWER_PROPS}
    />
  );
};
