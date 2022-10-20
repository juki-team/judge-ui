import { KeyFileType } from '../../types';
import { API_VERSION, JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL } from './settings';

export const JUDGE_API_V1 = {
  SYS: {
    LS: (folderPath: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/sys/ls/${encodeURIComponent(folderPath)}`;
    },
    CAT: (filePath: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/sys/cat/${encodeURIComponent(filePath)}`;
    },
    AWS_ECS_TASK_LIST: () => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/sys/aws/ecs/task-list`;
    },
    AWS_ECS_TASK_DEFINITION_LIST: () => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/sys/aws/ecs/task-definition-list`;
    },
    AWS_ECS_STOP_TASK_TASK_ARN: (taskArn: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/sys/aws/ecs/stop-task/${encodeURIComponent(taskArn)}`;
    },
    AWS_ECS_RUN_TASK_TASK_DEFINITION: (taskDefinition: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/sys/aws/ecs/run-task/${encodeURIComponent(taskDefinition)}`;
    },
    AWS_SQS_LIST: () => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/sys/aws/sqs/list`;
    },
  },
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
    ONLINE_USERS: () => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/user/online-users`;
    },
    SESSION_SESSION_ID: (sessionId: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/user/session/${sessionId}`;
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
      if (!key) return null;
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/problem/${key}/data`;
    },
    PROBLEM: (key: string) => {
      if (!key) return null;
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/problem/${key}`;
    },
    CREATE: () => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/problem`;
    },
    TEST_CASES: (problemKey: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/problem/${problemKey}/test-cases`;
    },
    TEST_CASES_GROUPS: (problemKey: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/problem/${problemKey}/test-cases-groups`;
    },
    ALL_TEST_CASES: (problemKey: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/problem/${problemKey}/all-test-cases`;
    },
    TEST_CASE: (problemKey: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/problem/${problemKey}/test-case`;
    },
    TEST_CASE_KEY_FILE: (problemKey: string, testCaseKey: string, keyFile: KeyFileType) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/problem/${problemKey}/test-case/${testCaseKey}/key-file/${keyFile}`;
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
      if (!key) return null;
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}`;
    },
    CONTEST_DATA: (key: string) => {
      if (!key) return null;
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/data`;
    },
    REGISTER: (key: string) => {
      if (!key) return null;
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/register`;
    },
    SUBMIT: (key: string, problemJudgeKey: string) => {
      if (!key || !problemJudgeKey) return null;
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submit/contest/${key}/problem-judge-key/${problemJudgeKey}`;
    },
    SCOREBOARD: (key: string, unfrozen: boolean) => {
      if (!key) return null;
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/scoreboard?${unfrozen ? 'state=unfrozen' : ''}`;
    },
    RECALCULATE_SCOREBOARD: (key: string) => {
      if (!key) return null;
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/recalculate-scoreboard`;
    },
    CLARIFICATION: (key: string) => {
      if (!key) return null;
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/clarification`;
    },
    ANSWER_CLARIFICATION: (key: string, clarificationId: string) => {
      if (!key) return null;
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/clarification/${clarificationId}`;
    },
  },
  REJUDGE: {
    CONTEST_PROBLEM: (contestKey: string, problemJudgeKey: string) => {
      if (!contestKey) return null;
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/rejudge/contest/${contestKey}/problem-judge-key/${problemJudgeKey}`;
    },
    SUBMISSION: (submissionId: string) => {
      if (!submissionId) return null;
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/rejudge/submission/${submissionId}`;
    },
  },
};
