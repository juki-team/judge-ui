'use client';

import {
  AssignmentIcon,
  CodeIcon,
  LeaderboardIcon,
  LibraryBooksIcon,
  LinkLastPath,
  MainMenu,
  T,
  TrophyIcon,
} from 'components';
import { jukiAppRoutes } from 'config';
import { useRouterStore, useUIStore, useUserStore } from 'hooks';
import React, { PropsWithChildren } from 'react';
import { JUKI_APP_COMPANY_KEY, ROUTES } from 'src/constants';
import { LastPathKey, MenuType, ProfileSetting, Theme } from 'types';

export const NavigationBar = ({ children }: PropsWithChildren<{}>) => {
  
  const pathname = useRouterStore(state => state.pathname);
  const pushRoute = useRouterStore(state => state.pushRoute);
  const { Link, Image } = useUIStore(store => store.components);
  const companyKey = useUserStore(state => state.company.key);
  const userNickname = useUserStore(state => state.user.nickname);
  const userPreferredTheme = useUserStore(state => state.user.settings[ProfileSetting.THEME]);
  const isContestsPage = ('/' + pathname).includes('//contest');
  const isProblemsPage = ('/' + pathname).includes('//problem');
  const isRankingPage = ('/' + pathname).includes('//ranking');
  const isBoardsPage = ('/' + pathname).includes('//board');
  const isIDEPage = ('/' + pathname).includes('//ide');
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
        <LinkLastPath lastPathKey={LastPathKey.SECTION_CONTEST}>
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
        <LinkLastPath lastPathKey={LastPathKey.SECTION_PROBLEM}>
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
            {children}
          </Link>
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
  
  menu.push(
    {
      label: <T className="tt-se">IDE</T>,
      tooltipLabel: 'IDE',
      icon: <CodeIcon />,
      selected: isIDEPage,
      menuItemWrapper: ({ children }) => (
        <Link className="link dy-cs" href={ROUTES.IDE.PAGE()}>
          {children}
        </Link>
      ),
    },
  );
  
  return (
    <>
      <MainMenu
        onSeeMyProfile={() => pushRoute(jukiAppRoutes.JUDGE().profiles.view({ nickname: userNickname }))}
        menu={menu}
        profileSelected={pathname.includes('/profiles/')}
        onBack={pathname !== backPah ? () => {
          pushRoute(backPah);
        } : undefined}
        moreApps={companyKey == JUKI_APP_COMPANY_KEY && <>
          <Link href="https://utils.juki.app">
            <div className="jk-row gap left">
              <Image
                width={100}
                height={50}
                src={`https://images.juki.pub/assets/juki-utils-horizontal-${userPreferredTheme === Theme.DARK ? 'white' : 'color'}-logo.png`}
                alt="juki utils"
              />
              <div className="link">utils.juki.app</div>
            </div>
          </Link>
          <Link href="https://coach.juki.app">
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
        </>}
      >
        {children}
      </MainMenu>
    </>
  );
};
