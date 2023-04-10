import { EditCreateProblemType, Language, ProblemMode, ProblemStatus, ProblemType } from 'types';

export const PROBLEM_DEFAULT = (): EditCreateProblemType => {
  return {
    author: '',
    editorial: { [Language.ES]: '', [Language.EN]: '' },
    key: '',
    name: '',
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
      html: {
        [Language.EN]: '',
        [Language.ES]: '',
      },
      sampleCases: [],
    },
    status: ProblemStatus.RESERVED,
    tags: [],
  };
};
