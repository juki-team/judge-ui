import { Theme } from '@juki-team/commons';
import {
  AssignmentIcon,
  CupIcon,
  Image,
  LeaderboardIcon,
  LinkSectionAdmin,
  LinkSectionProblem,
  LoadingIcon,
  LoginModal,
  SettingsIcon,
  SignUpModal,
  SubmissionModal,
  T,
  UserPreviewModal,
  VerticalMenu,
  WelcomeModal,
} from 'components';
import { LinkSectionContest } from 'components/contest/commons';
import { DrawerViewMenuMobile } from 'components/NavigationBar/DrawerViewMenuMobile';
import { SettingsSection } from 'components/NavigationBar/SettingsSection';
import { OpenDialog, QueryParam, ROUTES } from 'config/constants';
import { isOrHas, removeParamQuery } from 'helpers';
import { useJukiBase } from 'hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { AdminTab, LastLinkKey, LastLinkType } from 'types';
import { LoginUser } from './LoginUser';

const initialLastLink = {
  [LastLinkKey.SECTION_CONTEST]: { pathname: '/contests', query: {} },
  [LastLinkKey.CONTESTS]: { pathname: '/contests', query: {} },
  [LastLinkKey.SECTION_PROBLEM]: { pathname: '/problems', query: {} },
  [LastLinkKey.PROBLEMS]: { pathname: '/problems', query: {} },
  [LastLinkKey.SECTION_ADMIN]: { pathname: `/admin/${AdminTab.USERS_MANAGEMENT}`, query: {} },
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
  const {
    user: {
      canViewUsersManagement,
      canViewSubmissionsManagement,
      canViewFilesManagement,
      canViewEmailManagement,
      canViewJudgersManagement,
      isLogged,
      settings: { preferredTheme },
    },
    isLoading,
    company: { imageUrl, name },
    viewPortSize,
  } = useJukiBase();
  
  const menu = [
    {
      label: <T className="tt-se">contests</T>,
      icon: <CupIcon />,
      selected: ('/' + pathname).includes('//contest'),
      menuItemWrapper: (children) => <LinkSectionContest>{children}</LinkSectionContest>,
    },
    {
      label: <T className="tt-se">problems</T>,
      icon: <AssignmentIcon />,
      selected: ('/' + pathname).includes('//problem'),
      menuItemWrapper: (children) => <LinkSectionProblem>{children}</LinkSectionProblem>,
    },
    {
      label: <T className="tt-se">ranking</T>,
      icon: <LeaderboardIcon />,
      selected: ('/' + pathname).includes('//ranking'),
      menuItemWrapper: (children) => <Link className="link" href={ROUTES.RANKING.PAGE()}>{children}</Link>,
    },
  ];
  if (canViewUsersManagement || canViewSubmissionsManagement || canViewFilesManagement || canViewEmailManagement || canViewJudgersManagement) {
    menu.push({
      label: <T className="tt-se">admin</T>,
      icon: <SettingsIcon />,
      selected: ('/' + pathname).includes('//admin'),
      menuItemWrapper: (children) => <LinkSectionAdmin>{children}</LinkSectionAdmin>,
    });
  }
  
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
  const [helpOpen, setHelpOpen] = useState(false);
  
  const logoImageUrl = (viewPortSize === 'sm' && preferredTheme !== Theme.DARK) ? imageUrl.replace('white', 'color') : imageUrl;
  
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
                : (
                  <Image
                    src={isOpen ? logoImageUrl : logoImageUrl.replace('horizontal', 'vertical')}
                    alt={name}
                    height={isOpen ? 50 : 80}
                    width={isOpen ? 100 : 40}
                  />
                )}
            </div>
          )}
          bottomSection={({ isOpen }) => {
            return (
              <div
                className="jk-col stretch gap settings-apps-login-user-content nowrap pad-top-bottom"
              >
                <SettingsSection isOpen={isOpen} isMobile={false} helpOpen={helpOpen} setHelpOpen={setHelpOpen} />
                <LoginUser collapsed={!isOpen} />
              </div>
            );
          }}
          drawerMenuMobile={(props) => <DrawerViewMenuMobile {...props} logoImageUrl={logoImageUrl} />}
          rightMobile={{
            children: <LoginUser collapsed={false} />,
          }}
          centerMobile={{
            children: (
              <div className="jk-row"><Link href="/">
                <Image
                  src={logoImageUrl}
                  alt={name}
                  height={40}
                  width={80}
                />
              </Link></div>
            ),
          }}
        >
          {isLoading ? <div className="jk-col extend"><LoadingIcon size="very-huge" className="cr-py" /></div> : children}
        </VerticalMenu>
      </LasLinkProvider>
    </>
  );
};
