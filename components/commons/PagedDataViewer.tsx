import { DataViewer } from 'components';
import { DEFAULT_DATA_VIEWER_PROPS } from 'config/constants';
import { searchParamsObjectTypeToQuery } from 'helpers';
import { useDataViewerRequester2, useRouter } from 'hooks';
import { useCallback, useRef } from 'react';
import { ContentsResponseType, DataViewerHeadersType, GetRowKeyType, GetUrl, ReactNodeOrFunctionType } from 'types';

interface PagedDataViewerPros<T, V> {
  headers: DataViewerHeadersType<T>[],
  name: string,
  toRow: (row: V, index: number) => T,
  url: GetUrl,
  refreshInterval?: number,
  extraButtons?: ReactNodeOrFunctionType,
  getRowKey?: GetRowKeyType<T>
}

export const PagedDataViewer = <T, V>({
  headers,
  name,
  toRow,
  url,
  refreshInterval,
  extraButtons,
  getRowKey,
}: PagedDataViewerPros<T, V>) => {
  
  const { queryObject, replace } = useRouter();
  
  const {
    data: response,
    request,
    setLoaderStatusRef,
  } = useDataViewerRequester2<ContentsResponseType<V>>(url, { refreshInterval });
  
  const lastTotalRef = useRef(0);
  
  lastTotalRef.current = response?.success ? response.meta.totalElements : lastTotalRef.current;
  
  const setSearchParamsObject = useCallback(params => replace({ query: searchParamsObjectTypeToQuery(params) }), []);
  
  const data: T[] = (response?.success ? response.contents : []).map(toRow);
  
  return (
    <DataViewer<T>
      headers={headers}
      data={data}
      rows={{ height: 68 }}
      request={request}
      name={name}
      setLoaderStatusRef={setLoaderStatusRef}
      extraButtons={extraButtons}
      searchParamsObject={queryObject}
      setSearchParamsObject={setSearchParamsObject}
      pagination={{ total: lastTotalRef.current, pageSizeOptions: [16, 32, 64, 128, 256, 512] }}
      getRowKey={getRowKey}
      {...DEFAULT_DATA_VIEWER_PROPS}
    />
  );
};
