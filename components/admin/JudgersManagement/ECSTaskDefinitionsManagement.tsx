import { ButtonLoader, DataViewer, Field, PlayCircleIcon, Select, SettingsAlertIcon, T, TextHeadCell } from 'components';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest, searchParamsObjectTypeToQuery } from 'helpers';
import { useDataViewerRequester, useNotification, useRouter, useSWR } from 'hooks';
import { useMemo, useState } from 'react';
import {
  ContentResponseType,
  ContentsResponseType,
  DataViewerHeadersType,
  HTTPMethod,
  QueryParam,
  RunnerType,
  Status,
  TaskDefinitionResponseDTO,
} from 'types';

type RevisionType = { taskDefinitionArn: string, revision: number, memory: string, cpu: string, registeredAt: Date, isHighRunner: boolean, isLowRunner: boolean };

type AwsEcsTaskDefinitionList = { family: string, revisions: RevisionType[] };

const FieldTaskDefinition = ({ family, revisions }: AwsEcsTaskDefinitionList) => {
  
  const { notifyResponse } = useNotification();
  const [revision, setRevision] = useState<RevisionType>(revisions[0]);
  const { mutate } = useSWR();
  
  return (
    <div className="jk-row gap nowrap">
      <div className="jk-row">
        <div className="fw-bd">
          {family}
          {revision.isLowRunner && <>&nbsp;<T className="tt-ue jk-tag info">low</T></>}
          {revision.isHighRunner && <>&nbsp;<T className="tt-ue jk-tag info">high</T></>}
        </div>
        <Select
          options={revisions.map((definition) => ({ value: definition, label: definition.revision }))}
          selectedOption={{ value: revision }}
          onChange={({ value }) => setRevision(value)}
        />
      </div>
      <div className="jk-col gap">
        <div className="tx-s">{revision.memory} (MiB) / {revision.cpu} (unit)</div>
        <div className="tx-s"><T className="tt-se fw-bd">registered at</T>:&nbsp;{revision.registeredAt.toLocaleString()}</div>
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
              { method: HTTPMethod.POST }),
            );
            notifyResponse(response, setLoaderStatus);
            await mutate(JUDGE_API_V1.SYS.AWS_ECS_TASK_LIST());
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
                JUDGE_API_V1.SYS.AWS_ECS_SET_RUNNER_TYPE_TASK_DEFINITION(RunnerType.HIGH_PERFORMANCE, revision.taskDefinitionArn),
                { method: HTTPMethod.POST }),
              );
              notifyResponse(response, setLoaderStatus);
              await mutate(JUDGE_API_V1.SYS.AWS_ECS_TASK_LIST());
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
                JUDGE_API_V1.SYS.AWS_ECS_SET_RUNNER_TYPE_TASK_DEFINITION(RunnerType.LOW_PERFORMANCE, revision.taskDefinitionArn),
                { method: HTTPMethod.POST }),
              );
              notifyResponse(response, setLoaderStatus);
              await mutate(JUDGE_API_V1.SYS.AWS_ECS_TASK_LIST());
            }}
          >
            <T>set low runner</T>
          </ButtonLoader>
        )}
      </div>
    </div>
  );
};

export const ECSTaskDefinitionsManagement = () => {
  const {
    data: response,
    request,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponseType<TaskDefinitionResponseDTO>>(JUDGE_API_V1.SYS.AWS_ECS_TASK_DEFINITION_LIST());
  
  const columns: DataViewerHeadersType<AwsEcsTaskDefinitionList>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="tt-ue">task definition</T>} />,
      index: 'taskDefinition',
      field: ({ record }) => (
        <Field className="jk-row center gap">
          <FieldTaskDefinition {...record} />
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowB.family.localeCompare(rowA.family) },
    },
  ], []);
  
  const responseData: TaskDefinitionResponseDTO[] = (response?.success ? response?.contents : []);
  
  const definitions: { [key: string]: AwsEcsTaskDefinitionList } = {};
  responseData.forEach(({ taskDefinitionArn, family, revision, memory, cpu, registeredAt, isLowRunner, isHighRunner }) => {
      definitions[family] = {
        family,
        revisions: [
          ...(definitions[family]?.revisions || []),
          { taskDefinitionArn, revision, memory, cpu, registeredAt: new Date(registeredAt), isHighRunner, isLowRunner },
        ],
      };
    },
  );
  const data: AwsEcsTaskDefinitionList[] = Object.values(definitions).map(({ revisions, ...rest }) => ({
    ...rest,
    revisions: revisions.sort((a, b) => b.revision - a.revision),
  }));
  const { queryObject, push } = useRouter();
  
  return (
    <DataViewer<AwsEcsTaskDefinitionList>
      headers={columns}
      data={data}
      rows={{ height: 180 }}
      request={request}
      name={QueryParam.ECS_DEFINITIONS_TASK_TABLE}
      searchParamsObject={queryObject}
      setSearchParamsObject={(params) => push({ query: searchParamsObjectTypeToQuery(params) })}
      setLoaderStatusRef={setLoaderStatusRef}
      {...DEFAULT_DATA_VIEWER_PROPS}
    />
  );
};
