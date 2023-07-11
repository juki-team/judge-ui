import { ButtonLoaderOnClickType } from '@juki-team/base-ui';
import { getProblemJudgeKey } from '@juki-team/commons';
import { Judge, Status } from 'types';

export const isOrHas = (value: string | string[] | undefined, v: string) => {
  return value === v || (Array.isArray(value) && value.includes(v));
};

export const buttonLoaderLink = (fun: () => Promise<any>): ButtonLoaderOnClickType => async (setLoader) => {
  setLoader(Status.LOADING);
  await fun();
  setLoader(Status.SUCCESS);
};

export const roundTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  date.setSeconds(0, 0);
  return date.getTime();
};

export const getSimpleProblemJudgeKey = (judge: Judge, key: string, force?: boolean) => {
  if (judge === Judge.CUSTOMER || force) {
    return key;
  }
  return getProblemJudgeKey(judge, key);
};

export const disableOutOfRange = (date: Date, start: Date, end: Date) => ({
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

export {
  consoleWarn,
  isStringJson,
  isObjectJson,
  splitTime,
  indexToLetters,
  getProblemJudgeKey,
  lettersToIndex,
  humanFileSize,
  stringToArrayBuffer,
  getRandomString,
  mex,
  contentResponse,
} from '@juki-team/commons';

export {
  classNames,
  downloadBlobAsFile,
  renderReactNodeOrFunction,
  renderReactNodeOrFunctionP1,
  authorizedRequest,
  toBlob,
  handleShareMdPdf,
  downloadDataTableAsCsvFile,
  downloadJukiMarkdownAdPdf,
  downloadXlsxAsFile,
  downloadLink,
  cleanRequest,
  toFilterUrl,
  toSortUrl,
} from '@juki-team/base-ui';

export * from './commons';
export * from './contest';
export * from './routes';
