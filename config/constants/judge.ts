import { getProblemJudgeKey } from 'helpers';
import { Judge, KeyFileType, RunnerType } from 'types';
import { API_VERSION, JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL } from './settings';

const withSort = (path, sortUrl) => {
  return path + (sortUrl ? '&' + sortUrl : '');
};

const withFilter = (path, filterUrl) => {
  return path + (filterUrl ? '&' + filterUrl : '');
};

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
    AWS_ECS_SET_RUNNER_TYPE_TASK_DEFINITION: (runnerType: RunnerType, taskDefinition: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/sys/aws/ecs/runner/type/${runnerType}/task-definition/${encodeURIComponent(taskDefinition)}`;
    },
    AWS_ECS_RUNNER_MIN_TASKS: () => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/sys/aws/ecs/runner/min-tasks`;
    },
    AWS_ECS_RUNNER_MIN_TASK: (runnerType: RunnerType, minTasks: number) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/sys/aws/ecs/runner/type/${runnerType}/min/${minTasks}`;
    },
    AWS_SQS_LIST: () => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/sys/aws/sqs/list`;
    },
    AWS_ECS_ADJUST_TASKS: () => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/sys/aws/ecs/adjust-tasks`;
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
    ALL_ONLINE_USERS: () => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/user/all-online-users`;
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
    DELETE_OLD_SESSIONS: () => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/user/delete-old-sessions`;
    },
  },
  SUBMIT: {
    SUBMIT_ID: (submitId: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submit/${submitId}`;
    },
  },
  SUBMISSIONS: {
    LIST: (page: number, size: number, filterUrl: string, sortUrl: string) => {
      return withSort(withFilter(`${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submissions?page=${page}&size=${size}`, filterUrl), sortUrl);
    },
    NICKNAME: (nickname: string, page: number, size: number, filterUrl: string, sortUrl: string) => {
      return withSort(withFilter(`${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submissions?page=${page}&size=${size}&nickname=${nickname}`, filterUrl), sortUrl);
    },
    CONTEST: (contestKey: string, page: number, size: number, filterUrl: string, sortUrl: string) => {
      return withSort(withFilter(`${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submissions?page=${page}&size=${size}&contestKey=${encodeURIComponent(contestKey)}`, filterUrl), sortUrl);
    },
    CONTEST_NICKNAME: (contestKey: string, nickname: string, page: number, size: number, filterUrl: string, sortUrl: string) => {
      return withSort(withFilter(`${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submissions?page=${page}&size=${size}&contestKey=${encodeURIComponent(contestKey)}&nickname=${nickname}`, filterUrl), sortUrl);
    },
    PROBLEM: (problemKey: string, page: number, size: number, filterUrl: string, sortUrl: string) => {
      return withSort(withFilter(`${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submissions?page=${page}&size=${size}&problemJudgeKeys=${getProblemJudgeKey(Judge.JUKI_JUDGE, problemKey)}`, filterUrl), sortUrl);
    },
    PROBLEM_NICKNAME: (problemKey: string, nickname: string, page: number, size: number, filterUrl: string, sortUrl: string) => {
      return withSort(withFilter(`${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/submissions?page=${page}&size=${size}&problemJudgeKeys=${getProblemJudgeKey(Judge.JUKI_JUDGE, problemKey)}&nickname=${nickname}`, filterUrl), sortUrl);
    },
  },
  PROBLEM: {
    LIST: (page: number, size: number, filterUrl: string, sortUrl: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/problem/list?page=${page}&size=${size}${filterUrl ? '&' + filterUrl : ''}${sortUrl ? '&' + sortUrl : ''}`;
    },
    TAG_LIST: () => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/problem/tag-list`;
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
    LIST: (page: number, size: number, filterUrl: string | undefined, sortUrl: string | undefined) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/list?page=${page}&size=${size}${filterUrl ? '&' + filterUrl : ''}${sortUrl ? '&' + sortUrl : ''}`;
    },
    LIST_ENDLESS: (filterUrl?: string) => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/contest/list-endless${filterUrl ? '?' + filterUrl : ''}`;
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
    PROBLEM: (problemJudgeKey: string) => {
      if (!problemJudgeKey) return null;
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/rejudge/problem/${problemJudgeKey}`;
    },
    CONTEST_PROBLEM: (contestKey: string, problemJudgeKey: string) => {
      if (!contestKey) return null;
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/rejudge/contest/${contestKey}/problem-judge-key/${problemJudgeKey}`;
    },
    SUBMISSION: (submissionId: string) => {
      if (!submissionId) return null;
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/rejudge/submission/${submissionId}`;
    },
  },
  RANKING: {
    LIST: () => {
      return `${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/${API_VERSION}/rank/list`;
    },
  },
};
