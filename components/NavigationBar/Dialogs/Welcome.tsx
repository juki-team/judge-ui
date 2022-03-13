import { Button, JukiCompleteLaptopImage, Modal, T } from 'components';
import { OpenDialog, QueryParam, ROUTES } from 'config/constants';
import { removeParamQuery } from 'helpers';
import { useRouter } from 'next/router';
import { useUserState } from 'store';
import { ProfileTab } from 'types';

export const Welcome = () => {
  
  const { givenName, nickname } = useUserState();
  const { push, query } = useRouter();
  
  const handleClose = () => (
    push({ query: removeParamQuery(query, QueryParam.OPEN_DIALOG, OpenDialog.WELCOME) })
  );
  
  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      className="modal-welcome"
    >
      <div className="jk-pad jk-row nowrap">
        <div>
          <h5><T>hi</T><span className="given-name">{givenName}</span>!</h5>
          <h3><T>welcome to the Online Juki Judge</T></h3>
          <p>
            <T>participe in coding contests ranging from beginner level to week-long coding marathons</T>
          </p>
          <div>
            <Button
              type="text"
              onClick={() => {
                handleClose();
                push(ROUTES.PROFILE.PAGE(nickname, ProfileTab.PROFILE));
              }}
            >
              <T>see my profile</T>
            </Button>
            <Button onClick={handleClose}><T>continue</T></Button>
          </div>
        </div>
        <div>
          <JukiCompleteLaptopImage />
        </div>
      </div>
    </Modal>
  );
};
