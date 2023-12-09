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

export type LastLinkType = { [key in LastLinkKey]: { pathname: string, searchParams: URLSearchParams } };

export type { PropsWithChildren, ReactNode, FC } from 'react';
export type { AppProps } from 'next/app';
export type { NextApiRequest, NextApiResponse } from 'next';
export type { KeyedMutator } from 'swr';
