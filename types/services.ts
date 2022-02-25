import { Status } from './commons';

export enum ErrorCodes {
  // General errors
  ERR9900 = 'ERR9900',
  ERR9901 = 'ERR9901',
  ERR9902 = 'ERR9902',
  ERR9903 = 'ERR9903',
  ERR9997 = 'ERR9997',
  ERR9998 = 'ERR9998',
  ERR9999 = 'ERR9999',
  // User errors
  ERR0001 = 'ERR0001',
  ERR0002 = 'ERR0002',
  ERR0003 = 'ERR0003',
  ERR0004 = 'ERR0004',
  ERR0005 = 'ERR0005',
  ERR0006 = 'ERR0006',
  ERR0007 = 'ERR0007',
  ERR0008 = 'ERR0008',
  ERR0009 = 'ERR0009',
  ERR0010 = 'ERR0010',
  // View Errors
  ERR0101 = 'ERR0101',
  ERR0102 = 'ERR0102',
  ERR0103 = 'ERR0103'
}

export interface ErrorResponse {
  success: Status.ERROR,
  message: string,
  errorCode: ErrorCodes
}

export interface OkListResponse<T> {
  success: Status.SUCCESS,
  list: Array<T>,
  total: number
}

export interface OkObjectResponse<T> {
  success: Status.SUCCESS,
  object: T
}

export interface OkResponse { // Correct this
  success: Status.SUCCESS
}

export interface OkPagedListResponse<T> {
  success: Status.SUCCESS,
  object: {
    content: Array<T>,
    empty: boolean,
    first: boolean,
    last: boolean,
    number: number
    numberOfElements: number
    pageable: {
      offset: number,
      pageNumber: number,
      pageSize: number,
      paged: boolean,
      empty: boolean,
      sorted: boolean,
      unsorted: boolean,
      unpaged: boolean,
      sort: { sorted: boolean, unsorted: boolean, empty: boolean }
    },
    size: number
    sort: { sorted: boolean, unsorted: boolean, empty: boolean }
    totalElements: number
    totalPages: number
  }
}
