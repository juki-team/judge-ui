import { AdminTab, CourseTab, ProfileTab } from 'types';

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
  },
  SUBMISSIONS: {
    VIEW(key: string) {
      return [ '', ROUTES.PARAMS.SUBMISSION, ROUTES.PARAMS.VIEW, key ].join('/');
    },
  },
  COURSES: {
    VIEW(key: string, tab: CourseTab | typeof _TAB) {
      return [ '', ROUTES.PARAMS.COURSE, ROUTES.PARAMS.VIEW, key, tab ].join('/');
    },
    CREATE() {
      return [ '', ROUTES.PARAMS.COURSE, ROUTES.PARAMS.CREATE ].join('/');
    },
  },
  RANKING: {
    PAGE() {
      return '/' + ROUTES.PARAMS.RANKING;
    },
  },
  ADMIN: {
    PAGE(tab: AdminTab | typeof _TAB) {
      return [ '', ROUTES.PARAMS.ADMIN, tab ].join('/');
    },
  },
  PROFILE: {
    PAGE(key: string, tab?: ProfileTab | typeof _TAB) {
      return [ '', ROUTES.PARAMS.PROFILE, key, tab ].join('/');
    },
  },
  SHEETS: {
    LIST() {
      return '/' + ROUTES.PARAMS.SHEETS;
    },
    VIEW(key: string) {
      return [ '', ROUTES.PARAMS.SHEET, ROUTES.PARAMS.VIEW, key ].join('/');
    },
  },
};
