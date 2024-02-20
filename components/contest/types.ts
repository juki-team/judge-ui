import { Dispatch, SetStateAction } from 'react';
import { ContestResponseDTO, EditCreateContestType } from 'types';

export interface EditContestProps {
  contest: EditCreateContestType,
  setContest: Dispatch<SetStateAction<EditCreateContestType>>,
  editing?: boolean
}

export interface EditCreateContestProps {
  contest?: EditCreateContestType;
}

export interface EditViewMembersContestProps {
  contest: EditCreateContestType,
  membersToView?: ContestResponseDTO['members'],
  setContest?: Dispatch<SetStateAction<EditCreateContestType>>,
  editing?: boolean
}
