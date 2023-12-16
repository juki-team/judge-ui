import { HelpIcon } from '@juki-team/base-ui';
import {
  AssignmentIcon,
  CupIcon,
  JukiCouchLogoHorImage,
  JukiUtilsLogoHorImage,
  LastLink,
  LeaderboardIcon,
  MainMenu,
  SettingsIcon,
  SubmissionModal,
  T,
  UserPreviewModal,
} from 'components';
import { JUKI_APP_COMPANY_KEY, ROUTES } from 'config/constants';
import { useJukiRouter, useJukiUser } from 'hooks';
import Link from 'next/link';
import React, { createContext, PropsWithChildren, useState } from 'react';
import {
  AdminTab,
  ContestsTab,
  Judge,
  LastLinkKey,
  LastLinkType,
  MenuType,
  ProfileTab,
  QueryParam,
  QueryParamKey,
} from 'types';

const initialLastLink: LastLinkType = {
  [LastLinkKey.SECTION_CONTEST]: {
    pathname: ROUTES.CONTESTS.LIST(ContestsTab.ALL),
    searchParams: new URLSearchParams(''),
  },
  [LastLinkKey.CONTESTS]: { pathname: ROUTES.CONTESTS.LIST(ContestsTab.ALL), searchParams: new URLSearchParams() },
  [LastLinkKey.SECTION_PROBLEM]: { pathname: ROUTES.PROBLEMS.LIST(), searchParams: new URLSearchParams() },
  [LastLinkKey.PROBLEMS]: {
    pathname: ROUTES.PROBLEMS.LIST(),
    searchParams: new URLSearchParams({ [QueryParam.JUDGE]: Judge.CUSTOMER }),
  },
  [LastLinkKey.SECTION_ADMIN]: {
    pathname: ROUTES.ADMIN.PAGE(AdminTab.USERS_MANAGEMENT),
    searchParams: new URLSearchParams(),
  },
  [LastLinkKey.SHEETS]: { pathname: `/sheets`, searchParams: new URLSearchParams() },
  [LastLinkKey.SECTION_SHEET]: { pathname: `/sheets`, searchParams: new URLSearchParams() },
  [LastLinkKey.SECTION_HELP]: { pathname: `/help`, searchParams: new URLSearchParams() },
};

type LastLinkContext = {
  pushPath: (props: { key: string, pathname: string, searchParams: URLSearchParams }) => void,
  lastLink: LastLinkType
}

export const LastLinkContext = createContext<LastLinkContext>({
  pushPath: () => null,
  lastLink: initialLastLink,
});

export const LasLinkProvider = ({ children }: PropsWithChildren<{}>) => {
  
  const [ lastLink, setLastLink ] = useState<LastLinkType>(initialLastLink);
  
  return (
    <LastLinkContext.Provider
      value={{
        pushPath: ({ key, pathname, searchParams }) => setLastLink(prevState => ({
          ...prevState,
          [key]: { pathname, searchParams },
        })),
        lastLink,
      }}
    >
      {children}
    </LastLinkContext.Provider>
  );
};

export const NavigationBar = ({ children }: PropsWithChildren<{}>) => {
  
  const { pathname, pushRoute, searchParams } = useJukiRouter();
  
  const {
    user: {
      nickname,
      canViewSubmissionsManagement,
      canHandleEmail,
      canHandleJudges,
      canCreateUser,
      canHandleUsers,
      canHandleServices,
      canHandleSettings,
    },
    company: { key },
  } = useJukiUser();
  
  const { deleteSearchParams } = useJukiRouter();
  
  const menu: MenuType[] = [
    {
      label: <T className="tt-se">contests</T>,
      icon: <CupIcon />,
      selected: ('/' + pathname).includes('//contest'),
      menuItemWrapper: ({ children }) => (
        <LastLink
          lastLinkKey={LastLinkKey.SECTION_CONTEST}
          onDoubleClickRoute={ROUTES.CONTESTS.LIST(ContestsTab.ALL)}
        >
          {children}
        </LastLink>
      ),
    },
    {
      label: <T className="tt-se">problems</T>,
      icon: <AssignmentIcon />,
      selected: ('/' + pathname).includes('//problem'),
      menuItemWrapper: ({ children }) => (
        <LastLink
          lastLinkKey={LastLinkKey.SECTION_PROBLEM}
          onDoubleClickRoute={ROUTES.PROBLEMS.LIST()}
        >
          {children}
        </LastLink>
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
    || canHandleEmail
    || canHandleJudges
    || canCreateUser
    || canHandleUsers
    || canHandleServices
    || canHandleSettings
  ) {
    menu.push({
      label: <T className="tt-se">admin</T>,
      icon: <SettingsIcon />,
      selected: ('/' + pathname).includes('//admin'),
      menuItemWrapper: ({ children }) => <LastLink lastLinkKey={LastLinkKey.SECTION_ADMIN}>{children}</LastLink>,
    });
  }
  // menu.push({
  //   label: <T className="tt-se">help</T>,
  //   icon: <HelpIcon />,
  //   selected: ('/' + pathname).includes('//help'),
  //   menuItemWrapper: ({ children }) => <LastLink lastLinkKey={LastLinkKey.SECTION_HELP}>{children}</LastLink>,
  // });
  
  return (
    <>
      <UserPreviewModal
        isOpen={!!searchParams.get(QueryParamKey.USER_PREVIEW)}
        nickname={searchParams.get(QueryParamKey.USER_PREVIEW) as string}
        onClose={() => deleteSearchParams({ name: QueryParamKey.USER_PREVIEW })}
        userHref={ROUTES.PROFILE.PAGE(searchParams.get(QueryParamKey.USER_PREVIEW) as string, ProfileTab.PROFILE)}
      />
      {searchParams.get(QueryParam.SUBMISSION_VIEW) &&
        <SubmissionModal submitId={searchParams.get(QueryParam.SUBMISSION_VIEW) as string} />}
      
      <MainMenu
        onSeeMyProfile={() => pushRoute(ROUTES.PROFILE.PAGE(nickname, ProfileTab.PROFILE))}
        menu={menu}
        profileSelected={pathname.includes('/profile/')}
        moreApps={
          <>
            <a href="https://utils.juki.app" target="_blank">
              <div className="jk-row space-between">
                <div style={{ width: 95 }}><JukiUtilsLogoHorImage /></div>
                <div className="lnik">utils.juki.app</div>
              </div>
            </a>
            <div className="jk-row gap">
              <div style={{ width: 95 }}><JukiCouchLogoHorImage /></div>
              <div className="jk-row nowrap" style={{ alignItems: 'baseline' }}>
                <T className="tt-se">developing</T>&nbsp;
                <div className="dot-flashing" />
              </div>
            </div>
          </>
        }
      >
        {children}
      </MainMenu>
    </>
  );
};
