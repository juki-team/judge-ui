import {
  ContestClarificationsResponseDTO,
  ContestDataResponseDTO,
  ContestEventsResponseDTO,
  ContestMembersResponseDTO,
  ScoreboardResponseDTO,
} from 'types';

export interface ScoreboardResponseDTOFocus extends ScoreboardResponseDTO {
  focus?: { problemKey: string, success: boolean, points: number }[],
  diff?: { problemKey: string, pendingAttempts: number }[],
}

export type ContestDataUI =
  ContestDataResponseDTO
  & ContestEventsResponseDTO
  & ContestClarificationsResponseDTO
  & ContestMembersResponseDTO;
