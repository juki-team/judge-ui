import { ButtonLoader, DataViewer, DateField, DeleteIcon, Field, T, TextHeadCell, UserChip } from 'components';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1, QueryParam } from 'config/constants';
import { searchParamsObjectTypeToQuery } from 'helpers';
import { useDataViewerRequester, useRouter } from 'hooks';
import { useMemo } from 'react';
import { useUserDispatch } from 'store';
import { ContentsResponseType, DataViewerHeadersType, UserManagementSessionResponseDTO } from 'types';

export function UsersLogged() {
  
  const { deleteSession } = useUserDispatch();
  const {
    data: response,
    request,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponseType<UserManagementSessionResponseDTO>>(JUDGE_API_V1.USER.ONLINE_USERS());
  
  const columns: DataViewerHeadersType<UserManagementSessionResponseDTO>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="tt-ue">id/user</T>} />,
      index: 'id',
      field: ({ record: { id, user: { imageUrl, nickname, givenName, familyName, email } } }) => (
        <Field className="jk-col center">
          <UserChip imageUrl={imageUrl} nickname={nickname} givenName={givenName} familyName={familyName} email={email} />
          <div className="jk-row">{id}</div>
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.id.localeCompare(rowB.id) },
      filter: { type: 'text-auto' },
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
              onClick={deleteSession(id)}
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
  
  const { queryObject, push } = useRouter();
  
  const data: UserManagementSessionResponseDTO[] = (response?.success ? response?.contents : []);
  
  return (
    <>
      <DataViewer<UserManagementSessionResponseDTO>
        headers={columns}
        data={data}
        rows={{ height: 150 }}
        request={request}
        name={QueryParam.LOGGED_USERS_TABLE}
        searchParamsObject={queryObject}
        setSearchParamsObject={(params) => push({ query: searchParamsObjectTypeToQuery(params) })}
        setLoaderStatusRef={setLoaderStatusRef}
        {...DEFAULT_DATA_VIEWER_PROPS}
      />
    </>
  );
}
