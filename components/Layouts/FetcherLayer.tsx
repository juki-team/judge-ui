import { ErrorResponseType } from '@juki-team/commons';
import { LoadingIcon } from 'components';
import { renderReactNodeOrFunction, renderReactNodeOrFunctionP1 } from 'helpers';
import { ReactNodeOrFunctionP1Type, ReactNodeOrFunctionType } from 'types';
import { ContentResponseType, ContentsResponseType } from '../../types';

interface FetcherLayerProps<T extends (ContentResponseType<any> | ContentsResponseType<any>)> {
  isLoading: boolean,
  data: T | ErrorResponseType,
  error: ReactNodeOrFunctionType,
  children: ReactNodeOrFunctionP1Type<T>,
}

export const FetcherLayer = <T extends (ContentResponseType<any> | ContentsResponseType<any>), >({
  isLoading,
  data,
  error,
  children,
}: FetcherLayerProps<T>) => {
  
  if (isLoading) {
    return (
      <div className="jk-col extend">
        <LoadingIcon size="very-huge" />
      </div>
    );
  }
  if (data.success) {
    return <>{renderReactNodeOrFunctionP1(children, data)}</>;
  }
  return <>{renderReactNodeOrFunction(error)}</>;
};
