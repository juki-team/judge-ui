import { ContestStatus, UserStatus } from '../../types';

export const JUDGE_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_JUKI_JUDGE_BACKEND_BASE_URL;
export const JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL = process.env.NEXT_PUBLIC_JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL;

export const JUDGE_API_V1 = {
  USER: {
    SUMMARY_LIST: (session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/api/v1/user/summary-list?session=${session}`;
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
    UPDATE_IMAGE: () => {
      return `${JUDGE_BACKEND_BASE_URL}/api/user/updateImage`;
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
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/api/v1/submit/submitId/${submitId}?session=${session}`;
    },
  },
  SUBMISSIONS: {
    NICKNAME: (nickname: string, page: number, size: number, session?: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/api/v1/submissions/nickname/${nickname}?page=${page}&size=${size}&session=${session}`;
    },
    CONTEST: (contestKey: string, page: number, size: number, session?: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/api/v1/submissions/contest/${contestKey}?page=${page}&size=${size}&session=${session}`;
    },
    CONTEST_NICKNAME: (contestKey: string, nickname: string, page: number, size: number, session?: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/api/v1/submissions/contest/${contestKey}/nickname/${nickname}?page=${page}&size=${size}&session=${session}`;
    },
    PROBLEM: (problemKey: string, page: number, size: number, session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/api/v1/submissions/problem/${problemKey}?session=${session}&page=${page}&size=${size}`;
    },
    PROBLEM_NICKNAME: (problemKey: string, nickname: string, page: number, size: number, session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/api/v1/submissions/problem/${problemKey}/nickname/${nickname}?session=${session}&page=${page}&size=${size}`;
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
  },
  CONTEST: {
    CONTEST: (key?: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/contest${key ? '/' + key : ''}`;
    },
    CONTEST_LIST: (session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/api/v1/contest/list?session=${session}`;
    },
    CONTEST_V1: (key: string, session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/api/v1/contest${key ? '/' + key : ''}?session=${session}`;
    },
    CONTEST_DATA: (key: string, session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/api/v1/contest/${key}/data?session=${session}`;
    },
    CHANGE_STATUS: (key: string, status: ContestStatus) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/contest/changeStatus/${key}?status=${status}`;
    },
    REGISTER: (key: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/contest/${key}/register`;
    },
    REGISTER_V1: (key: string, session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/api/v1/contest/${key}/register?session=${session}`;
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
      return `${JUDGE_BACKEND_BASE_URL} / api / contest /${key}/judge/list`;
    },
    SUBMIT: (key: string, problemIndex: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/contest/${key}/problem/${problemIndex}/submit`;
    },
    SUBMIT_V1: (key: string, problemJudgeKey: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/api/v1/submit/contest/${key}/problem-judge-key/${problemJudgeKey}`;
    },
    SCOREBOARD: (key: string) => {
      return `${JUDGE_BACKEND_BASE_URL}/api/contest/${key}/scoreboard`;
    },
    SCOREBOARD_V1: (key: string, unfrozen: boolean, session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/api/v1/contest/${key}/scoreboard?${unfrozen ? 'state=unfrozen&' : ''}session=${session}`;
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
    CLARIFICATION_V1: (key: string, session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/api/v1/contest/${key}/clarification?session=${session}`;
    },
    ANSWER_CLARIFICATION_V1: (key: string, clarificationId: string, session: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/api/v1/contest/${key}/clarification/${clarificationId}?session=${session}`;
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