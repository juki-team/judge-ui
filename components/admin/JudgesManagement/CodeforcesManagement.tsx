import { ButtonLoader, FetcherLayer, InputToggle, T } from 'components';
import { JUDGE, JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useNotification } from 'hooks';
import React, { useState } from 'react';
import { KeyedMutator } from 'swr';
import { ContentResponseType, HTTPMethod, Judge, JudgeResponseDTO, Status } from 'types';
import Custom404 from '../../../pages/404';

interface CodeforcesManagementBodyProps {
  judge: JudgeResponseDTO,
  mutate: KeyedMutator<string>
}

export const CodeforcesManagementBody = ({ judge, mutate }: CodeforcesManagementBodyProps) => {
  
  const { notifyResponse } = useNotification();
  const [ languages, setLanguages ] = useState(judge.languages);
  
  return (
    <div className="jk-col nowrap top gap stretch">
      <div className="jk-col gap nowrap bc-we jk-br-ie jk-pad-sm">
        <h3>{JUDGE[judge.key]?.label || judge.key}</h3>
        <div><T className="fw-bd tt-se">key</T>:&nbsp;{judge.key}</div>
        <div className="jk-divider tiny" />
        <div className="jk-col gap block">
          <div className="fw-bd"><T className="tt-se">languages</T></div>
          <ButtonLoader
            size="small"
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
          <div className="jk-col stretch">
            <div className="jk-row jk-table-inline-header">
              <div className="jk-row" style={{ width: 120 }}><T>value</T></div>
              <div className="jk-row" style={{ width: 300 }}><T>label</T></div>
              <div className="jk-row" style={{ width: 120 }}><T>enabled</T></div>
            </div>
            {languages?.map((language, index) => (
              <div className="jk-row jk-table-inline-row" key={language.value}>
                <div className="jk-row" style={{ width: 120 }}>{language.value}</div>
                <div className="jk-row ws-np" style={{ width: 300 }}>{language.label}</div>
                <div className="jk-row" style={{ width: 120 }}>
                  <InputToggle
                    checked={language.enabled}
                    onChange={(enabled) => {
                      const newLanguages = [ ...languages ];
                      newLanguages[index] = { ...languages[index], enabled };
                      setLanguages(newLanguages);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <ButtonLoader
            size="small"
            disabled={JSON.stringify(languages) === JSON.stringify(judge.languages)}
            onClick={async (setLoaderStatus) => {
              setLoaderStatus(Status.LOADING);
              const response = cleanRequest<ContentResponseType<{}>>(
                await authorizedRequest(
                  JUDGE_API_V1.JUDGE.LANGUAGES(Judge.CODEFORCES),
                  { method: HTTPMethod.POST, body: JSON.stringify({ languages }) },
                ),
              );
              notifyResponse(response, setLoaderStatus);
              await mutate();
            }}
          >
            <T>save languages</T>
          </ButtonLoader>
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
