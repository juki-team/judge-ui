import { ProblemMode, ProblemStatus, ProblemType, ProgrammingLanguage } from '@bit/juki-team.juki.commons';
import { Judge, PagedArray } from '~/types';
import { Submission } from './contest';

export interface TestSampleType {
  input: string,
  output: string
}

export interface ProblemOverview {
  name: string,
  description: {
    general: string,
    input: string,
    output: string
  },
  samples: Array<TestSampleType>,
  settings: {
    timeLimit: number,
    memoryLimit: number,
    typeInput: ProblemType,
    typeOutput: ProblemType,
    mode: ProblemMode,
    evaluatorSource: string,
    languages: ProgrammingLanguage[],
    groupsPoint: { [key: string]: number }
  },
}

export interface ContestProblem extends ProblemOverview {
  index: string, // "A", "B", "C",...
  id: string,
  judge: Judge,
  link: string
  points: number,
  start: number,
  duration: number,
  color: string,
  myPoints: number,
  successRate: number,
  active: boolean
}

export interface ProblemNewState extends ProblemOverview {
  status: ProblemStatus,
  author: string,
  tags: Array<string>
}

export interface SubmissionProblem extends Submission {
  imageUrl: string,
  nickname: string
}

export interface ProblemState extends ProblemNewState {
  id: string,
  date: number,
  successRate: number,
  ownerNickname: string,
  rating: number,
  submissions: PagedArray<SubmissionProblem>
}

export type ProblemsState = { [key: string]: ProblemState };

export interface ProblemMetaState {
  id: string,
  name: string,
  tags: Array<string>,
  successRate: number
}

export enum ProblemActions {
  UPDATE_PROBLEMS = 'UPDATE_PROBLEMS'
}

interface UpdateProblemsType {
  type: ProblemActions.UPDATE_PROBLEMS,
  problems: Array<ProblemState>
}

export type ProblemActionTypes = UpdateProblemsType;

export enum ProblemsListActions {
  REPLACE_PROBLEMS_LIST = 'REPLACE_PROBLEMS_LIST'
}

interface ReplaceProblemsListType {
  type: ProblemsListActions.REPLACE_PROBLEMS_LIST,
  problems: Array<string>
}

export type ProblemsListActionTypes = ReplaceProblemsListType;
