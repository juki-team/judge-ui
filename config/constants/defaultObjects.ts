import { QueryParam } from './routes';

export const DEFAULT_DATA_VIEWER_PROPS = {
  getPageQueryParam: (name: string) => (name ? name + '.' : name) + QueryParam.PAGE_TABLE,
  getPageSizeQueryParam: (name: string) => (name ? name + '.' : name) + QueryParam.PAGE_SIZE_TABLE,
  getSortQueryParam: (name: string) => (name ? name + '.' : name) + QueryParam.SORT_TABLE,
  getFilterQueryParam: (name: string) => (name ? name + '.' : name) + QueryParam.FILTER_TABLE,
  getViewModeQueryParam: (name: string) => (name ? name + '.' : name) + QueryParam.VIEW_MODE_TABLE,
};
