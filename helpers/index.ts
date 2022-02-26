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

export const contestStatusCalculation = (contest) => {
  const currentDateMiliseconds = new Date().getTime();
  const startContestDateMiliseconds = new Date(contest.settings.start).getTime();
  const endContestDateMiliseconds = startContestDateMiliseconds + contest.timing.duration;
  let contestStatus = 'upcoming';
  
  if ( currentDateMiliseconds > startContestDateMiliseconds && currentDateMiliseconds < endContestDateMiliseconds ) {
    contestStatus= 'live';
  } else if ( currentDateMiliseconds > startContestDateMiliseconds ) {
    contestStatus = 'past'
  }
  return contestStatus;
}

export * from './permissions';
export * from './routes';
