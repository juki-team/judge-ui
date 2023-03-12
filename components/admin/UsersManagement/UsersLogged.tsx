import {
  ButtonLoader,
  CloseIcon,
  DataViewer,
  DateField,
  DeleteIcon,
  Field,
  InputToggle,
  T,
  TextHeadCell,
  UserChip,
} from 'components';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, classNames, cleanRequest } from 'helpers';
import { useDataViewerRequester, useJukiUser, useNotification, useSWR } from 'hooks';
import { useMemo, useState } from 'react';
import {
  ContentResponseType,
  ContentsResponseType,
  DataViewerHeadersType,
  FilterTextOfflineType,
  HTTPMethod,
  QueryParam,
  Status,
  UserManagementSessionResponseDTO,
} from 'types';

export function UsersLogged() {
  
  const { deleteUserSession } = useJukiUser();
  const [withGuests, setWithGuests] = useState(false);
  const {
    data: response,
    request,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponseType<UserManagementSessionResponseDTO>>(withGuests ? JUDGE_API_V1.USER.ALL_ONLINE_USERS() : JUDGE_API_V1.USER.ONLINE_USERS());
  
  const columns: DataViewerHeadersType<UserManagementSessionResponseDTO>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<><T className="tt-ue">id</T>/<T className="tt-ue">user</T></>} />,
      index: 'id',
      field: ({ record: { id, user: { imageUrl, nickname, givenName, familyName, email } } }) => (
        <Field className="jk-col center">
          <UserChip imageUrl={imageUrl} nickname={nickname} givenName={givenName} familyName={familyName} email={email} />
          <div className="jk-row">{id}</div>
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.id.localeCompare(rowB.id) },
      filter: {
        type: 'text', callbackFn: ({ text }) => ({ user: { givenName, familyName, nickname, email } }) => {
          const regExp = new RegExp(text, 'gi');
          return !!(nickname?.match?.(regExp)) || !!(givenName?.match?.(regExp)) || !!(familyName?.match?.(regExp)) || !!(email?.match?.(regExp));
        },
      } as FilterTextOfflineType<UserManagementSessionResponseDTO>,
      cardPosition: 'top',
      minWidth: 400,
    },
    {
      head: <TextHeadCell text={<T className="tt-ue">created at</T>} />,
      index: 'createdAt',
      field: ({ record: { createdAt } }) => (
        <DateField date={new Date(createdAt)} label={<T>created at</T>} />
      ),
      cardPosition: 'bottom',
      minWidth: 250,
      sort: { compareFn: () => (rowA, rowB) => new Date(rowB.createdAt).getTime() - new Date(rowA.createdAt).getTime() },
    },
    {
      head: <TextHeadCell text={<T className="tt-ue">updated at</T>} />,
      index: 'updatedAt',
      field: ({ record: { updatedAt } }) => (
        <DateField date={new Date(updatedAt)} label={<T>updated at</T>} />
      ),
      cardPosition: 'bottom',
      minWidth: 250,
      sort: { compareFn: () => (rowA, rowB) => new Date(rowB.updatedAt).getTime() - new Date(rowA.updatedAt).getTime() },
    },
    {
      head: <TextHeadCell text={<T className="tt-ue">valid until</T>} />,
      index: 'validUntil',
      field: ({ record: { validUntil } }) => (
        <DateField date={new Date(validUntil)} label={<T>valid until</T>} />
      ),
      cardPosition: 'bottom',
      minWidth: 250,
      sort: { compareFn: () => (rowA, rowB) => new Date(rowB.validUntil).getTime() - new Date(rowA.validUntil).getTime() },
    },
    {
      head: <TextHeadCell text={<T className="tt-ue">operations</T>} />,
      index: 'operations',
      field: ({ record: { id } }) => {
        return (
          <Field className="jk-col center gap">
            <ButtonLoader
              icon={<DeleteIcon />}
              onClick={(setLoader) => deleteUserSession({
                params: { sessionId: id },
                setLoader,
                onSuccess: async () => {
                  setLoader(Status.LOADING);
                  await mutate(JUDGE_API_V1.USER.ONLINE_USERS());
                  setLoader(Status.SUCCESS);
                },
              })}
              size="tiny"
            >
              <T>delete session</T>
            </ButtonLoader>
          </Field>
        );
      },
      cardPosition: 'center',
      minWidth: 190,
    },
  ], []);
  
  const { notifyResponse } = useNotification();
  const { mutate } = useSWR();
  const data: UserManagementSessionResponseDTO[] = (response?.success ? response?.contents : []);
  
  return (
    <>
      <DataViewer<UserManagementSessionResponseDTO>
        headers={columns}
        data={data}
        rows={{ height: 150 }}
        cards={{ width: 300 }}
        request={request}
        name={QueryParam.LOGGED_USERS_TABLE}
        extraNodes={
          [
            <div className="jk-row gap">
              <ButtonLoader
                size="small"
                icon={<CloseIcon circle />}
                onClick={async (setLoaderStatus) => {
                  setLoaderStatus(Status.LOADING);
                  const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
                    JUDGE_API_V1.USER.DELETE_OLD_SESSIONS(),
                    { method: HTTPMethod.POST }),
                  );
                  notifyResponse(response, setLoaderStatus);
                  await mutate(JUDGE_API_V1.USER.ONLINE_USERS());
                }}>
                <T>delete old sessions</T>
              </ButtonLoader>
              <InputToggle
                checked={withGuests}
                onChange={(newValue) => setWithGuests(newValue)}
                rightLabel={<T className={classNames({ 'fw-bd': withGuests })}>with guests</T>}
              />
            </div>,
          ]
        }
        setLoaderStatusRef={setLoaderStatusRef}
        {...DEFAULT_DATA_VIEWER_PROPS}
      />
    </>
  );
}
