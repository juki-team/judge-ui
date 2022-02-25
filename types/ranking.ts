export interface RankingUserState {
  country: string,
  key: string,
  nickname: string,
  points: string,
  institution: string,
  imageUrl: string,
}

export type RankingState = { [key: string]: RankingUserState };

export enum RankingActions {
  REPLACE_RANKING = 'REPLACE_RANKING',
}

interface ReplaceRankingType {
  type: RankingActions.REPLACE_RANKING,
  rankingList: RankingState
}

export type RakingActionTypes = ReplaceRankingType;
