import { UserState } from './users';

export type ProfilesState = { [key: string]: UserState };

export enum ProfileActions {
  REPLACE_PROFILES = 'REPLACE_PROFILES',
  REPLACE_PROFILE = 'REPLACE_PROFILE'
}

interface ReplaceProfilesType {
  type: ProfileActions.REPLACE_PROFILES,
  profiles: ProfilesState
}

interface ReplaceProfileType {
  type: ProfileActions.REPLACE_PROFILE,
  profile: UserState
}

export type ProfilesActionTypes = ReplaceProfilesType | ReplaceProfileType;
