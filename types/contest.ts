import { ContestStatus, Judge, ProblemVerdict, ProgrammingLanguage } from '../types';

export type MetaProblemSearcher = {
  name: string,
  url: string,
  id: string,
  rating: number,
  tag: string,
  judge: Judge
};

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

export enum ContestSettingsParams {
  START = 'start',
  CLARIFICATIONS = 'clarifications',
  OPEN_REGISTRATION = 'openRegistration',
  OPEN_SCOREBOARD = 'openScoreboard',
  LIMIT_PROBLEM_TIME = 'limitProblemTime',
  LANGUAGES = 'languages',
  FROZEN = 'frozen',
  MANUAL_JUDGE = 'manualJudge',
  NUMBER_MANUAL_JUDGES = 'numberManualJudges'
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
  problems: { [key: string]: { index: string, color: string, points: number } },
  registered: boolean,
  settings: {},
  status: ContestStatus,
  tags: [],
  timing: {},
  totalRegistered: number,
}