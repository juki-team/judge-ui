import {
  ContentResponseType,
  ContentsResponseType,
  ErrorCode,
  ErrorResponseType,
  NewNotificationType,
  NotificationType,
  RequestFilterType,
  SetLoaderStatusOnClickType,
  Status,
} from 'types';
import { consoleWarn } from './index';

export const actionLoaderWrapper = async <T extends ContentResponseType<any> | ContentsResponseType<any>>({
  request,
  addNotification,
  setLoader,
  onError,
  onSuccess,
}: {
  request: () => Promise<ErrorResponseType | T>,
  addNotification: (props: NewNotificationType) => void,
  setLoader?: SetLoaderStatusOnClickType,
  onSuccess?: (result: T) => void,
  onError?: (result: ErrorResponseType) => void
}) => {
  
  const timeStamp = new Date().getTime();
  setLoader?.(Status.LOADING, timeStamp);
  const result = await request();
  if (result) {
    if (result.success === true) {
      // setLoader?.(prevState => prevState[1] === timeStamp ? [Status.SUCCESS, timeStamp] : prevState);
      setLoader?.(Status.SUCCESS);
      await onSuccess(result);
    } else {
      let setError = true;
      setLoader?.(Status.ERROR);
      // if (setLoader) {
      //   setError = false;
      //   setLoader((prevState) => {
      //     if (!setError && prevState[1] === timeStamp) {
      //       setError = true;
      //       if (!result.errors.some(({ code }) => code === ErrorCode.ERR9997)) {
      //         return [Status.ERROR, timeStamp];
      //       } else {
      //         return [Status.NONE, timeStamp];
      //       }
      //     }
      //     return prevState;
      //   });
      // }
      if (!result.errors.some(({ code }) => code === ErrorCode.ERR9997)) {
        addNotification({ type: NotificationType.ERROR, message: result.message });
      }
      if (setError) {
        // if (result.errorCode === 'ERR9901') { // Unauthorized user
        //   dispatch(clearRedux());
        // }
        onError?.(result);
      }
    }
  } else {
    consoleWarn({ result, message: 'actionLoaderWrapper error' });
  }
};

export const toFilterUrl = (filter: RequestFilterType) => {
  let filterUrl = '';
  Object.entries(filter).forEach(([key, value]) => {
    if (filterUrl) {
      filterUrl += '&';
    }
    filterUrl += `${key}=${encodeURIComponent(value.toString())}`;
  });
  return filterUrl;
};
