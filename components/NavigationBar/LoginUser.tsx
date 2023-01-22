import { Button, ButtonLoader, Image, LoadingIcon, LoginIcon, LogoutIcon, Popover, T } from 'components';
import { OpenDialog, QueryParam, ROUTES } from 'config/constants';
import { addParamQuery, classNames } from 'helpers';
import { useJukiBase, useUserDispatch } from 'hooks';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ProfileTab } from 'types';

export const LoginUser = ({ collapsed }: { collapsed: boolean }) => {
  
  const { user, isLoading } = useJukiBase();
  const { push, query } = useRouter();
  const { logout } = useUserDispatch();
  const { viewPortSize } = useJukiBase();
  const [visible, setVisible] = useState(false);
  
  if (isLoading) {
    return <div className="jk-row"><LoadingIcon className="cr-we" /></div>;
  }
  
  if (user.isLogged) {
    return (
      <Popover
        visible={visible}
        onVisibleChange={(visible) => setVisible(visible)}
        content={
          <div
            className={classNames('jk-col gap user-profile-popup', {
              'jk-pad-md': viewPortSize === 'sm',
              'jk-pad-sm': viewPortSize !== 'sm',
            })}
          >
            <Image
              src={user.imageUrl}
              className="jk-user-profile-img huge elevation-1"
              alt={user.nickname}
              height={50}
              width={50}
            />
            {user.nickname}
            <div className="jk-col gap">
              <ButtonLoader
                extend
                onClick={async () => {
                  await push(ROUTES.PROFILE.PAGE(user.nickname, ProfileTab.PROFILE));
                  setVisible(false);
                }}
              >
                <T className="ws-np">ir a mi cuenta</T>
              </ButtonLoader>
              <ButtonLoader
                extend
                onClick={async (setLoaderStatus) => {
                  await logout(setLoaderStatus);
                  setVisible(false);
                }}
                type="outline"
                icon={<LogoutIcon />}
              >
                <T className="ws-np">sign out</T>
              </ButtonLoader>
            </div>
            {/*<div className="jk-divider tiny" />*/}
            {/*<div className="jk-row space-between nowrap">*/}
            {/*  <div className="tx-s capitalized-case"><T>privacity policy</T></div>*/}
            {/*  <div className="tx-s capitalized-case"><T>terms of service</T></div>*/}
            {/*</div>*/}
          </div>
        }
        triggerOn="click"
        placement={viewPortSize === 'sm' ? 'centerScreen' : 'rightBottom'}
      >
        <div className={classNames('user-logged-head nowrap jk-row gap')}>
          <img
            src={user.imageUrl}
            alt={user.nickname}
            className={classNames('jk-user-profile-img large')}
          />
          {viewPortSize !== 'sm' && viewPortSize !== 'md' && <div className="jk-row nickname">{user.nickname}</div>}
        </div>
      </Popover>
    );
  }
  
  return (
    <div className="jk-row extend">
      <Button
        type="secondary"
        onClick={() => push({ query: addParamQuery(query, QueryParam.DIALOG, OpenDialog.SIGN_IN) })}
        size={viewPortSize === 'sm' ? 'small' : undefined}
        icon={!collapsed && <LoginIcon />}
        extend
        style={{ margin: '0 var(--pad-xt)' }}
      >
        {!collapsed ? <T className="ws-np ws-np">sign in</T> : <LoginIcon />}
      </Button>
    </div>
  );
};
