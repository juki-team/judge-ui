import { Button, ButtonLoader, CopyIcon, CopyToClipboard, InputPassword, Modal, T } from 'components';
import { useState } from 'react';
import { PUT } from '../../config/constants';
import { authorizedRequest, clean } from '../../helpers';
import { JUDGE_API_V1 } from '../../config/constants/judge';
import { ContentResponseType, Status } from '../../types';
import { useNotification } from '../index';

const getRandomString = (length: number) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let retVal = '';
  for (let i = 0; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return retVal;
};

export const ChangePassword = ({ onClose, nickname }: { onClose: () => void, nickname: string }) => {
  
  const [newPassword, setNewPassword] = useState(getRandomString(12));
  const { addSuccessNotification, addErrorNotification } = useNotification();
  
  return (
    <Modal
      isOpen={!!nickname}
      onClose={onClose}
    >
      <div className="jk-pad">
        <h6><T>change password</T></h6>
        <div className="jk-row start"><T>nickname</T>: &nbsp;
          <div className="link">{nickname}</div>
        </div>
        <div className="jk-row start">
          <InputPassword onChange={value => setNewPassword(value)} value={newPassword} />
          <CopyToClipboard text={newPassword}>
            <CopyIcon className="cursor-pointer" />
          </CopyToClipboard>
          <Button type="text" onClick={() => setNewPassword(getRandomString(12))}>
            <T>regenerate</T>
          </Button>
        </div>
        <div className="jk-row end">
          <Button type="text" onClick={onClose}><T>cancel</T></Button>
          <ButtonLoader
            onClick={async setLoaderStatus => {
              setLoaderStatus?.(Status.LOADING);
              const response = clean<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.ACCOUNT.CHANGE_PASSWORD(), PUT, JSON.stringify({
                nickName: nickname,
                newPassword,
              })));
              if (response.success) {
                addSuccessNotification(<T>password changed successfully</T>);
                setLoaderStatus?.(Status.SUCCESS);
              } else {
                addErrorNotification(<T>error</T>);
                setLoaderStatus?.(Status.ERROR);
              }
            }}
          >
            <T>change</T>
          </ButtonLoader>
        </div>
      </div>
    </Modal>
  );
};