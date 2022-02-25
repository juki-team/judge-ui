export enum ContestTimeStatus {
  UPCOMING = 'upcoming',
  LIVE = 'live',
  PAST = 'past'
}

export enum AdminTab {
  USERS = 'users',
  ATTEMPTS = 'attempts',
  REJUDGE = 'rejudge',
  RESET_PASSWORD = 'reset-password'
}

export enum ProblemTab {
  STATEMENT = 'statement',
  EDITOR = 'editor',
  SUBMISSIONS = 'submissions',
  TESTS = 'tests',
  RANKING = 'ranking',
  STATISTICS = 'statistics',
  SETUP = 'setup'
}

export type ProblemParamsType = { key: string, tab: ProblemTab };

export enum ContestTab {
  OVERVIEW = 'overview',
  PROBLEMS = 'problems',
  PROBLEM = 'problem',
  SCOREBOARD = 'scoreboard',
  SUBMISSIONS = 'submissions',
  CLARIFICATIONS = 'clarifications',
  STATUS = 'status',
  TIMING = 'timing',
  SETUP = 'setup',
  ARCHIVE = 'archive',
  JUDGE = 'judge'
}

export type ContestParamsType = { key: string, tab: ContestTab, subTab?: string, subSubTab?: ProblemTab };

export enum ProfileTab {
  PROFILE = 'profile',
  SETTINGS = 'settings',
  SUBMISSIONS = 'submissions',
  CONTESTS = 'contests'
}

export type SearchParams = { [key: string]: Array<number | string> };
