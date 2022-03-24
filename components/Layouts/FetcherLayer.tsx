import { LoadingIcon } from 'components';
import { renderReactNodeOrFunction } from 'helpers';
import { ReactNodeOrFunctionType } from 'types';

interface FetcherLayerProps<T> {
  isLoading: boolean,
  data: T,
  error: ReactNodeOrFunctionType,
  children: ReactNodeOrFunctionType<T>,
}

export const FetcherLayer = <T, >({ isLoading, data, error, children }: FetcherLayerProps<T>) => {
  
  if (isLoading) {
    return (
      <div className="jk-row filled">
        <div className="jk-col">
          <LoadingIcon size="huge" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return renderReactNodeOrFunction(error);
  }
  
  return renderReactNodeOrFunction(children, data);
};
