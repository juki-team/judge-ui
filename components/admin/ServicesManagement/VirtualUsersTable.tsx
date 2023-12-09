import { ButtonLoader, DataViewer, DateLiteral, Field, T } from 'components/index';
import { JUDGE, JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest, toFilterUrl } from 'helpers';
import { useDataViewerRequester, useNotification } from 'hooks';
import React, { ReactNode, useMemo, useState } from 'react';
import {
  ContentResponseType,
  ContentsResponseType,
  DataViewerHeadersType,
  HTTPMethod,
  Status,
  VirtualUserResponseDTO,
} from 'types';
import { SetVirtualUserDataModal } from '../JudgesManagement/SetVirtualUserDataModal';

export const VirtualUsersTable = () => {
  
  const { notifyResponse } = useNotification();
  
  const {
    data: response,
    request,
    reload,
    refreshRef,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponseType<VirtualUserResponseDTO>>(
    ({ filter, sort }) => (
      JUDGE_API_V1.VIRTUAL_USER.LIST(toFilterUrl(filter))
    ),
  );
  
  const [ modal, setModal ] = useState<ReactNode>(null);
  
  const data: VirtualUserResponseDTO[] = (response?.success ? response.contents : []);
  
  const headers = useMemo(() => {
    return [
      {
        head: 'judge',
        index: 'judge',
        field: ({ record: { judge } }) => (
          <Field className="jk-col center">
            <div className="fw-bd">{JUDGE[judge]?.label || judge}</div>
          </Field>
        ),
        minWidth: 200,
        cardPosition: 'top',
        filter: {
          type: 'select',
          options: Object.values(JUDGE).map(judge => ({
            value: judge.value,
            label: JUDGE[judge.value].label,
          })),
        },
      },
      {
        head: 'user data',
        index: 'user-data',
        field: ({ record: { email, username, password } }) => (
          <Field className="jk-col center">
            <div className="fw-bd">{username}</div>
            <div>{email}</div>
            <div>{password}</div>
          </Field>
        ),
        minWidth: 320,
        cardPosition: 'top',
      },
      {
        head: 'working in',
        index: 'workingIn',
        field: ({ record: { workingIn, attempts, updatedAt, submitId, judgeSubmissionId } }) => (
          <Field className="jk-col center">
            <div>{workingIn} ({attempts})</div>
            <div><DateLiteral date={new Date(updatedAt)} /></div>
            <div className="jk-col">
              <div className="tx-t">{submitId || '-'}</div>
              <div className="tx-t">{judgeSubmissionId || '-'}</div>
            </div>
          </Field>
        ),
        minWidth: 240,
        cardPosition: 'center',
      },
      {
        head: 'actions',
        index: 'actions',
        field: ({ record }) => (
          <Field className="jk-col gap center">
            <ButtonLoader
              size="small"
              onClick={async (setLoaderStatus) => {
                setLoaderStatus(Status.LOADING);
                const response = cleanRequest<ContentResponseType<string>>(
                  await authorizedRequest(JUDGE_API_V1.VIRTUAL_USER.SET_FREE(record.id), {
                    method: HTTPMethod.POST,
                  }));
                notifyResponse(response, setLoaderStatus);
                await reload();
              }}
            >
              <T>set free</T>
            </ButtonLoader>
            <ButtonLoader
              size="small"
              onClick={() => {
                setModal(
                  <SetVirtualUserDataModal
                    onClose={() => setModal(null)}
                    reloadTable={reload}
                    virtualUser={record}
                  />,
                );
              }}
            >
              <T>set user data</T>
            </ButtonLoader>
          </Field>
        ),
        minWidth: 200,
        cardPosition: 'bottom',
      },
    ] as DataViewerHeadersType<VirtualUserResponseDTO>[];
  }, [ notifyResponse, reload ]);
  
  return (
    <>
      {modal}
      <DataViewer<VirtualUserResponseDTO>
        headers={headers}
        data={data}
        request={request}
        setLoaderStatusRef={setLoaderStatusRef}
        rows={{ height: 128 }}
        refreshRef={refreshRef}
      />
    </>
  );
};
