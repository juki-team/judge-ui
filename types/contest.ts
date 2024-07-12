import { ContestDataResponseDTO, EntityMembersResponseDTO } from '@juki-team/commons';
import { UpsertContestProblemDTO } from 'types';
import { UpsertContestDTO } from './index';

export type UpsertContestProblemDTOUI = UpsertContestProblemDTO & { name: string, judgeKey: string };

export interface UpsertContestDTOUI extends Omit<UpsertContestDTO, 'members'> {
  owner: ContestDataResponseDTO['owner'],
  members: EntityMembersResponseDTO,
  problems: { [key: string]: UpsertContestProblemDTOUI },
}

export enum ContestTemplate {
  CLASSIC = 'CLASSIC',
  ENDLESS = 'ENDLESS',
  CUSTOM = 'CUSTOM',
}
