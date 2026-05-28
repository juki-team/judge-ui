import { JUKI_SERVICE_V2_URL } from '@juki-team/base-ui/constants';
import { KeyFileType } from 'types';

export const JUDGE_API_V1 = {
  PROBLEM: {
    TEST_CASES: (problemKey: string) => {
      return `${JUKI_SERVICE_V2_URL}/problem/${problemKey}/test-cases`;
    },
    TEST_CASES_GROUPS: (problemKey: string) => {
      return `${JUKI_SERVICE_V2_URL}/problem/${problemKey}/test-cases-groups`;
    },
    ALL_TEST_CASES: (problemKey: string) => {
      return `${JUKI_SERVICE_V2_URL}/problem/${problemKey}/all-test-cases`;
    },
    TEST_CASE: (problemKey: string) => {
      return `${JUKI_SERVICE_V2_URL}/problem/${problemKey}/test-case`;
    },
    TEST_CASE_KEY_FILE: (problemKey: string, testCaseKey: string, keyFile: KeyFileType) => {
      return `${JUKI_SERVICE_V2_URL}/problem/${problemKey}/test-case/${testCaseKey}/key-file/${keyFile}`;
    },
    POST_PDF: () => {
      return `${JUKI_SERVICE_V2_URL}/problem/statement-pdf`;
    },
  },
  CONTEST: {
    REGISTER: (key: string) => {
      return `${JUKI_SERVICE_V2_URL}/contest/${key}/register`;
    },
    SCOREBOARD: (key: string, unfrozen: boolean, official: boolean) => {
      return `${JUKI_SERVICE_V2_URL}/contest/${key}/scoreboard${official ? '?official=true' : ''}${unfrozen ? `${official ? '&' : '?'}state=unfrozen` : ''}`;
    },
    SCOREBOARD_HISTORY: (key: string) => {
      return `${JUKI_SERVICE_V2_URL}/contest/${key}/scoreboard-history`;
    },
    RECALCULATE_SCOREBOARD_HISTORY: (key: string) => {
      return `${JUKI_SERVICE_V2_URL}/contest/${key}/recalculate-scoreboard-history`;
    },
    CLARIFICATION: (key: string) => {
      return `${JUKI_SERVICE_V2_URL}/contest/${key}/clarification`;
    },
    ANSWER_CLARIFICATION: (key: string, clarificationId: string) => {
      return `${JUKI_SERVICE_V2_URL}/contest/${key}/clarification/${clarificationId}`;
    },
    LOCK_SCOREBOARD: (key: string) => {
      return `${JUKI_SERVICE_V2_URL}/contest/${key}/lock-scoreboard`;
    },
    UNLOCK_SCOREBOARD: (key: string) => {
      return `${JUKI_SERVICE_V2_URL}/contest/${key}/unlock-scoreboard`;
    },
    DISABLE_UPSOLVING: (key: string) => {
      return `${JUKI_SERVICE_V2_URL}/contest/${key}/disable-upsolving`;
    },
    ENABLE_UPSOLVING: (key: string) => {
      return `${JUKI_SERVICE_V2_URL}/contest/${key}/enable-upsolving`;
    },
    CONTEST_MEMBERS: (key: string) => {
      return `${JUKI_SERVICE_V2_URL}/contest/${key}/members`;
    },
  },
  REJUDGE: {
    PROBLEM_COUNT: (problemJudgeKey: string) => {
      return `${JUKI_SERVICE_V2_URL}/rejudge/problem/${problemJudgeKey}/count`;
    },
    PROBLEM: (problemJudgeKey: string) => {
      return `${JUKI_SERVICE_V2_URL}/rejudge/problem/${problemJudgeKey}`;
    },
  },
  RANKING: {
    LIST: () => {
      return `${JUKI_SERVICE_V2_URL}/rank/list`;
    },
  },
};
