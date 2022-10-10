import { UserState } from 'store';
import { Language, PagedArray, Theme, UserStatus } from 'types';

export const PAGED_ARRAY_EMPTY: PagedArray<any> = {
  list: [],
  pageNumber: 0,
  pageSize: 0,
  totalPages: 0,
  totalElements: 0,
};

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
  
  isLogged: false,
  sessionId: '',
};

export const MY_STATUS = 'my-status';
export const STATUS = 'status';
