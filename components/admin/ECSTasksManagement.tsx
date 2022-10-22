import { ButtonLoader, CloseIcon, DataViewer, Field, T, TextHeadCell } from 'components/index';
import {
  DEFAULT_DATA_VIEWER_PROPS,
  JUDGE_API_V1,
  JUKI_HIGH_RUNNER_TASK_DEFINITION_FAMILY_NAME,
  JUKI_LOW_RUNNER_TASK_DEFINITION_FAMILY_NAME,
  QueryParam,
} from 'config/constants';
import { authorizedRequest, cleanRequest, notifyResponse, searchParamsObjectTypeToQuery } from 'helpers';
import { useDataViewerRequester, useNotification, useRouter } from 'hooks';
import { useMemo } from 'react';
import { useSWRConfig } from 'swr';
import { ContentResponseType, ContentsResponseType, DataViewerHeadersType, HTTPMethod, Status, TaskResponseDTO } from 'types';

export const ECSTasksManagement = () => {
  const {
    data: response,
    request,
    setLoaderStatusRef,
  } = useDataViewerRequester<ContentsResponseType<TaskResponseDTO>>(JUDGE_API_V1.SYS.AWS_ECS_TASK_LIST(), { refreshInterval: 10 * 1000 });
  const { mutate } = useSWRConfig();
  const { addNotification } = useNotification();
  const columns: DataViewerHeadersType<TaskResponseDTO>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="tt-ue">task</T>} />,
      index: 'task ',
      field: ({
        record: {
          taskArn,
          group,
          createdAt,
          cpu,
          memory,
          lastStatus,
          desiredStatus,
          launchType,
          startedAt,
          taskDefinitionArn,
        },
      }) => (
        <Field className="jk-row center gap">
          <div className="jk-col">
            <div className="fw-br">
              {group}
              {JUKI_LOW_RUNNER_TASK_DEFINITION_FAMILY_NAME === group && <>&nbsp;<T className="tt-ue jk-tag info">low</T></>}
              {JUKI_HIGH_RUNNER_TASK_DEFINITION_FAMILY_NAME === group && <>&nbsp;<T className="tt-ue jk-tag info">high</T></>}
            </div>
            <div className="tx-s"><T className="fw-bd">started at</T>:&nbsp;{new Date(startedAt).toLocaleString()}</div>
            <div className="tx-s"><T className="fw-bd">created at</T>:&nbsp;{new Date(createdAt).toLocaleString()}</div>
            <div className="tx-s">{memory} (MiB) / {cpu} (unit)</div>
            <div className="tx-s fw-bd">
              <span className={lastStatus === 'RUNNING' ? 'cr-ss' : 'cr-wg'}>{lastStatus}</span> / {desiredStatus}
            </div>
            <div className="tx-s">{launchType}</div>
            <div className="tx-xs fw-br" style={{ lineHeight: '12px' }}>{taskDefinitionArn}</div>
            <div className="tx-xs" style={{ lineHeight: '12px' }}>{taskArn}</div>
            <ButtonLoader
              size="small"
              icon={<CloseIcon circle />}
              onClick={async (setLoaderStatus) => {
                setLoaderStatus(Status.LOADING);
                const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
                  JUDGE_API_V1.SYS.AWS_ECS_STOP_TASK_TASK_ARN(taskArn),
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
              <T>stop</T>
            </ButtonLoader>
          </div>
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowB.taskArn.localeCompare(rowA.taskArn) },
      cardPosition: 'center',
      minWidth: 400,
    },
  ], []);
  
  const data: TaskResponseDTO[] = (response?.success ? response?.contents : []).map(task => ({
    ...task,
    group: task.group.replace('family:', ''),
  }));
  
  const { queryObject, push } = useRouter();
  
  return (
    <DataViewer<TaskResponseDTO>
      headers={columns}
      data={data}
      rows={{ height: 240 }}
      request={request}
      name={QueryParam.ALL_USERS_TABLE}
      searchParamsObject={queryObject}
      setSearchParamsObject={(params) => push({ query: searchParamsObjectTypeToQuery(params) })}
      setLoaderStatusRef={setLoaderStatusRef}
      extraButtons={[
        <ButtonLoader
          onClick={async (setLoaderStatus) => {
            setLoaderStatus(Status.LOADING);
            const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
              JUDGE_API_V1.SYS.AWS_ECS_ADJUST_TASKS(),
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
          style={{ marginLeft: 'var(--pad-xt)' }}
        >
          <T>adjust tasks</T>
        </ButtonLoader>,
      ]}
      {...DEFAULT_DATA_VIEWER_PROPS}
    />
  );
};
