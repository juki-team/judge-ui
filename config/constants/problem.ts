import { Judge, ProblemMode, ProblemStatus, ProblemType } from '@juki-team/commons';
import { EditCreateProblem } from 'types';

export const PROBLEM_DEFAULT = (): EditCreateProblem => {
  return {
    author: '',
    editorial: '',
    judge: Judge.JUKI_JUDGE,
    key: '',
    name: '',
    ownerNickname: '',
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
    },
    statement: { description: '', input: '', output: '' },
    status: ProblemStatus.RESERVED,
    tags: [],
  };
};
