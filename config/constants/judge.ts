import { getProblemJudgeKey } from 'helpers';
import { Judge, KeyFileType } from 'types';
import { API_VERSION, JUKI_SERVICE_BASE_URL } from './settings';

const withSort = (path: string, sortUrl?: string) => {
  return path + (sortUrl ? '&' + sortUrl : '');
};

const withFilter = (path: string, filterUrl?: string) => {
  return path + (filterUrl ? '&' + filterUrl : '');
};

export const JUDGE_API_V1 = {
  SYS: {
    AWS_ECS_TASK_LIST: (companyKey: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/sys/aws/ecs/task-list?companyKey=${companyKey}`;
    },
    AWS_ECS_TASK_DEFINITION_LIST: (companyKey: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/sys/aws/ecs/task-definition-list?companyKey=${companyKey}`;
    },
    AWS_ECS_STOP_TASK_TASK_ARN: (taskArn: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/sys/aws/ecs/stop-task/${encodeURIComponent(taskArn)}`;
    },
    AWS_ECS_RUN_TASK_TASK_DEFINITION: (taskDefinition: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/sys/aws/ecs/run-task/${encodeURIComponent(taskDefinition)}`;
    },
    AWS_ECS_ADJUST_TASKS: () => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/sys/aws/ecs/adjust-tasks`;
    },
    MAIL_SEND: () => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/sys/email/send`;
    },
  },
  SUBMIT: {
    SUBMIT_ID: (submitId: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/submit/${submitId}`;
    },
  },
  SUBMISSIONS: {
    LIST: (page: number, size: number, filterUrl: string, sortUrl: string) => {
      return withSort(withFilter(
        `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/submissions?page=${page}&size=${size}`,
        filterUrl,
      ), sortUrl);
    },
    NICKNAME: (nickname: string, page: number, size: number, filterUrl: string, sortUrl: string) => {
      return withSort(withFilter(
        `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/submissions?page=${page}&size=${size}&nickname=${nickname}`,
        filterUrl,
      ), sortUrl);
    },
    CONTEST: (contestKey: string, page: number, size: number, filterUrl: string, sortUrl: string) => {
      return withSort(withFilter(`${JUKI_SERVICE_BASE_URL}/${API_VERSION}/submissions?page=${page}&size=${size}&contestKey=${encodeURIComponent(
        contestKey)}`, filterUrl), sortUrl);
    },
    CONTEST_NICKNAME: (contestKey: string, nickname: string, page: number, size: number, filterUrl: string, sortUrl: string) => {
      return withSort(withFilter(`${JUKI_SERVICE_BASE_URL}/${API_VERSION}/submissions?page=${page}&size=${size}&contestKey=${encodeURIComponent(
        contestKey)}&nickname=${nickname}`, filterUrl), sortUrl);
    },
    PROBLEM: (judge: Judge, problemKey: string, page: number, size: number, filterUrl: string, sortUrl: string) => {
      return withSort(withFilter(`${JUKI_SERVICE_BASE_URL}/${API_VERSION}/submissions?page=${page}&size=${size}&problemJudgeKeys=${getProblemJudgeKey(
        judge,
        problemKey,
      )}`, filterUrl), sortUrl);
    },
    PROBLEM_NICKNAME: (judge: Judge, problemKey: string, nickname: string, page: number, size: number, filterUrl: string, sortUrl: string) => {
      return withSort(withFilter(`${JUKI_SERVICE_BASE_URL}/${API_VERSION}/submissions?page=${page}&size=${size}&problemJudgeKeys=${getProblemJudgeKey(
        judge,
        problemKey,
      )}&nickname=${nickname}`, filterUrl), sortUrl);
    },
  },
  PROBLEM: {
    LIST: (judge: Judge, page: number, size: number, filterUrl: string, sortUrl: string) => {
      return withSort(withFilter(
        `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/problem/list?page=${page}&size=${size}&judge=${judge}`,
        filterUrl,
      ), sortUrl);
    },
    TAG_LIST: () => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/problem/tag-list`;
    },
    DATA: (key: string) => {
      if (!key) {
        return null;
      }
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/problem/${key}/data`;
    },
    PROBLEM: (key: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/problem/${key}`;
    },
    RE_CRAWL_PROBLEM: (key: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/problem/re-crawl/${key}`;
    },
    CREATE: () => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/problem`;
    },
    TEST_CASES: (problemKey: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/problem/${problemKey}/test-cases`;
    },
    TEST_CASES_GROUPS: (problemKey: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/problem/${problemKey}/test-cases-groups`;
    },
    ALL_TEST_CASES: (problemKey: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/problem/${problemKey}/all-test-cases`;
    },
    TEST_CASE: (problemKey: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/problem/${problemKey}/test-case`;
    },
    TEST_CASE_KEY_FILE: (problemKey: string, testCaseKey: string, keyFile: KeyFileType) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/problem/${problemKey}/test-case/${testCaseKey}/key-file/${keyFile}`;
    },
    SUBMIT: (judge: Judge, key: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/submit/problem/${getProblemJudgeKey(judge, key)}`;
    },
  },
  CONTEST: {
    LIST: (page: number, size: number, filterUrl: string | undefined, sortUrl: string | undefined) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/contest/list?page=${page}&size=${size}${filterUrl ? '&'
        + filterUrl : ''}${sortUrl ? '&' + sortUrl : ''}`;
    },
    CREATE: () => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/contest`;
    },
    CONTEST: (key: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}`;
    },
    CONTEST_DATA: (key: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/data`;
    },
    REGISTER: (key: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/register`;
    },
    SUBMIT: (key: string, problemJudgeKey: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/submit/contest/${key}/problem-judge-key/${problemJudgeKey}`;
    },
    SCOREBOARD: (key: string, unfrozen: boolean) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/scoreboard?${unfrozen ? 'state=unfrozen' : ''}`;
    },
    SCOREBOARD_HISTORY: (key: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/scoreboard-history`;
    },
    RECALCULATE_SCOREBOARD: (key: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/recalculate-scoreboard`;
    },
    CLARIFICATION: (key: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/clarification`;
    },
    ANSWER_CLARIFICATION: (key: string, clarificationId: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/clarification/${clarificationId}`;
    },
    LOCK_SCOREBOARD: (key: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/lock-scoreboard`;
    },
    UNLOCK_SCOREBOARD: (key: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/contest/${key}/unlock-scoreboard`;
    },
  },
  COURSE: {
    LIST: (page: number, size: number, filterUrl: string, sortUrl: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/course/list?page=${page}&size=${size}${filterUrl ? '&'
        + filterUrl : ''}${sortUrl ? '&' + sortUrl : ''}`;
    },
  },
  REJUDGE: {
    PROBLEM: (problemJudgeKey: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/rejudge/problem/${problemJudgeKey}`;
    },
    CONTEST_PROBLEM: (contestKey: string, problemJudgeKey: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/rejudge/contest/${contestKey}/problem-judge-key/${problemJudgeKey}`;
    },
    SUBMISSION: (submissionId: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/rejudge/submission/${submissionId}`;
    },
  },
  RANKING: {
    LIST: () => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/rank/list`;
    },
  },
  JUDGE: {
    GET: (judge: Judge, companyKey: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/judge/${judge}/company/${companyKey}`;
    },
    CRAWL_LANGUAGES: (judge: Judge, companyKey: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/judge/${judge}/company/${companyKey}/re-crawl-languages`;
    },
    LANGUAGES: (judge: Judge, companyKey: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/judge/${judge}/company/${companyKey}/languages`;
    },
  },
};
