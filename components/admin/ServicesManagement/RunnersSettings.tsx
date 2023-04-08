import { ButtonLoader, Input, SaveIcon, T } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useNotification } from 'hooks';
import { useEffect, useState } from 'react';
import { ContentResponseType, HTTPMethod, RunnerType, Status } from 'types';

export const RunnersSettings = () => {
  
  const [highPerformanceRunnerMinTasks, setHighPerformanceRunnerMinTasks] = useState(0);
  const [lowPerformanceRunnerMinTasks, setLowPerformanceRunnerMinTasks] = useState(0);
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(false);
  const { notifyResponse } = useNotification();
  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = cleanRequest<ContentResponseType<{ highPerformanceRunnerMinTasks: number, lowPerformanceRunnerMinTasks: number }>>(await authorizedRequest(JUDGE_API_V1.SYS.AWS_ECS_RUNNER_MIN_TASKS()));
      if (response.success) {
        setHighPerformanceRunnerMinTasks(response.content.highPerformanceRunnerMinTasks ?? 0);
        setLowPerformanceRunnerMinTasks(response.content.lowPerformanceRunnerMinTasks ?? 0);
      }
      setLoading(false);
    })();
  }, [reload]);
  
  return (
    <div className="jk-col nowrap top gap jk-pad-md stretch bc-we jk-br-ie">
      <div className="jk-row gap">
        <T>high performance runner min tasks</T>
        <Input
          type="number"
          value={highPerformanceRunnerMinTasks}
          onChange={setHighPerformanceRunnerMinTasks}
          disabled={loading}
        />
        <ButtonLoader
          size="small"
          disabled={loading}
          icon={<SaveIcon />}
          onClick={async (setLoaderStatus) => {
            setLoading(true);
            setLoaderStatus(Status.LOADING);
            const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
              JUDGE_API_V1.SYS.AWS_ECS_RUNNER_MIN_TASK(RunnerType.HIGH_PERFORMANCE, highPerformanceRunnerMinTasks),
              { method: HTTPMethod.POST }),
            );
            notifyResponse(response, setLoaderStatus);
            setLoading(false);
            setReload(Date.now());
          }}
        >
          <T>save</T>
        </ButtonLoader>
      </div>
      <div className="jk-row gap">
        <T>low performance runner min tasks</T>
        <Input type="number" value={lowPerformanceRunnerMinTasks} onChange={setLowPerformanceRunnerMinTasks}
               disabled={loading} />
        <ButtonLoader
          size="small"
          disabled={loading}
          icon={<SaveIcon />}
          onClick={async (setLoaderStatus) => {
            setLoading(true);
            setLoaderStatus(Status.LOADING);
            const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
              JUDGE_API_V1.SYS.AWS_ECS_RUNNER_MIN_TASK(RunnerType.LOW_PERFORMANCE, lowPerformanceRunnerMinTasks),
              { method: HTTPMethod.POST }),
            );
            notifyResponse(response, setLoaderStatus);
            setLoading(false);
            setReload(Date.now());
          }}
        >
          <T>save</T>
        </ButtonLoader>
      </div>
    </div>
  );
};
