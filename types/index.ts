import { ScopeData, UserInterface as _UserInterface } from '@bit/juki-team.juki.commons';

export * from './commons';
export * from './contest';
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

export { NotificationType, Period } from '@bit/juki-team.juki.base-ui';
export type {
  FilterTextOfflineType,
  LoaderStatusOnClickType,
  SetLoaderStatusOnClickType,
  LoginInputType,
  NewNotificationType,
  SignUpInputType,
  SetLoaderStatusType,
  ButtonLoaderOnClickType,
  ReactNodeOrFunctionType,
} from '@bit/juki-team.juki.base-ui';
