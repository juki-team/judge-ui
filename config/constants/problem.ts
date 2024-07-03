import { EntityAccess, Judge, ProblemScoringMode, ProblemType, UpsertProblemUIDTO } from 'types';
import { EMPTY_TEXT_LANGUAGES } from './commons';

export const PROBLEM_DEFAULT = ({ nickname, imageUrl }: { nickname: string, imageUrl: string }): UpsertProblemUIDTO => {
  return {
    judge: Judge.CUSTOMER,
    author: '',
    editorial: EMPTY_TEXT_LANGUAGES,
    name: '',
    settings: {
      timeLimit: 1000,
      memoryLimit: 256000,
      mode: ProblemScoringMode.TOTAL,
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
    },
    tags: [],
    members: {
      access: EntityAccess.PRIVATE,
      managers: {},
      spectators: {},
    },
    owner: { nickname, imageUrl },
  };
};
