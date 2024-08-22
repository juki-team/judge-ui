import { DocumentMembersResponseDTO, Judge, UpsertProblemDTO, UserBasicInfoResponseDTO } from 'types';

export type KeyFileType = 'input' | 'output';

export interface UpsertProblemUIDTO extends Omit<UpsertProblemDTO, 'members'> {
  judgeKey: Judge | string,
  judgeIsExternal: boolean,
  members: DocumentMembersResponseDTO,
  owner: UserBasicInfoResponseDTO,
}
