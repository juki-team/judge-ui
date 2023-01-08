import {
  AppsIcon,
  ArrowIcon,
  AssignmentIcon,
  Button,
  CloseIcon,
  CupIcon,
  DarkModeIcon,
  GmailIcon,
  Image,
  JukiCouchLogoHorImage,
  JukiJudgeLogoHorImage,
  JukiUtilsLogoHorImage,
  LanguageIcon,
  LeaderboardIcon,
  LightModeIcon,
  LinkSectionAdmin,
  LinkSectionProblem,
  LoadingIcon,
  LoginModal,
  PhoneIcon,
  Popover,
  Select,
  SettingsIcon,
  SignUpModal,
  SubmissionModal,
  SupportAgentIcon,
  T,
  TelegramIcon,
  UserPreviewModal,
  VerticalMenu,
  WelcomeModal,
} from 'components';
import { LinkSectionContest } from 'components/contest/commons';
import { OpenDialog, QueryParam, ROUTES } from 'config/constants';
import { classNames, isOrHas, removeParamQuery } from 'helpers';
import { useJukiBase, useJukiFlags, useUserDispatch } from 'hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { Language, LastLinkKey, LastLinkType, ProfileSettingOptions, Status, Theme } from 'types';
import { LoginUser } from './LoginUser';

const initialLastLink = {
  [LastLinkKey.SECTION_CONTEST]: { pathname: '/contests', query: {} },
  [LastLinkKey.CONTESTS]: { pathname: '/contests', query: {} },
  [LastLinkKey.SECTION_PROBLEM]: { pathname: '/problems', query: {} },
  [LastLinkKey.PROBLEMS]: { pathname: '/problems', query: {} },
  [LastLinkKey.SECTION_ADMIN]: { pathname: '/admin', query: {} },
};

export const LastLinkContext = createContext<{
  pushPath: ({
    key,
    pathname,
    query,
  }) => void, lastLink: LastLinkType
}>({
  pushPath: () => null,
  lastLink: initialLastLink,
});

export const LasLinkProvider = ({ children }: PropsWithChildren<{}>) => {
  const [lastLink, setLastLink] = useState<LastLinkType>(initialLastLink);
  
  return (
    <LastLinkContext.Provider value={{
      pushPath: ({ key, pathname, query }) => setLastLink(prevState => ({ ...prevState, [key]: { pathname, query } })),
      lastLink,
    }}>
      {children}
    </LastLinkContext.Provider>
  );
};

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
      menuItemWrapper: (children) => <LinkSectionContest>{children}</LinkSectionContest>,
    },
    {
      label: <T>problems</T>,
      icon: <AssignmentIcon />,
      selected: ('/' + pathname).includes('//problem'),
      menuItemWrapper: (children) => <LinkSectionProblem>{children}</LinkSectionProblem>,
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
      menuItemWrapper: (children) => <LinkSectionAdmin>{children}</LinkSectionAdmin>,
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
  
  const toggleTheme = () => {
    toggleSetting(ProfileSettingOptions.THEME, settings?.[ProfileSettingOptions.THEME] === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };
  const loading = loader === Status.LOADING;
  const Settings2 = (isMobile: boolean, isOpen?: boolean) => (
    <>
      <div className="jk-row center gap">
        {loading ? <LoadingIcon /> : <LanguageIcon />}
        <Select
          options={[{ value: Language.EN, label: 'English' }, { value: Language.ES, label: 'Español' }]}
          selectedOption={{ value: settings?.[ProfileSettingOptions.LANGUAGE] }}
          onChange={({ value }) => toggleSetting(ProfileSettingOptions.LANGUAGE, value)}
          disabled={loading}
          optionsPlacement={isMobile ? 'right' : 'right'}
          className={classNames('language-select', { 'tx-t': !isOpen })}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div
          className="jk-row center gap" onClick={loading ? undefined : toggleTheme}
          style={{ cursor: loading ? 'initial' : 'pointer' }}
        >
          {settings?.[ProfileSettingOptions.THEME] === Theme.DARK
            ? <>{loading ? <LoadingIcon /> : <LightModeIcon />}<T className="tt-se">light mode</T></>
            : <>{loading ? <LoadingIcon /> : <DarkModeIcon />}<T className="tt-se">dark mode</T></>}
        </div>
      </div>
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
        placement={isMobile ? 'bottomRight' : 'right'}
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
      <LasLinkProvider>
        <VerticalMenu
          menu={menu}
          topSection={({ isOpen }) => (
            <div className="jk-row" onClick={() => push('/')} style={{ padding: 'calc(var(--pad-lg) + var(--pad-lg)) 0' }}>
              {isLoading
                ? <LoadingIcon />
                :
                <Image
                  src={isOpen ? imageUrl : imageUrl.replace('horizontal', 'vertical')}
                  alt={name}
                  height={isOpen ? 50 : 80}
                  width={isOpen ? 100 : 40}
                />}
            </div>
          )}
          bottomSection={({ isOpen }) => {
            return (
              <div className="jk-col stretch gap settings-apps-login-user-content nowrap">
                {Settings2(false, isOpen)}
                <LoginUser collapsed={!isOpen} />
              </div>
            );
          }}
          drawerMenuMobile={
            <div className="bc-py jk-row filled ">
              <div className="jk-col space-between left-mobile-content">
                <div
                  className="jk-col gap mobile-left-side-bottom"
                  style={{ color: 'var(--t-color-primary-text)', padding: '0 var(--pad-s)' }}
                >
                  {Settings2(true)}
                  <div />
                  <div />
                </div>
              </div>
            </div>
          }
          rightMobile={{
            children: <LoginUser collapsed={false} />,
          }}
          centerMobile={{
            children: <div className="jk-row"><Link href="/"><JukiJudgeLogoHorImage /></Link></div>,
          }}
        >
          {isLoading ? <div className="jk-col extend"><LoadingIcon size="very-huge" /></div> : children}
          <div
            className={classNames('need-help-container jk-border-radius-inline jk-col nowrap', {
              'open elevation-1': flags.isHelpOpen,
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
        </VerticalMenu>
      </LasLinkProvider>
    </>
  );
};
