import { useRouter } from 'next/router';
import { useCallback } from 'react';
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

export const roundTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  date.setSeconds(0, 0);
  return date.getTime();
};

export const disableOutOfRange = (date, start, end) => ({
  year: !date.isWithinInterval({
    start: start.startOfYear(),
    end: end.endOfYear(),
  }, '[]'),
  month: !date.isWithinInterval({
    start: start.startOfMonth(),
    end: end.endOfMonth(),
  }, '[]'),
  day: !date.isWithinInterval({
    start: start.startOfDay(),
    end: end.endOfDay(),
  }, '[]'),
  hours: !date.isWithinInterval({
    start: start.startOfHour(),
    end: end.endOfHour(),
  }, '[]'),
  minutes: !date.isWithinInterval({
    start: start.startOfMinute(),
    end: end.endOfMinute(),
  }, '[]'),
  seconds: !date.isWithinInterval({
    start: start.startOfSecond(),
    end: end.endOfSecond(),
  }, '[]'),
});

export { consoleWarn, isStringJson, isObjectJson, splitTime, indexToLetters, getProblemJudgeKey } from '@juki-team/commons';
export {
  classNames,
  downloadBlobAsFile,
  getSearchParamsObject,
  renderReactNodeOrFunction,
  renderReactNodeOrFunctionP1,
  authorizedRequest,
  cleanRequest,
  settings,
  toBlob,
} from '@juki-team/base-ui';

export const useDateFormat = () => {
  const { locale } = useRouter();
  const dtf = useCallback((date: Date | number) => {
    const dtf = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeStyle: 'medium' });
    return dtf.format(date);
  }, [locale]);
  const rlt = useCallback((date: number, unit: Intl.RelativeTimeFormatUnit) => {
    const rtf = new Intl.RelativeTimeFormat(locale);
    return rtf.format(date, unit);
  }, [locale]);
  return { dtf, rlt };
};

export * from './contest';
export * from './notify';
export * from './problem';
export * from './permissions';
export * from './routes';
export * from './services';
