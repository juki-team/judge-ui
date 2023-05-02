import { RequestFilterType, RequestSortType } from 'types';

export enum Status {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  LOADING = 'LOADING',
  NONE = 'NONE'
}

export enum LastLinkKey {
  SECTION_CONTEST = 'SECTION_CONTESTS',
  CONTESTS = 'CONTESTS',
  SECTION_PROBLEM = 'SECTION_PROBLEMS',
  PROBLEMS = 'PROBLEMS',
  SECTION_ADMIN = 'SECTION_ADMINS',
  SHEETS = 'SHEETS',
  SECTION_SHEET = 'SECTION_SHEET',
}

export type LastLinkType = { [key in LastLinkKey]: { pathname: string, query: {} } };
