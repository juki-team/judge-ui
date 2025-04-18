import { ProfileTab } from 'types';

export const _TAB = ':tab';
export const _SUB_SUB_TAB = ':subSubTab';

export const ROUTES = {
  ROOT: '/',
  PARAMS: {
    SUBMISSION: 'submission',
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
    COURSES: 'courses',
    COURSE: 'course',
    SHEETS: 'sheets',
    SHEET: 'sheet',
    BOARDS: 'boards',
    IDE: 'ide',
  },
  
  RANKING: {
    PAGE() {
      return '/' + ROUTES.PARAMS.RANKING;
    },
  },
  BOARDS: {
    PAGE(tab?: string) {
      return '/' + ROUTES.PARAMS.BOARDS + (tab ? `?tab=${tab}` : '');
    },
  },
  IDE: {
    PAGE(tab?: string) {
      return '/' + ROUTES.PARAMS.IDE;
    },
  },
  PROFILE: {
    PAGE(key: string, tab?: ProfileTab | typeof _TAB) {
      return [ '', ROUTES.PARAMS.PROFILE, key, tab ].join('/');
    },
  },
};
