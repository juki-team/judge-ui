import { useRouter } from 'next/router';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import {
  AppsIcon,
  Button,
  ConstructionIcon,
  HorizontalMenu,
  JukiCouchLogoHorImage,
  JukiJudgeLogoHorImage,
  JukiUtilsLogoHorImage,
  LoadingIcon,
  Popover,
  SettingIcon,
  T,
} from '..';
import { OpenDialog, QueryParam } from '../../config/constants';
import { isOrHas, removeSubQuery } from '../../helpers';
import { useUserDispatch, useUserState } from '../../store';
import { ButtonLoaderStateType, Language, ProfileSettingOptions, Status, Theme } from '../../types';
import { Login } from './Login';
import { LoginUser } from './LoginUser';
import { SettingsPopover } from './SettingsPopover';
import { SignUp } from './SignUp';
import { Welcome } from './Welcome';

export const NavigationBar = ({ children }: PropsWithChildren<{}>) => {
  
  const { pathname, push, query } = useRouter();
  const [loader, setLoader] = useState<ButtonLoaderStateType>([0, Status.NONE]);
  
  const menu = [
    { label: 'contests', selected: ('/' + pathname).includes('//contest'), onClick: () => push('/contests') },
    { label: 'problems', selected: ('/' + pathname).includes('//problem'), onClick: () => push('/problems') },
    { label: 'admin', selected: ('/' + pathname).includes('//admin'), onClick: () => push('/admin') },
  ];
  
  const user = useUserState();
  const { updateUserSettings, setUser } = useUserDispatch();
  
  useEffect(() => {
    if (user.isLogged && (isOrHas(query[QueryParam.OPEN_DIALOG], OpenDialog.SIGN_UP) || isOrHas(query[QueryParam.OPEN_DIALOG], OpenDialog.SIGN_IN))) {
      push({
        query: removeSubQuery(
          removeSubQuery(query, QueryParam.OPEN_DIALOG, OpenDialog.SIGN_UP),
          QueryParam.OPEN_DIALOG,
          OpenDialog.SIGN_IN,
        ),
      });
    }
  }, [user.isLogged, query]);
  
  const toggleSetting = (key: ProfileSettingOptions, value: string) => {
    if (user.isLogged) {
      updateUserSettings({
        ...user,
        [key]: value,
      }, setLoader);
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
  
  return (
    <>
      {isOrHas(query[QueryParam.OPEN_DIALOG], OpenDialog.SIGN_UP) && <SignUp />}
      {isOrHas(query[QueryParam.OPEN_DIALOG], OpenDialog.SIGN_IN) && <Login />}
      {isOrHas(query[QueryParam.OPEN_DIALOG], OpenDialog.WELCOME) && <Welcome />}
      <HorizontalMenu
        menu={menu}
        leftSection={() => (
          <div className="color-white navbar" onClick={() => push('/')}>
            <JukiJudgeLogoHorImage />
          </div>
        )}
        rightSection={
          <div className="jk-row gap settings-apps-login-user-content">
            <Popover
              content={
                <SettingsPopover
                  loader={loader[1] === Status.LOADING}
                  languageChecked={user[ProfileSettingOptions.LANGUAGE] === Language.ES}
                  toggleLanguage={toggleLanguage}
                  themeChecked={user[ProfileSettingOptions.THEME] === Theme.DARK}
                  toggleTheme={toggleTheme}
                />
              }
              triggerOn="click"
              placement="bottom"
            >
              <div className="color-white">
                <Button icon={<SettingIcon />} type="text" />
              </div>
            </Popover>
            <Popover
              content={
                <div className="jk-col gap more-apps-popover">
                  <div className="semi-bold sentence-case"><T>more apps coming soon</T></div>
                  <div className="jk-col gap color-primary">
                    <div className="jk-row">
                      <JukiCouchLogoHorImage /> <LoadingIcon size="small" /> <T className="sentence-case">developing</T>...
                    </div>
                    <div className="jk-row">
                      <JukiUtilsLogoHorImage /> <LoadingIcon size="small" /> <T className="sentence-case">developing</T>...
                    </div>
                  </div>
                </div>
              }
              triggerOn="click"
              placement="bottom"
            >
              <div className="color-white">
                <Button icon={<AppsIcon />} type="text" />
              </div>
            </Popover>
            <LoginUser />
          </div>
        }
        rightMobileMenu={{
          icon: <div>a</div>,
          content: <div className="jk-col gap more-apps-popover">
            <div className="semi-bold sentence-case"><T>more apps coming soon</T></div>
            <div className="jk-col gap color-primary">
              <div className="jk-row">
                <JukiCouchLogoHorImage /> <ConstructionIcon /> <T className="sentence-case">developing</T>...
              </div>
              <div className="jk-row">
                <JukiUtilsLogoHorImage /> <ConstructionIcon /> <T className="sentence-case">developing</T>...
              </div>
            </div>
          </div>,
        }}
      >
        {children}
      </HorizontalMenu>
    </>
  );
};