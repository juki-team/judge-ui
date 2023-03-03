import {
  AssignmentIcon,
  CupIcon,
  DrawerViewMenuMobile,
  HorizontalMenu,
  Image,
  LeaderboardIcon,
  LinkSectionAdmin,
  LinkSectionContest,
  LinkSectionProblem,
  LoadingIcon,
  LoginModal,
  SettingsIcon,
  SettingsSection,
  SignUpModal,
  SubmissionModal,
  T,
  UserPreviewModal,
  VerticalMenu,
  WelcomeModal,
} from 'components';
import { ROUTES } from 'config/constants';
import { isOrHas, removeParamQuery } from 'helpers';
import { useJukiUI, useJukiUser } from 'hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import {
  AdminTab,
  LastLinkKey,
  LastLinkType,
  MenuType,
  MenuViewMode,
  OpenDialog,
  ProfileSetting,
  ProfileTab,
  QueryParam,
  Theme,
} from 'types';
import { LoginUser } from './LoginUser';

const initialLastLink = {
  [LastLinkKey.SECTION_CONTEST]: { pathname: '/contests', query: {} },
  [LastLinkKey.CONTESTS]: { pathname: '/contests', query: {} },
  [LastLinkKey.SECTION_PROBLEM]: { pathname: '/problems', query: {} },
  [LastLinkKey.PROBLEMS]: { pathname: '/problems', query: {} },
  [LastLinkKey.SECTION_ADMIN]: { pathname: `/admin/${AdminTab.USERS_MANAGEMENT}`, query: {} },
  [LastLinkKey.SHEETS]: { pathname: `/sheets`, query: {} },
  [LastLinkKey.SECTION_SHEET]: { pathname: `/sheets`, query: {} },
};

export const LastLinkContext = createContext<{
  pushPath: ({
    key,
    pathname,
    query,
  }: { key: string, pathname: string, query: (NodeJS.Dict<string | string[]>) }) => void, lastLink: LastLinkType
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
  const { viewPortSize } = useJukiUI();
  const {
    user: {
      canViewUsersManagement,
      canViewSubmissionsManagement,
      canViewFilesManagement,
      canViewEmailManagement,
      canViewRunnersManagement,
      isLogged,
      settings: { [ProfileSetting.THEME]: preferredTheme, [ProfileSetting.MENU_VIEW_MODE]: preferredMenuViewMode },
    },
    isLoading,
    company: { imageUrl, name },
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
    {
      label: <T className="tt-se">ranking</T>,
      icon: <LeaderboardIcon />,
      selected: ('/' + pathname).includes('//ranking'),
      menuItemWrapper: ({ children }) => <Link className="link" href={ROUTES.RANKING.PAGE()}>{children}</Link>,
    },
  ];
  if (canViewUsersManagement || canViewSubmissionsManagement || canViewFilesManagement || canViewEmailManagement || canViewRunnersManagement) {
    menu.push({
      label: <T className="tt-se">admin</T>,
      icon: <SettingsIcon />,
      selected: ('/' + pathname).includes('//admin'),
      menuItemWrapper: ({ children }) => <LinkSectionAdmin>{children}</LinkSectionAdmin>,
    });
  }
  
  useEffect(() => {
    if (isLogged && (isOrHas(query[QueryParam.DIALOG], OpenDialog.SIGN_UP) || isOrHas(query[QueryParam.DIALOG], OpenDialog.SIGN_IN))) {
      void push({
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
  
  const drawerMenuMobile = (props) => <DrawerViewMenuMobile {...props} logoImageUrl={logoImageUrl} />;
  
  const rightMobile = {
    children: <div className="jk-row"><LoginUser collapsed={false} popoverPlacement="bottomRight" /></div>,
  };
  
  const centerMobile = {
    children: (
      <div className="jk-row"><Link href="/">
        <Image
          src={logoImageUrl}
          alt={name}
          height={45}
          width={90}
        />
      </Link></div>
    ),
  };
  
  const topSection = ({ isOpen }) => (
    <div className="jk-row" onClick={() => push('/')} style={{ padding: 'calc(var(--pad-lg) + var(--pad-lg)) 0' }}>
      {isLoading
        ? <LoadingIcon />
        : (
          <Image
            src={isOpen ? logoImageUrl : logoImageUrl.replace('horizontal', 'vertical')}
            alt={name}
            height={isOpen ? 60 : 80}
            width={isOpen ? 120 : 40}
          />
        )}
    </div>
  );
  const bottomSection = ({ isOpen }) => {
    return (
      <div className="jk-col stretch gap settings-apps-login-user-content nowrap pad-top-bottom">
        <SettingsSection
          isOpen={isOpen}
          isMobile={false}
          helpOpen={helpOpen}
          setHelpOpen={setHelpOpen}
          popoverPlacement="right"
        />
        <LoginUser collapsed={!isOpen} popoverPlacement="rightBottom" />
      </div>
    );
  };
  
  const leftSection = () => (
    <div className="jk-row pad-left-right" onClick={() => push('/')}>
      {isLoading
        ? <LoadingIcon />
        : (
          <Image
            src={logoImageUrl}
            alt={name}
            height={viewPortSize === 'md' ? 40 : 46}
            width={viewPortSize === 'md' ? 80 : 92}
          />
        )}
    </div>
  );
  const rightSection = () => {
    return (
      <div className="jk-row stretch gap settings-apps-login-user-content nowrap pad-left-right">
        <SettingsSection
          isOpen={false}
          isMobile={false}
          helpOpen={helpOpen}
          setHelpOpen={setHelpOpen}
          popoverPlacement="bottom"
        />
        <LoginUser collapsed={false} popoverPlacement="bottomRight" />
      </div>
    );
  };
  
  return (
    <>
      {isOrHas(query[QueryParam.DIALOG], OpenDialog.SIGN_UP) && <SignUpModal />}
      {isOrHas(query[QueryParam.DIALOG], OpenDialog.SIGN_IN) && <LoginModal />}
      {isOrHas(query[QueryParam.DIALOG], OpenDialog.WELCOME) && <WelcomeModal />}
      {query[QueryParam.USER_PREVIEW] && (
        <UserPreviewModal
          nickname={query[QueryParam.USER_PREVIEW] as string}
          onClose={() => push({ query: removeParamQuery(query, QueryParam.USER_PREVIEW, null) })}
          userHref={ROUTES.PROFILE.PAGE(query[QueryParam.USER_PREVIEW] as string, ProfileTab.PROFILE)}
        />
      )}
      {query[QueryParam.SUBMISSION_VIEW] && <SubmissionModal submitId={query[QueryParam.SUBMISSION_VIEW] as string} />}
      <LasLinkProvider>
        {preferredMenuViewMode === MenuViewMode.HORIZONTAL
          ? (
            <HorizontalMenu
              menu={menu}
              leftSection={leftSection}
              rightSection={rightSection}
              drawerMenuMobile={drawerMenuMobile}
              rightMobile={rightMobile}
              centerMobile={centerMobile}
            >
              {isLoading ? <div className="jk-col extend"><LoadingIcon size="very-huge" className="cr-py" /></div> : children}
            </HorizontalMenu>
          )
          : (
            <VerticalMenu
              menu={menu}
              topSection={topSection}
              bottomSection={bottomSection}
              drawerMenuMobile={drawerMenuMobile}
              rightMobile={rightMobile}
              centerMobile={centerMobile}
            >
              {isLoading ? <div className="jk-col extend"><LoadingIcon size="very-huge" className="cr-py" /></div> : children}
            </VerticalMenu>
          )
        }
      </LasLinkProvider>
    </>
  );
};
