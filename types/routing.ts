export enum ContestTimeStatus {
  UPCOMING = 'upcoming',
  LIVE = 'live',
  PAST = 'past'
}

export enum AdminTab {
  LOGGED_USERS = 'logged-users',
  USERS = 'users',
  SUBMISSIONS = 'submissions',
  RESET_PASSWORD = 'reset-password',
  FILES_MANAGEMENT = 'files-management',
  SQS_MANAGEMENT = 'sqs-management',
  ECS_TASKS_MANAGEMENT = 'ecs-task-management',
  ECS_DEFINITIONS_TASK_MANAGEMENT = 'ecs-definitios-management',
}

export enum ProblemTab {
  STATEMENT = 'statement',
  EDITOR = 'editor',
  MY_SUBMISSIONS = 'my-submissions',
  SUBMISSIONS = 'submissions',
  TESTS = 'tests',
  RANKING = 'ranking',
  STATISTICS = 'statistics',
  SETUP = 'setup',
  EDITORIAL = 'editorial',
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
  SETUP = 'setup',
  JUDGE = 'judge',
  MEMBERS = 'members',
}

export enum ContestsTab {
  CONTESTS = 'contests',
  COMPETITIONS = 'competitions',
}

export type ContestParamsType = { key: string, tab: ContestTab, subTab?: string, subSubTab?: ProblemTab };

export enum ProfileTab {
  PROFILE = 'profile',
  SETTINGS = 'settings',
  SUBMISSIONS = 'submissions',
  CONTESTS = 'contests'
}

export type SearchParams = { [key: string]: Array<number | string> };
