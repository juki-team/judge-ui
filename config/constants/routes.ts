import { AdminTab, ContestsTab, ContestTab, ProblemTab, ProfileTab } from '../../types';

export enum QueryParam {
  DIALOG = 'dialog',
  USER_PREVIEW = 'userPreview',
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
    // CREATE(tab: ContestTab | typeof _TAB) {
    //   return ['', ROUTES.PARAMS.CONTEST, ROUTES.PARAMS.CREATE, tab].join('/');
    // },
    CREATE() {
      return ['', ROUTES.PARAMS.CONTEST, ROUTES.PARAMS.CREATE].join('/');
    },
    // EDIT(key: string, tab: ContestTab | typeof _TAB) {
    //   return ['', ROUTES.PARAMS.CONTEST, ROUTES.PARAMS.EDIT, key, tab].join('/');
    // },
    EDIT(key: string) {
      return ['', ROUTES.PARAMS.CONTEST, ROUTES.PARAMS.EDIT, key].join('/');
    },
  },
  PROBLEMS: {
    LIST() {
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
