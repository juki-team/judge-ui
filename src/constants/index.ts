import { JUKI_FORWARDED_HOST, JUKI_METADATA, JUKI_SESSION_ID } from '@juki-team/commons';

export {
  ERROR,
  SYSTEM_ROLE,
  PROBLEM_TYPE,
  PROBLEM_VERDICT,
  PROBLEM_MODE,
  PROGRAMMING_LANGUAGE,
  USER_STATUS,
  FILE_ROLE,
  ENTITY_ACCESS,
  ACCEPTED_PROGRAMMING_LANGUAGES,
  PROBLEM_MODES,
  RUNNER_ACCEPTED_PROBLEM_MODES,
  RUNNER_ACCEPTED_PROBLEM_TYPES,
  SUBMISSION_RUN_STATUS,
  JUDGE,
  PALLETE,
  USER_ROLE,
  PROBLEM_ROLE,
  CONTEST_ROLE,
  TEAM_ROLE,
  COURSE_ROLE,
  LANGUAGE,
  CONTEST_STATUS,
  MAX_DATE,
  MIN_DATE,
  RUNNER_ACCEPTED_PROGRAMMING_LANGUAGES,
  JUKI_APP_COMPANY_KEY,
  COMPANY_PLAN,
  PROBLEM_TYPES,
  EMPTY_USER_PERMISSIONS,
  EMPTY_ENTITY_MEMBERS,
  EMPTY_DOCUMENT_MEMBERS,
  JUKI_FORWARDED_HOST,
  JUKI_SESSION_ID,
  JUKI_METADATA,
} from '@juki-team/commons';

export * from './commons';
export * from './contest';
export * from './judge';
export * from './problem';
export * from './routes';
export * from './settings';

export const HEADERS = (jukiSessionId: string): HeadersInit => ({
  origin: 'https://juki.app',
  referer: 'https://juki.app',
  [JUKI_SESSION_ID]: jukiSessionId,
  [JUKI_FORWARDED_HOST]: 'juki.app',
});

export const META_HEADERS = (): HeadersInit => ({
  origin: 'https://juki.app',
  referer: 'https://juki.app',
  [JUKI_METADATA]: 'true',
  [JUKI_FORWARDED_HOST]: 'juki.app',
});
