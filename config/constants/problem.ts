import { EditCreateProblemType, ProblemMode, ProblemStatus, ProblemType } from 'types';
import { EmptyTextLanguages } from './commons';

export const PROBLEM_DEFAULT = (): EditCreateProblemType => {
  return {
    author: '',
    editorial: EmptyTextLanguages,
    key: '',
    name: '',
    settings: {
      timeLimit: 1000,
      memoryLimit: 256000,
      mode: ProblemMode.TOTAL,
      type: ProblemType.STANDARD,
      withPE: true,
      pointsByGroups: {},
      byProgrammingLanguage: {},
      evaluatorSource: '',
    },
    statement: {
      description: EmptyTextLanguages,
      input: EmptyTextLanguages,
      output: EmptyTextLanguages,
      sampleCases: [],
      note: EmptyTextLanguages,
      html: EmptyTextLanguages,
    },
    status: ProblemStatus.RESERVED,
    tags: [],
  };
};
