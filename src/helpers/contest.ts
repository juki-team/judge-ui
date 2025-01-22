import { UpsertContestDTO } from '@juki-team/commons';
import { FIFTEEN_MINUTES, FIVE_HOURS, MAX_DATE, MIN_DATE, ONE_HOUR } from 'config/constants';
import { ContestDataResponseDTO, ContestTemplate, UpsertContestDTOUI, UpsertContestProblemDTOUI } from 'types';
import { roundTimestamp } from './index';

export const adjustContest = (contest: UpsertContestDTOUI, prevContest: UpsertContestDTOUI): UpsertContestDTOUI => {
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
  const problems: UpsertContestDTOUI['problems'] = {};
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

export const toUpsertContestDTOUI = (contest: ContestDataResponseDTO): UpsertContestDTOUI => {
  const problems: { [key: string]: UpsertContestProblemDTOUI } = {};
  console.log({ contest });
  Object.values(contest.problems).forEach(problem => {
    problems[problem.key] = {
      key: problem.key,
      judge: problem.judge,
      index: problem.index,
      name: problem.name,
      points: problem.points,
      color: problem.color,
      startTimestamp: problem.startTimestamp,
      endTimestamp: problem.endTimestamp,
      tags: problem.tags,
      company: problem.company,
    };
  });
  
  return {
    description: contest.description,
    members: contest.members,
    name: contest.name,
    problems,
    settings: contest.settings,
    tags: contest.tags,
    owner: contest.owner,
    state: contest.state,
  };
};

export const toUpsertContestDTO = (entity: UpsertContestDTOUI): UpsertContestDTO => {
  
  const problems: UpsertContestDTO['problems'] = {};
  for (const problem of Object.values(entity.problems)) {
    problems[problem.key] = {
      color: problem.color,
      endTimestamp: problem.endTimestamp,
      index: problem.index,
      key: problem.key,
      points: problem.points,
      startTimestamp: problem.startTimestamp,
    };
  }
  
  return {
    description: entity.description ?? '',
    members: {
      rankAdministrators: entity.members.rankAdministrators,
      administrators: Object.keys(entity.members.administrators),
      rankManagers: entity.members.rankManagers,
      managers: Object.keys(entity.members.managers),
      rankParticipants: entity.members.rankParticipants,
      participants: Object.keys(entity.members.participants),
      rankGuests: entity.members.rankGuests,
      guests: Object.keys(entity.members.guests),
      rankSpectators: entity.members.rankSpectators,
      spectators: Object.keys(entity.members.spectators),
    },
    name: entity.name ?? '',
    problems,
    settings: {
      clarifications: entity.settings?.clarifications ?? false,
      numberJudgeValidations: entity.settings?.numberJudgeValidations ?? 0,
      languages: entity.settings?.languages ?? [],
      penalty: entity.settings?.penalty ?? 0,
      timeToSolve: entity.settings?.timeToSolve ?? 0,
      startTimestamp: entity.settings?.startTimestamp ?? 0,
      frozenTimestamp: entity.settings?.frozenTimestamp ?? 0,
      quietTimestamp: entity.settings?.quietTimestamp ?? 0,
      endTimestamp: entity.settings?.endTimestamp ?? 0,
    },
    tags: entity.tags ?? [],
  };
};
