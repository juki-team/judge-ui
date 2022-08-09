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
  MY_SUBMISSIONS = 'my-submissions',
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
  MY_SUBMISSIONS = 'my-submissions',
  CLARIFICATIONS = 'clarifications',
  SUBMISSIONS = 'submissions',
  TIMING = 'timing',
  SETUP = 'setup',
  ARCHIVE = 'archive',
  JUDGE = 'judge',
  MEMBERS = 'members',
}

export type ContestParamsType = { key: string, tab: ContestTab, subTab?: string, subSubTab?: ProblemTab };

export enum ProfileTab {
  PROFILE = 'profile',
  SETTINGS = 'settings',
  SUBMISSIONS = 'submissions',
  CONTESTS = 'contests'
}

export type SearchParams = { [key: string]: Array<number | string> };
