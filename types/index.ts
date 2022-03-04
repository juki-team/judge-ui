import { ScopeData, UserInterface as _UserInterface } from '@bit/juki-team.juki.commons';

export * from './commons';
export * from './contest';
export * from './loading';
export * from './problem';
export * from './routing';

export {
  ErrorCode,
  Judge,
  ProblemMode,
  ProblemStatus,
  ProblemType,
  ProblemVerdict,
  ProfileSettingOptions,
  UserStatus,
  Language,
  Theme,
  ScopeData,
  ProgrammingLanguage,
  UserRole,
  TeamRole,
  ContestStatus,
  CourseRole,
  SubmissionRunStatus,
} from '@bit/juki-team.juki.commons';

export type {
  ErrorType,
  ErrorResponseType,
  ContentResponseType,
  ContentsMetaType,
  ContentsResponseType,
} from '@bit/juki-team.juki.commons';

export interface UserInterface extends _UserInterface {
  myPermissions: { [key in ScopeData]: string },
}

export { NotificationType } from '@bit/juki-team.juki.base-ui';
export type {
  ButtonLoaderActionType, ButtonLoaderStateType, LoginInput, NewNotificationType, SignUpInput,
} from '@bit/juki-team.juki.base-ui';

