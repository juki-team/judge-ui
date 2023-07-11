import { Dispatch, SetStateAction } from 'react';
import { EditCreateContestType } from 'types';

export interface EditContestProps {
  contest: EditCreateContestType,
  setContest: Dispatch<SetStateAction<EditCreateContestType>>,
  editing?: boolean
}

export interface EditCreateContestProps {
  contest?: EditCreateContestType;
}
