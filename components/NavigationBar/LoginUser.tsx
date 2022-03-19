import { useRouter } from 'next/router';
import { Button, ButtonLoader, Popover, T, UpIcon } from '..';
import { OpenDialog, QueryParam, ROUTES } from '../../config/constants';
import { addParamQuery } from '../../helpers';
import { useUserDispatch, useUserState } from '../../store';
import { ProfileTab } from '../../types';

export const LoginUser = () => {
  
  const user = useUserState();
  const { push, query } = useRouter();
  const { logout } = useUserDispatch();
  
  if (user.isLogged) {
    return (
      <Popover
        content={
          <div className="jk-col gap user-profile-popup">
            <img src={user.imageUrl} className="jk-user-profile-img huge" alt={user.nickname} />
            <Button
              className="jk-row nickname bold"
              onClick={() => push(ROUTES.PROFILE.PAGE(user.nickname, ProfileTab.PROFILE))}
              type="text"
            >
              {user.nickname}
            </Button>
            <ButtonLoader onClick={logout} type="outline" size="small"><T>sign out</T></ButtonLoader>
            {/*<div className="jk-divider tiny" />*/}
            {/*<div className="jk-row space-between nowrap">*/}
            {/*  <div className="text-s capitalized-case"><T>privacity policy</T></div>*/}
            {/*  <div className="text-s capitalized-case"><T>terms of service</T></div>*/}
            {/*</div>*/}
          </div>
        }
        triggerOn="click"
        placement="bottomRight"
      >
        <div className="user-logged-head jk-row gap nowrap color-white">
          <img src={user.imageUrl} alt={user.nickname} className="jk-user-profile-img large" />
          <div className="jk-row nickname">{user.nickname}</div>
          <UpIcon rotate={180} />
        </div>
      </Popover>
    );
  }
  
  return (
    <Button
      type="secondary"
      onClick={() => push({ query: addParamQuery(query, QueryParam.OPEN_DIALOG, OpenDialog.SIGN_IN) })}
    >
      <T>sign in</T>
    </Button>
  );
};