import { UserState } from 'store';
import { Language, Theme, UserStatus } from 'types';
import { QueryParam } from './routes';

export const USER_GUEST: UserState = {
  givenName: 'Guest',
  familyName: 'Guest',
  email: 'GUEST',
  nickname: '',
  status: UserStatus.ACTIVE,
  aboutMe: '',
  imageUrl: 'https://i.ibb.co/gvC4twc/juki.png',
  city: '',
  country: '',
  institution: '',
  
  // telegramUsername: '',
  settings: {
    preferredLanguage: Language.ES,
    preferredTheme: Theme.LIGHT,
  },
  handles: {},
  // userRole: UserRole.GUEST,
  // teamRole: TeamRole.GUEST,
  // courseRole: CourseRole.GUEST,
  canCreateUser: false,
  canCreateProblem: false,
  canCreateContest: false,
  canViewSubmissionsManagement: false,
  canViewUsersManagement: false,
  canViewFilesManagement: false,
  canViewECSManagement: false,
  canViewSQSManagement: false,
  canViewEmailManagement: false,
  isLogged: false,
  sessionId: '',
};

export const DEFAULT_DATA_VIEWER_PROPS = {
  getPageQueryParam: (name: string) => (name ? name + '.' : name) + QueryParam.PAGE_TABLE,
  getPageSizeQueryParam: (name: string) => (name ? name + '.' : name) + QueryParam.PAGE_SIZE_TABLE,
  getSortQueryParam: (name: string) => (name ? name + '.' : name) + QueryParam.SORT_TABLE,
  getFilterQueryParam: (name: string) => (name ? name + '.' : name) + QueryParam.FILTER_TABLE,
  getViewModeQueryParam: (name: string) => (name ? name + '.' : name) + QueryParam.VIEW_MODE_TABLE,
};
