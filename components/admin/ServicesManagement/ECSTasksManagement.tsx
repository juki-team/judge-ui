import { ButtonLoader, DataViewer, Field, SettingsSuggestIcon, StopCircleIcon, T, TextHeadCell } from 'components';
import { DEFAULT_DATA_VIEWER_PROPS, JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useDataViewerRequester, useNotification } from 'hooks';
import { useMemo } from 'react';
import {
  CompanyResponseDTO,
  ContentResponseType,
  ContentsResponseType,
  DataViewerHeadersType,
  HTTPMethod,
  QueryParam,
  Status,
  TaskResponseDTO,
} from 'types';

export const ECSTasksManagement = ({ company }: { company: CompanyResponseDTO }) => {
  const {
    data: response,
    request,
    setLoaderStatusRef,
    reload,
    refreshRef,
  } = useDataViewerRequester<ContentsResponseType<TaskResponseDTO>>(() => JUDGE_API_V1.SYS.AWS_ECS_TASK_LIST(company.key));
  const { addSuccessNotification, notifyResponse } = useNotification();
  const columns: DataViewerHeadersType<TaskResponseDTO>[] = useMemo(() => [
    {
      head: <TextHeadCell text={<T className="tt-ue">task definition</T>} />,
      index: 'group',
      field: ({ record: { group, isHighRunnerGroup, isLowRunnerGroup, memory, cpu, taskDefinitionArn } }) => (
        <Field className="jk-row center gap">
          <div className="jk-col gap">
            <div className="jk-col fw-bd">
              {isLowRunnerGroup && <T className="tt-ue jk-tag info">low</T>}
              {isHighRunnerGroup && <T className="tt-ue jk-tag info">high</T>}
              {group}
            </div>
            <div>{memory} (MiB) / {cpu} (unit)</div>
            <div className="tx-s">{taskDefinitionArn}</div>
          </div>
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowB.group.localeCompare(rowA.group) },
      cardPosition: 'center',
      minWidth: 400,
    },
    {
      head: <TextHeadCell text={<T className="tt-ue">task</T>} />,
      index: 'task',
      field: ({
                record: {
                  taskArn,
                  createdAt,
                  lastStatus,
                  desiredStatus,
                  launchType,
                  startedAt,
                },
              }) => (
        <Field className="jk-row center gap">
          <div className="jk-col">
            <div className="tx-s"><T className="fw-bd">started at</T>:&nbsp;{new Date(startedAt).toLocaleString()}</div>
            <div className="tx-s"><T className="fw-bd">created at</T>:&nbsp;{new Date(createdAt).toLocaleString()}</div>
            <div className="tx-s fw-bd">
              <span className={lastStatus === 'RUNNING' ? 'cr-ss' : 'cr-wg'}>{lastStatus}</span> / {desiredStatus}
            </div>
            <div className="tx-s">{launchType}</div>
            <div className="tx-t">{taskArn}</div>
            <ButtonLoader
              size="small"
              icon={<StopCircleIcon />}
              onClick={async (setLoaderStatus) => {
                setLoaderStatus(Status.LOADING);
                const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
                    JUDGE_API_V1.SYS.AWS_ECS_STOP_TASK_TASK_ARN(taskArn),
                    { method: HTTPMethod.POST },
                  ),
                );
                notifyResponse(response, setLoaderStatus);
                reload();
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
  
  const data: TaskResponseDTO[] = (response?.success ? response?.contents : []);
  
  return (
    <DataViewer<TaskResponseDTO>
      headers={columns}
      data={data}
      rows={{ height: 200 }}
      request={request}
      name={QueryParam.ECS_TASKS_TABLE}
      setLoaderStatusRef={setLoaderStatusRef}
      refreshRef={refreshRef}
      extraNodes={[
        <ButtonLoader
          icon={<SettingsSuggestIcon />}
          size="small"
          onClick={async (setLoaderStatus) => {
            setLoaderStatus(Status.LOADING);
            const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
                JUDGE_API_V1.SYS.AWS_ECS_ADJUST_TASKS(),
                { method: HTTPMethod.POST },
              ),
            );
            if (notifyResponse(response, setLoaderStatus)) {
              addSuccessNotification(<pre>{JSON.stringify(response.content, null, 2)}</pre>);
            }
            reload();
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
