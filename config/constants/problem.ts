import { Language, ProblemMode, ProblemStatus, ProblemType } from '@juki-team/commons';
import { EditCreateProblemType } from 'types';

export const PROBLEM_DEFAULT = (): EditCreateProblemType => {
  return {
    author: '',
    editorial: { [Language.ES]: '', [Language.EN]: '' },
    key: '',
    name: '',
    sampleCases: [],
    settings: {
      timeLimit: 1000,
      memoryLimit: 256000,
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
      input: {
        [Language.EN]: '',
        [Language.ES]: '',
      },
      output: {
        [Language.EN]: '',
        [Language.ES]: '',
      },
    },
    status: ProblemStatus.RESERVED,
    tags: [],
  };
};
