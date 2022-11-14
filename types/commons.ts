import { RequestFilterType, RequestSortType } from 'types';

export type PagedArray<T> = {
  list: Array<T>,
  pageNumber: number,
  pageSize: number,
  totalPages: number,
  totalElements: number
}

export enum NotificationType {
  SUCCESS = 'SUCCESS',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export enum Status {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  LOADING = 'LOADING',
  NONE = 'NONE'
}

export type GetUrl = (props: { pagination: { page: number, pageSize: number }, filter: RequestFilterType, sort: RequestSortType }) => string
