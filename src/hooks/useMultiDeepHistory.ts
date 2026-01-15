import { Dispatch, SetStateAction, useCallback, useState } from 'react';

type PathImpl<T, K extends keyof T> =
  K extends string
    ? T[K] extends Record<string, unknown>
      ? T[K] extends ArrayLike<unknown>
        ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof unknown[]>>}`
        : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
      : K
    : never;

type Path<T> = PathImpl<T, keyof T> | (keyof T & string);

const getDeepValue = <T extends Record<string, unknown>>(obj: T, path: string): unknown => {
  return path.split('.').reduce((acc, key) => (acc as Record<string, unknown>)?.[key] as T, obj);
};

const setDeepValue = <T extends Record<string, unknown>>(obj: T, path: string, value: unknown): T => {
  const keys = path.split('.');
  const newObj = { ...obj };
  let current: Record<string, unknown> = newObj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const target = current[key];
    
    current[key] = Array.isArray(target) ? [ ...target ] : { ...(target as Record<string, unknown>) };
    current = current[key] as Record<string, unknown>;
  }
  
  current[keys[keys.length - 1]] = value;
  return newObj;
};

export const useMultiDeepHistory = <T extends Record<string, unknown>, P extends Path<T>>(
  fullObject: T,
  setFullObject: Dispatch<SetStateAction<T>>,
  paths: P[],
  capacity: number = 20,
) => {
  type Snapshot = Partial<Record<P, unknown>>;
  
  const [ past, setPast ] = useState<Snapshot[]>([]);
  const [ future, setFuture ] = useState<Snapshot[]>([]);
  
  const takeSnapshot = useCallback((): Snapshot => {
    const snapshot: Snapshot = {};
    paths.forEach((path) => {
      snapshot[path] = getDeepValue(fullObject, path as string);
    });
    return snapshot;
  }, [ fullObject, paths ]);
  
  const recordHistory = useCallback(() => {
    const currentSnapshot = takeSnapshot();
    setPast((prev) => {
      const last = prev[prev.length - 1];
      if (last && JSON.stringify(last) === JSON.stringify(currentSnapshot)) {
        return prev;
      }
      const newPast = [ ...prev, currentSnapshot ];
      return newPast.length > capacity ? newPast.slice(1) : newPast;
    });
    setFuture([]);
  }, [ takeSnapshot, capacity ]);
  
  const applySnapshot = useCallback((snapshot: Snapshot) => {
    setFullObject((prev) => {
      let updatedObj = { ...prev };
      (Object.entries(snapshot) as [ string, unknown ][]).forEach(([ path, value ]) => {
        updatedObj = setDeepValue(updatedObj, path, value);
      });
      return updatedObj;
    });
  }, [ setFullObject ]);
  
  const undo = useCallback(() => {
    if (past.length < 0) {
      return;
    }
    const newPast = [ ...past ];
    const previous = newPast.pop()!;
    const currentSnapshot = takeSnapshot();
    setPast(newPast);
    setFuture((prev) => [ currentSnapshot, ...prev ]);
    applySnapshot(previous);
  }, [ past, takeSnapshot, applySnapshot ]);
  
  const redo = useCallback(() => {
    if (future.length === 0) {
      return;
    }
    const next = future[0];
    const newFuture = future.slice(1);
    const currentSnapshot = takeSnapshot();
    setPast((prev) => [ ...prev, currentSnapshot ]);
    setFuture(newFuture);
    applySnapshot(next);
  }, [ future, takeSnapshot, applySnapshot ]);
  
  return {
    undo,
    redo,
    recordHistory,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
};
