import { FIFTEEN_MINUTES, FIVE_HOURS, MAX_DATE, MIN_DATE, ONE_HOUR } from '../config/constants';
import { ContestProblemBasicType, ContestTemplate, EditCreateContestType } from '../types';
import { roundTimestamp } from './index';

export const getContestStatus = (startTimestamp: number, endTimestamp: number) => {
  const currentDateMilliseconds = new Date().getTime();
  let contestStatus = 'upcoming';
  
  if (startTimestamp < currentDateMilliseconds && currentDateMilliseconds < endTimestamp) {
    contestStatus = 'live';
  } else if (currentDateMilliseconds > startTimestamp) {
    contestStatus = 'past';
  }
  return contestStatus;
};

export const adjustContest = (contest: EditCreateContestType): EditCreateContestType => {
  const startTimestamp = roundTimestamp(contest.settings.startTimestamp);
  const endTimestamp = Math.max(roundTimestamp(contest.settings.endTimestamp), startTimestamp);
  const frozenTimestamp = Math.min(Math.max(roundTimestamp(contest.settings.frozenTimestamp), startTimestamp), endTimestamp);
  const quietTimestamp = Math.min(Math.max(roundTimestamp(contest.settings.quietTimestamp), frozenTimestamp), endTimestamp);
  const problems: { [key: string]: ContestProblemBasicType & { name: string } } = {};
  Object.values(contest.problems).forEach(problem => {
    problems[problem.key] = {
      ...problem,
      startTimestamp: Math.min(Math.max(roundTimestamp(problem.startTimestamp), contest.settings.startTimestamp), contest.settings.endTimestamp),
      endTimestamp: Math.min(Math.max(roundTimestamp(problem.endTimestamp), problem.startTimestamp), contest.settings.endTimestamp),
    };
  });
  return {
    ...contest,
    settings: {
      ...contest.settings,
      startTimestamp,
      frozenTimestamp,
      quietTimestamp,
      endTimestamp,
    },
    problems,
  };
};

type ContestForTemplate = { settings: { startTimestamp: number, endTimestamp: number, frozenTimestamp: number, quietTimestamp: number, penalty: number } };
export const isEndlessContest = (contest: ContestForTemplate) => (
  contest.settings.startTimestamp === MIN_DATE.getTime() &&
  contest.settings.frozenTimestamp === MAX_DATE.getTime() &&
  contest.settings.quietTimestamp === MAX_DATE.getTime() &&
  contest.settings.endTimestamp === MAX_DATE.getTime() &&
  contest.settings.penalty === 0
);

export const isClassicContest = (contest: ContestForTemplate) => (
  contest.settings.frozenTimestamp === contest.settings.startTimestamp + FIVE_HOURS - ONE_HOUR &&
  contest.settings.quietTimestamp === contest.settings.startTimestamp + FIVE_HOURS - FIFTEEN_MINUTES &&
  contest.settings.endTimestamp === contest.settings.startTimestamp + FIVE_HOURS &&
  contest.settings.penalty === 20
);

export const getContestTemplate = (contest: ContestForTemplate): ContestTemplate => {
  if (isEndlessContest(contest)) {
    return ContestTemplate.ENDLESS;
  }
  if (isClassicContest(contest)) {
    return ContestTemplate.CLASSIC;
  }
  return ContestTemplate.CUSTOM;
};
