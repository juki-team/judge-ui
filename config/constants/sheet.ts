import { CreateSheetDTO, SheetStatus } from 'types';

export const SHEET_DEFAULT = (): CreateSheetDTO & { key: string } => {
  return {
    key: '',
    status: SheetStatus.PUBLIC,
    title: '',
    description: '',
    body: [],
  };
};
