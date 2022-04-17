import { ContestStatus, UserStatus } from '../../types';

export const JUDGE_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_JUKI_JUDGE_BACKEND_BASE_URL;
export const JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL = process.env.NEXT_PUBLIC_JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL;

export const JUDGE_API_V1 = {
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
    UPDATE_IMAGE: () => {
      return `${JUDGE_BACKEND_BASE_URL}/api/user/updateImage`;
    },
    CHANGE_PASSWORD: () => {
      return `${JUDGE_BACKEND_BASE_URL}/api/user/password/update`;
    },
  },
  SUBMISSIONS: {
    NICKNAME: (nickname: string, page: number, size: number, session?: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/api/v1/submissions/nickname/${nickname}?page=${page}&size=${size}&session=${session}`;
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
    SUBMIT: (id: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/problem/${id}/submit`;
    },
    SUBMIT_V1: (id: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/api/v1/submit/problem/${id}`;
    },
    SUBMISSION_CODE: (key: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/problem/submit/${key}`;
    },
    PROBLEM_STATUS: (id: string, page: number, size: number) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/problem/${id}/submit/status?page=${page}&size=${size}`;
    },
    PROBLEM_STATUS_V1: (id: string, page: number, size: number, session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/api/v1/submissions/problem/${id}?session=${session}&page=${page}&size=${size}`;
    },
    PROBLEM_STATUS_NICKNAME: (id: string, page: number, size: number, session: string, nickname: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/api/v1/submissions/problem/${id}/nickname/${nickname}?session=${session}&page=${page}&size=${size}`;
    },
  },
  CONTEST: {
    CONTEST: (key?: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/contest${key ? '/' + key : ''}`;
    },
    CHANGE_STATUS: (key: string, status: ContestStatus) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/contest/changeStatus/${key}?status=${status}`;
    },
    REGISTER: (key: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/contest/${key}/register`;
    },
    UN_FROZEN: (key: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/contest/${key}/scoreboard/unFrozen`;
    },
    MY_STATUS: (key: string, page: number, size: number) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/contest/${key}/myStatus?page=${page}&size=${size}`;
    },
    STATUS: (key: string, page: number, size: number) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/contest/${key}/status?page=${page}&size=${size}`;
    },
    PENDING_STATUS: (key: string) => {
      return `${JUDGE_BACKEND_BASE_URL} / api / contest /${key}/judge/list`
        ;
    },
    SUBMIT: (key: string, problemIndex: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/contest/${key}/problem/${problemIndex}/submit`;
    },
    SUBMIT_V1: (key: string, problemIndex: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/api/v1/submit/contest/${key}/problem/${problemIndex}`;
    },
    SCOREBOARD: (key: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/contest/${key}/scoreboard`;
    },
    REJUDGE_PROBLEM: (key: string, problemIndex: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/contest/${key}/problem/${problemIndex}/rejudge`;
    },
    REJUDGE_SUBMISSION: (key: string, submissionMongoId: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/contest/${key}/rejudge/${submissionMongoId}`;
    },
    JUDGE_SUBMISSION: (key: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/contest/${key}/judge/submit`;
    },
    VIEW_SOURCE_SUBMISSION: (key: string, submissionMongoId: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/contest/${key}/submit/${submissionMongoId}/source`;
    },
    CLARIFICATIONS: (key: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/contest/${key}/clarification`;
    },
    ANSWER_CLARIFICATION: (key: string, idClarification: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/contest/${key}/clarification/${idClarification}/answer`;
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