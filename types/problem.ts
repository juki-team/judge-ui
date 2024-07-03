import { DocumentMembersResponseDTO, UpsertProblemDTO } from 'types';

export type KeyFileType = 'input' | 'output';

export interface UpsertProblemUIDTO extends Omit<UpsertProblemDTO, 'members'> {
  members: DocumentMembersResponseDTO,
}
