import { LoadingIcon } from 'components';
import { renderReactNodeOrFunction, renderReactNodeOrFunctionP1 } from 'helpers';
import { useFetcher } from 'hooks';
import { useEffect } from 'react';
import { KeyedMutator, SWRConfiguration } from 'swr';
import { ContentResponseType, ContentsResponseType, ReactNodeOrFunctionP1Type, ReactNodeOrFunctionType } from 'types';

interface FetcherLayerProps<T extends (ContentResponseType<any> | ContentsResponseType<any>)> {
  url: string,
  options?: SWRConfiguration,
  errorView?: ReactNodeOrFunctionType,
  children: ReactNodeOrFunctionP1Type<{ data: T, isLoading: boolean, error: any, mutate: KeyedMutator<any> }>,
  onError?: (error?: any) => void,
}

export const FetcherLayer = <T extends (ContentResponseType<any> | ContentsResponseType<any>), >({
  url,
  options,
  errorView = null,
  children,
  onError,
}: FetcherLayerProps<T>) => {
  const { isLoading, data, error, mutate } = useFetcher<T>(url, options);
  
  useEffect(() => {
    if (data?.success === false || error) {
      onError?.(error);
    }
  }, [data?.success, error]);
  
  if (isLoading) {
    return (
      <div className="jk-row jk-col extend">
        <LoadingIcon size="very-huge" />
      </div>
    );
  }
  if (data?.success) {
    return <>{renderReactNodeOrFunctionP1(children, { data, isLoading, error, mutate })}</>;
  }
  
  return <>{renderReactNodeOrFunction(errorView)}</>;
};
