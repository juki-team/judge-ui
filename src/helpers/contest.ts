import { jukiApiManager } from 'config';
import { FIFTEEN_MINUTES, FIVE_HOURS, MAX_DATE, MIN_DATE, ONE_HOUR } from 'config/constants';
import type { ContentResponseType, UpsertContestDto, UpsertContestDtoUI, UpsertContestProblemDtoUI } from 'types';
import { ContestTemplate } from 'types';
import type { ContestDataUI } from '../components/contest/view/types';
import { cleanRequest, getMetaHeaders, isGlobalContest, roundTimestamp } from './index';

export const adjustContest = (contest: UpsertContestDtoUI, prevContest: UpsertContestDtoUI): UpsertContestDtoUI => {
  const startsAt = roundTimestamp(contest.settings.startsAt);
  const endsAt = Math.max(roundTimestamp(contest.settings.endsAt), startsAt);
  const frozenAt = Math.min(
    Math.max(roundTimestamp(contest.settings.frozenAt), startsAt),
    endsAt,
  );
  const silencedAt = Math.min(
    Math.max(roundTimestamp(contest.settings.silencedAt), frozenAt),
    endsAt,
  );
  const problems: UpsertContestDtoUI['problems'] = {};
  Object.entries(contest.problems).forEach(([ problemJudgeKey, problem ]) => {
    let problemStartTimestamp = prevContest.problems[problemJudgeKey].startsAt
    === prevContest.settings.startsAt ? startsAt : problem.startsAt;
    problemStartTimestamp = Math.min(
      Math.max(roundTimestamp(problemStartTimestamp), contest.settings.startsAt),
      contest.settings.endsAt,
    );
    let problemEndTimestamp = prevContest.problems[problemJudgeKey].endsAt
    === prevContest.settings.endsAt ? endsAt : problem.endsAt;
    problemEndTimestamp = Math.min(
      Math.max(roundTimestamp(problemEndTimestamp), problemStartTimestamp),
      contest.settings.endsAt,
    );
    problems[problem.key] = {
      ...problem,
      startsAt: problemStartTimestamp,
      endsAt: problemEndTimestamp,
    };
  });
  
  return {
    ...contest,
    settings: {
      ...contest.settings,
      startsAt,
      frozenAt,
      silencedAt,
      endsAt,
    },
    problems,
  };
};

type ContestForTemplate = {
  settings: {
    startsAt: number,
    endsAt: number,
    frozenAt: number,
    silencedAt: number,
    penalty: number
  }
};
export const isEndlessContest = (contest: ContestForTemplate) => (
  contest.settings.startsAt === MIN_DATE.getTime() &&
  contest.settings.frozenAt === MAX_DATE.getTime() &&
  contest.settings.silencedAt === MAX_DATE.getTime() &&
  contest.settings.endsAt === MAX_DATE.getTime() &&
  contest.settings.penalty === 0
);

export const isClassicContest = (contest: ContestForTemplate) => (
  contest.settings.frozenAt === contest.settings.startsAt + FIVE_HOURS - ONE_HOUR &&
  contest.settings.silencedAt === contest.settings.startsAt + FIVE_HOURS - FIFTEEN_MINUTES &&
  contest.settings.endsAt === contest.settings.startsAt + FIVE_HOURS &&
  contest.settings.penalty === 20
);

export const getContestTemplate = (contest: ContestForTemplate): ContestTemplate => {
  if (isEndlessContest(contest)) {
    return ContestTemplate.ENDLESS;
  }
  if (isClassicContest(contest)) {
    return ContestTemplate.CLASSIC;
  }
  if (isGlobalContest(contest.settings)) {
    return ContestTemplate.GLOBAL;
  }
  return ContestTemplate.CUSTOMIZED;
};

export const toUpsertContestDtoUI = (contest: ContestDataUI): UpsertContestDtoUI => {
  const problems: { [key: string]: UpsertContestProblemDtoUI } = {};
  Object.values(contest.problems).forEach(problem => {
    problems[problem.key] = {
      key: problem.key,
      judge: problem.judge,
      index: problem.index,
      name: problem.name,
      points: problem.points,
      color: problem.color,
      startsAt: problem.startsAt,
      endsAt: problem.endsAt,
      tags: problem.tags,
      organization: problem.organization,
      prerequisites: problem.prerequisites,
      maxAcceptedUsers: problem.maxAcceptedUsers,
      group: problem.group || '',
    };
  });
  
  return {
    description: contest.description,
    members: contest.members,
    name: contest.name,
    problems,
    settings: contest.settings,
    tags: Array.isArray(contest.tags) ? contest.tags : [],
    owner: contest.owner,
    state: contest.state,
    groups: contest.groups || {},
  };
};

export const toUpsertContestDto = (entity: UpsertContestDtoUI): UpsertContestDto => {
  
  const problems: UpsertContestDto['problems'] = {};
  for (const problem of Object.values(entity.problems)) {
    problems[problem.key] = {
      color: problem.color,
      endsAt: problem.endsAt,
      index: problem.index,
      key: problem.key,
      points: problem.points,
      startsAt: problem.startsAt,
      prerequisites: problem.prerequisites?.map(prerequisite => ({ ...prerequisite })) || [],
      maxAcceptedUsers: problem.maxAcceptedUsers || 0,
      group: problem.group || '',
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
      startsAt: entity.settings?.startsAt ?? 0,
      frozenAt: entity.settings?.frozenAt ?? 0,
      silencedAt: entity.settings?.silencedAt ?? 0,
      endsAt: entity.settings?.endsAt ?? 0,
      scoreboardLocked: entity.settings?.scoreboardLocked ?? true,
      upsolvingEnabled: entity.settings?.upsolvingEnabled ?? false,
    },
    tags: entity.tags ?? [],
    groups: entity.groups ?? {},
  };
};

export async function getContestMetadata(contestKey: string) {
  
  let result;
  try {
    const response = await fetch(
      jukiApiManager.API_V2.contest.getMetadata({ params: { key: contestKey } }).url,
      { headers: getMetaHeaders() });
    const text = await response.text();
    result = cleanRequest<ContentResponseType<{
      title: string,
      description: string,
      cover: string
    }>>(text);
  } catch (error) {
    console.error('error on generateMetadata', error);
  }
  
  const { title, description, cover } = result?.success ? result.content : { title: '', description: '', cover: '' };
  
  return { title, description, cover };
}
