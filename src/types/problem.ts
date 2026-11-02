import {
  EntityMembersResponseDto,
  EntityState,
  Judge,
  ProblemSampleCasesType,
  UpsertProblemDto,
  UserOrganizationBasicInfoResponseDto,
} from './commons';

export type KeyFileType = 'input' | 'output';

export interface UpsertProblemUIDTO extends Omit<UpsertProblemDto, 'members'> {
  judgeKey: Judge | string,
  judgeIsExternal: boolean,
  members: EntityMembersResponseDto,
  owner: UserOrganizationBasicInfoResponseDto,
  state: EntityState,
}

export enum PrintMode {
  AS_PROBLEM_SET = 'asProblemSet'
}

export type StatementDto = {
  description: string,
  input: string,
  output: string,
  note: string,
  sampleCases: ProblemSampleCasesType,
}
