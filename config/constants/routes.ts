import { AdminTab, ContestTab, ContestTimeStatus, ProblemTab, ProfileTab } from '../../types';

export enum QueryParam {
  OPEN_DIALOG = 'openDialog',
}

export enum OpenDialog {
  WELCOME = 'welcome',
  SIGN_IN = 'signIn',
  SIGN_UP = 'signUp'
}

export const _TYPE = ':type';
export const _KEY = ':key';
export const _TAB = ':tab';
export const _SUB_TAB = ':subTab?';
export const _SUB_SUB_TAB = ':subSubTab?';
export const PAGE = 'page';
export const PAGE_SIZE = 'size';

export const ADMIN_TAB: { [key in AdminTab]: { value: AdminTab, print: string } } = {
  [AdminTab.USERS]: { value: AdminTab.USERS, print: 'Users' },
  [AdminTab.ATTEMPTS]: { value: AdminTab.ATTEMPTS, print: 'Submissions' },
  [AdminTab.REJUDGE]: { value: AdminTab.REJUDGE, print: 'Rejudging' },
  [AdminTab.RESET_PASSWORD]: { value: AdminTab.REJUDGE, print: 'Reset Password' },
};

export const PROBLEM_TAB: { [key in ProblemTab]: { value: ProblemTab, print: string } } = {
  [ProblemTab.STATEMENT]: { value: ProblemTab.STATEMENT, print: 'statement' },
  [ProblemTab.EDITOR]: { value: ProblemTab.EDITOR, print: 'code editor' },
  [ProblemTab.SUBMISSIONS]: { value: ProblemTab.SUBMISSIONS, print: 'submissions' },
  [ProblemTab.TESTS]: { value: ProblemTab.TESTS, print: 'test cases' },
  [ProblemTab.RANKING]: { value: ProblemTab.RANKING, print: '' },
  [ProblemTab.STATISTICS]: { value: ProblemTab.STATISTICS, print: '' },
  [ProblemTab.SETUP]: { value: ProblemTab.SETUP, print: 'setup' },
};

export const CONTEST_TAB: { [key in ContestTab]: { value: ContestTab, print: string } } = {
  [ContestTab.OVERVIEW]: { value: ContestTab.OVERVIEW, print: 'overview' },
  [ContestTab.PROBLEMS]: { value: ContestTab.PROBLEMS, print: 'problems' },
  [ContestTab.PROBLEM]: { value: ContestTab.PROBLEM, print: 'problem' },
  [ContestTab.SCOREBOARD]: { value: ContestTab.SCOREBOARD, print: 'scoreboard' },
  [ContestTab.SUBMISSIONS]: { value: ContestTab.SUBMISSIONS, print: 'my submissions' },
  [ContestTab.CLARIFICATIONS]: { value: ContestTab.CLARIFICATIONS, print: 'clarifications' },
  [ContestTab.STATUS]: { value: ContestTab.STATUS, print: 'status' },
  [ContestTab.TIMING]: { value: ContestTab.TIMING, print: 'timing' },
  [ContestTab.SETUP]: { value: ContestTab.SETUP, print: 'setup' },
  [ContestTab.ARCHIVE]: { value: ContestTab.ARCHIVE, print: 'archive' },
  [ContestTab.JUDGE]: { value: ContestTab.JUDGE, print: 'judge' },
};

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
    LIST_PAGE(type: ContestTimeStatus | typeof _TYPE) {
      return ['', ROUTES.PARAMS.CONTESTS, type].join('/');
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
    CREATE(tab: ContestTab | typeof _TAB) {
      return ['', ROUTES.PARAMS.CONTEST, ROUTES.PARAMS.CREATE, tab].join('/');
    },
    EDIT(key: string, tab: ContestTab | typeof _TAB) {
      return ['', ROUTES.PARAMS.CONTEST, ROUTES.PARAMS.EDIT, key, tab].join('/');
    },
  },
  PROBLEMS: {
    LIST_PAGE() {
      return '/' + ROUTES.PARAMS.PROBLEMS;
    },
    CREATE(tab: ProblemTab | typeof _TAB) {
      return ['', ROUTES.PARAMS.PROBLEM, ROUTES.PARAMS.CREATE, tab].join('/');
    },
    VIEW(key: string, tab: ProblemTab | typeof _TAB) {
      return ['', ROUTES.PARAMS.PROBLEM, ROUTES.PARAMS.VIEW, key, tab].join('/');
    },
    EDIT(key: string, tab: ProblemTab | typeof _TAB) {
      return ['', ROUTES.PARAMS.PROBLEM, ROUTES.PARAMS.EDIT, key, tab].join('/');
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
