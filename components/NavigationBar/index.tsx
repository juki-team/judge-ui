import {
  AssignmentIcon,
  CupIcon,
  JukiCouchLogoHorImage,
  JukiUtilsLogoHorImage,
  LeaderboardIcon,
  LinkSectionAdmin,
  LinkSectionContest,
  LinkSectionProblem,
  MainMenu,
  SettingsIcon,
  SubmissionModal,
  T,
  UserPreviewModal,
} from 'components';
import { JUKI_APP_COMPANY_KEY, ROUTES } from 'config/constants';
import { useJukiRouter, useJukiUser, useRouter } from 'hooks';
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

const initialLastLink = {
  [LastLinkKey.SECTION_CONTEST]: { pathname: ROUTES.CONTESTS.LIST(ContestsTab.ALL), query: {} },
  [LastLinkKey.CONTESTS]: { pathname: ROUTES.CONTESTS.LIST(ContestsTab.ALL), query: {} },
  [LastLinkKey.SECTION_PROBLEM]: { pathname: ROUTES.PROBLEMS.LIST(), query: {} },
  [LastLinkKey.PROBLEMS]: { pathname: ROUTES.PROBLEMS.LIST(), query: { [QueryParam.JUDGE]: Judge.CUSTOMER } },
  [LastLinkKey.SECTION_ADMIN]: { pathname: ROUTES.ADMIN.PAGE(AdminTab.USERS_MANAGEMENT), query: {} },
  [LastLinkKey.SHEETS]: { pathname: `/sheets`, query: {} },
  [LastLinkKey.SECTION_SHEET]: { pathname: `/sheets`, query: {} },
};

type LastLinkContext = {
  pushPath: (props: { key: string, pathname: string, query: (NodeJS.Dict<string | string[]>) }) => void,
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
        pushPath: ({ key, pathname, query }) => setLastLink(prevState => ({
          ...prevState,
          [key]: { pathname, query },
        })),
        lastLink,
      }}
    >
      {children}
    </LastLinkContext.Provider>
  );
};

export const NavigationBar = ({ children }: PropsWithChildren<{}>) => {
  
  const { pathname, push, query } = useRouter();
  
  const {
    user: {
      nickname,
      canViewSubmissionsManagement,
      canSendEmail,
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
      menuItemWrapper: ({ children }) => <LinkSectionContest>{children}</LinkSectionContest>,
    },
    {
      label: <T className="tt-se">problems</T>,
      icon: <AssignmentIcon />,
      selected: ('/' + pathname).includes('//problem'),
      menuItemWrapper: ({ children }) => <LinkSectionProblem>{children}</LinkSectionProblem>,
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
    || canSendEmail
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
      menuItemWrapper: ({ children }) => <LinkSectionAdmin>{children}</LinkSectionAdmin>,
    });
  }
  
  return (
    <>
      <UserPreviewModal
        isOpen={!!query[QueryParamKey.USER_PREVIEW]}
        nickname={query[QueryParamKey.USER_PREVIEW] as string}
        onClose={() => deleteSearchParams({ name: QueryParamKey.USER_PREVIEW })}
        userHref={ROUTES.PROFILE.PAGE(query[QueryParamKey.USER_PREVIEW] as string, ProfileTab.PROFILE)}
      />
      {query[QueryParam.SUBMISSION_VIEW] && <SubmissionModal submitId={query[QueryParam.SUBMISSION_VIEW] as string} />}
      <LasLinkProvider>
        <MainMenu
          onSeeMyProfile={() => push(ROUTES.PROFILE.PAGE(nickname, ProfileTab.PROFILE))}
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
      </LasLinkProvider>
    </>
  );
};
