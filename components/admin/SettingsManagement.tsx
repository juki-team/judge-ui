import { ButtonLoader, getRandomString, Input, SaveIcon, T } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest, notifyResponse } from 'helpers';
import { useNotification } from 'hooks';
import { useEffect, useState } from 'react';
import { ContentResponseType, HTTPMethod, RunnerType, Status } from 'types';
import { useUserDispatch } from '../../store';

export const SettingsManagement = () => {
  
  const [highPerformanceRunnerMinTasks, setHighPerformanceRunnerMinTasks] = useState(0);
  const [lowPerformanceRunnerMinTasks, setLowPerformanceRunnerMinTasks] = useState(0);
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();
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
  const { signUp } = useUserDispatch();
  const [users, setUsers] = useState([]);
  const [usersGen, setUsersGen] = useState({ prefix: 'team-test-', initialNumber: 0, total: 1, emailDomain: 'juki.contact' });
  
  return (
    <div className="jk-col gap jk-pad-md stretch">
      <div className="jk-row gap">
        <T>high performance runner min tasks</T>
        <Input type="number" value={highPerformanceRunnerMinTasks} onChange={setHighPerformanceRunnerMinTasks} disabled={loading} />
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
            if (notifyResponse(response, addNotification)) {
              setLoaderStatus(Status.SUCCESS);
            } else {
              setLoaderStatus(Status.ERROR);
            }
            setLoading(false);
            setReload(Date.now());
          }}
        >
          <T>save</T>
        </ButtonLoader>
      </div>
      <div className="jk-row gap">
        <T>low performance runner min tasks</T>
        <Input type="number" value={lowPerformanceRunnerMinTasks} onChange={setLowPerformanceRunnerMinTasks} disabled={loading} />
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
            if (notifyResponse(response, addNotification)) {
              setLoaderStatus(Status.SUCCESS);
            } else {
              setLoaderStatus(Status.ERROR);
            }
            setLoading(false);
            setReload(Date.now());
          }}
        >
          <T>save</T>
        </ButtonLoader>
      </div>
      <h1>
        <T>generate users</T>
      </h1>
      <div className="jk-col gap">
        <div className="jk-form-item jk-row gap block extend">
          <label><T>prefix</T></label>
          <Input value={usersGen.prefix} onChange={(value) => setUsersGen(prevState => ({ ...prevState, prefix: value }))} />
        </div>
        <div className="jk-form-item jk-row gap block extend">
          <label><T>initial number</T></label>
          <Input
            type="number"
            value={usersGen.initialNumber}
            onChange={(value) => setUsersGen(prevState => ({ ...prevState, initialNumber: value }))}
          />
        </div>
        <div className="jk-form-item jk-row gap block extend">
          <label><T>total</T></label>
          <Input
            type="number"
            value={usersGen.total}
            onChange={(value) => setUsersGen(prevState => ({ ...prevState, total: value }))}
          />
        </div>
        <div className="jk-form-item jk-row gap block extend">
          <label><T>email domain</T></label>
          <Input value={usersGen.emailDomain} onChange={(value) => setUsersGen(prevState => ({ ...prevState, emailDomain: value }))} />
        </div>
      </div>
      <ButtonLoader
        onClick={async (setLoaderStatus, loaderStatus, event) => {
          setUsers([]);
          for (let i = usersGen.initialNumber; i < usersGen.initialNumber + usersGen.total; i++) {
            const nickname = `${usersGen.prefix}${i}`;
            const password = getRandomString(8);
            const email = `${nickname}@${usersGen.emailDomain}`;
            const result = await signUp('', '', nickname, email, password, setLoaderStatus, false);
            setUsers(users => [...users, { nickname, password, email, message: result?.message }]);
          }
        }}
      >
        generate
      </ButtonLoader>
      <div className="jk-col extend stretch">
        <div className="jk-row block stretch jk-table-inline-header">
          <div className="jk-row">nickname</div>
          <div className="jk-row">email</div>
          <div className="jk-row">password</div>
          <div className="jk-row">message</div>
        </div>
        {users.map(user => (
          <div className="jk-row block jk-table-inline-row">
            <div className="jk-row">{user.nickname}</div>
            <div className="jk-row">{user.email}</div>
            <div className="jk-row">{user.password}</div>
            <div className="jk-r0w">{user.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
