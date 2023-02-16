import { downloadBlobAsFile } from '@juki-team/base-ui';
import { stringToArrayBuffer } from '@juki-team/commons';
import { Status } from 'types';
import { utils, write } from 'xlsx';

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

export const downloadXlsxAsFile = async (data: (string | number)[][], fileName: string, sheetName: string) => {
  const workBook = utils.book_new();
  workBook.Props = {
    Title: fileName,
    Subject: fileName,
    Author: 'Juki Judge',
    CreatedDate: new Date(),
  };
  workBook.SheetNames.push(sheetName);
  workBook.Sheets[sheetName] = utils.aoa_to_sheet(data);
  const workBookOut = write(workBook, { bookType: 'xlsx', type: 'binary' });
  const blob = new Blob([stringToArrayBuffer(workBookOut)], { type: 'application/octet-stream' });
  await downloadBlobAsFile(blob, fileName);
};

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
} from '@juki-team/commons';

export {
  classNames,
  downloadBlobAsFile,
  getSearchParamsObject,
  renderReactNodeOrFunction,
  renderReactNodeOrFunctionP1,
  authorizedRequest,
  settings,
  toBlob,
  handleShareMdPdf,
  downloadDataTableAsCsvFile,
  downloadJukiMarkdownAdPdf,
  downloadLink,
  cleanRequest,
  notifyResponse,
} from '@juki-team/base-ui';

export * from './contest';
export * from './problem';
export * from './routes';
export * from './services';
