import { ScopeData, UserInterface as _UserInterface } from '@juki-team/commons';

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
  HTTPMethod,
} from '@juki-team/commons';

export type {
  ErrorType,
  ErrorResponseType,
  ContentResponseType,
  ContentsMetaType,
  ContentsResponseType,
  SubmissionResponseDTO,
} from '@juki-team/commons';

export interface UserInterface extends _UserInterface {
  myPermissions: { [key in ScopeData]: string },
}

export { NotificationType, Period } from '@juki-team/base-ui';
export type {
  FilterTextOfflineType,
  SearchParamsObjectType,
  LoaderStatusOnClickType,
  SetLoaderStatusOnClickType,
  LoginInputType,
  NewNotificationType,
  SignUpInputType,
  SetLoaderStatusType,
  ButtonLoaderOnClickType,
  ReactNodeOrFunctionType,
  ReactNodeOrFunctionP1Type,
} from '@juki-team/base-ui';
