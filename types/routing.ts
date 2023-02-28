export enum QueryParam {
  DIALOG = 'dg',
  USER_PREVIEW = 'up',
  SUBMISSION_VIEW = 'sv',
  // tables
  MY_STATUS_TABLE = 'mst',
  STATUS_TABLE = 'sst',
  ALL_SUBMISSIONS_TABLE = 'ast',
  PROFILE_SUBMISSIONS_TABLE = 'pst',
  ALL_USERS_TABLE = 'aut',
  ECS_DEFINITIONS_TASK_TABLE = 'edt',
  ECS_TASKS_TABLE = 'ett',
  LOGGED_USERS_TABLE = 'lut',
  // contests
  ALL_CONTESTS_TABLE = 'act',
  ENDLESS_CONTESTS_TABLE = 'ect',
  LIVE_CONTESTS_TABLE = 'lct',
  UPCOMING_CONTESTS_TABLE = 'uct',
  PAST_CONTESTS_TABLE = 'pct',
  //
  SCOREBOARD_TABLE = 'sdt',
  PROBLEMS_TABLE = 'pmt',
  RANKING_TABLE = 'rgt',
  // courses
  COURSES_TABLE = 'cst',
  // table queries
  PAGE_TABLE = 'p',
  PAGE_SIZE_TABLE = 'z',
  SORT_TABLE = 's',
  FILTER_TABLE = 'f',
  VIEW_MODE_TABLE = 'v',
}

export enum OpenDialog {
  WELCOME = 'w',
  SIGN_IN = 'si',
  SIGN_UP = 'sup',
}

export enum AdminTab {
  SUBMISSIONS = 'submissions',
  RESET_PASSWORD = 'reset-password',
  FILES_MANAGEMENT = 'files-management',
  SQS_MANAGEMENT = 'sqs-management',
  MAIL_MANAGEMENT = 'mail-management',
  
  USERS_MANAGEMENT = 'users-management',
  ALL_USERS = 'all-users',
  LOGGED_USERS = 'logged-users',
  
  RUNNERS_MANAGEMENT = 'runners-management',
  RUNNERS_SETTINGS = 'runners-settings',
  ECS_TASKS_MANAGEMENT = 'ecs-task-management',
  ECS_DEFINITIONS_TASK_MANAGEMENT = 'ecs-definitions-management',
}

export enum ProblemTab {
  STATEMENT = 'statement',
  EDITOR = 'editor',
  MY_SUBMISSIONS = 'my-submissions',
  SUBMISSIONS = 'submissions',
  TESTS = 'tests',
  // RANKING = 'ranking',
  // STATISTICS = 'statistics',
  SETUP = 'setup',
  EDITORIAL = 'editorial',
}

export enum ContestTab {
  OVERVIEW = 'overview',
  PROBLEMS = 'problems',
  PROBLEM = 'problem',
  SCOREBOARD = 'scoreboard',
  MY_SUBMISSIONS = 'my-submissions',
  CLARIFICATIONS = 'clarifications',
  SUBMISSIONS = 'submissions',
  SETUP = 'setup',
  // JUDGE = 'judge',
  MEMBERS = 'members',
}

export enum ContestsTab {
  ALL = 'all',
  ENDLESS = 'endless',
  LIVE = 'live',
  UPCOMING = 'upcoming',
  PAST = 'past',
}

export enum ProfileTab {
  PROFILE = 'profile',
  SETTINGS = 'settings',
  SUBMISSIONS = 'submissions',
  CONTESTS = 'contests',
}

export enum CourseTab {
  OVERVIEW = 'overview',
  UNITS = 'units',
}

export enum SheetTab {
  CONTENT = 'content',
  SETUP = 'setup',
}
