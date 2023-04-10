import { ButtonLoader, DataViewer, DateField, FetcherLayer, Select, T, TextField, TextHeadCell } from 'components';
import { JUDGE, JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useDataViewerRequester, useNotification } from 'hooks';
import React, { useMemo } from 'react';
import { KeyedMutator } from 'swr';
import {
  ContentResponseType,
  ContentsResponseType,
  HTTPMethod,
  Judge,
  JudgeResponseDTO,
  Status,
  VirtualUserResponseDTO,
} from 'types';
import Custom404 from '../../../pages/404';
import { DataViewerHeadersType } from '../../../types';

interface CodeforcesManagementBodyProps {
  judge: JudgeResponseDTO,
  mutate: KeyedMutator<string>
}

export const CodeforcesManagementBody = ({ judge, mutate }: CodeforcesManagementBodyProps) => {
  
  const { notifyResponse } = useNotification();
  
  const {
    data: response,
    request,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponseType<VirtualUserResponseDTO>>(JUDGE_API_V1.VIRTUAL_USER.LIST(Judge.CODEFORCES));
  
  const data: VirtualUserResponseDTO[] = (response?.success ? response.contents : []);
  
  const headers = useMemo(() => {
    return [
      {
        head: <TextHeadCell text={<T className="tt-ue">email</T>} />,
        index: 'email',
        field: ({ record: { email } }) => (
          <TextField label={<T>email</T>} text={email} />
        ),
        minWidth: 280,
      },
      {
        head: <TextHeadCell text={<T className="tt-ue">user</T>} />,
        index: 'user',
        field: ({ record: { user } }) => (
          <TextField label={<T>user</T>} text={user} />
        ),
        minWidth: 200,
      },
      {
        head: <TextHeadCell text={<T className="tt-ue">password</T>} />,
        index: 'password',
        field: ({ record: { password } }) => (
          <TextField label={<T>password</T>} text={password} />
        ),
        minWidth: 140,
      },
      {
        head: <TextHeadCell text={<T className="tt-ue">working in</T>} />,
        index: 'workingIn',
        field: ({ record: { workingIn } }) => (
          <TextField label={<T>working in</T>} text={workingIn} />
        ),
        minWidth: 140,
      },
      {
        head: <TextHeadCell text={<T className="tt-ue">submitId</T>} />,
        index: 'submitId',
        field: ({ record: { submitId } }) => (
          <TextField label={<T>submitId</T>} text={submitId} />
        ),
        minWidth: 100,
      },
      {
        head: <TextHeadCell text={<T className="tt-ue">attempts</T>} />,
        index: 'attempts',
        field: ({ record: { attempts } }) => (
          <TextField label={<T>attempts</T>} text={attempts} />
        ),
        minWidth: 100,
      },
      {
        head: <TextHeadCell text={<T className="tt-ue">update at</T>} />,
        index: 'updatedAt',
        field: ({ record: { updatedAt } }) => (
          <DateField label={<T>updated at</T>} date={new Date(updatedAt)} twoLines />
        ),
        minWidth: 200,
      },
    ] as DataViewerHeadersType<VirtualUserResponseDTO>[];
  }, []);
  
  return (
    <div className="jk-col nowrap top gap stretch">
      <div className="jk-col gap nowrap bc-we jk-br-ie jk-pad-sm">
        <h3>{JUDGE[judge.key]?.label || judge.key}</h3>
        <div><T className="fw-bd tt-se">key</T>:&nbsp;{judge.key}</div>
        <div className="jk-row-col gap">
          <div><T className="fw-bd tt-se">languages</T>:&nbsp;</div>
          <Select
            options={judge.languages.map(language => ({ value: language.label, label: language.label }))}
            selectedOption={judge.languages[0] || { value: '', label: '' }}
          />
          <ButtonLoader
            onClick={async (setLoaderStatus) => {
              setLoaderStatus(Status.LOADING);
              const response = cleanRequest<ContentResponseType<{}>>(
                await authorizedRequest(
                  JUDGE_API_V1.JUDGE.CRAWL_LANGUAGES(Judge.CODEFORCES),
                  { method: HTTPMethod.POST },
                ),
              );
              notifyResponse(response, setLoaderStatus);
              await mutate();
            }}
          >
            <T>crawl languages</T>
          </ButtonLoader>
        </div>
      </div>
      <div className="jk-col gap nowrap bc-we jk-br-ie jk-pad-sm">
        <h3><T>virtual users</T></h3>
        <div style={{ width: '100%', height: '100%' }}>
          <DataViewer<VirtualUserResponseDTO>
            headers={headers}
            data={data}
            request={request}
            setLoaderStatusRef={setLoaderStatusRef}
          />
        </div>
      </div>
    </div>
  );
};

export const CodeforcesManagement = () => {
  return (
    <FetcherLayer<ContentResponseType<JudgeResponseDTO>>
      url={JUDGE_API_V1.JUDGE.GET(Judge.CODEFORCES)}
      errorView={<Custom404 />}
    >
      {({ data, mutate }) => {
        return (
          <CodeforcesManagementBody judge={data.content} mutate={mutate} />
        );
      }}
    </FetcherLayer>
  );
};
