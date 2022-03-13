import { PUT } from 'config/constants';
import { authorizedRequest, can, clean } from 'helpers';
import { useState } from 'react';
import { JUDGE_API_V1 } from 'services/judge';
import { useUserState } from 'store';
import { ContentResponseType, Status } from 'types';
import { Button, ButtonLoader, EditIcon, Input, SaveIcon, T, useNotification } from '../index';

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
  
  return (
    <div>
      <div className="permissions-cell jk-row">
        <div className="permissions-box">
          {newPermissions.map((permission, index) => (
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
                    const response = clean<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.ACCOUNT.CHANGE_PERMISSIONS(nickname), PUT, JSON.stringify(newPermissions)));
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
