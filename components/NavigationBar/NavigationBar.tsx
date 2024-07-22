import {
  AssignmentIcon,
  CupIcon,
  HelpIcon,
  LeaderboardIcon,
  LinkLastPath,
  MainMenu,
  SettingsIcon,
  T,
} from 'components';
import { jukiSettings } from 'config';
import { JUKI_APP_COMPANY_KEY, ROUTES } from 'config/constants';
import { useJukiRouter, useJukiUI, useJukiUser } from 'hooks';
import React, { PropsWithChildren } from 'react';
import { LastPathKey, MenuType, ProfileSetting, Theme } from 'types';

export const NavigationBar = ({ children }: PropsWithChildren<{}>) => {
  
  const { pathname, pushRoute } = useJukiRouter();
  const { components: { Link, Image } } = useJukiUI();
  
  const {
    user: {
      nickname,
      permissions: {
        submissions: {
          manage: canViewSubmissionsManagement,
        },
        users: {
          create: canCreateUser,
        },
        canHandleUsers,
      },
      settings: { [ProfileSetting.THEME]: userTheme },
    },
    company: { key },
  } = useJukiUser();
  
  const menu: MenuType[] = [
    {
      label: <T className="tt-se">contests</T>,
      icon: <CupIcon />,
      selected: ('/' + pathname).includes('//contest'),
      menuItemWrapper: ({ children }) => (
        <LinkLastPath
          lastPathKey={LastPathKey.SECTION_CONTEST}
          onDoubleClickRoute={jukiSettings.ROUTES.contests().list()}
        >
          {children}
        </LinkLastPath>
      ),
    },
    {
      label: <T className="tt-se">problems</T>,
      icon: <AssignmentIcon />,
      selected: ('/' + pathname).includes('//problem'),
      menuItemWrapper: ({ children }) => (
        <LinkLastPath
          lastPathKey={LastPathKey.SECTION_PROBLEM}
          onDoubleClickRoute={jukiSettings.ROUTES.problems().list()}
        >
          {children}
        </LinkLastPath>
      ),
    },
  ];
  if (key === JUKI_APP_COMPANY_KEY) {
    menu.push(
      {
        label: <T className="tt-se">ranking</T>,
        icon: <LeaderboardIcon />,
        selected: ('/' + pathname).includes('//ranking'),
        menuItemWrapper: ({ children }) => <Link className="link" href={ROUTES.RANKING.PAGE()}>{children}</Link>,
      },
    );
  }
  if (
    canViewSubmissionsManagement
    || canCreateUser
    || canHandleUsers
  ) {
    menu.push({
      label: <T className="tt-se">admin</T>,
      icon: <SettingsIcon />,
      selected: ('/' + pathname).includes('//admin'),
      menuItemWrapper: ({ children }) =>
        <LinkLastPath lastPathKey={LastPathKey.SECTION_ADMIN}>{children}</LinkLastPath>,
    });
  }
  
  menu.push({
    label: <T className="tt-se">info</T>,
    icon: <HelpIcon />,
    selected: ('/' + pathname).includes('//help'),
    menuItemWrapper: ({ children }) => <LinkLastPath lastPathKey={LastPathKey.SECTION_HELP}>{children}</LinkLastPath>,
  });
  
  return (
    <>
      
      <MainMenu
        onSeeMyProfile={() => pushRoute(jukiSettings.ROUTES.profiles().view({ nickname }))}
        menu={menu}
        profileSelected={pathname.includes('/profile/')}
        moreApps={
          <>
            <a href="https://utils.juki.app" target="_blank">
              <div className="jk-row gap left">
                <Image
                  width={100}
                  height={50}
                  src={`https://images.juki.pub/assets/juki-utils-horizontal-${userTheme === Theme.DARK ? 'white' : 'color'}-logo.png`}
                  alt="juki coach"
                />
                <div className="link">utils.juki.app</div>
              </div>
            </a>
            <a href="https://coach.juki.app" target="_blank">
              <div className="jk-row gap left">
                <Image
                  width={100}
                  height={50}
                  src={`https://images.juki.pub/assets/juki-coach-horizontal-${userTheme === Theme.DARK ? 'white' : 'color'}-logo.png`}
                  alt="juki coach"
                />
                <div className="jk-row nowrap" style={{ alignItems: 'baseline' }}>
                  <T className="link">coach.juki.app</T>
                </div>
              </div>
            </a>
          </>
        }
      >
        {children}
      </MainMenu>
    </>
  );
};
