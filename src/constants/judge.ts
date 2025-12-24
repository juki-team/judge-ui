import { GroupByTimestampKey, KeyFileType } from 'types';
import { JUKI_SERVICE_V1_URL } from './settings';

export const JUDGE_API_V1 = {
  STATISTICS: {
    PROBLEM: (problemKey: string) => {
      return `${JUKI_SERVICE_V1_URL}/statistics/problem/${problemKey}/recalculate`;
    },
  },
  PROBLEM: {
    PROBLEM: (key: string) => {
      return `${JUKI_SERVICE_V1_URL}/problem/${key}`;
    },
    PROBLEM_MEMBERS: (key: string) => {
      return `${JUKI_SERVICE_V1_URL}/problem/${key}/members`;
    },
    CREATE: () => {
      return `${JUKI_SERVICE_V1_URL}/problem`;
    },
    TEST_CASES: (problemKey: string) => {
      return `${JUKI_SERVICE_V1_URL}/problem/${problemKey}/test-cases`;
    },
    TEST_CASES_GROUPS: (problemKey: string) => {
      return `${JUKI_SERVICE_V1_URL}/problem/${problemKey}/test-cases-groups`;
    },
    ALL_TEST_CASES: (problemKey: string) => {
      return `${JUKI_SERVICE_V1_URL}/problem/${problemKey}/all-test-cases`;
    },
    TEST_CASE: (problemKey: string) => {
      return `${JUKI_SERVICE_V1_URL}/problem/${problemKey}/test-case`;
    },
    TEST_CASE_KEY_FILE: (problemKey: string, testCaseKey: string, keyFile: KeyFileType) => {
      return `${JUKI_SERVICE_V1_URL}/problem/${problemKey}/test-case/${testCaseKey}/key-file/${keyFile}`;
    },
    STATISTICS: (key: string, startTimestamp: number, endTimestamp: number, groupBy: GroupByTimestampKey[]) => {
      return `${JUKI_SERVICE_V1_URL}/statistics/problem/${key}?startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}&groupBy=${groupBy.join(',')}`;
    },
    POST_PDF: () => {
      return `${JUKI_SERVICE_V1_URL}/problem/statement-pdf`;
    },
  },
  CONTEST: {
    CREATE: () => {
      return `${JUKI_SERVICE_V1_URL}/contest`;
    },
    CONTEST: (key: string) => {
      return `${JUKI_SERVICE_V1_URL}/contest/${encodeURIComponent(key)}`;
    },
    GLOBAL: (key: string) => {
      return `${JUKI_SERVICE_V1_URL}/contest/${encodeURIComponent(key)}/global`;
    },
    CONTEST_DATA: (key: string) => {
      return `${JUKI_SERVICE_V1_URL}/contest/${key}/data`;
    },
    REGISTER: (key: string) => {
      return `${JUKI_SERVICE_V1_URL}/contest/${key}/register`;
    },
    SCOREBOARD: (key: string, unfrozen: boolean, official: boolean) => {
      return `${JUKI_SERVICE_V1_URL}/contest/${key}/scoreboard${official ? '?official=true' : ''}${unfrozen ? `${official ? '&' : '?'}state=unfrozen` : ''}`;
    },
    SCOREBOARD_HISTORY: (key: string) => {
      return `${JUKI_SERVICE_V1_URL}/contest/${key}/scoreboard-history`;
    },
    RECALCULATE_SCOREBOARD_HISTORY: (key: string) => {
      return `${JUKI_SERVICE_V1_URL}/contest/${key}/recalculate-scoreboard-history`;
    },
    CLARIFICATION: (key: string) => {
      return `${JUKI_SERVICE_V1_URL}/contest/${key}/clarification`;
    },
    ANSWER_CLARIFICATION: (key: string, clarificationId: string) => {
      return `${JUKI_SERVICE_V1_URL}/contest/${key}/clarification/${clarificationId}`;
    },
    LOCK_SCOREBOARD: (key: string) => {
      return `${JUKI_SERVICE_V1_URL}/contest/${key}/lock-scoreboard`;
    },
    UNLOCK_SCOREBOARD: (key: string) => {
      return `${JUKI_SERVICE_V1_URL}/contest/${key}/unlock-scoreboard`;
    },
    DISABLE_UPSOLVING: (key: string) => {
      return `${JUKI_SERVICE_V1_URL}/contest/${key}/disable-upsolving`;
    },
    ENABLE_UPSOLVING: (key: string) => {
      return `${JUKI_SERVICE_V1_URL}/contest/${key}/enable-upsolving`;
    },
    CONTEST_MEMBERS: (key: string) => {
      return `${JUKI_SERVICE_V1_URL}/contest/${key}/members`;
    },
  },
  REJUDGE: {
    PROBLEM_COUNT: (problemJudgeKey: string) => {
      return `${JUKI_SERVICE_V1_URL}/rejudge/problem/${problemJudgeKey}/count`;
    },
    PROBLEM: (problemJudgeKey: string) => {
      return `${JUKI_SERVICE_V1_URL}/rejudge/problem/${problemJudgeKey}`;
    },
    CONTEST_PROBLEM: (contestKey: string, problemJudgeKey: string) => {
      return `${JUKI_SERVICE_V1_URL}/rejudge/contest/${contestKey}/problem/${problemJudgeKey}`;
    },
  },
  RANKING: {
    LIST: () => {
      return `${JUKI_SERVICE_V1_URL}/rank/list`;
    },
  },
};
