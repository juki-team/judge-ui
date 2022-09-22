import { ContestStatus, UserStatus } from '../../types';

export const JUDGE_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_JUKI_JUDGE_BACKEND_BASE_URL;
export const JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL = process.env.NEXT_PUBLIC_JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL;
export const API_VERSION = 'api/v1';

export const JUDGE_API_V1 = {
  USER: {
    SUMMARY_LIST: (session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/user/summary-list?session=${session}`;
    },
    PROFILE: (nickname: string, session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/user/nickname/${nickname}/profile?session=${session}`;
    },
    UPDATE_PROFILE_IMAGE: (nickname: string, session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/user/nickname/${nickname}/profile-image?session=${session}`;
    },
    UPDATE_PROFILE_DATA: (nickname: string, session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/user/nickname/${nickname}/profile-data?session=${session}`;
    },
  },
  ACCOUNT: {
    PING: () => {
      return `${JUDGE_BACKEND_BASE_URL}/api/auth/ping`;
    },
    LOGOUT: () => {
      return `${JUDGE_BACKEND_BASE_URL}/api/auth/logout`;
    },
    USER: (nickname?: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/user${nickname ? '/' + nickname : ''}`;
    },
    SIGNIN: () => {
      return `${JUDGE_BACKEND_BASE_URL}/api/auth/signin`;
    },
    GOOGLE_SIGNIN: () => {
      return `${JUDGE_BACKEND_BASE_URL}/api/auth/signin/google`;
    },
    SIGNUP: () => {
      return `${JUDGE_BACKEND_BASE_URL}/api/auth/signup`;
    },
    CHANGE_STATUS: (nickname: string, status: UserStatus) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/user/changeStatus/${nickname}?status=${status}`;
    },
    CHANGE_PERMISSIONS: (nickname: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/user/permissions/${nickname}`;
    },
    UPDATE: () => {
      return `${JUDGE_BACKEND_BASE_URL}/api/user/update`;
    },
    UPDATE_PASSWORD: () => {
      return `${JUDGE_BACKEND_BASE_URL}/api/user/password/update`;
    },
    CHANGE_PASSWORD: () => {
      return `${JUDGE_BACKEND_BASE_URL}/api/user/password/change`;
    },
  },
  SUBMIT: {
    SUBMIT_ID: (submitId: string, session?: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submit/submitId/${submitId}?session=${session}`;
    },
  },
  SUBMISSIONS: {
    LIST: (page: number, size: number, session?: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submissions?page=${page}&size=${size}&session=${session}`;
    },
    NICKNAME: (nickname: string, page: number, size: number, session?: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submissions/nickname/${nickname}?page=${page}&size=${size}&session=${session}`;
    },
    CONTEST: (contestKey: string, page: number, size: number, session?: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submissions/contest/${contestKey}?page=${page}&size=${size}&session=${session}`;
    },
    CONTEST_NICKNAME: (contestKey: string, nickname: string, page: number, size: number, session?: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submissions/contest/${contestKey}/nickname/${nickname}?page=${page}&size=${size}&session=${session}`;
    },
    PROBLEM: (problemKey: string, page: number, size: number, session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submissions/problem/${problemKey}?session=${session}&page=${page}&size=${size}`;
    },
    PROBLEM_NICKNAME: (problemKey: string, nickname: string, page: number, size: number, session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submissions/problem/${problemKey}/nickname/${nickname}?session=${session}&page=${page}&size=${size}`;
    },
  },
  PROBLEM: {
    PROBLEM: (id?: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/problem${id ? '/' + id : ''}`;
    },
    TESTS: (id: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/problem/${id}/testCases`;
    },
    EVALUATOR_SOURCE: (id: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/problem/${id}/evaluatorSource`;
    },
    TEST: (id: string, testId?: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/problem/${id}/testCase${testId ? '/' + testId : ''}`;
    },
    BASIC_LIST: () => {
      return `${JUDGE_BACKEND_BASE_URL}/api/problem/basicList`;
    },
    SUBMIT_V1: (id: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submit/problem/${id}`;
    },
  },
  CONTEST: {
    CONTEST_LIST: (session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/list?session=${session}`;
    },
    CONTEST_V1: (key: string, session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest${key ? '/' + key : ''}?session=${session}`;
    },
    CONTEST_DATA: (key: string, session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/data?session=${session}`;
    },
    REGISTER_V1: (key: string, session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/register?session=${session}`;
    },
    SUBMIT_V1: (key: string, problemJudgeKey: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submit/contest/${key}/problem-judge-key/${problemJudgeKey}`;
    },
    SCOREBOARD_V1: (key: string, unfrozen: boolean, session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/scoreboard?${unfrozen ? 'state=unfrozen&' : ''}session=${session}`;
    },
    CLARIFICATION_V1: (key: string, session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/clarification?session=${session}`;
    },
    ANSWER_CLARIFICATION_V1: (key: string, clarificationId: string, session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/clarification/${clarificationId}?session=${session}`;
    },
  },
  REJUDGE: {
    CONTEST_PROBLEM: (contestKey: string, problemJudgeKey: string, session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/rejudge/contest/${contestKey}/problem-judge-key/${problemJudgeKey}?session=${session}`;
    },
  },
  ADMIN: {
    ADMIN: (page?: string, size?: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/user?page=${page}&size=${size}`;
    },
  },
  UPLOAD: () => {
    return `${JUDGE_BACKEND_BASE_URL}/api/problem/file/update`;
  },
};