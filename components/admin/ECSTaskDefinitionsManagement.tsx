import { ButtonLoader, CloseIcon, DataViewer, Field, Select, T, TextHeadCell } from 'components/index';
import {
  DEFAULT_DATA_VIEWER_PROPS,
  JUDGE_API_V1,
  JUKI_HIGH_RUNNER_TASK_DEFINITION_FAMILY_NAME,
  JUKI_LOW_RUNNER_TASK_DEFINITION_FAMILY_NAME,
  QueryParam,
} from 'config/constants';
import { authorizedRequest, cleanRequest, notifyResponse, searchParamsObjectTypeToQuery } from 'helpers';
import { useDataViewerRequester, useNotification, useRouter } from 'hooks';
import { useMemo, useState } from 'react';
import { useSWRConfig } from 'swr';
import { ContentResponseType, ContentsResponseType, DataViewerHeadersType, HTTPMethod, Status, TaskDefinitionResponseDTO } from 'types';

type RevisionType = { taskDefinitionArn: string, revision: number, memory: string, cpu: string, registeredAt: Date };
type AwsEcsTaskDefinitionList = { family: string, revisions: RevisionType[] };

const FieldTaskDefinition = ({ family, revisions }: AwsEcsTaskDefinitionList) => {
  
  const { addNotification } = useNotification();
  const [revision, setRevision] = useState<RevisionType>(revisions[0]);
  const { mutate } = useSWRConfig();
  
  return (
    <div className="jk-col">
      <div className="fw-br">
        {family}
        {JUKI_LOW_RUNNER_TASK_DEFINITION_FAMILY_NAME === family && <>&nbsp;<T className="tt-ue jk-tag info">low</T></>}
        {JUKI_HIGH_RUNNER_TASK_DEFINITION_FAMILY_NAME === family && <>&nbsp;<T className="tt-ue jk-tag info">high</T></>}
      </div>
      <div className="tx-s">{revision.memory} (MiB) / {revision.cpu} (unit)</div>
      <div className="tx-s"><T className="tt-se fw-bd">registered at</T>:&nbsp;{revision.registeredAt.toLocaleString()}</div>
      <div className="tx-xs fw-br" style={{ lineHeight: '12px' }}>{revision.taskDefinitionArn}</div>
      <div className="jk-row center gap">
        <Select
          options={revisions.map((definition) => ({ value: definition, label: definition.revision }))}
          selectedOption={{ value: revision }}
          onChange={({ value }) => setRevision(value)}
        />
        <ButtonLoader
          size="small"
          icon={<CloseIcon circle />}
          onClick={async (setLoaderStatus) => {
            setLoaderStatus(Status.LOADING);
            const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
              JUDGE_API_V1.SYS.AWS_ECS_RUN_TASK_TASK_DEFINITION(revision.taskDefinitionArn),
              { method: HTTPMethod.POST }),
            );
            const success = notifyResponse(response, addNotification);
            await mutate(JUDGE_API_V1.SYS.AWS_ECS_TASK_LIST());
            if (success) {
              setLoaderStatus(Status.SUCCESS);
            } else {
              setLoaderStatus(Status.ERROR);
            }
          }}
        >
          <T>run task</T>
        </ButtonLoader>
      </div>
    </div>
  );
};

export const ECSTaskDefinitionsManagement = () => {
  const {
    data: response,
    request,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponseType<TaskDefinitionResponseDTO>>(JUDGE_API_V1.SYS.AWS_ECS_TASK_DEFINITION_LIST(), { refreshInterval: 10 * 1000 });
  
  const columns: DataViewerHeadersType<AwsEcsTaskDefinitionList>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="tt-ue">task definition</T>} />,
      index: 'taskDefinition',
      field: ({ record: { family, revisions } }) => (
        <Field className="jk-row center gap">
          <FieldTaskDefinition family={family} revisions={revisions} />
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowB.family.localeCompare(rowA.family) },
    },
  ], []);
  
  const responseData: TaskDefinitionResponseDTO[] = (response?.success ? response?.contents : []);
  
  const definitions: { [key: string]: AwsEcsTaskDefinitionList } = {};
  responseData.forEach(({ taskDefinitionArn, family, revision, memory, cpu, registeredAt }) => {
      definitions[family] = {
        family,
        revisions: [
          ...(definitions[family]?.revisions || []),
          { taskDefinitionArn, revision, memory, cpu, registeredAt: new Date(registeredAt) },
        ],
      };
    },
  );
  const data: AwsEcsTaskDefinitionList[] = Object.values(definitions).map(({ family, revisions }) => ({
    family,
    revisions: revisions.sort((a, b) => b.revision - a.revision),
  }));
  const { queryObject, push } = useRouter();
  
  return (
    <DataViewer<AwsEcsTaskDefinitionList>
      headers={columns}
      data={data}
      rows={{ height: 180 }}
      request={request}
      name={QueryParam.ALL_USERS_TABLE}
      searchParamsObject={queryObject}
      setSearchParamsObject={(params) => push({ query: searchParamsObjectTypeToQuery(params) })}
      setLoaderStatusRef={setLoaderStatusRef}
      extraButtons={[]}
      {...DEFAULT_DATA_VIEWER_PROPS}
    />
  );
};
