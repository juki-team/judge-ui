import { EntityState, ProblemScoringMode, ProblemType, UpsertProblemUIDTO } from 'types';
import { EMPTY_ENTITY_MEMBERS, EMPTY_TEXT_LANGUAGES } from './commons';

export const PROBLEM_DEFAULT = ({ nickname, imageUrl, companyKey, judgeKey, judgeIsExternal }: {
  nickname: string,
  imageUrl: string,
  companyKey: string,
  judgeKey: string,
  judgeIsExternal: boolean,
}): UpsertProblemUIDTO => {
  return {
    state: EntityState.RELEASED,
    judgeKey,
    judgeIsExternal,
    author: '',
    editorial: EMPTY_TEXT_LANGUAGES,
    name: '',
    shortname: '',
    settings: {
      timeLimit: 1000,
      memoryLimit: 256000,
      scoringMode: ProblemScoringMode.TOTAL,
      type: ProblemType.STANDARD,
      withPE: true,
      pointsByGroups: {},
      byProgrammingLanguage: {},
      evaluatorSource: '',
    },
    statement: {
      description: EMPTY_TEXT_LANGUAGES,
      input: EMPTY_TEXT_LANGUAGES,
      output: EMPTY_TEXT_LANGUAGES,
      sampleCases: [],
      note: EMPTY_TEXT_LANGUAGES,
      html: EMPTY_TEXT_LANGUAGES,
      pdfUrl: EMPTY_TEXT_LANGUAGES,
    },
    tags: [],
    members: EMPTY_ENTITY_MEMBERS(),
    owner: { nickname, imageUrl, company: { key: companyKey } },
    costs: {
      unlockEditorial: 0,
      unlockHint: 0,
      viewTestCases: 0,
    },
    rewardJukiCoins: {
      forSolving: 0,
      forSolvingFirstTry: 0,
      forSolvingInAnExtraLanguage: 0,
    },
  };
};
