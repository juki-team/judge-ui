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
  SubmitResponseDTO,
  CaseResultGroupType,
  CaseResultType,
  TestCaseResultType,
  ScoreboardResponseDTO,
  ContestResponseDTO,
  ProblemResponseDTO,
  ProblemLanguagesType,
  PointsByGroupsType,
  UserSummaryListResponseDTO,
  ContestProblemBasicType,
  ContestSummaryListResponseDTO,
  CreateContestDTO,
} from '@juki-team/commons';

export interface UserInterface extends _UserInterface {
  myPermissions: { [key in ScopeData]: string },
}

export { NotificationType, Period } from '@juki-team/base-ui';
export type {
  RowSortableItemContentType,
  RowSortableItem,
  CropImageType,
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
  PlacementType,
} from '@juki-team/base-ui';
