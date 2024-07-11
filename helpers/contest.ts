import { FIFTEEN_MINUTES, FIVE_HOURS, MAX_DATE, MIN_DATE, ONE_HOUR } from 'config/constants';
import {
  ContestProblemBasicType,
  ContestResponseDTO,
  ContestTemplate,
  EditContestProblemBasicType,
  EditCreateContestType,
} from 'types';
import { roundTimestamp } from './index';

export const adjustContest = (contest: EditCreateContestType, prevContest: EditCreateContestType): EditCreateContestType => {
  const startTimestamp = roundTimestamp(contest.settings.startTimestamp);
  const endTimestamp = Math.max(roundTimestamp(contest.settings.endTimestamp), startTimestamp);
  const frozenTimestamp = Math.min(
    Math.max(roundTimestamp(contest.settings.frozenTimestamp), startTimestamp),
    endTimestamp,
  );
  const quietTimestamp = Math.min(
    Math.max(roundTimestamp(contest.settings.quietTimestamp), frozenTimestamp),
    endTimestamp,
  );
  const problems: { [key: string]: ContestProblemBasicType & { name: string } } = {};
  Object.entries(contest.problems).forEach(([ problemJudgeKey, problem ]) => {
    let problemStartTimestamp = prevContest.problems[problemJudgeKey].startTimestamp
    === prevContest.settings.startTimestamp ? startTimestamp : problem.startTimestamp;
    problemStartTimestamp = Math.min(
      Math.max(roundTimestamp(problemStartTimestamp), contest.settings.startTimestamp),
      contest.settings.endTimestamp,
    );
    let problemEndTimestamp = prevContest.problems[problemJudgeKey].endTimestamp
    === prevContest.settings.endTimestamp ? endTimestamp : problem.endTimestamp;
    problemEndTimestamp = Math.min(
      Math.max(roundTimestamp(problemEndTimestamp), problemStartTimestamp),
      contest.settings.endTimestamp,
    );
    problems[problem.key] = {
      ...problem,
      startTimestamp: problemStartTimestamp,
      endTimestamp: problemEndTimestamp,
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

type ContestForTemplate = {
  settings: {
    startTimestamp: number,
    endTimestamp: number,
    frozenTimestamp: number,
    quietTimestamp: number,
    penalty: number
  }
};
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

export const parseContest = (contest: ContestResponseDTO): EditCreateContestType => {
  const problems: { [key: string]: EditContestProblemBasicType } = {};
  Object.values(contest.problems).forEach(problem => {
    problems[problem.key] = {
      key: problem.key,
      index: problem.index,
      judgeKey: problem.judgeKey,
      name: problem.name,
      points: problem.points,
      color: problem.color,
      startTimestamp: problem.startTimestamp,
      endTimestamp: problem.endTimestamp,
    };
  });
  
  const members = {
    administrators: Object.keys(contest.members.administrators),
    judges: Object.keys(contest.members.judges),
    contestants: Object.keys(contest.members.contestants),
    guests: Object.keys(contest.members.guests),
    spectators: Object.keys(contest.members.spectators),
  };
  
  return {
    description: contest.description,
    key: contest.key,
    members,
    name: contest.name,
    problems,
    settings: contest.settings,
    tags: contest.tags,
    status: contest.status,
  };
};
