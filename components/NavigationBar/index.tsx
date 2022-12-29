import {
  AppsIcon,
  ArrowIcon,
  AssignmentIcon,
  Button,
  CloseIcon,
  CupIcon,
  GmailIcon,
  HorizontalMenu,
  Image,
  JukiCouchLogoHorImage,
  JukiJudgeLogoHorImage,
  JukiUtilsLogoHorImage,
  LeaderboardIcon,
  LoadingIcon,
  LoginModal,
  MenuIcon,
  PhoneIcon,
  Popover,
  SettingsIcon,
  SignUpModal,
  SubmissionModal,
  SupportAgentIcon,
  T,
  TelegramIcon,
  UserPreviewModal,
  WelcomeModal,
} from 'components';
import { OpenDialog, QueryParam, ROUTES } from 'config/constants';
import { classNames, isOrHas, removeParamQuery } from 'helpers';
import { useJukiBase, useJukiFlags, useUserDispatch } from 'hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { AdminTab, ContestsTab, Language, ProfileSettingOptions, Status, Theme } from 'types';
import { LoginUser } from './LoginUser';
import { SettingsPopover } from './SettingsPopover';

export const NavigationBar = ({ children }: PropsWithChildren<{}>) => {
  
  const { pathname, push, query } = useRouter();
  const [loader, setLoader] = useState<Status>(Status.NONE);
  const { flags, setFlags } = useJukiFlags();
  const {
    user: {
      canViewUsersManagement,
      canViewSubmissionsManagement,
      canViewFilesManagement,
      canViewEmailManagement,
      canViewJudgersManagement,
      isLogged,
      settings,
      nickname,
    },
    isLoading,
    company: { emailContact, imageUrl, name },
  } = useJukiBase();
  
  const menu = [
    {
      label: <T>contests</T>,
      icon: <CupIcon />,
      selected: ('/' + pathname).includes('//contest'),
      menuItemWrapper: (children) => <Link href={ROUTES.CONTESTS.LIST(ContestsTab.CONTESTS)}>{children}</Link>,
    },
    {
      label: <T>problems</T>,
      icon: <AssignmentIcon />,
      selected: ('/' + pathname).includes('//problem'),
      menuItemWrapper: (children) => <Link href={ROUTES.PROBLEMS.LIST()}>{children}</Link>,
    },
    {
      label: <T>ranking</T>,
      icon: <LeaderboardIcon />,
      selected: ('/' + pathname).includes('//ranking'),
      menuItemWrapper: (children) => <Link href={ROUTES.RANKING.PAGE()}>{children}</Link>,
    },
  ];
  if (canViewUsersManagement || canViewSubmissionsManagement || canViewFilesManagement || canViewEmailManagement || canViewJudgersManagement) {
    menu.push({
      label: <T>admin</T>,
      icon: <SettingsIcon />,
      selected: ('/' + pathname).includes('//admin'),
      menuItemWrapper: (children) => <Link href={ROUTES.ADMIN.PAGE(AdminTab.USERS_MANAGEMENT)}>{children}</Link>,
    });
  }
  const { updateUserSettings, setUser } = useUserDispatch();
  
  useEffect(() => {
    if (isLogged && (isOrHas(query[QueryParam.DIALOG], OpenDialog.SIGN_UP) || isOrHas(query[QueryParam.DIALOG], OpenDialog.SIGN_IN))) {
      push({
        query: removeParamQuery(
          removeParamQuery(query, QueryParam.DIALOG, OpenDialog.SIGN_UP),
          QueryParam.DIALOG,
          OpenDialog.SIGN_IN,
        ),
      });
    }
  }, [isLogged, query]);
  
  const toggleSetting = (key: ProfileSettingOptions, value: string) => {
    const newSettings = { ...settings };
    if (key === ProfileSettingOptions.LANGUAGE) {
      newSettings.preferredLanguage = value as Language;
    }
    if (key === ProfileSettingOptions.THEME) {
      newSettings.preferredTheme = value as Theme;
    }
    if (isLogged) {
      updateUserSettings(nickname, newSettings, (status: Status) => setLoader(status));
    } else {
      localStorage.setItem(key, value);
      setUser(prevState => ({ ...prevState, settings: newSettings }));
    }
  };
  
  const toggleLanguage = () => {
    toggleSetting(ProfileSettingOptions.LANGUAGE, settings?.[ProfileSettingOptions.LANGUAGE] === Language.EN ? Language.ES : Language.EN);
  };
  const toggleTheme = () => {
    toggleSetting(ProfileSettingOptions.THEME, settings?.[ProfileSettingOptions.THEME] === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };
  
  const Settings = (placement: 'bottom' | 'topLeft') => (
    <>
      <Popover
        content={
          <SettingsPopover
            loader={loader === Status.LOADING}
            languageChecked={settings?.[ProfileSettingOptions.LANGUAGE] === Language.ES}
            toggleLanguage={toggleLanguage}
            themeChecked={settings?.[ProfileSettingOptions.THEME] === Theme.DARK}
            toggleTheme={toggleTheme}
          />
        }
        triggerOn="click"
        placement={placement}
      >
        <div className="jk-row">
          <Button icon={<SettingsIcon />} type="text" />
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
        <div className="jk-row">
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
          <div className="navbar jk-row" onClick={() => push('/')}>
            {isLoading ? <LoadingIcon /> : <Image src={imageUrl} alt={name} height={40} width={80} />}
          </div>
        )}
        rightSection={
          <div className="jk-row stretch gap settings-apps-login-user-content nowrap">
            {Settings('bottom')}
            <LoginUser />
          </div>
        }
        leftMobile={{
          children: ({ toggle }) => (
            <div className="jk-row nowrap left mobile-left-side-header">
              <div className="jk-row" onClick={toggle}><MenuIcon /></div>
              <Link href="/"><JukiJudgeLogoHorImage /></Link>
            </div>
          ),
          content: ({ toggle }) => (
            <div className="bc-py jk-row filled ">
              <div className="jk-col space-between left-mobile-content">
                <div className="jk-row nowrap gap left mobile-left-side-header">
                  <div className="jk-row"><ArrowIcon rotate={-90} onClick={toggle} /></div>
                  <JukiJudgeLogoHorImage />
                </div>
                <div className="jk-col gap mobile-left-side-bottom">
                  {Settings('topLeft')}
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
        {isLoading ? <div className="jk-col extend"><LoadingIcon size="very-huge" /></div> : children}
        <div
          className={classNames('need-help-container jk-border-radius-inline jk-col nowrap', {
            'open jk-shadow': flags.isHelpOpen,
            'cursor-pointer': !flags.isHelpOpen,
            focus: flags.isHelpFocused,
          })}
          onClick={() => setFlags(prevState => ({ ...prevState, isHelpOpen: true }))}
        >
          <div className="jk-row gap center">
            <SupportAgentIcon />
            {flags.isHelpOpen && (
              <>
                <T className="tt-ue tx-s fw-bd">need help?</T>
                <div
                  className="jk-row close cursor-pointer"
                  style={{ position: 'absolute', right: 'var(--pad-sm)' }}
                  onClick={(event) => {
                    setFlags(prevState => ({ ...prevState, isHelpOpen: false }));
                    event.stopPropagation();
                  }}
                >
                  <CloseIcon />
                </div>
              </>
            )}
          </div>
          {flags.isHelpOpen && (
            <div className="jk-col center stretch extend">
              <div className="jk-row center fw-bd"><T className="tt-se">contact the webmaster</T>:</div>
              <div className="jk-row gap center">
                <TelegramIcon />
                <div className="jk-row link fw-bd" style={{ width: 180 }}>
                  <Link href="https://t.me/OscarGauss" target="_blank">t.me/OscarGauss</Link>
                </div>
              </div>
              <div className="jk-row gap center">
                <PhoneIcon />
                <div className="jk-row fw-bd" style={{ width: 180 }}>+591 79153358</div>
              </div>
              {!isLoading && !!emailContact && (
                <div className="jk-row gap center">
                  <GmailIcon />
                  <div className="jk-row fw-bd" style={{ width: 180 }}>{emailContact}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </HorizontalMenu>
    </>
  );
};
