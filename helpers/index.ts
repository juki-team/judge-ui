import { Status } from 'types';

export const isOrHas = (value: string | string[] | undefined, v: string) => {
  return value === v || (Array.isArray(value) && value.includes(v));
};

export const buttonLoaderLink = (fun) => async setLoader => {
  const now = new Date().getTime();
  setLoader([now, Status.LOADING]);
  await fun();
  setLoader([now, Status.SUCCESS]);
};

export { consoleWarn, isStringJson, isObjectJson, splitTime } from '@juki-team/commons';
export {
  classNames,
  downloadBlobAsFile,
  getSearchParamsObject,
  renderReactNodeOrFunction,
  renderReactNodeOrFunctionP1,
  authorizedRequest,
  cleanRequest,
  settings,
} from '@juki-team/base-ui';
export * from './contest';
export * from './permissions';
export * from './routes';
export * from './services';
