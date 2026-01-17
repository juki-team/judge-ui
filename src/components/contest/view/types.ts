import {
  ContestClarificationsResponseDTO,
  ContestDataResponseDTO,
  ContestEventsResponseDTO,
  ContestMembersResponseDTO,
  ScoreboardResponseDTO,
} from 'types';

export type ScoreboardResponseDTOUI = ScoreboardResponseDTO & { official: boolean };

export type BunchScoreboardResponseDTOUI = ScoreboardResponseDTO & { official: boolean, order: number };

export interface ScoreboardResponseDTOFocus extends ScoreboardResponseDTOUI {
  focus?: { problemKey: string, success: boolean, points: number }[],
  diff?: { problemKey: string, pendingAttempts: number, focus: boolean }[],
}

export type ContestDataUI =
  ContestDataResponseDTO
  & ContestEventsResponseDTO
  & ContestClarificationsResponseDTO
  & ContestMembersResponseDTO;
