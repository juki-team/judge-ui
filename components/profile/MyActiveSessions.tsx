import { ButtonLoader, DataViewer, DateLiteral, DeleteIcon, Field, T } from 'components';
import { jukiSettings } from 'config';
import { DEFAULT_DATA_VIEWER_PROPS } from 'config/constants';
import { useDataViewerRequester, useJukiUser, useSWR } from 'hooks';
import { useMemo } from 'react';
import { ContentsResponseType, DataViewerHeadersType, QueryParam, SessionBasicResponseDTO, Status } from 'types';

export function MyActiveSessions() {
  
  const { deleteUserSession } = useJukiUser();
  
  const {
    data: response,
    request,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponseType<SessionBasicResponseDTO>>(() => jukiSettings.API.user.getMySessions().url);
  
  const { mutate } = useSWR();
  
  const columns: DataViewerHeadersType<SessionBasicResponseDTO>[] = useMemo(() => [
    {
      head: 'session',
      index: 'session',
      Field: ({ record: { updatedAt, deviceName, osName } }) => (
        <Field className="jk-col center">
          <div className="fw-bd">{deviceName}</div>
          <div>{osName}</div>
          <DateLiteral date={new Date(updatedAt)} />
        </Field>
      ),
      cardPosition: 'top',
      minWidth: 250,
      sort: {
        compareFn: () => (rowA, rowB) => new Date(rowB.createdAt).getTime()
          - new Date(rowA.createdAt).getTime(),
      },
    },
    {
      head: 'operations',
      index: 'operations',
      Field: ({ record: { id } }) => {
        return (
          <Field className="jk-col center gap">
            <ButtonLoader
              icon={<DeleteIcon />}
              onClick={(setLoader) => deleteUserSession({
                params: { sessionId: id },
                setLoader,
                onSuccess: async () => {
                  setLoader(Status.LOADING);
                  await mutate(jukiSettings.API.user.getMySessions().url);
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
      cardPosition: 'bottom',
      minWidth: 190,
    },
  ], [ deleteUserSession, mutate ]);
  
  const data: SessionBasicResponseDTO[] = (response?.success ? response?.contents : []);
  
  return (
    <>
      <DataViewer<SessionBasicResponseDTO>
        headers={columns}
        data={data}
        rows={{ height: 100 }}
        cards={{ width: 300, height: 160 }}
        request={request}
        name={QueryParam.LOGGED_USERS_TABLE}
        setLoaderStatusRef={setLoaderStatusRef}
        {...DEFAULT_DATA_VIEWER_PROPS}
      />
    </>
  );
}
