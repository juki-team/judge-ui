import {
  AssignmentIcon,
  CupIcon,
  HelpIcon,
  JukiCouchLogoHorImage,
  JukiUtilsLogoHorImage,
  LeaderboardIcon,
  LinkLastPath,
  MainMenu,
  SettingsIcon,
  SubmissionModal,
  T,
  UserPreviewModal,
} from 'components';
import { JUKI_APP_COMPANY_KEY, ROUTES } from 'config/constants';
import { useJukiRouter, useJukiUI, useJukiUser } from 'hooks';
import React, { PropsWithChildren } from 'react';
import { ContestsTab, LastPathKey, MenuType, ProfileTab, QueryParam, QueryParamKey } from 'types';


export const NavigationBar = ({ children }: PropsWithChildren<{}>) => {
  
  const { pathname, pushRoute, searchParams } = useJukiRouter();
  const { components: { Link } } = useJukiUI();
  
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
        <LinkLastPath
          lastPathKey={LastPathKey.SECTION_CONTEST}
          onDoubleClickRoute={ROUTES.CONTESTS.LIST(ContestsTab.ALL)}
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
          onDoubleClickRoute={ROUTES.PROBLEMS.LIST()}
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
      <UserPreviewModal
        isOpen={!!searchParams.get(QueryParamKey.USER_PREVIEW)}
        nickname={searchParams.get(QueryParamKey.USER_PREVIEW) as string}
        onClose={() => deleteSearchParams({ name: QueryParamKey.USER_PREVIEW })}
        userHref={ROUTES.PROFILE.PAGE(searchParams.get(QueryParamKey.USER_PREVIEW) as string, ProfileTab.PROFILE)}
      />
      {searchParams.get(QueryParam.SUBMISSION_VIEW) && (
        <SubmissionModal submitId={searchParams.get(QueryParam.SUBMISSION_VIEW) as string} />
      )}
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
