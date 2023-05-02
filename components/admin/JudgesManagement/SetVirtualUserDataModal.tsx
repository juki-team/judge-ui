import { Button, ButtonLoader, Input, LockIcon, MailIcon, Modal, PersonIcon, T } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useNotification } from 'hooks';
import React, { useState } from 'react';
import { ContentResponseType, HTTPMethod, Status, VirtualUserResponseDTO } from 'types';

type SetVirtualUserDataModalProps = {
  onClose: () => void,
  reloadTable: () => void,
  virtualUser: VirtualUserResponseDTO,
}

export const SetVirtualUserDataModal = ({ onClose, reloadTable, virtualUser }: SetVirtualUserDataModalProps) => {
  
  const { notifyResponse } = useNotification();
  const [ data, setData ] = useState({
    email: virtualUser.email,
    username: virtualUser.username,
    password: virtualUser.password,
  });
  
  return (
    <Modal isOpen={true} onClose={onClose} closeIcon>
      <div className="jk-col gap extend stretch jk-pad-md">
        <div>
          <div className="jk-form-item">
            <label>
              <div className="jk-row left gap"><MailIcon size="small" /><T>email</T></div>
              <Input onChange={email => setData({ ...data, email })} value={data.email} />
            </label>
          </div>
          <div className="jk-form-item">
            <label>
              <div className="jk-row left gap"><PersonIcon size="small" /><T>username</T></div>
              <Input onChange={username => setData({ ...data, username })} value={data.username} />
            </label>
          </div>
          <div className="jk-form-item">
            <label>
              <div className="jk-row left gap"><LockIcon size="small" /><T>password</T></div>
              <Input onChange={password => setData({ ...data, password })} value={data.password} />
            </label>
          </div>
        </div>
        <div className="jk-row right gap">
          <Button onClick={onClose}><T>cancel</T></Button>
          <ButtonLoader
            onClick={async (setLoaderStatus) => {
              setLoaderStatus(Status.LOADING);
              const response = cleanRequest<ContentResponseType<string>>(
                await authorizedRequest(JUDGE_API_V1.VIRTUAL_USER.UPDATE_DATA(virtualUser.id), {
                  method: HTTPMethod.PUT,
                  body: JSON.stringify(data),
                }));
              if (notifyResponse(response, setLoaderStatus)) {
                await reloadTable();
                onClose();
              }
            }}
          >
            <T>save</T>
          </ButtonLoader>
        </div>
      </div>
    </Modal>
  );
};
