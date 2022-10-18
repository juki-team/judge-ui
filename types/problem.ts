import { CreateProblemDTO } from 'types';

export interface EditCreateProblemType extends CreateProblemDTO {
  key: string,
}

export type KeyFileType = 'input' | 'output';
