import { ButtonLoader, InputToggle, T } from 'components/index';
import { JUDGE, JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useJukiNotification } from 'hooks';
import React, { useEffect, useState } from 'react';
import { KeyedMutator } from 'swr';
import { CompanyResponseDTO, ContentResponseType, HTTPMethod, JudgeResponseDTO, Status } from 'types';

interface JudgeManagementBodyProps {
  company: CompanyResponseDTO,
  judge: JudgeResponseDTO,
  mutate: KeyedMutator<string>,
  withError?: boolean,
}

export const JudgeManagementBody = ({ company, judge, mutate, withError }: JudgeManagementBodyProps) => {
  
  const { notifyResponse } = useJukiNotification();
  const [ languages, setLanguages ] = useState(judge.languages);
  useEffect(() => {
    setLanguages(judge.languages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ JSON.stringify(judge.languages) ]);
  
  return (
    <div className="jk-col nowrap top gap stretch">
      <div className="jk-col gap nowrap bc-we jk-br-ie jk-pg-sm">
        {withError && (
          <div className="jk-tag error">
            <T className="tt-se">{'not initialized, to initialize click on the "crawl languages" button'}</T>
          </div>
        )}
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
                  JUDGE_API_V1.JUDGE.CRAWL_LANGUAGES(judge.key, company.key),
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
              <div className="jk-row jk-table-inline-row" key={language.value + language.label}>
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
                  JUDGE_API_V1.JUDGE.LANGUAGES(judge.key, company.key),
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
