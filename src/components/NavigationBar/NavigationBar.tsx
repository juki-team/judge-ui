'use client';

import {
  AssignmentIcon,
  HelpIcon,
  LeaderboardIcon,
  LibraryBooksIcon,
  LinkLastPath,
  MainMenu,
  T,
  TrophyIcon,
} from 'components';
import { jukiAppRoutes } from 'config';
import { JUKI_APP_COMPANY_KEY, ROUTES } from 'config/constants';
import { useEffect, useJukiUI, useRouterStore, useUserStore } from 'hooks';
import React, { PropsWithChildren } from 'react';
import { LastPathKey, MenuType, ProfileSetting, Theme } from 'types';

export const NavigationBar = ({ children }: PropsWithChildren<{}>) => {
  
  const pathname = useRouterStore(state => state.pathname);
  const pushRoute = useRouterStore(state => state.pushRoute);
  const { components: { Link, Image } } = useJukiUI();
  useEffect(() => {
    console.log('render');
  }, [ Link, Image ]);
  const state = useUserStore();
  const user = useUserStore(state => state.user);
  const companyKey = useUserStore(state => state.company.key);
  const userNickname = useUserStore(state => state.user.nickname);
  const userPreferredTheme = useUserStore(state => state.user.settings[ProfileSetting.THEME]);
  const isContestsPage = ('/' + pathname).includes('//contest');
  const isProblemsPage = ('/' + pathname).includes('//problem');
  const isRankingPage = ('/' + pathname).includes('//ranking');
  const isBoardsPage = ('/' + pathname).includes('//board');
  const backPah = isContestsPage ? jukiAppRoutes.JUDGE().contests.list()
    : isProblemsPage
      ? jukiAppRoutes.JUDGE().problems.list()
      : '/';
  
  const menu: MenuType[] = [
    {
      label: <T className="tt-se">contests</T>,
      tooltipLabel: 'contests',
      icon: <TrophyIcon />,
      selected: isContestsPage,
      menuItemWrapper: ({ children }) => isContestsPage ? (
        <LinkLastPath lastPathKey={LastPathKey.CONTESTS}>
          {children}
        </LinkLastPath>
      ) : (
        <LinkLastPath
          lastPathKey={LastPathKey.SECTION_CONTEST}
          onDoubleClickRoute={jukiAppRoutes.JUDGE().contests.list()}
        >
          {children}
        </LinkLastPath>
      ),
    },
    {
      label: <T className="tt-se">problems</T>,
      tooltipLabel: 'problems',
      icon: <AssignmentIcon />,
      selected: isProblemsPage,
      menuItemWrapper: ({ children }) => isProblemsPage ? (
        <LinkLastPath lastPathKey={LastPathKey.PROBLEMS}>
          {children}
        </LinkLastPath>
      ) : (
        <LinkLastPath
          lastPathKey={LastPathKey.SECTION_PROBLEM}
          onDoubleClickRoute={jukiAppRoutes.JUDGE().problems.list()}
        >
          {children}
        </LinkLastPath>
      ),
    },
  ];
  if (companyKey === JUKI_APP_COMPANY_KEY) {
    menu.push(
      {
        label: <T className="tt-se">ranking</T>,
        tooltipLabel: 'ranking',
        icon: <LeaderboardIcon />,
        selected: isRankingPage,
        menuItemWrapper: ({ children }) => (
          <Link className="link dy-cs" href={ROUTES.RANKING.PAGE()}>
            {children}</Link>
        ),
      },
    );
    menu.push(
      {
        label: <T className="tt-se">boards</T>,
        tooltipLabel: 'boards',
        icon: <LibraryBooksIcon />,
        selected: isBoardsPage,
        menuItemWrapper: ({ children }) => (
          <LinkLastPath lastPathKey={LastPathKey.BOARDS}>
            {children}
          </LinkLastPath>
        ),
      },
    );
  }
  
  menu.push({
    label: <T className="tt-se">info</T>,
    tooltipLabel: 'info',
    icon: <HelpIcon />,
    selected: ('/' + pathname).includes('//help'),
    menuItemWrapper: ({ children }) => <LinkLastPath lastPathKey={LastPathKey.SECTION_HELP}>{children}</LinkLastPath>,
  });
  
  return (
    <>
      <MainMenu
        onSeeMyProfile={() => pushRoute(jukiAppRoutes.JUDGE().profiles.view({ nickname: userNickname }))}
        menu={menu}
        profileSelected={pathname.includes('/profile/')}
        onBack={pathname !== backPah ? () => {
          pushRoute(backPah);
        } : undefined}
        moreApps={
          <>
            <Link href="https://utils.juki.app" target="_blank">
              <div className="jk-row gap left">
                <Image
                  width={100}
                  height={50}
                  src={`https://images.juki.pub/assets/juki-utils-horizontal-${userPreferredTheme === Theme.DARK ? 'white' : 'color'}-logo.png`}
                  alt="juki coach"
                />
                <div className="link">utils.juki.app</div>
              </div>
            </Link>
            <Link href="https://coach.juki.app" target="_blank">
              <div className="jk-row gap left">
                <Image
                  width={100}
                  height={50}
                  src={`https://images.juki.pub/assets/juki-coach-horizontal-${userPreferredTheme === Theme.DARK ? 'white' : 'color'}-logo.png`}
                  alt="juki coach"
                />
                <div className="jk-row nowrap" style={{ alignItems: 'baseline' }}>
                  <T className="link">coach.juki.app</T>
                </div>
              </div>
            </Link>
          </>
        }
      >
        {children}
      </MainMenu>
    </>
  );
};
