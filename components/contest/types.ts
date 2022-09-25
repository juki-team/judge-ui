import { Dispatch, SetStateAction } from 'react';
import { EditCreateContest } from 'types';

export interface EditContestProps {
  contest: EditCreateContest,
  setContest: Dispatch<SetStateAction<EditCreateContest>>,
  editing?: boolean
}
