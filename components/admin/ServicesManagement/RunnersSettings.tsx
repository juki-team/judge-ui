import { ButtonLoader, Input, LoadingIcon, Popover, SaveIcon, T } from 'components';
import { jukiSettings } from 'config';
import { COMPANY_PLAN } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useFetcher, useNotification } from 'hooks';
import React, { useEffect, useState } from 'react';
import {
  CompanyPlan,
  CompanyResourceSpecificationsResponseDTO,
  CompanyResponseDTO,
  ContentResponseType,
  HTTPMethod,
  Status,
} from 'types';

export const RunnersSettings = ({ company }: { company: CompanyResponseDTO }) => {
  
  const [ resource, setResource ] = useState({
    highPerformanceRunnerTaskDefinition: '',
    highPerformanceRunnerMinimum: -1,
    highPerformanceRunnerMaximum: -1,
    lowPerformanceRunnerTaskDefinition: '',
    lowPerformanceRunnerMinimum: -1,
    lowPerformanceRunnerMaximum: -1,
  });
  const [ loading, setLoading ] = useState(false);
  const {
    data,
    isLoading,
    mutate,
    isValidating,
  } = useFetcher<ContentResponseType<CompanyResourceSpecificationsResponseDTO>>(jukiSettings.API.company.getResourceSpecifications({ params: { companyKey: company.key } }).url);
  useEffect(() => {
    if (data?.success) {
      setResource({
        highPerformanceRunnerTaskDefinition: data.content.highPerformanceRunner.taskDefinition,
        highPerformanceRunnerMinimum: data.content.highPerformanceRunner.minimum,
        highPerformanceRunnerMaximum: data.content.highPerformanceRunner.maximum,
        lowPerformanceRunnerTaskDefinition: data.content.lowPerformanceRunner.taskDefinition,
        lowPerformanceRunnerMinimum: data.content.lowPerformanceRunner.minimum,
        lowPerformanceRunnerMaximum: data.content.lowPerformanceRunner.maximum,
      });
    }
  }, [ data ]);
  
  const { notifyResponse } = useNotification();
  
  if (isLoading || isValidating) {
    return (
      <div className="jk-col center jk-pad-md bc-we jk-br-ie">
        <div className="jk-row">
          <LoadingIcon size="very-huge" className="cr-py" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="jk-col nowrap top gap jk-pad-md stretch bc-we jk-br-ie">
      <Popover
        content={
          <div><T>{COMPANY_PLAN[company.plan]?.description}</T></div>
        }
      >
        <div className="jk-row">
          <div className="jk-tag">{company.plan}</div>
        </div>
      </Popover>
      <div className="jk-form-item">
        <label>
          <T>high performance runner min tasks</T>
          <Input
            type="number"
            value={resource.highPerformanceRunnerMinimum}
            onChange={(highPerformanceRunnerMinimum) => setResource(prevState => ({
              ...prevState,
              highPerformanceRunnerMinimum,
            }))}
            disabled={loading || isValidating || company.plan !== CompanyPlan.CUSTOM}
          />
        </label>
      </div>
      <div className="jk-form-item">
        <label>
          <T>high performance runner max tasks</T>
          <Input
            type="number"
            value={resource.highPerformanceRunnerMaximum}
            onChange={(highPerformanceRunnerMaximum) => setResource(prevState => ({
              ...prevState,
              highPerformanceRunnerMaximum,
            }))}
            disabled={loading || isValidating || company.plan !== CompanyPlan.CUSTOM}
          />
        </label>
      </div>
      <div className="jk-form-item">
        <label>
          <T>low performance runner min tasks</T>
          <Input
            type="number"
            value={resource.lowPerformanceRunnerMinimum}
            onChange={(lowPerformanceRunnerMinimum) => setResource(prevState => ({
              ...prevState,
              lowPerformanceRunnerMinimum,
            }))}
            disabled={loading || isValidating || company.plan !== CompanyPlan.CUSTOM}
          />
        </label>
      </div>
      <div className="jk-form-item">
        <label>
          <T>low performance runner max tasks</T>
          <Input
            type="number"
            value={resource.lowPerformanceRunnerMaximum}
            onChange={(lowPerformanceRunnerMaximum) => setResource(prevState => ({
              ...prevState,
              lowPerformanceRunnerMaximum,
            }))}
            disabled={loading || isValidating || company.plan !== CompanyPlan.CUSTOM}
          />
        </label>
      </div>
      {company.plan === CompanyPlan.CUSTOM && (
        <div className="jk-row gap">
          <ButtonLoader
            size="small"
            disabled={loading}
            icon={<SaveIcon />}
            onClick={async (setLoaderStatus) => {
              setLoading(true);
              setLoaderStatus(Status.LOADING);
              const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
                jukiSettings.API.company.getResourceSpecifications({ params: { companyKey: company.key } }).url,
                { method: HTTPMethod.POST, body: JSON.stringify(resource) }),
              );
              notifyResponse(response, setLoaderStatus);
              setLoading(false);
              await mutate();
            }}
          >
            <T>save</T>
          </ButtonLoader>
        </div>
      )}
    </div>
  );
};
