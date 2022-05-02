import { searchParamsObjectTypeToQuery } from 'helpers';
import { useDataViewerRequester, useRouter } from 'hooks';
import { useCallback, useRef } from 'react';
import { ContentsResponseType, ReactNodeOrFunctionType } from 'types';
import { DataViewer, DataViewerHeadersType } from '../index';

export const PagedDataViewer = <T, V>({
  headers,
  name,
  toRow,
  url,
  refreshInterval,
  extraButtons,
}: { headers: DataViewerHeadersType<T>[], name: string, toRow: (row: V, index: number) => T, url: (page: number, size: number) => string, refreshInterval?: number, extraButtons?: ReactNodeOrFunctionType }) => {
  
  const { queryObject, push } = useRouter();
  
  const page = +queryObject[name + '.page']?.[0];
  const size = +queryObject[name + '.pageSize']?.[0];
  const {
    data: response,
    request,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponseType<V>>(page && size && url(page, size), { refreshInterval });
  
  const lastTotalRef = useRef(0);
  
  lastTotalRef.current = response?.success ? response.meta.totalElements : lastTotalRef.current;
  
  const setSearchParamsObject = useCallback(params => push({ query: searchParamsObjectTypeToQuery(params) }), []);
  
  const data: T[] = (response?.success ? response.contents : []).map(toRow);
  
  return (
    <DataViewer<T>
      headers={headers}
      data={data}
      rows={{ height: 68 }}
      request={request}
      name={name}
      setLoaderStatusRef={setLoaderStatusRef}
      extraButtons={extraButtons}
      searchParamsObject={queryObject}
      setSearchParamsObject={setSearchParamsObject}
      pagination={{ total: lastTotalRef.current, pageSizeOptions: [16, 32, 64, 128, 256, 512] }}
    />
  );
};

export {
  Timer,
  TimerLabeled,
  AlertModal,
  AppsIcon,
  ArrowIcon,
  AssignmentIcon,
  Button,
  ButtonLoader,
  CheckIcon,
  CloseIcon,
  CloudUploadIcon,
  CodeEditorKeyMap,
  CodeEditorTheme,
  CodeRunnerEditor, SettingIcon,
  CodeViewer,
  ConstructionIcon,
  CopyIcon,
  CopyToClipboard,
  CupIcon,
  DataViewer,
  DateField,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
  ExclamationIcon,
  ExternalIcon,
  EyeIcon,
  Field,
  FilterIcon,
  FloatToolbar,
  HeadlineIcon,
  HomeIcon,
  HorizontalMenu,
  ImageUploaderModal,
  InfoCircleIcon,
  Input,
  InputPassword,
  InputToggle,
  JukiBaseUiProvider,
  JukiCompleteLaptopImage,
  JukiCouchLogoHorImage,
  JukiJudgeLogoHorImage,
  JukiSurprisedImage,
  JukiUtilsLogoHorImage,
  BalloonIcon,
  LayoutIcon,
  LinkIcon,
  LoaderLayer,
  LockIcon,
  LoadingIcon,
  LoginModal,
  MailIcon,
  MdMathEditor,
  MdMathViewer,
  MenuIcon,
  Modal,
  NotFound,
  PlaceIcon,
  PlusIcon,
  Popover,
  ReloadIcon,
  SaveIcon,
  SchoolIcon,
  JukiCourtImage,
  Select,
  SignUpModal,
  DateLiteral,
  SplitPane,
  MultiSelect,
  T,
  Tabs,
  TextArea,
  TextField,
  TextHeadCell,
  UpIcon,
  useNotification,
} from '@juki-team/base-ui';

export type {
  CodeEditorTestCasesType,
  DataViewerHeadersType,
  FilterSelectOfflineType,
} from '@juki-team/base-ui';
