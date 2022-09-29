import { Judge } from '../types';

export const getProblemUrl = (judge: Judge, key: string) => {
  if (judge === Judge.JUKI_JUDGE) {
    return `/problem/view/${key}`;
  }
  return '#';
};

export const getEditorSettingsStorageKey = (useNickname) => `jk-editor-settings-store/${useNickname}`;

export const getProblemsStoreKey = (useNickname) => `jk-problem-storage/${useNickname}`;

export const getSourcesStoreKey = (useNickname) => `jk-sources-storage/${useNickname}`;
