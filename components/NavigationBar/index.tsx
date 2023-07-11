import {
  AssignmentIcon,
  CupIcon,
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
import { removeParamQuery } from 'helpers';
import { useJukiUser, useRouter } from 'hooks';
import Link from 'next/link';
import React, { createContext, PropsWithChildren, useState } from 'react';
import {
  AdminTab,
  ContestsTab,
  Judge,
  LastLinkKey,
  LastLinkType,
  MenuType,
  ProfileSetting,
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
      canViewSubmissionsManagement,
      canSendEmail,
      canHandleJudges,
      canCreateUser,
      canHandleUsers,
      canHandleServices,
      canHandleSettings,
      settings: { [ProfileSetting.THEME]: preferredTheme, [ProfileSetting.MENU_VIEW_MODE]: preferredMenuViewMode },
    },
    company: { key },
  } = useJukiUser();
  
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
      {query[QueryParamKey.USER_PREVIEW] && (
        <UserPreviewModal
          nickname={query[QueryParamKey.USER_PREVIEW] as string}
          onClose={() => push({ query: removeParamQuery(query, QueryParamKey.USER_PREVIEW, null) })}
          userHref={ROUTES.PROFILE.PAGE(query[QueryParamKey.USER_PREVIEW] as string, ProfileTab.PROFILE)}
        />
      )}
      {query[QueryParam.SUBMISSION_VIEW] && <SubmissionModal submitId={query[QueryParam.SUBMISSION_VIEW] as string} />}
      <LasLinkProvider>
        <MainMenu onSeeMyProfile={() => null} menu={menu}>
          {children}
        </MainMenu>
      </LasLinkProvider>
    </>
  );
};
