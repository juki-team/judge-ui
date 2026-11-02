import {
  ContestClarificationsResponseDto,
  ContestDataResponseDto,
  ContestEventsResponseDto,
  ContestMembersResponseDto,
  ScoreboardResponseDto,
} from 'types';

export type ScoreboardResponseDtoUI = ScoreboardResponseDto & { official: boolean };

export type BunchScoreboardResponseDtoUI = ScoreboardResponseDto & {
  official: boolean,
  order: number,
  label: string,
  color: string
};

export interface ScoreboardResponseDtoFocus extends ScoreboardResponseDtoUI {
  focus?: { problemKey: string, success: boolean, points: number }[],
  diff?: { problemKey: string, pendingAttempts: number, focus: boolean }[],
}

export type ContestDataUI =
  ContestDataResponseDto
  & ContestEventsResponseDto
  & ContestClarificationsResponseDto
  & ContestMembersResponseDto;
