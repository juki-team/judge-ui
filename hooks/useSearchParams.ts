import { AppendSearchParamsType, DeleteSearchParamsType, SetSearchParamsType } from '@juki-team/base-ui';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from './useRouter';

const cloneURLSearchParams = (urlSearchParams: URLSearchParams) => {
  return new URLSearchParams(urlSearchParams.toString());
};

export const useSearchParams = () => {
  
  const { query, push } = useRouter();
  
  const searchParams = useMemo(() => {
    const urlSearchParams = new URLSearchParams('');
    for (const [ key, values ] of Object.entries(query)) {
      if (typeof values === 'string') {
        urlSearchParams.append(key, values);
      } else if (Array.isArray(values)) {
        for (const value of values) {
          urlSearchParams.append(key, value);
        }
      }
    }
    return urlSearchParams;
  }, [ query ]);
  
  const [ updateTrigger, setUpdateTrigger ] = useState(Date.now());
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;
  const updateSearchParams = useCallback(async (newSearchParams: URLSearchParams) => {
    const newSearchParamsSorted = cloneURLSearchParams(newSearchParams);
    const searchParamsSorted = cloneURLSearchParams(searchParamsRef.current);
    newSearchParamsSorted.sort();
    searchParamsSorted.sort();
    if (newSearchParamsSorted.toString() !== searchParamsSorted.toString()) {
      await push({ query: newSearchParams.toString() });
    }
  }, []);
  type AppendSearchParamsActions = {
    action: 'appendSearchParams',
    props: { name: string, value: string }[],
  } | {
    action: 'deleteSearchParams',
    props: { name: string, value?: string }[],
  } | {
    action: 'setSearchParams',
    props: { name: string, value: string | string[] }[],
  }
  
  const appendSearchParamsActionsRef = useRef<AppendSearchParamsActions[]>([]);
  
  useEffect(() => {
    const chunkUpdateSearchParams = async () => {
      const newSearchParams = cloneURLSearchParams(searchParamsRef.current);
      for (const searchParamsActions of appendSearchParamsActionsRef.current) {
        if (searchParamsActions.action === 'appendSearchParams') {
          for (const { name, value } of searchParamsActions.props) {
            newSearchParams.append(name, value);
          }
        } else if (searchParamsActions.action === 'deleteSearchParams') {
          for (const { name, value } of searchParamsActions.props) {
            const values = newSearchParams.getAll(name);
            newSearchParams.delete(name);
            if (value !== undefined) {
              for (const v of values) {
                if (v !== value) {
                  newSearchParams.append(name, v);
                }
              }
            }
          }
        } else if (searchParamsActions.action === 'setSearchParams') {
          for (const { name, value } of searchParamsActions.props) {
            newSearchParams.delete(name);
            let values: string[] = [];
            if (typeof value === 'string') {
              values.push(value);
            } else {
              values = value;
            }
            for (const value of values) {
              newSearchParams.append(name, value);
            }
          }
        }
      }
      if (appendSearchParamsActionsRef.current.length) {
        appendSearchParamsActionsRef.current = [];
        await updateSearchParams(newSearchParams);
      }
    };
    void chunkUpdateSearchParams();
  }, [ searchParams, updateTrigger ]);
  
  const appendSearchParams: AppendSearchParamsType = useCallback(async (...props) => {
    appendSearchParamsActionsRef.current.push({ action: 'appendSearchParams', props });
    setUpdateTrigger(Date.now());
  }, []);
  
  const deleteSearchParams: DeleteSearchParamsType = useCallback(async (...props) => {
    appendSearchParamsActionsRef.current.push({ action: 'deleteSearchParams', props });
    setUpdateTrigger(Date.now());
  }, []);
  
  const setSearchParams: SetSearchParamsType = useCallback(async (...props) => {
    appendSearchParamsActionsRef.current.push({ action: 'setSearchParams', props });
    setUpdateTrigger(Date.now());
  }, []);
  
  return { searchParams, appendSearchParams, deleteSearchParams, setSearchParams };
};