import { ContestStatus, ProblemVerdict, ProgrammingLanguage } from '../types';
import { ContestProblemBasicType, CreateContestDTO } from './index';

export type BaseClarification = {
  answer: string, // si es judge o admi
  publicVisible: boolean// si es judge o admi
}

export interface NewClarification extends BaseClarification {
  problem: string,
  question: string,
}

export interface AnswerClarification extends NewClarification {
  answered: boolean,
  answeredTime: number,
  judgeType: false,
  user: string,
  userAnswer: string
  id: string,
}

export interface Submission {
  answer: ProblemVerdict,
  submitId: string,
  when: number,
  timeUsed: number,
  memoryUsed: number,
  language: ProgrammingLanguage,
  submitPoints: number,
}

export interface ContestState {
  canRegister: boolean,
  canRejudge: boolean,
  canUpdate: boolean,
  canViewProblems: boolean,
  canViewScoreBoard: boolean,
  description: string,
  key: string,
  name: string,
  problems: { [key: string]: { index: string, color: string, points: number, name: string } },
  registered: boolean,
  settings: {},
  status: ContestStatus,
  tags: [],
  timing: {},
  totalRegistered: number,
}

export interface EditCreateContestDTO extends CreateContestDTO {
  problems: { [key: string]: ContestProblemBasicType & { name: string } },
}
