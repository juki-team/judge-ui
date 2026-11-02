import { EntityState } from 'types';
import {
  ContestDataResponseDto,
  EntityOrganizationSummaryListResponseDto,
  EntityMembersResponseDto,
  ProblemJudgeSummaryListResponseDto,
  UpsertContestProblemDto,
} from './commons';
import { UpsertContestDto } from './index';

export type UpsertContestProblemDtoUI = UpsertContestProblemDto & {
  name: string,
  judge: ProblemJudgeSummaryListResponseDto,
  tags: string[],
  organization: EntityOrganizationSummaryListResponseDto,
};

export interface UpsertContestDtoUI extends Omit<UpsertContestDto, 'members'> {
  owner: ContestDataResponseDto['owner'],
  members: EntityMembersResponseDto,
  problems: { [key: string]: UpsertContestProblemDtoUI },
  state: EntityState,
}

export enum ContestTemplate {
  CLASSIC = 'CLASSIC',
  ENDLESS = 'ENDLESS',
  GLOBAL = 'GLOBAL',
  CUSTOMIZED = 'CUSTOMIZED',
}
