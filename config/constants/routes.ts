import { AdminTab, ContestsTab, ContestTab, ProblemTab, ProfileTab } from '../../types';

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
  SIGN_UP = 'sup'
}

export const _TAB = ':tab';
export const _SUB_SUB_TAB = ':subSubTab?';

export const ROUTES = {
  ROOT: '/',
  PARAMS: {
    POSTS: 'posts',
    RESUME: 'resume',
    ABOUT: 'about',
    CONTEST: 'contest',
    PRINT_SCORE: 'printScore',
    CONTESTS: 'contests',
    PROBLEMS: 'problems',
    PROBLEM: 'problem',
    RANKING: 'ranking',
    ADMIN: 'admin',
    VIEW: 'view',
    CREATE: 'create',
    EDIT: 'edit',
    PROFILE: 'profile',
  },
  POSTS: {
    PAGE(key?: string) {
      return '/' + ROUTES.PARAMS.POSTS + (key ? ('/' + key) : '');
    },
  },
  RESUME: {
    PAGE: '/resume',
  },
  ABOUT: {
    PAGE: '/about',
  },
  CONTESTS: {
    LIST(tab: ContestsTab) {
      return ['', ROUTES.PARAMS.CONTESTS, tab].join('/');
    },
    VIEW(key: string, tab: ContestTab | typeof _TAB, subTab?: string, subSubTab?: ProblemTab | typeof _SUB_SUB_TAB) {
      return [
        '',
        ROUTES.PARAMS.CONTEST,
        ROUTES.PARAMS.VIEW,
        key,
        tab,
        ...(subTab ? [subTab] : []),
        ...(subSubTab ? [subSubTab] : []),
      ].join('/');
    },
    PRINT_SCORE(key: string) {
      return ['', ROUTES.PARAMS.CONTEST, ROUTES.PARAMS.VIEW, key, ROUTES.PARAMS.PRINT_SCORE].join('/');
    },
    CREATE() {
      return ['', ROUTES.PARAMS.CONTEST, ROUTES.PARAMS.CREATE].join('/');
    },
    EDIT(key: string) {
      return ['', ROUTES.PARAMS.CONTEST, ROUTES.PARAMS.EDIT, key].join('/');
    },
  },
  PROBLEMS: {
    LIST() {
      return '/' + ROUTES.PARAMS.PROBLEMS;
    },
    CREATE() {
      return ['', ROUTES.PARAMS.PROBLEM, ROUTES.PARAMS.CREATE].join('/');
    },
    VIEW(key: string, tab: ProblemTab | typeof _TAB) {
      return ['', ROUTES.PARAMS.PROBLEM, ROUTES.PARAMS.VIEW, key, tab].join('/');
    },
    EDIT(key: string) {
      return ['', ROUTES.PARAMS.PROBLEM, ROUTES.PARAMS.EDIT, key].join('/');
    },
  },
  RANKING: {
    PAGE() {
      return '/' + ROUTES.PARAMS.RANKING;
    },
  },
  ADMIN: {
    PAGE(tab: AdminTab | typeof _TAB) {
      return ['', ROUTES.PARAMS.ADMIN, tab].join('/');
    },
  },
  PROFILE: {
    PAGE(key: string, tab?: ProfileTab | typeof _TAB) {
      return ['', ROUTES.PARAMS.PROFILE, key, tab].join('/');
    },
  },
};
