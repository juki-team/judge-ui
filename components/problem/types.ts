import { Dispatch, SetStateAction } from 'react';
import { EditCreateProblemType } from '../../types';

export interface EditPropsProps {
  problem: EditCreateProblemType,
  setProblem: Dispatch<SetStateAction<EditCreateProblemType>>,
  editing?: boolean
}