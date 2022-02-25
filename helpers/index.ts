import { OpenDialog, QueryParam } from '../config/constants';

export * from './permissions';
export { isStringJson, isObjectJson } from '@bit/juki-team.juki.commons';
export { classNames, downloadBlobAsFile, getSearchParamsObject, request, consoleWarn, settings } from '@bit/juki-team.juki.base-ui';

export const isOrHas = (value: string | string[] | undefined, v: string) => {
  return value === v || (Array.isArray(value) && value.includes(v));
};

export const addParamQuery = (value: string | string[] | undefined, v: string) => {
  if (isOrHas(value, v)) {
    return value;
  }
  if (value) {
    if (typeof value === 'string') {
      return [value, v];
    }
    return [...value, v];
  }
  return v;
};

export const subParamQuery = (value: string | string[] | undefined, v: string) => {
  if (!isOrHas(value, v)) {
    return value;
  }
  if (typeof value === 'string') {
    return null;
  }
  return value.filter(val => val !== v);
};

export const removeSubQuery = (query: { [key: string]: string | string[] | undefined }, queryParamKey: QueryParam, value: OpenDialog) => {
  const { [queryParamKey]: queryParam, ...restQuery } = query;
  if (Array.isArray(queryParam)) {
    const newQueryParam = queryParam.filter(v => v !== value);
    if (newQueryParam.length) {
      return { ...restQuery, [queryParamKey]: newQueryParam };
    }
  } else if (queryParam && queryParam !== value) {
    return { ...restQuery, [queryParamKey]: queryParam };
  }
  return { ...restQuery };
};

export const addSubQuery = (query: { [key: string]: string | string[] | undefined }, queryParamKey: string, value: string) => {
  const { [queryParamKey]: queryParam, ...restQuery } = query;
  if (isOrHas(queryParam, value)) {
    return { ...restQuery };
  }
  if (Array.isArray(queryParam)) {
    const newQueryParam = [...queryParam.filter(v => v !== value), value];
    return { ...restQuery, [queryParamKey]: newQueryParam };
  }
  if (queryParam) {
    return { ...restQuery, [queryParamKey]: [queryParam, value] };
  }
  return { ...restQuery, [queryParamKey]: value };
};
