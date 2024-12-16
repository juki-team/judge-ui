import { DocumentMembersResponseDTO, Judge, UpsertProblemDTO, UserCompanyBasicInfoResponseDTO } from 'src/types/index';

export type KeyFileType = 'input' | 'output';

export interface UpsertProblemUIDTO extends Omit<UpsertProblemDTO, 'members'> {
  judgeKey: Judge | string,
  judgeIsExternal: boolean,
  members: DocumentMembersResponseDTO,
  owner: UserCompanyBasicInfoResponseDTO,
}

export enum PrintMode {
  AS_PROBLEM_SET = 'asProblemSet'
}
