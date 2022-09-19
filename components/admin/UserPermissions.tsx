import { JUDGE_API_V1 } from 'config/constants/judge';
import { authorizedRequest, can, cleanRequest } from 'helpers';
import React, { useState } from 'react';
import { useUserState } from 'store';
import { ContentResponseType, HTTPMethod, Status } from 'types';
import { Button, ButtonLoader, EditIcon, Input, SaveIcon, Select, T, useNotification } from '../index';

export interface ProblemPermissionsProps {
  permissions: Array<{ key: string, value: string }>,
  nickname: string,
  refresh: () => void,
}

export const UserPermissions = ({ permissions, nickname, refresh }: ProblemPermissionsProps) => {
  
  const user = useUserState();
  const [editing, setEditing] = useState(false);
  const [newPermissions, setNewPermissions] = useState<Array<{ key: string, value: string }>>(permissions);
  const { addSuccessNotification, addErrorNotification } = useNotification();
  const contestPermission = newPermissions.filter(permission => permission.key === 'CONTEST')[0] || { key: 'CONTEST', value: '9993' };
  
  const roleContest = {
    '0000': 'super admin',
    '0111': 'admin',
    '0222': 'manager',
    '9993': 'regular',
    '0333': 'guest',
  };
  const codeRoleContest = ['0000', '0111', '0222', '9993', '0333'];
  const CONTEST = 'CONTEST';
  
  return (
    <div>
      <div className="permissions-cell jk-row nowrap">
        <div className="permissions-box">
          {newPermissions.filter(permission => permission.key !== CONTEST).map((permission, index) => (
            <div className="permission jk-row" key={permission.key}>
              <div className="label-permission text-s semi-bold">{permission.key}</div>
              {editing ?
                permission.value.split('').map((value, indexV) => (
                  <Input<number>
                    value={+value}
                    onChange={value => {
                      setNewPermissions(prevState => {
                        const newState = [...prevState];
                        const newValue = permission.value.split('');
                        newValue[indexV] = !Number.isNaN(value) && value > 0 && value < 10 ? value + '' : '0';
                        newState[index] = { key: permission.key, value: newValue.join('') };
                        return newState;
                      });
                    }}
                  />
                ))
                : <div className="value-permission">{permission.value}</div>}
            </div>
          ))}
          <div className="jk-form-item" style={{ width: 200 }}>
            <label>
              <T>contest</T>
              <Select
                disabled={!editing}
                options={codeRoleContest.map(code => ({ label: <T>{roleContest[code]}</T>, value: code }))}
                selectedOption={{
                  value: contestPermission.value,
                  label: codeRoleContest.find(code => contestPermission.value === code) ?
                    <T>{roleContest[contestPermission.value]}</T> : contestPermission.value,
                }}
                onChange={({ value }) => {
                  setNewPermissions(prevState => {
                    const newState = prevState.filter(p => p.key !== CONTEST);
                    newState.push({ key: CONTEST, value });
                    return newState;
                  });
                }}
                extend
              />
            </label>
          </div>
        </div>
        {can.updatePermissionsUser(user) && (
          <div className="editing-actions-box">
            {editing ? (
              <ButtonLoader
                type="text"
                icon={<SaveIcon filledCircle className="color-primary" />}
                onClick={async setLoaderStatus => {
                  if (JSON.stringify(newPermissions) !== JSON.stringify(permissions)) {
                    setLoaderStatus?.(Status.LOADING);
                    const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.ACCOUNT.CHANGE_PERMISSIONS(nickname), {
                      method: HTTPMethod.PUT,
                      body: JSON.stringify(newPermissions),
                    }));
                    if (response.success) {
                      addSuccessNotification(<T>success</T>);
                      setLoaderStatus?.(Status.SUCCESS);
                    } else {
                      addErrorNotification(<T>error</T>);
                      setLoaderStatus?.(Status.ERROR);
                    }
                    refresh();
                  }
                  setEditing(false);
                }}
              />
            ) : <Button type="text" icon={<EditIcon filledCircle className="color-primary" />} onClick={() => setEditing(true)} />}
          </div>
        )}
      </div>
    </div>
  );
};
