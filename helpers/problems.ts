import { EntityAccess, Judge, ProblemScoringMode, ProblemType, UpsertProblemDTO, UpsertProblemUIDTO } from 'types';
import { EMPTY_TEXT_LANGUAGES } from '../config/constants';

export const toUpsertProblemDTO = (entity: UpsertProblemUIDTO): UpsertProblemDTO => ({
  members: {
    access: entity?.members?.access ?? EntityAccess.PRIVATE,
    managers: entity?.members?.managers ? Object.keys(entity.members.managers) : [],
    spectators: entity?.members?.spectators ? Object.keys(entity.members.spectators) : [],
  },
  name: entity?.name || '',
  author: entity?.author || '',
  settings: {
    timeLimit: entity?.settings?.timeLimit || 0,
    memoryLimit: entity?.settings?.memoryLimit || 0,
    withPE: entity?.settings?.withPE || false,
    type: entity?.settings?.type ?? ProblemType.STANDARD,
    mode: entity?.settings?.mode ?? ProblemScoringMode.SUBTASK,
    byProgrammingLanguage: entity?.settings?.byProgrammingLanguage ?? {},
    evaluatorSource: entity?.settings?.evaluatorSource || '',
    pointsByGroups: entity?.settings?.pointsByGroups ?? {},
  },
  tags: entity?.tags ?? [],
  statement: {
    description: entity?.statement?.description ?? EMPTY_TEXT_LANGUAGES,
    input: entity?.statement?.input ?? EMPTY_TEXT_LANGUAGES,
    output: entity?.statement?.output ?? EMPTY_TEXT_LANGUAGES,
    sampleCases: [],
    note: entity?.statement?.note ?? EMPTY_TEXT_LANGUAGES,
    html: entity?.statement?.html ?? EMPTY_TEXT_LANGUAGES,
  },
  editorial: entity?.editorial ?? EMPTY_TEXT_LANGUAGES,
  judge: entity?.judge ?? Judge.CUSTOMER,
});
