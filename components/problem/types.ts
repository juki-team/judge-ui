import { Dispatch, SetStateAction } from 'react';
import { EditCreateProblem } from '../../types';

export interface EditPropsProps {
  problem: EditCreateProblem,
  setProblem: Dispatch<SetStateAction<EditCreateProblem>>,
  editing?: boolean
}