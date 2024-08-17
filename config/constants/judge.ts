import { KeyFileType } from 'types';
import { API_VERSION, JUKI_SERVICE_BASE_URL } from './settings';

export const JUDGE_API_V1 = {
  SYS: {
    MAIL_SEND: () => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/sys/email/send`;
    },
  },
  PROBLEM: {
    PROBLEM: (key: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/problem/${key}`;
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
  },
  CONTEST: {
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
  REJUDGE: {
    PROBLEM: (problemJudgeKey: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/rejudge/problem/${problemJudgeKey}`;
    },
    CONTEST_PROBLEM: (contestKey: string, problemJudgeKey: string) => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/rejudge/contest/${contestKey}/problem/${problemJudgeKey}`;
    },
  },
  RANKING: {
    LIST: () => {
      return `${JUKI_SERVICE_BASE_URL}/${API_VERSION}/rank/list`;
    },
  },
};
