import { DocumentMembersResponseDTO, Judge, UpsertProblemDTO, UserBasicInfoResponseDTO } from 'src/types/index';

export type KeyFileType = 'input' | 'output';

export interface UpsertProblemUIDTO extends Omit<UpsertProblemDTO, 'members'> {
  judgeKey: Judge | string,
  judgeIsExternal: boolean,
  members: DocumentMembersResponseDTO,
  owner: UserBasicInfoResponseDTO,
}

export enum PrintMode {
  AS_PROBLEM_SET = 'asProblemSet'
}
