import { UserState } from '../../store';
import {
  CourseRole,
  Language,
  PagedArray,
  ProfileSettingOptions,
  ScopeData,
  TeamRole,
  Theme,
  UserInterface,
  UserRole,
  UserStatus,
} from '../../types';

export const PAGED_ARRAY_EMPTY: PagedArray<any> = {
  list: [],
  pageNumber: 0,
  pageSize: 0,
  totalPages: 0,
  totalElements: 0,
};

export const DEFAULT_PERMISSIONS: { [key in ScopeData]: string } = {
  [ScopeData.USER]: '9992',
  [ScopeData.PROBLEM]: '9993',
  [ScopeData.CONTEST]: '9993',
  [ScopeData.ATTEMPT]: '9999',
};

export const DEFAULT_SETTINGS: { [key in ProfileSettingOptions]: string } = {
  [ProfileSettingOptions.DIAGNOSTIC]: '',
  [ProfileSettingOptions.LANGUAGE]: Language.EN,
  [ProfileSettingOptions.LOW_RATE]: '',
  [ProfileSettingOptions.NOTIFICATION]: '',
  [ProfileSettingOptions.SOCIAL]: '',
  [ProfileSettingOptions.TALKS]: '',
  [ProfileSettingOptions.THEME]: Theme.LIGHT,
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
  
  telegramUsername: '',
  preferredLanguage: Language.ES,
  preferredTheme: Theme.LIGHT,
  userRole: UserRole.GUEST,
  teamRole: TeamRole.GUEST,
  courseRole: CourseRole.GUEST,
  myPermissions: { ...DEFAULT_PERMISSIONS },
  
  isLogged: false,
};