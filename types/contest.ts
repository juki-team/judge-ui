import { ContestProblemBasicType, CreateContestDTO } from './index';

export type EditContestProblemBasicType = ContestProblemBasicType & { name: string };

export type EditCreateContestType = CreateContestDTO & {
  problems: { [key: string]: EditContestProblemBasicType },
}

export enum ContestTemplate {
  CLASSIC = 'CLASSIC',
  ENDLESS = 'ENDLESS',
  CUSTOM = 'CUSTOM',
}
