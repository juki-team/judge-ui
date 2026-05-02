import { type ContestClarificationsResponseDTO, type ContestDataResponseDTO, type ContestEventsResponseDTO, type ContestMembersResponseDTO, type ScoreboardResponseDTO } from '@juki-team/commons/dto';

export type ScoreboardResponseDTOUI = ScoreboardResponseDTO & { official: boolean };

export type BunchScoreboardResponseDTOUI = ScoreboardResponseDTO & {
  official: boolean,
  order: number,
  label: string,
  color: string
};

export interface ScoreboardResponseDTOFocus extends ScoreboardResponseDTOUI {
  focus?: { problemKey: string, success: boolean, points: number }[],
  diff?: { problemKey: string, pendingAttempts: number, focus: boolean }[],
}

export type ContestDataUI =
  ContestDataResponseDTO
  & ContestEventsResponseDTO
  & ContestClarificationsResponseDTO
  & ContestMembersResponseDTO;
