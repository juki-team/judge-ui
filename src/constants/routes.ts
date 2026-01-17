import { type Metadata } from 'next';
import type { ProfileTab } from 'types';

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
    PAGE() {
      return '/' + ROUTES.PARAMS.IDE;
    },
  },
  PROFILE: {
    PAGE(key: string, tab?: ProfileTab | typeof _TAB) {
      return [ '', ROUTES.PARAMS.PROFILE, key, tab ].join('/');
    },
  },
};

export const DEFAULT_METADATA: Metadata = {
  title: {
    template: 'Juki Judge | %s',
    default: 'Juki Judge',
  },
  description: 'Juki Judge is designed to make people improve their programming skills',
  applicationName: 'Juki Judge',
  keywords: [ 'Juki Judge' ],
  manifest: '/manifest.json',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    title: 'Juki Judge',
    description: 'Juki Judge is designed to make people improve their programming skills',
    siteName: 'Juki Judge',
    url: 'https://judge.juki.app',
    images: [
      {
        url: 'https://images.juki.pub/assets/juki-judge-court.png',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Juki Judge',
    description: 'Juki Judge is designed to make people improve their programming skills',
    // siteId: '1467726470533754880',
    creator: '@oscar_gauss',
    // creatorId: '1467726470533754880',
    images: [ 'https://images.juki.pub/assets/juki-judge-court.png' ], // Must be an absolute URL
  },
  verification: {
    google: 'google',
    yandex: 'yandex',
    yahoo: 'yahoo',
    other: {
      me: [ 'oscargauss@juki.app', 'https://www.oscargauss.com' ],
    },
  },
  appleWebApp: {
    capable: true,
    title: 'Juki Judge',
    statusBarStyle: 'default',
    startupImage: [
      '/icons/apple-touch-icon.png',
      // {
      //   url: '/assets/startup/apple-touch-startup-image-1536x2008.png',
      //   media: '(device-width: 768px) and (device-height: 1024px)',
      // },
    ],
  },
};
