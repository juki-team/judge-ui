import { API_VERSION, JUDGE_BACKEND_BASE_URL, JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL } from './settings';

export const JUDGE_API_V1 = {
  AUTH: {
    SIGN_IN: () => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/auth/sign-in`;
    },
    SIGN_UP: () => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/auth/sign-up`;
    },
    SIGN_OUT: () => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/auth/sign-out`;
    },
    PING: () => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/auth/ping`;
    },
    RESET: (nickname: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/auth/nickname/${nickname}/reset`;
    },
    UPDATE: (nickname: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/auth/nickname/${nickname}/update`;
    },
  },
  USER: {
    SUMMARY_LIST: () => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/user/summary-list`;
    },
    MANAGEMENT_LIST: () => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/user/management-list`;
    },
    NICKNAME: (nickname: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/user/nickname/${nickname}`;
    },
    PROFILE: (nickname: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/user/nickname/${nickname}/profile`;
    },
    UPDATE_PROFILE_IMAGE: (nickname: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/user/nickname/${nickname}/profile-image`;
    },
    UPDATE_PROFILE_DATA: (nickname: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/user/nickname/${nickname}/profile-data`;
    },
    UPDATE_PREFERENCES: (nickname: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/user/nickname/${nickname}/preferences`;
    },
    ROLES: (nickname: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/user/nickname/${nickname}/roles`;
    },
    STATUS: (nickname: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/user/nickname/${nickname}/status`;
    },
  },
  SUBMIT: {
    SUBMIT_ID: (submitId: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submit/${submitId}`;
    },
  },
  SUBMISSIONS: {
    LIST: (page: number, size: number) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submissions?page=${page}&size=${size}`;
    },
    NICKNAME: (nickname: string, page: number, size: number) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submissions/nickname/${nickname}?page=${page}&size=${size}`;
    },
    CONTEST: (contestKey: string, page: number, size: number) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submissions/contest/${contestKey}?page=${page}&size=${size}`;
    },
    CONTEST_NICKNAME: (contestKey: string, nickname: string, page: number, size: number) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submissions/contest/${contestKey}/nickname/${nickname}?page=${page}&size=${size}`;
    },
    PROBLEM: (problemKey: string, page: number, size: number) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submissions/problem/${problemKey}?page=${page}&size=${size}`;
    },
    PROBLEM_NICKNAME: (problemKey: string, nickname: string, page: number, size: number) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submissions/problem/${problemKey}/nickname/${nickname}?&page=${page}&size=${size}`;
    },
  },
  PROBLEM: {
    LIST: () => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/problem/list`;
    },
    DATA: (key: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/problem/${key}/data`;
    },
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
    SUBMIT: (key: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submit/problem/${key}`;
    },
  },
  CONTEST: {
    LIST: () => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/list`;
    },
    CREATE: () => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest`;
    },
    CONTEST: (key: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}`;
    },
    CONTEST_DATA: (key: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/data`;
    },
    REGISTER: (key: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/register`;
    },
    SUBMIT: (key: string, problemJudgeKey: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submit/contest/${key}/problem-judge-key/${problemJudgeKey}`;
    },
    SCOREBOARD: (key: string, unfrozen: boolean) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/scoreboard?${unfrozen ? 'state=unfrozen' : ''}`;
    },
    RECALCULATE_SCOREBOARD: (key: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/recalculate-scoreboard`;
    },
    CLARIFICATION: (key: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/clarification`;
    },
    ANSWER_CLARIFICATION: (key: string, clarificationId: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/clarification/${clarificationId}`;
    },
  },
  REJUDGE: {
    CONTEST_PROBLEM: (contestKey: string, problemJudgeKey: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/rejudge/contest/${contestKey}/problem-judge-key/${problemJudgeKey}`;
    },
  },
};
