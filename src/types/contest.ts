import type { ContestDataResponseDTO, EntityOrganizationSummaryListResponseDTO as EntityCompanySummaryListResponseDTO, EntityMembersResponseDTO, ProblemJudgeSummaryListResponseDTO, UpsertContestDTO, UpsertContestProblemDTO } from '@juki-team/commons/dto';
import { EntityState } from '@juki-team/commons/enums';

export type UpsertContestProblemDTOUI = UpsertContestProblemDTO & {
  name: string,
  judge: ProblemJudgeSummaryListResponseDTO,
  tags: string[],
  company: EntityCompanySummaryListResponseDTO,
};

export interface UpsertContestDTOUI extends Omit<UpsertContestDTO, 'members'> {
  owner: ContestDataResponseDTO['owner'],
  members: EntityMembersResponseDTO,
  problems: { [key: string]: UpsertContestProblemDTOUI },
  state: EntityState,
}

export enum ContestTemplate {
  CLASSIC = 'CLASSIC',
  ENDLESS = 'ENDLESS',
  GLOBAL = 'GLOBAL',
  CUSTOMIZED = 'CUSTOMIZED',
}
