import { DELETE, ERROR, GET, POST, PUT } from 'config/constants';
import {
  ContentResponseType,
  ContentsResponseType,
  ErrorCode,
  ErrorResponseType,
  NewNotificationType,
  NotificationType,
  SetLoaderStatusOnClickType,
  Status,
} from '../types';
import { consoleWarn, isStringJson } from './index';

export const clean = <T extends ContentResponseType<any> | ContentsResponseType<any>>(responseText: string): (ErrorResponseType | T) => {
  if (!isStringJson(responseText)) {
    // this occurs when the endpoint don't exits or server is down
    consoleWarn({ responseText });
    return { success: false, message: ERROR[ErrorCode.ERR9999].message, errors: [{ code: ErrorCode.ERR9999, detail: '' }] };
  }
  const responseJson = JSON.parse(responseText);
  console.log({ responseJson });
  if (responseJson.success) {
    if (Object.keys(responseJson).length === 3 && typeof responseJson.success === 'boolean' && typeof responseJson.message === 'string' && responseJson.content) {
      return {
        success: responseJson.success,
        message: responseJson.message,
        content: responseJson.content,
      } as T;
    } else if (Object.keys(responseJson).length === 3 && typeof responseJson.total === 'number' && Array.isArray(responseJson.list)) {
      return {
        success: true,
        message: '',
        meta: { page: 1, size: 1, totalElements: responseJson.total, sort: [] },
        contents: responseJson.list,
      } as T;
    }
    if (Object.keys(responseJson).length === 2 && typeof responseJson.object === 'object') {
      if (Array.isArray(responseJson.object.content) && typeof responseJson.object.size === 'number' && typeof responseJson.object.totalElements === 'number' && typeof responseJson.object.number === 'number') {
        return {
          success: true,
          message: '',
          meta: {
            page: responseJson.object.number,
            size: responseJson.object.size,
            totalElements: responseJson.object.totalElements,
            sort: [],
          },
          contents: responseJson.object.content,
        } as T;
      }
      return {
        success: true,
        message: '',
        content: responseJson.object,
      } as T;
    }
    if (Object.keys(responseJson).length === 1 && responseJson.success === true) {
      return { success: true, message: '', content: null } as T;
    }
    consoleWarn({ responseText });
    return { success: false, message: ERROR[ErrorCode.ERR9998].message, errors: [{ code: ErrorCode.ERR9998, detail: '' }] };
  } else {
    consoleWarn({ responseText });
    if (Object.keys(responseJson).length === 3 && typeof responseJson.message === 'string' && typeof responseJson.errorCode === 'string') {
      return { success: false, message: responseJson.message, errors: [{ code: responseJson.errorCode, detail: '' }] };
    }
    return { success: false, message: ERROR[ErrorCode.ERR9998].message, errors: [{ code: ErrorCode.ERR9998, detail: '' }] };
  }
};

export const authorizedRequest = async (url: string, method?: typeof POST | typeof PUT | typeof DELETE | typeof GET, body?: string, signal?: AbortSignal) => {
  console.log('authorizedRequest', { url, method });
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Accept', 'application/json');
  requestHeaders.set('Content-Type', 'application/json');
  return await fetch(url, {
    method: method ? method : GET,
    headers: requestHeaders,
    credentials: 'include',
    ...(body ? { body } : {}),
    ...(signal ? { signal } : {}),
  })
    .then((response: any) => {
      return response.text();
    })
    .catch((error) => {
      console.error('The Error:', error);
      if (signal?.aborted) {
        return JSON.stringify({
          success: false,
          message: ERROR[ErrorCode.ERR9997].message,
          errors: [{ code: ErrorCode.ERR9997, detail: `[${method}] ${url} \n ${body}` }],
        } as ErrorResponseType);
      }
      return JSON.stringify({
        success: false,
        message: ERROR[ErrorCode.ERR9998].message,
        errors: [{ code: ErrorCode.ERR9998, detail: `FETCH CATCH ERROR : ` + JSON.stringify({ method, url, body, error }) }],
      } as ErrorResponseType);
    });
};

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
  console.log({ result });
  if (result) {
    if (result.success === true) {
      setLoader?.(prevState => prevState[1] === timeStamp ? [Status.SUCCESS, timeStamp] : prevState);
      await onSuccess(result);
    } else {
      let setError = true;
      if (setLoader) {
        setError = false;
        setLoader((prevState) => {
          if (!setError && prevState[1] === timeStamp) {
            setError = true;
            if (result.errors.some(({ code }) => code === ErrorCode.ERR9997)) {
              return [Status.ERROR, timeStamp];
            } else {
              return [Status.NONE, timeStamp];
            }
          }
          return prevState;
        });
      }
      if (result.errors.some(({ code }) => code === ErrorCode.ERR9997)) {
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

