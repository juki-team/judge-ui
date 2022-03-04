import { Status } from '../types';

export { isStringJson, isObjectJson } from '@bit/juki-team.juki.commons';
export { classNames, downloadBlobAsFile, getSearchParamsObject, request, consoleWarn, settings } from '@bit/juki-team.juki.base-ui';

export const isOrHas = (value: string | string[] | undefined, v: string) => {
  return value === v || (Array.isArray(value) && value.includes(v));
};

export const buttonLoaderLink = (fun) => async setLoader => {
  const now = new Date().getTime();
  setLoader([now, Status.LOADING]);
  await fun();
  setLoader([now, Status.SUCCESS]);
};

export const contestStatusCalculation = (startDate: Date, duration: number) => {
  const currentDateMilliseconds = new Date().getTime();
  const startContestDateMilliseconds = startDate.getTime();
  const endContestDateMilliseconds = startContestDateMilliseconds + duration;
  let contestStatus = 'upcoming';
  
  if (currentDateMilliseconds > startContestDateMilliseconds && currentDateMilliseconds < endContestDateMilliseconds) {
    contestStatus = 'live';
  } else if (currentDateMilliseconds > startContestDateMilliseconds) {
    contestStatus = 'past';
  }
  return contestStatus;
};

export * from './permissions';
export * from './routes';
