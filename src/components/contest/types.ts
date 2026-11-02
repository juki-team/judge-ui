import { Dispatch, SetStateAction } from 'react';
import { UpsertContestDtoUI } from 'types';

export interface EditContestProps {
  contest: UpsertContestDtoUI,
  setContest: Dispatch<SetStateAction<UpsertContestDtoUI>>,
  editing?: boolean
}

export interface EditViewMembersContestProps {
  contest: UpsertContestDtoUI,
  setContest?: Dispatch<SetStateAction<UpsertContestDtoUI>>,
  editing?: boolean
}
