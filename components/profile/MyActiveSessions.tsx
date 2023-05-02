import { ButtonLoader, DataViewer, DateLiteral, DeleteIcon, Field, T, TextHeadCell } from 'components';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1 } from 'config/constants';
import { useDataViewerRequester, useJukiUser, useSWR } from 'hooks';
import { useMemo } from 'react';
import { ContentsResponseType, DataViewerHeadersType, QueryParam, SessionBasicResponseDTO, Status } from 'types';

export function MyActiveSessions() {
  
  const { deleteUserSession } = useJukiUser();
  const {
    data: response,
    request,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponseType<SessionBasicResponseDTO>>(() => JUDGE_API_V1.USER.MY_SESSIONS());
  
  const columns: DataViewerHeadersType<SessionBasicResponseDTO>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="tt-ue">session</T>} />,
      index: 'session',
      field: ({ record: { updatedAt, deviceName, osName } }) => (
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
                  await mutate(JUDGE_API_V1.USER.MY_SESSIONS());
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
  ], []);
  
  const { mutate } = useSWR();
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
