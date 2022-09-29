import { ContestStatus } from '../types';
import { ContestProblemBasicType, CreateContestDTO } from './index';

export type EditContestProblemBasicType = ContestProblemBasicType & { name: string };

export type EditCreateContestType = CreateContestDTO & {
  status: ContestStatus,
  problems: { [key: string]: EditContestProblemBasicType },
}

export enum ContestTemplate {
  CLASSIC = 'CLASSIC',
  ENDLESS = 'ENDLESS',
  CUSTOM = 'CUSTOM',
}
