import { DEFAULT_DATA_VIEWER_PROPS } from 'config/constants';
import { useMemo } from 'react';
import { ButtonLoader, DataViewer, DateLiteral, DeleteIcon, Field, T } from 'src/components/index';
import { jukiApiSocketManager } from 'src/config';
import { useDataViewerRequester, useJukiUser, useSWR } from 'src/hooks';
import { ContentsResponseType, DataViewerHeadersType, QueryParam, SessionBasicResponseDTO, Status } from 'src/types';

export function MyActiveSessions() {
  
  const { deleteUserSession, user: { sessionId } } = useJukiUser();
  
  const {
    data: response,
    request,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponseType<SessionBasicResponseDTO>>(() => jukiApiSocketManager.API_V1.user.getMySessions().url);
  
  const { mutate } = useSWR();
  
  const columns: DataViewerHeadersType<SessionBasicResponseDTO>[] = useMemo(() => [
    {
      head: 'session',
      index: 'session',
      Field: ({ record: { updateTimestamp, deviceName, osName, id } }) => (
        <Field className="jk-col center">
          <div className="fw-bd">{deviceName}</div>
          <div>{osName}</div>
          <DateLiteral date={new Date(updateTimestamp)} />
          {sessionId === id && <div className="jk-tag info"><T className="tt-se">this device</T></div>}
        </Field>
      ),
      cardPosition: 'top',
      minWidth: 250,
      sort: {
        compareFn: () => (rowA, rowB) => rowB.updateTimestamp - rowA.updateTimestamp,
      },
    },
    {
      head: 'operations',
      index: 'operations',
      Field: ({ record: { id } }) => {
        return (
          <Field className="jk-col center gap">
            {sessionId !== id && (
              <ButtonLoader
                icon={<DeleteIcon />}
                onClick={(setLoader) => deleteUserSession({
                  params: { sessionId: id },
                  setLoader,
                  onSuccess: async () => {
                    setLoader(Status.LOADING);
                    await mutate(jukiApiSocketManager.API_V1.user.getMySessions().url);
                    setLoader(Status.SUCCESS);
                  },
                })}
                size="tiny"
              >
                <T>delete session</T>
              </ButtonLoader>
            )}
          </Field>
        );
      },
      cardPosition: 'bottom',
      minWidth: 190,
    },
  ], [ deleteUserSession, mutate, sessionId ]);
  
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
