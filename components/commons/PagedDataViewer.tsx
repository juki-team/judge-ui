import { DataViewer } from 'components';
import { DEFAULT_DATA_VIEWER_PROPS, PAGE_SIZE_OPTIONS } from 'config/constants';
import { useDataViewerRequester, useJukiUI } from 'hooks';
import { useEffect, useRef, useState } from 'react';
import {
  ContentsResponseType,
  DataViewerHeadersType,
  DataViewerRequesterGetUrlType,
  GetRecordKeyType,
  GetRecordStyleType,
  OnRecordClickType,
  ReactNodeOrFunctionType,
} from 'types';

interface PagedDataViewerPros<T, V = T> {
  cards?: { height?: number, width?: number, expanded?: boolean },
  rows?: { height?: number, width?: number },
  headers: DataViewerHeadersType<T>[],
  name: string,
  toRow?: (row: V, index: number) => T,
  getUrl: DataViewerRequesterGetUrlType,
  refreshInterval?: number,
  extraNodes?: ReactNodeOrFunctionType[],
  getRowKey?: GetRecordKeyType<T>
  onRecordClick?: OnRecordClickType<T>,
  getRecordStyle?: GetRecordStyleType<T>;
  dependencies?: any[],
}

export const PagedDataViewer = <T extends { [key: string]: any }, V = T>(props: PagedDataViewerPros<T, V>) => {
  const {
    cards,
    rows = { height: 68 },
    headers,
    name,
    toRow,
    getUrl,
    refreshInterval,
    extraNodes,
    getRowKey,
    onRecordClick,
    dependencies = [],
    getRecordStyle,
  } = props;
  
  const { viewPortSize } = useJukiUI();
  const {
    data: response,
    request,
    setLoaderStatusRef,
    reload,
    refreshRef,
  } = useDataViewerRequester<ContentsResponseType<V>>(getUrl, { refreshInterval });
  
  useEffect(() => {
    if (dependencies.length) {
      reload();
    }
  }, dependencies);
  const [ _, setRender ] = useState(Date.now()); // TODO: Fix the render of DataViewer
  useEffect(() => {
    setTimeout(() => setRender(Date.now()), 100);
  }, [ response ]);
  
  const lastTotalRef = useRef(0);
  
  lastTotalRef.current = response?.success ? response.meta.totalElements : lastTotalRef.current;
  
  const data: V[] = (response?.success ? response.contents : []);
  
  return (
    <DataViewer<T>
      getRecordStyle={getRecordStyle}
      cards={cards}
      headers={headers}
      data={toRow ? data.map(toRow) : (data as unknown as T[])}
      rows={rows}
      request={request}
      rowsView={viewPortSize !== 'sm'}
      name={name}
      setLoaderStatusRef={setLoaderStatusRef}
      extraNodes={extraNodes}
      extraNodesFloating
      pagination={{ total: lastTotalRef.current, pageSizeOptions: PAGE_SIZE_OPTIONS }}
      getRecordKey={getRowKey}
      onRecordClick={onRecordClick}
      refreshRef={refreshRef}
      {...DEFAULT_DATA_VIEWER_PROPS}
    />
  );
};
