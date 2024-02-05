import { ButtonLoader, DataViewer, Field, PlayCircleIcon, Select, SettingsAlertIcon, T } from 'components';
import { jukiSettings } from 'config';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useDataViewerRequester, useEffect, useNotification } from 'hooks';
import { useMemo, useState } from 'react';
import {
  CompanyResponseDTO,
  ContentResponseType,
  ContentsResponseType,
  DataViewerHeadersType,
  HTTPMethod,
  QueryParam,
  Status,
  TaskDefinitionResponseDTO,
} from 'types';

type RevisionType = {
  taskDefinitionArn: string,
  revision: number,
  memory: string,
  cpu: string,
  registeredAt: Date,
  isHighRunner: boolean,
  isLowRunner: boolean
};

type AwsEcsTaskDefinitionList = {
  family: string,
  revisions: RevisionType[],
  companyKey: string,
};

const FieldTaskDefinition = ({ family, revisions, companyKey, reload }: AwsEcsTaskDefinitionList & {
  reload: () => void
}) => {
  
  const { notifyResponse } = useNotification();
  const [ revision, setRevision ] = useState<RevisionType>(revisions[0]);
  const { isHighRunner, isLowRunner, ...restRevision } = revision;
  
  const firstRevisionString = JSON.stringify(revisions[0]);
  useEffect(() => {
    setRevision(JSON.parse(firstRevisionString))
  }, [ firstRevisionString ]);
  
  return (
    <div className="jk-row gap nowrap">
      <div className="jk-col gap">
        <div className="jk-col gap fw-bd">
          {family}
          {revisions.map((revision, index) => (
            revision.isHighRunner || revision.isLowRunner ? (
              <div key={revision.revision} className="jk-row center gap">
                {revision.isLowRunner && (
                  <div className="jk-tag info">
                    &nbsp;<T className="tt-ue">low</T>{` (v${revision.revision})`}
                  </div>
                )}
                {revision.isHighRunner && (
                  <div className="jk-tag info">
                    <T className="tt-ue">high</T>{` (v${revision.revision})`}
                  </div>
                )}
              </div>
            ) : null))}
        </div>
        <Select
          options={revisions.map(({ isLowRunner, isHighRunner, ...definition }) => ({
            value: definition,
            label: definition.revision,
          }))}
          selectedOption={{ value: restRevision }}
          onChange={({ value }) => setRevision({ ...value, isLowRunner, isHighRunner })}
        />
      </div>
      <div className="jk-col gap">
        <div className="tx-s">{revision.memory} (MiB) / {revision.cpu} (unit)</div>
        <div className="tx-s"><T className="tt-se fw-bd">registered
          at</T>:&nbsp;{revision.registeredAt.toLocaleString()}</div>
        <div className="tx-xs fw-bd">{revision.taskDefinitionArn}</div>
      </div>
      <div className="jk-col gap">
        <ButtonLoader
          size="small"
          icon={<PlayCircleIcon />}
          onClick={async (setLoaderStatus) => {
            setLoaderStatus(Status.LOADING);
            const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
                JUDGE_API_V1.SYS.AWS_ECS_RUN_TASK_TASK_DEFINITION(revision.taskDefinitionArn),
                { method: HTTPMethod.POST },
              ),
            );
            notifyResponse(response, setLoaderStatus);
            reload();
          }}
        >
          <T>run task</T>
        </ButtonLoader>
        {!revision.isHighRunner && (
          <ButtonLoader
            size="small"
            className="bc-er"
            icon={<SettingsAlertIcon />}
            onClick={async (setLoaderStatus) => {
              setLoaderStatus(Status.LOADING);
              const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
                  jukiSettings.API.company.getResourceSpecifications({ params: { companyKey } }).url,
                  {
                    method: HTTPMethod.POST,
                    body: JSON.stringify({ highPerformanceRunnerTaskDefinition: revision.taskDefinitionArn }),
                  },
                ),
              );
              notifyResponse(response, setLoaderStatus);
              reload();
            }}
          >
            <T>set high runner</T>
          </ButtonLoader>
        )}
        {!revision.isLowRunner && (
          <ButtonLoader
            size="small"
            className="bc-er"
            icon={<SettingsAlertIcon />}
            onClick={async (setLoaderStatus) => {
              setLoaderStatus(Status.LOADING);
              const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
                  jukiSettings.API.company.getResourceSpecifications({ params: { companyKey } }).url,
                  {
                    method: HTTPMethod.POST,
                    body: JSON.stringify({ lowPerformanceRunnerTaskDefinition: revision.taskDefinitionArn }),
                  },
                ),
              );
              notifyResponse(response, setLoaderStatus);
              reload();
            }}
          >
            <T>set low runner</T>
          </ButtonLoader>
        )}
      </div>
    </div>
  );
};

export const ECSTaskDefinitionsManagement = ({ company }: { company: CompanyResponseDTO }) => {
  
  const {
    data: response,
    request,
    reload,
    reloadRef,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponseType<TaskDefinitionResponseDTO>>(() => JUDGE_API_V1.SYS.AWS_ECS_TASK_DEFINITION_LIST(company.key));
  
  useEffect(() => {
    reload();
  }, [ company.key, reload ]);
  
  const columns: DataViewerHeadersType<AwsEcsTaskDefinitionList>[] = useMemo(() => [
    {
      head: 'task definition',
      index: 'taskDefinition',
      field: ({ record }) => (
        <Field className="jk-row center gap">
          <FieldTaskDefinition {...record} companyKey={company.key} reload={reload} />
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowB.family.localeCompare(rowA.family) },
    },
  ], [ company.key, reload ]);
  
  const responseData: TaskDefinitionResponseDTO[] = (response?.success ? response?.contents : []);
  
  const definitions: { [key: string]: AwsEcsTaskDefinitionList } = {};
  responseData.forEach(({
                          taskDefinitionArn,
                          family,
                          revision,
                          memory,
                          cpu,
                          registeredAt,
                          isLowRunner,
                          isHighRunner,
                        }) => {
      definitions[family] = {
        family,
        revisions: [
          ...(definitions[family]?.revisions || []),
          { taskDefinitionArn, revision, memory, cpu, registeredAt: new Date(registeredAt), isHighRunner, isLowRunner },
        ],
        companyKey: company.key,
      };
    },
  );
  
  const data: AwsEcsTaskDefinitionList[] = Object.values(definitions).map(({ revisions, ...rest }) => ({
    ...rest,
    revisions: revisions.sort((a, b) => b.revision - a.revision),
  }));
  
  return (
    <DataViewer<AwsEcsTaskDefinitionList>
      headers={columns}
      data={data}
      rows={{ height: 180 }}
      request={request}
      name={QueryParam.ECS_DEFINITIONS_TASK_TABLE}
      reloadRef={reloadRef}
      setLoaderStatusRef={setLoaderStatusRef}
      {...DEFAULT_DATA_VIEWER_PROPS}
    />
  );
};
