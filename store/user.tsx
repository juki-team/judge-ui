import { T, TwoActionModal } from 'components';
import { createContext } from 'helpers';
import { useEffect, useFetcher, useJukiRouter, useJukiUser, usePrevious, useState } from 'hooks';
import { useRouter } from 'next/router';
import {
  ContentResponseType,
  FlagsType,
  Language,
  ProfileSetting,
  PropsWithChildren,
  ReactNode,
  SetFlagsType,
  Theme,
} from 'types';
import i18n from '../i18n';

export const UserContext = createContext<{ flags: FlagsType, setFlags: SetFlagsType }>({
  flags: {
    isHelpOpen: false,
    isHelpFocused: false,
  }, setFlags: () => null,
});

export const _setFlags: { current: SetFlagsType } = { current: () => null };

export const UserProvider = ({ children }: PropsWithChildren<{}>) => {
  
  // const { i18n } = useT();
  const { locale, pathname, asPath, query, replace, isReady } = useRouter();
  const { pathname: pathname2 } = useJukiRouter();
  const { user } = useJukiUser();
  const { data, isLoading } = useFetcher<ContentResponseType<{ version: string }>>(
    '/api/version',
    { revalidateOnFocus: true, revalidateOnReconnect: true, revalidateIfStale: true, revalidateOnMount: true },
  );
  const version = (data?.success && data.content.version) || '';
  const previousVersion = usePrevious(version);
  const [ modal, setModal ] = useState<ReactNode>(null);
  const router = useRouter();
  useEffect(() => {
    if (previousVersion && version && version !== previousVersion) {
      setModal(
        <TwoActionModal
          isOpen={true}
          secondary={{ label: <T>cancel</T>, onClick: () => setModal(null) }}
          primary={{ label: <T>reload</T>, onClick: () => router.reload() }}
          title={<div><T>attention</T></div>}
          onClose={() => setModal(null)}
        >
          <div className="jk-col gap left stretch">
            <div>
              <T className="tt-se">an interface update is available, to use the new interface it is necessary to
                reload the application.</T>
            </div>
            <div>
              <T className="tt-se">your UI version is</T>&nbsp;
              <span className="jk-tag gray-6">{previousVersion}</span>&nbsp;
              <T>and the new UI version available is</T>&nbsp;
              <span className="jk-tag gray-6">{version}</span>.
            </div>
            <div>
              <T className="tt-se">an interface update may mean improvements in the user experience and/or bug
                fixes.</T>
            </div>
            <div>
              <T className="tt-se fw-bd">if you reload the page the changes that are not saved will be lost.</T>
            </div>
          </div>
        </TwoActionModal>,
      );
    }
  }, [ version, previousVersion, router ]);
  
  const [ flags, setFlags ] = useState<FlagsType>({ isHelpOpen: false, isHelpFocused: false });
  _setFlags.current = setFlags;
  
  const userLanguage = user.settings?.[ProfileSetting.LANGUAGE] === Language.ES ? Language.ES : Language.EN;
  
  useEffect(() => {
    void i18n?.changeLanguage?.(userLanguage);
  }, [ userLanguage ]);
  
  useEffect(() => {
    if (isReady) {
      if (locale?.toLowerCase() !== userLanguage.toLowerCase()) {
        void replace({ pathname, query }, asPath, { locale: userLanguage.toLowerCase() });
      }
    }
  }, [ userLanguage, user.nickname, locale, pathname, asPath, replace, query, isReady ]);
  
  const userTheme = user.settings?.[ProfileSetting.THEME];
  
  useEffect(() => {
    document.querySelector('body')?.classList.remove('jk-theme-dark');
    document.querySelector('body')?.classList.remove('jk-theme-light');
    if (userTheme === Theme.DARK) {
      document.querySelector('body')?.classList.add('jk-theme-dark');
    } else {
      document.querySelector('body')?.classList.add('jk-theme-light');
    }
  }, [ userTheme ]);
  
  return (
    <UserContext.Provider value={{ flags, setFlags }}>
      {modal}
      {children}
    </UserContext.Provider>
  );
};
