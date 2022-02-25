import { ERROR } from '../config/constants';
import { ErrorCode, ErrorResponse, LoaderAction, NewNotificationType, NotificationType, Status } from '../types';
import { consoleWarn, isStringJson } from './index';

export const clean = (responseText: string): any => {
  if (!isStringJson(responseText)) {
    // this occurs when the endpoint don't exits or server is down
    consoleWarn({ responseText });
    return { success: Status.ERROR, message: ERROR[ErrorCode.ERR9999], errorCode: ErrorCode.ERR9999 };
  }
  const responseJson = JSON.parse(responseText);
  if (responseJson.success) {
    if (Object.keys(responseJson).length === 3 && typeof responseJson.total === 'number' && Array.isArray(responseJson.list)) {
      return { ...responseJson, success: Status.SUCCESS };
    }
    if (Object.keys(responseJson).length === 2 && typeof responseJson.object === 'object') {
      return { ...responseJson, success: Status.SUCCESS };
    }
    if (Object.keys(responseJson).length === 1 && responseJson.success === true) {
      return { success: Status.SUCCESS };
    }
    consoleWarn({ responseText });
    return { success: Status.ERROR, message: ERROR[ErrorCode.ERR9998], errorCode: ErrorCode.ERR9998 };
  } else {
    consoleWarn({ responseText });
    if (Object.keys(responseJson).length === 3 && typeof responseJson.message === 'string' && typeof responseJson.errorCode === 'string') {
      return { ...responseJson, success: Status.ERROR };
    }
    return { success: Status.ERROR, message: ERROR[ErrorCode.ERR9998], errorCode: ErrorCode.ERR9998 };
  }
};

export const GET = 'GET';
export const POST = 'POST';
export const PUT = 'PUT';
export const DELETE = 'DELETE';

export const authorizedRequest = async (url: string, method?: typeof POST | typeof PUT | typeof DELETE | typeof GET, body?: string, signal?: AbortSignal) => {
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
          message: ERROR[ErrorCode.ERR9997],
          errorCode: ErrorCode.ERR9997,
        });
      }
      return 'FETCH CATCH ERROR :' + JSON.stringify({ url, error });
    });
};

export const actionLoaderWrapper = async <T>(request: () => Promise<ErrorResponse | T>, addNotification: (props: NewNotificationType) => void, onSuccess: (result: T) => void, setLoader?: LoaderAction, onFailure?: (result: ErrorResponse) => void) => {
  const timeStamp = new Date().getTime();
  setLoader?.([timeStamp, Status.LOADING]);
  const result: any = await request();
  if (result) {
    if (result.success === Status.SUCCESS) {
      setLoader?.(prevState => prevState[0] === timeStamp ? [timeStamp, Status.SUCCESS] : prevState);
      await onSuccess(result);
    } else {
      let setError = true;
      if (setLoader) {
        setError = false;
        setLoader((prevState: any) => {
          if (!setError && prevState[0] === timeStamp) {
            setError = true;
            if (result.errorCode !== ErrorCode.ERR9997) {
              return [timeStamp, Status.ERROR];
            } else {
              return [timeStamp, Status.NONE];
            }
          }
          return prevState;
        });
      }
      if (result.errorCode !== ErrorCode.ERR9997) {
        addNotification({ type: NotificationType.ERROR, message: result.message });
      }
      if (setError) {
        // if (result.errorCode === 'ERR9901') { // Unauthorized user
        //   dispatch(clearRedux());
        // }
        onFailure?.(result);
      }
    }
  } else {
    consoleWarn({ result, message: 'actionLoaderWrapper error' });
  }
};

