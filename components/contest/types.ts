import { Dispatch, SetStateAction } from 'react';
import { UpsertContestDTOUI } from 'types';

export interface EditContestProps {
  contest: UpsertContestDTOUI,
  setContest: Dispatch<SetStateAction<UpsertContestDTOUI>>,
  editing?: boolean
}

export interface EditViewMembersContestProps {
  contest: UpsertContestDTOUI,
  setContest?: Dispatch<SetStateAction<UpsertContestDTOUI>>,
  editing?: boolean
}
