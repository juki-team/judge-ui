import { Dispatch, SetStateAction } from 'react';
import { UpsertContestDtoUI } from 'types';

export interface EditContestProps {
  contest: UpsertContestDtoUI,
  setContest: Dispatch<SetStateAction<UpsertContestDtoUI>>,
  editing?: boolean
}

export interface EditViewMembersContestProps {
  // only what it uses: the contest view passes its ContestDataUI, the editor its UpsertContestDtoUI
  contest: Pick<UpsertContestDtoUI, 'members' | 'owner'>,
  setContest?: Dispatch<SetStateAction<UpsertContestDtoUI>>,
  editing?: boolean
}
