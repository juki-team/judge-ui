import { Button, ButtonLoader, ContentCopyIcon, CopyToClipboard, InputPassword, Modal, ReloadIcon, T, UserNicknameLink } from 'components';
import React, { useState } from 'react';
import { useUserDispatch } from '../../store';

export const getRandomString = (length: number) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let retVal = '';
  for (let i = 0; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return retVal;
};

export const ResetPassword = ({ onClose, nickname }: { onClose: () => void, nickname: string }) => {
  
  const [newPassword, setNewPassword] = useState(getRandomString(12));
  const { resetPassword } = useUserDispatch();
  
  return (
    <Modal
      isOpen={!!nickname}
      onClose={onClose}
      shouldCloseOnOverlayClick
      closeIcon
    >
      <div className="jk-pad-md jk-col gap left stretch">
        <h6><T>reset password</T></h6>
        <UserNicknameLink nickname={nickname}>
          <div className="link">{nickname}</div>
        </UserNicknameLink>
        <div className="jk-form-item" style={{ width: '100%' }}>
          <label>
            <div className="jk-row space-between">
              <T>new password</T>
              <div className="jk-row">
                <Button type="text" size="small" onClick={() => setNewPassword(getRandomString(12))}
                        icon={<ReloadIcon />}><T>regenerate</T></Button>
                <CopyToClipboard text={newPassword}>
                  <Button
                    type="text"
                    icon={<ContentCopyIcon className="cursor-pointer" />}
                    size="small"
                  >
                    <T>copy</T>
                  </Button>
                </CopyToClipboard>
              </div>
            </div>
            <InputPassword onChange={value => setNewPassword(value)} value={newPassword} />
          </label>
        </div>
        <div className="jk-row right gap">
          <Button type="text" onClick={onClose}><T>cancel</T></Button>
          <ButtonLoader onClick={resetPassword(nickname, newPassword, onClose)}>
            <T>change</T>
          </ButtonLoader>
        </div>
      </div>
    </Modal>
  );
};
