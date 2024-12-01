import {
  ContestDataResponseDTO,
  EntityMembersResponseDTO,
  ProblemJudgeSummaryListResponseDTO,
  UpsertContestProblemDTO,
} from 'src/types/index';
import { UpsertContestDTO } from './index';

export type UpsertContestProblemDTOUI = UpsertContestProblemDTO & {
  name: string,
  judge: ProblemJudgeSummaryListResponseDTO,
};

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
