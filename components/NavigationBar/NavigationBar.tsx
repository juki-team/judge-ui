import { jukiSettings } from '@juki-team/base-ui';
import {
  AssignmentIcon,
  CupIcon,
  HelpIcon,
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
import {
  ContestsTab,
  LastPathKey,
  MenuType,
  ProfileSetting,
  ProfileTab,
  QueryParam,
  QueryParamKey,
  Theme,
} from 'types';

export const NavigationBar = ({ children }: PropsWithChildren<{}>) => {
  
  const { pathname, pushRoute, searchParams } = useJukiRouter();
  const { components: { Link, Image } } = useJukiUI();
  
  const {
    user: {
      nickname,
      permissions: {
        canViewSubmissionsManagement,
        canCreateUser,
        canHandleUsers,
      },
      settings: { [ProfileSetting.THEME]: userTheme },
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
  
  const userPreviewQuery = searchParams.getAll(QueryParamKey.USER_PREVIEW);
  const [ userPreviewNickname, userPreviewCompanyKey ] = Array.isArray(userPreviewQuery) ? userPreviewQuery as unknown as [ string, string ] : [ userPreviewQuery as string ];
  
  return (
    <>
      <UserPreviewModal
        isOpen={!!searchParams.get(QueryParamKey.USER_PREVIEW)}
        nickname={userPreviewNickname}
        companyKey={userPreviewCompanyKey}
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
