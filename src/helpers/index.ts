import {
  endOfDay,
  endOfHour,
  endOfMinute,
  endOfMonth,
  endOfSecond,
  endOfYear,
  isWithinInterval,
  startOfDay,
  startOfHour,
  startOfMinute,
  startOfMonth,
  startOfSecond,
  startOfYear,
} from '@juki-team/commons/helpers';

export const roundTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  date.setSeconds(0, 0);
  return date.getTime();
};

export const disableOutOfRange = (date: Date, start: Date, end: Date) => ({
  year: !isWithinInterval(date, {
    start: startOfYear(start),
    end: endOfYear(end),
  }, '[]'),
  month: !isWithinInterval(date, {
    start: startOfMonth(start),
    end: endOfMonth(end),
  }, '[]'),
  day: !isWithinInterval(date, {
    start: startOfDay(start),
    end: endOfDay(end),
  }, '[]'),
  hours: !isWithinInterval(date, {
    start: startOfHour(start),
    end: endOfHour(end),
  }, '[]'),
  minutes: !isWithinInterval(date, {
    start: startOfMinute(start),
    end: endOfMinute(end),
  }, '[]'),
  seconds: !isWithinInterval(date, {
    start: startOfSecond(start),
    end: endOfSecond(end),
  }, '[]'),
});

export * from './contest';
export * from './problems';
