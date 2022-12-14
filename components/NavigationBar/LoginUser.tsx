import { Button, ButtonLoader, Image, LoadingIcon, Popover, T, UpIcon_ } from 'components';
import { OpenDialog, QueryParam, ROUTES } from 'config/constants';
import { addParamQuery, classNames } from 'helpers';
import { useJukiBase } from 'hooks';
import { useRouter } from 'next/router';
import { useUserDispatch, useUserState } from 'store';
import { ProfileTab } from 'types';

export const LoginUser = () => {
  
  const user = useUserState();
  const { push, query } = useRouter();
  const { logout } = useUserDispatch();
  const { viewPortSize } = useJukiBase();
  
  if (user.isLoading) {
    return <LoadingIcon className="cr-we" />;
  }
  
  if (user.isLogged) {
    return (
      <Popover
        content={
          <div className="jk-col gap user-profile-popup">
            <Image src={user.imageUrl} className="jk-user-profile-img huge jk-shadow" alt={user.nickname} height={50}
                   width={50} />
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
            {/*  <div className="tx-s capitalized-case"><T>privacity policy</T></div>*/}
            {/*  <div className="tx-s capitalized-case"><T>terms of service</T></div>*/}
            {/*</div>*/}
          </div>
        }
        triggerOn="click"
        placement="bottomRight"
      >
        <div
          className={classNames('user-logged-head nowrap jk-row gap')}
        >
          <img
            src={user.imageUrl}
            alt={user.nickname}
            className={classNames('jk-user-profile-img', { large: viewPortSize !== 'sm', smalla: viewPortSize == 'sm' })}
          />
          <div className="jk-row nickname">{user.nickname}</div>
          <UpIcon_ rotate={180} />
        </div>
      </Popover>
    );
  }
  
  return (
    <Button
      type="secondary"
      onClick={() => push({ query: addParamQuery(query, QueryParam.DIALOG, OpenDialog.SIGN_IN) })}
    >
      <T className="ws-np">sign in</T>
    </Button>
  );
};
