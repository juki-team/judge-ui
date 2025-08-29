import {
  EntityMembersResponseDTO,
  EntityState,
  Judge,
  UpsertProblemDTO,
  UserCompanyBasicInfoResponseDTO,
} from './commons';

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
