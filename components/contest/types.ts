import { Dispatch, SetStateAction } from 'react';
import { EditCreateContestDTO } from 'types';

export interface EditContestProps {
  contest: EditCreateContestDTO,
  setContest: Dispatch<SetStateAction<EditCreateContestDTO>>,
  editing?: boolean
}
