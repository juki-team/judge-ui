import { Judge, Language, ProblemMode, ProblemStatus, ProblemType } from '@juki-team/commons';
import { EditCreateProblemType } from 'types';

export const PROBLEM_DEFAULT = (): EditCreateProblemType => {
  return {
    author: '',
    editorial: { [Language.ES]: '', [Language.EN]: '' },
    key: '',
    name: '',
    sampleCases: [],
    settings: {
      timeLimit: 2,
      memoryLimit: 2,
      languages: [],
      mode: ProblemMode.TOTAL,
      type: ProblemType.STANDARD,
      withPE: true,
      pointsByGroups: {},
      byProgrammingLanguage: {},
      evaluatorSource: '',
    },
    statement: {
      description: {
        [Language.EN]: '',
        [Language.ES]: '',
      },
      input: '',
      output: '',
    },
    status: ProblemStatus.RESERVED,
    tags: [],
  };
};
