export {
  ErrorCode,
  Judge,
  ProblemScoringMode,
  ProblemType,
  ProblemVerdict,
  ProfileSetting,
  Language,
  Theme,
  ScopeData,
  UserRole,
  TeamRole,
  ContestStatus,
  CourseRole,
  SubmissionRunStatus,
  HTTPMethod,
  RunnerType,
  MenuViewMode,
  DataViewMode,
  FileType,
  Status,
  EntityAccess,
  EntityMembersRank,
  EntityState,
  CodeLanguage,
  ContestProblemPrerequisiteType,
  ContestProblemBlockedByType,
  WebSocketSubscriptionEvent,
  WebSocketMessageEvent,
  OrganizationPlan,
  OrganizationLogoType,
  SystemRole,
} from '@juki-team/commons/enums';

export {
  OrganizationPlan as CompanyPlan,
  OrganizationLogoType as CompanyLogoType,
} from '@juki-team/commons/enums';

export type {
  EntityMembersDTO,
  ContestProblemBasicDataResponseDTO,
  VirtualUserResponseDTO,
  OrganizationResponseDTO,
  JudgeDataResponseDTO,
  ScoreboardResponseDTO,
  ContestDataResponseDTO,
  ContestProblemDataResponseDTO,
  ContestSummaryListResponseDTO,
  UpsertContestDTO,
  UserProfileResponseDTO,
  PingResponseDTO,
  UserBasicResponseDTO,
  ProblemSummaryListResponseDTO,
  SessionBasicResponseDTO,
  ProblemTestCasesResponseDTO,
  UpsertContestProblemDTO,
  SqsPropertiesResponseDTO,
  UserRankResponseDTO,
  EmailDataResponseDTO,
  CourseSummaryListResponseDTO,
  CreateFileDTO,
  OrganizationResourcesResponseDTO,
  OrganizationUserPermissionsResponseDTO,
  SubmissionDataResponseDTO,
  UpsertProblemDTO,
  ProblemDataResponseDTO,
  DocumentMembersResponseDTO,
  UserOrganizationBasicInfoResponseDTO,
  SubmissionSummaryListResponseDTO,
  JudgeSummaryListResponseDTO,
  EntityMembersResponseDTO,
  ProblemJudgeSummaryListResponseDTO,
  EntityOrganizationSummaryListResponseDTO,
  WebSocketResponseEventDTO,
  SubscribeProblemCrawledWebSocketEventDTO,
  SubscribeContestChangesWebSocketEventDTO,
  SubscribeSubmissionsCrawlWebSocketEventDTO,
  DocumentMemberResponseDTO,
  ContestEventsResponseDTO,
  ContestMembersResponseDTO,
  ContestClarificationsResponseDTO,
  MetadataResponseDTO,
  SubscribeClientTrackWebSocketEventDTO,
  ClientTrackLocationWebSocketEventDTO,
  ClientTrackScreenshotWebSocketEventDTO,
  ClientTrackDeviceWebSocketEventDTO,
  ScoreboardHistoryResponseDTO,
  GroupByTimestampKey,
  UserNotificationSubmissionWebSocketResponseEventDTO as SubscribeUserNotificationWebsocketEventDTO,
  StatisticsProblemResponseDTO,
} from '@juki-team/commons/dto';

export type {
  OrganizationResponseDTO as CompanyResponseDTO,
  OrganizationResourcesResponseDTO as CompanyResourceSpecificationsResponseDTO,
  OrganizationUserPermissionsResponseDTO as CompanyUserPermissionsResponseDTO,
  UserOrganizationBasicInfoResponseDTO as UserCompanyBasicInfoResponseDTO,
  EntityOrganizationSummaryListResponseDTO as EntityCompanySummaryListResponseDTO,
} from '@juki-team/commons/dto';

export type {
  ErrorResponse as ErrorResponseType,
  ContentResponse as ContentResponseType,
  ContentsMeta as ContentsMetaType,
  ContentsResponse as ContentsResponseType,
  TextLanguage as TextLanguageType,
  ProblemSettings as ProblemSettingsType,
  ProblemSampleCases as ProblemSampleCasesType,
  ProblemStatement as ProblemStatementType,
  ProblemSettingsByProgrammingLanguage as ProblemSettingsByProgrammingLanguageType,
  ProblemSettingsPointsByGroups as ProblemSettingsPointsByGroupsType,
  ContestProblem as ContestProblemType,
  ContestTimeData,
  CodeEditorTestCases as CodeEditorTestCasesType,
  CodeEditorTestCase as CodeEditorTestCaseType,
  CodeEditorSheet as CodeEditorSheetType,
  JkmdSheet as JkmdSheetType,
  UserSettings as UserSettingsType,
} from '@juki-team/commons/types';

export type {
  UserPing as UserPingType,
  TestCaseResult as TestCaseResultType,
  SqsProperties as SqsPropertiesType,
} from '@juki-team/commons/dto';

export type { ApiError as ErrorType } from '@juki-team/commons/types';

export { QueryParamKey, ProblemTab, ContestTab, ProfileTab, ContestsTab } from '@juki-team/base-ui/enums';

export type {
  IconProps,
  BasicModalProps,
  ModalProps,
  ButtonLoaderOnClickType,
  ReactNodeOrFunctionType,
  ReactNodeOrFunctionP1Type,
  RequestFilterType,
  RequestSortType,
  NewNotificationType,
  AuthorizedRequestType,
  SetLoaderStatusOnClickType,
  DeleteSearchParamsType,
  SetSearchParamsType,
  LinkCmpProps,
  ImageCmpProps,
  AppendSearchParamsType,
  PlacementType,
  TabsType,
  TabType,
  SortableItem,
  TwoContentLayoutProps,
  TwoContentSectionProps,
  MenuType,
  DataViewerHeadersType,
  FilterSelectOfflineType,
  CropImageType,
  FilterTextOfflineType,
  SetLoaderStatusType,
  CodeEditorExpandPositionType,
  GetRecordKeyType,
  JkTableHeaderFilterType,
  FilterSelectOnlineType,
  OnRecordClickType,
  GetRecordStyleType,
  UserCodeEditorProps,
  UpsertComponentEntityProps,
  SortableItemComponent,
  TableHeadFieldProps,
  PagedDataViewerProps,
  DataViewerRequesterGetUrlType,
  DataViewerRequestPropsType,
  DataViewerToolbarProps,
  TimeDisplayType,
  CodeViewerProps,
  InformationPopoverProps,
  MdMathEditorProps,
  DataViewerRequestType,
} from '@juki-team/base-ui/types';

import type { DateDisplayType } from '@juki-team/base-ui/types';
import type { CSSProperties } from 'react';

export type DateLiteralProps = {
  date: Date;
  className?: string;
  show?: DateDisplayType;
  twoLines?: boolean;
  withDayName?: boolean;
  style?: CSSProperties;
};

export type { VirtualItem } from '@tanstack/virtual-core';

export enum LastPathKey {
  SECTION_CONTEST = 'SECTION_CONTEST',
  CONTESTS = 'CONTESTS',
  SECTION_PROBLEM = 'SECTION_PROBLEM',
  PROBLEMS = 'PROBLEMS',
  SECTION_HELP = 'SECTION_HELP',
  BOARDS = 'BOARDS',
}

export type { PropsWithChildren, ReactNode, FC } from 'react';
export type { AppProps } from 'next/app';
export type { NextApiRequest, NextApiResponse } from 'next';
export type { KeyedMutator } from 'swr';

export type TFunction = (key: string) => string;
