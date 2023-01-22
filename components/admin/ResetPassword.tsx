import { Button, ButtonLoader, Modal, T, UserNicknameLink } from 'components';
import { useUserDispatch } from 'hooks';
import React from 'react';

export const ResetPassword = ({ onClose, nickname }: { onClose: () => void, nickname: string }) => {
  
  const { resetPassword } = useUserDispatch();
  
  return (
    <Modal
      isOpen={!!nickname}
      onClose={onClose}
      closeWhenClickOutside
      closeIcon
    >
      <div className="jk-pad-md jk-col gap left stretch">
        <h2><T>reset password</T></h2>
        <div className="jk-row left">
          <T className="tt-se">the password for</T>&nbsp;
          <UserNicknameLink nickname={nickname}>
            <div className="link">{nickname}</div>
          </UserNicknameLink>&nbsp;
          <T>will be reset</T>.
        </div>
        <div>
          <T className="tt-se">the new password will be sent to user's email</T>.
        </div>
        <div className="jk-row right gap extend">
          <Button type="text" onClick={onClose}><T>cancel</T></Button>
          <ButtonLoader onClick={resetPassword(nickname, onClose)}>
            <T>reset_2</T>
          </ButtonLoader>
        </div>
      </div>
    </Modal>
  );
};
