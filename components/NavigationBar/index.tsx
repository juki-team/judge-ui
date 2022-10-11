import { LoginModal, SignUpModal, SubmissionModal, UserPreviewModal, WelcomeModal } from 'components';
import { OpenDialog, QueryParam, ROUTES } from 'config/constants';
import { isOrHas, removeParamQuery } from 'helpers';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useUserDispatch, useUserState } from 'store';
import { AdminTab, ContestsTab, Language, ProfileSettingOptions, Status, Theme } from 'types';
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
import { LoginUser } from './LoginUser';
import { SettingsPopover } from './SettingsPopover';

export const NavigationBar = ({ children }: PropsWithChildren<{}>) => {
  
  const { pathname, push, query } = useRouter();
  const [loader, setLoader] = useState<Status>(Status.NONE);
  const user = useUserState();
  
  const menu = [
    {
      label: <T>contests</T>,
      icon: <CupIcon />,
      selected: ('/' + pathname).includes('//contest'),
      menuItemWrapper: (children) => <Link href={ROUTES.CONTESTS.LIST(ContestsTab.CONTESTS)}><a>{children}</a></Link>,
    },
    {
      label: <T>problems</T>,
      icon: <AssignmentIcon />,
      selected: ('/' + pathname).includes('//problem'),
      menuItemWrapper: (children) => <Link href={ROUTES.PROBLEMS.LIST()}><a>{children}</a></Link>,
    },
  ];
  if (user.canViewUsersManagement || user.canViewSubmissionsManagement || user.canViewFilesManagement) {
    menu.push({
      label: <T>admin</T>,
      icon: <SettingIcon />,
      selected: ('/' + pathname).includes('//admin'),
      menuItemWrapper: (children) => <Link href={ROUTES.ADMIN.PAGE(AdminTab.USERS)}><a>{children}</a></Link>,
    });
  }
  const { updateUserSettings, setUser } = useUserDispatch();
  
  useEffect(() => {
    if (user.isLogged && (isOrHas(query[QueryParam.DIALOG], OpenDialog.SIGN_UP) || isOrHas(query[QueryParam.DIALOG], OpenDialog.SIGN_IN))) {
      push({
        query: removeParamQuery(
          removeParamQuery(query, QueryParam.DIALOG, OpenDialog.SIGN_UP),
          QueryParam.DIALOG,
          OpenDialog.SIGN_IN,
        ),
      });
    }
  }, [user.isLogged, query]);
  
  const toggleSetting = (key: ProfileSettingOptions, value: string) => {
    const settings = { ...user.settings };
    if (key === ProfileSettingOptions.LANGUAGE) {
      settings.preferredLanguage = value as Language;
    }
    if (key === ProfileSettingOptions.THEME) {
      settings.preferredTheme = value as Theme;
    }
    if (user.isLogged) {
      updateUserSettings(user.nickname, settings, (status: Status) => setLoader(status));
    } else {
      localStorage.setItem(key, value);
      setUser({ ...user, settings });
    }
  };
  
  const toggleLanguage = () => {
    toggleSetting(ProfileSettingOptions.LANGUAGE, user.settings?.[ProfileSettingOptions.LANGUAGE] === Language.EN ? Language.ES : Language.EN);
  };
  const toggleTheme = () => {
    toggleSetting(ProfileSettingOptions.THEME, user.settings?.[ProfileSettingOptions.THEME] === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };
  
  const settings = (placement: 'bottom' | 'rightBottom') => (
    <>
      <Popover
        content={
          <SettingsPopover
            loader={loader === Status.LOADING}
            languageChecked={user.settings?.[ProfileSettingOptions.LANGUAGE] === Language.ES}
            toggleLanguage={toggleLanguage}
            themeChecked={user.settings?.[ProfileSettingOptions.THEME] === Theme.DARK}
            toggleTheme={toggleTheme}
          />
        }
        triggerOn="click"
        placement={placement}
      >
        <div className="cr-we">
          <Button icon={<SettingIcon />} type="text" />
        </div>
      </Popover>
      <Popover
        content={
          <div className="jk-col gap more-apps-popover">
            <div className="semi-bold tt-se"><T>more apps coming soon</T></div>
            <div className="jk-col gap cr-py">
              <div className="jk-row">
                <JukiCouchLogoHorImage /> <LoadingIcon size="small" /> <T className="tt-se">developing</T>...
              </div>
              <div className="jk-row">
                <JukiUtilsLogoHorImage /> <LoadingIcon size="small" /> <T className="tt-se">developing</T>...
              </div>
            </div>
          </div>
        }
        triggerOn="click"
        placement={placement}
      >
        <div className="cr-we">
          <Button icon={<AppsIcon />} type="text" />
        </div>
      </Popover>
    </>
  );
  
  return (
    <>
      {isOrHas(query[QueryParam.DIALOG], OpenDialog.SIGN_UP) && <SignUpModal />}
      {isOrHas(query[QueryParam.DIALOG], OpenDialog.SIGN_IN) && <LoginModal />}
      {isOrHas(query[QueryParam.DIALOG], OpenDialog.WELCOME) && <WelcomeModal />}
      {query[QueryParam.USER_PREVIEW] && <UserPreviewModal nickname={query[QueryParam.USER_PREVIEW] as string} />}
      {query[QueryParam.SUBMISSION_VIEW] && <SubmissionModal submitId={query[QueryParam.SUBMISSION_VIEW] as string} />}
      <HorizontalMenu
        menu={menu}
        leftSection={() => (
          <div className="cr-we navbar" onClick={() => push('/')}>
            <JukiJudgeLogoHorImage />
          </div>
        )}
        rightSection={
          <div className="jk-row gap settings-apps-login-user-content nowrap">
            {settings('bottom')}
            <LoginUser />
          </div>
        }
        leftMobile={{
          children: ({ toggle }) => (
            <div className="jk-row gap nowrap left mobile-left-side-header">
              <div className="jk-row" onClick={toggle}><MenuIcon className="cr-we" /></div>
              <Link href="/"><a><JukiJudgeLogoHorImage className="cr-we" /></a></Link>
            </div>
          ),
          content: ({ toggle }) => (
            <div className="bc-py jk-row filled ">
              <div className="jk-col space-between left-mobile-content">
                <div className="jk-row nowrap gap left mobile-left-side-header">
                  <div className="jk-row"><ArrowIcon rotate={-90} onClick={toggle} className="cr-we" /></div>
                  <JukiJudgeLogoHorImage className="cr-we" />,
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
        {user.isLoading ? <div className="jk-col extend"><LoadingIcon size="very-huge" /></div> : children}
      </HorizontalMenu>
    </>
  );
};