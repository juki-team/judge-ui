import { useJukiBase } from '@juki-team/base-ui';
import { DataViewer } from 'components';
import { DEFAULT_DATA_VIEWER_PROPS } from 'config/constants';
import { searchParamsObjectTypeToQuery } from 'helpers';
import { useDataViewerRequester2, useRouter } from 'hooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ContentsResponseType, DataViewerHeadersType, GetRecordKeyType, GetUrl, ReactNodeOrFunctionType } from 'types';

interface PagedDataViewerPros<T, V = T> {
  headers: DataViewerHeadersType<T>[],
  name: string,
  toRow?: (row: V, index: number) => T,
  url: GetUrl,
  refreshInterval?: number,
  extraNodes?: ReactNodeOrFunctionType[],
  getRowKey?: GetRecordKeyType<T>
}

export const PagedDataViewer = <T, V = T>({
  headers,
  name,
  toRow,
  url,
  refreshInterval,
  extraNodes,
  getRowKey,
}: PagedDataViewerPros<T, V>) => {
  
  const { queryObject, replace } = useRouter();
  const { viewPortSize } = useJukiBase();
  const {
    data: response,
    request,
    setLoaderStatusRef,
  } = useDataViewerRequester2<ContentsResponseType<V>>(url, { refreshInterval });
  const [_, setRender] = useState(Date.now()); // TODO: Fix the render of DataViewer
  useEffect(() => {
    setTimeout(() => setRender(Date.now()), 100);
  }, [response]);
  
  const lastTotalRef = useRef(0);
  
  lastTotalRef.current = response?.success ? response.meta.totalElements : lastTotalRef.current;
  
  const setSearchParamsObject = useCallback(params => replace({ query: searchParamsObjectTypeToQuery(params) }), []);
  
  const data: V[] = (response?.success ? response.contents : []);
  
  return (
    <DataViewer<T>
      headers={headers}
      data={toRow ? data.map(toRow) : data as unknown as T[]}
      rows={{ height: 68 }}
      request={request}
      rowsView={viewPortSize !== 'sm'}
      name={name}
      setLoaderStatusRef={setLoaderStatusRef}
      extraNodes={extraNodes}
      extraNodesFloating
      searchParamsObject={queryObject}
      setSearchParamsObject={setSearchParamsObject}
      pagination={{ total: lastTotalRef.current, pageSizeOptions: [16, 32, 64, 128, 256, 512] }}
      getRecordKey={getRowKey}
      {...DEFAULT_DATA_VIEWER_PROPS}
    />
  );
};
