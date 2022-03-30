import { OpenDialog, QueryParam, ROUTES } from 'config/constants';
import { can, isOrHas, removeParamQuery } from 'helpers';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useUserDispatch, useUserState } from 'store';
import { AdminTab, Language, ProfileSettingOptions, Status, Theme } from 'types';
import {
  AppsIcon,
  ArrowIcon,
  AssignmentIcon,
  Button,
  CupIcon,
  HorizontalMenu,
  JukiCouchLogoHorImage,
  JukiJudgeLogoHorImage,
  JukiUtilsLogoHorImage,
  LoadingIcon,
  MenuIcon,
  Popover,
  SettingIcon,
  T,
} from '..';
import { Login, SignUp, Welcome } from './Dialogs';
import { UserPreview } from './Dialogs/UserPreview';
import { LoginUser } from './LoginUser';
import { SettingsPopover } from './SettingsPopover';

export const NavigationBar = ({ children }: PropsWithChildren<{}>) => {
  
  const { pathname, push, query } = useRouter();
  const [loader, setLoader] = useState<Status>(Status.NONE);
  const user = useUserState();
  
  const menu = [
    // {
    //   label: <T>contests</T>,
    //   icon: <CupIcon />,
    //   selected: ('/' + pathname).includes('//contest'),
    //   onClick: () => push(ROUTES.CONTESTS.LIST()),
    // },
    {
      label: <T>problems</T>,
      icon: <AssignmentIcon />,
      selected: ('/' + pathname).includes('//problem'),
      onClick: () => push(ROUTES.PROBLEMS.LIST()),
    },
  
  ];
  if (can.viewUsersTab(user)) {
    menu.push({
      label: <T>admin</T>,
      icon: <SettingIcon />,
      selected: ('/' + pathname).includes('//admin'),
      onClick: () => push(ROUTES.ADMIN.PAGE(AdminTab.USERS)),
    });
  }
  const { updateUserSettings, setUser } = useUserDispatch();
  
  useEffect(() => {
    if (user.isLogged && (isOrHas(query[QueryParam.OPEN_DIALOG], OpenDialog.SIGN_UP) || isOrHas(query[QueryParam.OPEN_DIALOG], OpenDialog.SIGN_IN))) {
      push({
        query: removeParamQuery(
          removeParamQuery(query, QueryParam.OPEN_DIALOG, OpenDialog.SIGN_UP),
          QueryParam.OPEN_DIALOG,
          OpenDialog.SIGN_IN,
        ),
      });
    }
  }, [user.isLogged, query]);
  
  const toggleSetting = (key: ProfileSettingOptions, value: string) => {
    if (user.isLogged) {
      updateUserSettings({ ...user, [key]: value }, (status: Status) => setLoader(status));
    } else {
      localStorage.setItem(key, value);
      setUser({
        ...user,
        [key]: value,
      });
    }
  };
  
  const toggleLanguage = () => {
    toggleSetting(ProfileSettingOptions.LANGUAGE, user[ProfileSettingOptions.LANGUAGE] === Language.EN ? Language.ES : Language.EN);
  };
  const toggleTheme = () => {
    toggleSetting(ProfileSettingOptions.THEME, user[ProfileSettingOptions.THEME] === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };
  
  const settings = (placement: 'bottom' | 'rightBottom') => (
    <>
      <Popover
        content={
          <SettingsPopover
            loader={loader[0] === Status.LOADING}
            languageChecked={user[ProfileSettingOptions.LANGUAGE] === Language.ES}
            toggleLanguage={toggleLanguage}
            themeChecked={user[ProfileSettingOptions.THEME] === Theme.DARK}
            toggleTheme={toggleTheme}
          />
        }
        triggerOn="click"
        placement={placement}
      >
        <div className="color-white">
          <Button icon={<SettingIcon />} type="text" />
        </div>
      </Popover>
      <Popover
        content={
          <div className="jk-col gap more-apps-popover">
            <div className="semi-bold text-sentence-case"><T>more apps coming soon</T></div>
            <div className="jk-col gap color-primary">
              <div className="jk-row">
                <JukiCouchLogoHorImage /> <LoadingIcon size="small" /> <T className="text-sentence-case">developing</T>...
              </div>
              <div className="jk-row">
                <JukiUtilsLogoHorImage /> <LoadingIcon size="small" /> <T className="text-sentence-case">developing</T>...
              </div>
            </div>
          </div>
        }
        triggerOn="click"
        placement={placement}
      >
        <div className="color-white">
          <Button icon={<AppsIcon />} type="text" />
        </div>
      </Popover>
    </>
  );
  
  return (
    <>
      {isOrHas(query[QueryParam.OPEN_DIALOG], OpenDialog.SIGN_UP) && <SignUp />}
      {isOrHas(query[QueryParam.OPEN_DIALOG], OpenDialog.SIGN_IN) && <Login />}
      {isOrHas(query[QueryParam.OPEN_DIALOG], OpenDialog.WELCOME) && <Welcome />}
      {query[QueryParam.OPEN_USER_PREVIEW] && <UserPreview nickname={query[QueryParam.OPEN_USER_PREVIEW]} />}
      <HorizontalMenu
        menu={menu}
        left={() => (
          <div className="color-white navbar" onClick={() => push('/')}>
            <JukiJudgeLogoHorImage />
          </div>
        )}
        right={
          <div className="jk-row gap settings-apps-login-user-content nowrap">
            {settings('bottom')}
            <LoginUser />
          </div>
        }
        leftMobile={{
          children: ({ toggle }) => (
            <div className="jk-row gap nowrap start mobile-left-side-header">
              <div className="jk-row" onClick={toggle}><MenuIcon className="color-white" /></div>
              <Link href="/"><a><JukiJudgeLogoHorImage className="color-white" /></a></Link>
            </div>
          ),
          content: ({ toggle }) => (
            <div className="bg-color-primary jk-row filled left-mobile-content">
              <div className="jk-col space-between">
                <div className="jk-row nowrap gap start mobile-left-side-header">
                  <div className="jk-row"><ArrowIcon rotate={-90} onClick={toggle} className="color-white" /></div>
                  <JukiJudgeLogoHorImage className="color-white" />,
                </div>
                <div className="jk-col gap mobile-left-side-bottom">
                  {settings('rightBottom')}
                  <div />
                  <div />
                </div>
              </div>
            </div>
          ),
        }}
        rightMobile={{
          children: <LoginUser />,
        }}
      >
        {children}
      </HorizontalMenu>
    </>
  );
};