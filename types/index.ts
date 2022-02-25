import { ProfileSettingOptions, ScopeData, UserInterface as _UserInterface } from '@bit/juki-team.juki.commons';

export * from './commons';
export * from './contest';
export * from './judge';
export * from './loading';
export * from './problems';
export * from './routing';
export * from './services';

export {
  UserStatus, Language, Theme, ScopeData, ProgrammingLanguage, UserRole, TeamRole, CourseRole,
  ErrorCode,
  ProfileSettingOptions,
  ProblemStatus,
} from '@bit/juki-team.juki.commons';

export interface UserInterface extends _UserInterface {
  myPermissions: { [key in ScopeData]: string },
}

export { NotificationType } from '@bit/juki-team.juki.base-ui';
export type {
  ButtonLoaderActionType, ButtonLoaderStateType, LoginInput, NewNotificationType, SignUpInput,
} from '@bit/juki-team.juki.base-ui';

