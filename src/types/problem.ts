import type { EntityMembersResponseDTO, UpsertProblemDTO, UserOrganizationBasicInfoResponseDTO as UserCompanyBasicInfoResponseDTO } from '@juki-team/commons/dto';
import type { ProblemSampleCases } from '@juki-team/commons/types';
import { EntityState, Judge } from '@juki-team/commons/enums';

export type KeyFileType = 'input' | 'output';

export interface UpsertProblemUIDTO extends Omit<UpsertProblemDTO, 'members'> {
  judgeKey: Judge | string,
  judgeIsExternal: boolean,
  members: EntityMembersResponseDTO,
  owner: UserCompanyBasicInfoResponseDTO,
  state: EntityState,
}

export enum PrintMode {
  AS_PROBLEM_SET = 'asProblemSet'
}

export type StatementDTO = {
  description: string,
  input: string,
  output: string,
  note: string,
  sampleCases: ProblemSampleCases,
}
