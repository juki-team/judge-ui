import { UserStatus, Judge, ScopeData } from '~/types';

interface Settings {
  key: string,
  value: boolean,
}

export type UserPermissions = Array<{ key: typeof ScopeData.USER | typeof ScopeData.PROBLEM | typeof ScopeData.CONTEST | typeof ScopeData.ATTEMPT, value: string }>;

export interface UserState {
  name: string,
  givenName: string,
  familyName: string,
  email: string,
  nickname: string,
  imageUrl: string,
  handles: { [key in Judge]: string },
  permissions: UserPermissions,
  aboutMe: string,
  institution: string,
  city: string,
  country: string,
  status: UserStatus,
  following: number,
  followers: number,
  // only APP
  passPermissions: { [key: string]: string },
  settings: { [key: string]: Settings }
}

export enum UserActions {
  REPLACE_USERS = 'REPLACE_USERS'
}

interface ReplaceUsersType {
  type: UserActions.REPLACE_USERS,
  users: Array<UserState>
}

export type UsersActionTypes = ReplaceUsersType;
