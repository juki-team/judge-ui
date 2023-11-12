import {
  ButtonLoader,
  CloseIcon,
  DataViewer,
  DateField,
  DeleteIcon,
  Field,
  InputToggle,
  T,
  TextField,
  TextHeadCell,
  UserChip,
} from 'components';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, classNames, cleanRequest } from 'helpers';
import { useDataViewerRequester, useJukiUser, useNotification } from 'hooks';
import { useEffect, useMemo, useState } from 'react';
import {
  CompanyResponseDTO,
  ContentResponseType,
  ContentsResponseType,
  DataViewerHeadersType,
  FilterTextOfflineType,
  HTTPMethod,
  QueryParam,
  SessionResponseDTO,
  Status,
} from 'types';

export function UsersLogged({ company }: { company: CompanyResponseDTO }) {
  
  const { deleteUserSession } = useJukiUser();
  const [ withGuests, setWithGuests ] = useState(false);
  const {
    data: response,
    request,
    reload,
    refreshRef,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponseType<SessionResponseDTO>>(
    () => withGuests ? JUDGE_API_V1.USER.ALL_ONLINE_USERS(company.key) : JUDGE_API_V1.USER.ONLINE_USERS(company.key),
  );
  useEffect(reload, [ withGuests, reload, company.key ]);
  const columns: DataViewerHeadersType<SessionResponseDTO>[] = useMemo(() => [
    {
      head: 'user',
      index: 'id',
      field: ({ record: { id, user: { imageUrl, nickname, givenName, familyName, email } } }) => (
        <Field className="jk-col center">
          <UserChip
            imageUrl={imageUrl}
            nickname={nickname}
            givenName={givenName}
            familyName={familyName}
            email={email}
          />
          <div className="jk-row">{id}</div>
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.id.localeCompare(rowB.id) },
      filter: {
        type: 'text', callbackFn: ({ text }) => ({ user: { givenName, familyName, nickname, email } }) => {
          const regExp = new RegExp(text, 'gi');
          return !!(nickname?.match?.(regExp))
            || !!(givenName?.match?.(regExp))
            || !!(familyName?.match?.(regExp))
            || !!(email?.match?.(regExp));
        },
      } as FilterTextOfflineType<SessionResponseDTO>,
      cardPosition: 'top',
      minWidth: 400,
    },
    {
      head: 'created at',
      index: 'createdAt',
      field: ({ record: { createdAt } }) => (
        <DateField date={new Date(createdAt)} label={<T>created at</T>} />
      ),
      cardPosition: 'bottom',
      minWidth: 250,
      sort: {
        compareFn: () => (rowA, rowB) => new Date(rowB.createdAt).getTime()
          - new Date(rowA.createdAt).getTime(),
      },
    },
    {
      head: 'updated at',
      index: 'updatedAt',
      field: ({ record: { updatedAt } }) => (
        <DateField date={new Date(updatedAt)} label={<T>updated at</T>} />
      ),
      cardPosition: 'bottom',
      minWidth: 250,
      sort: {
        compareFn: () => (rowA, rowB) => (
          new Date(rowB.updatedAt).getTime() - new Date(rowA.updatedAt).getTime()
        ),
      },
    },
    {
      head: 'valid until',
      index: 'validUntil',
      field: ({ record: { validUntil } }) => (
        <DateField date={new Date(validUntil)} label={<T>valid until</T>} />
      ),
      cardPosition: 'bottom',
      minWidth: 250,
      sort: {
        compareFn: () => (rowA, rowB) => (
          new Date(rowB.validUntil).getTime() - new Date(rowA.validUntil).getTime()
        ),
      },
    },
    {
      head: 'device',
      index: 'device',
      field: ({ record: { deviceName } }) => (
        <TextField text={deviceName} label={<T>device</T>} />
      ),
      cardPosition: 'bottom',
      minWidth: 250,
      sort: {
        compareFn: () => (rowA, rowB) => (
          rowA.deviceName.localeCompare(rowB.deviceName)
        ),
      },
    },
    {
      head: 'os',
      index: 'os',
      field: ({ record: { osName } }) => (
        <TextField text={osName} label={<T>os</T>} />
      ),
      cardPosition: 'bottom',
      minWidth: 250,
      sort: {
        compareFn: () => (rowA, rowB) => (
          rowA.osName.localeCompare(rowB.osName)
        ),
      },
    },
    {
      head: 'operations',
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
                  await reload();
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
  ], [ reload ]);
  
  const { notifyResponse } = useNotification();
  const data: SessionResponseDTO[] = (response?.success ? response?.contents : []);
  
  return (
    <>
      <DataViewer<SessionResponseDTO>
        headers={columns}
        data={data}
        rows={{ height: 150 }}
        cards={{ width: 300 }}
        request={request}
        name={QueryParam.LOGGED_USERS_TABLE}
        refreshRef={refreshRef}
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
                      { method: HTTPMethod.POST },
                    ),
                  );
                  notifyResponse(response, setLoaderStatus);
                  await reload();
                }}
              >
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
