import { ContentResponseType, Judge, PointsByGroupsType, ProblemLanguagesType, ProblemResponseDTO, ProblemState } from '../types';

export const dataToProblemResponseDTO = (data: ContentResponseType<ProblemState>) => {
  const languages: ProblemLanguagesType = {};
  (data.content?.settings?.languages || []).forEach(language => {
    languages[language] = {
      language,
      timeLimit: data.content?.settings?.timeLimit || 0,
      memoryLimit: data.content?.settings?.memoryLimit || 0,
    };
  });
  const pointsByGroups: PointsByGroupsType = {};
  (Object.entries(data.content?.settings?.groupsPoint || {}).forEach(([group, points]) => {
    pointsByGroups[group] = {
      points,
      partial: 0,
    };
  }));
  pointsByGroups[0] = { points: 0, partial: 0 };
  const problem: ProblemResponseDTO = {
    judge: Judge.JUKI_JUDGE,
    author: data?.content?.author || '',
    key: data?.content?.id || '',
    languages,
    mode: data?.content?.settings?.mode,
    name: data?.content?.name,
    ownerNickname: data?.content?.ownerNickname,
    pointsByGroups,
    sampleCases: data?.content?.samples,
    statement: {
      description: data?.content?.description?.general,
      input: data?.content?.description?.input,
      output: data?.content?.description?.output,
    },
    status: data?.content?.status,
    tags: data?.content?.tags || [],
    type: data?.content?.settings?.typeInput,
  };
  return problem;
};

export const getProblemUrl = (judge: Judge, key: string) => {
  if (judge === Judge.JUKI_JUDGE) {
    return `/problem/view/${key}`;
  }
  return '#';
};

export const getEditorSettingsStorageKey = (useNickname) => `jk-editor-settings-store/${useNickname}`;

export const getProblemsStoreKey = (useNickname) => `jk-problem-storage/${useNickname}`;
