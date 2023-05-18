import { AlertModal, T } from 'components';
import { useFetcher, useJukiUser, usePrevious, useRouter, useT } from 'hooks';
import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { ContentResponseType, FlagsType, Language, ProfileSetting, SetFlagsType, Theme } from 'types';

export const UserContext = createContext<{ flags: FlagsType, setFlags: SetFlagsType }>({
  flags: {
    isHelpOpen: false,
    isHelpFocused: false,
  }, setFlags: () => null,
});

export const _setFlags: { current: SetFlagsType } = { current: null };

export const UserProvider = ({ children }: PropsWithChildren<{}>) => {
  
  const { i18n } = useT();
  const { locale, pathname, asPath, query, isReady, replace } = useRouter();
  const { user } = useJukiUser();
  const { data, isLoading } = useFetcher<ContentResponseType<{ version: string }>>(
    '/api/version',
    { revalidateOnFocus: true, revalidateOnReconnect: true, revalidateIfStale: true, revalidateOnMount: true },
  );
  const version = (data?.success && data.content.version) || '';
  const previousVersion = usePrevious(version);
  const [ modal, setModal ] = useState(null);
  const router = useRouter();
  useEffect(() => {
    if (previousVersion && version && version !== previousVersion) {
      setModal(
        <AlertModal
          decline={{ label: <T>cancel</T>, onClick: () => setModal(null) }}
          accept={{ label: <T>reload</T>, onClick: () => router.reload() }}
          title={<div><T>attention</T></div>}
          content={
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
          }
          onClose={() => setModal(null)}
        />,
      );
    }
  }, [ version, previousVersion ]);
  const [ flags, setFlags ] = useState<FlagsType>({ isHelpOpen: false, isHelpFocused: false });
  _setFlags.current = setFlags;
  useEffect(() => {
    if (isReady) {
      const newLocale = user.settings?.[ProfileSetting.LANGUAGE] === Language.ES ? 'es' : 'en';
      void i18n?.changeLanguage?.(newLocale);
    }
  }, [ user.settings?.[ProfileSetting.LANGUAGE], isReady ]);
  
  useEffect(() => {
    if (isReady) {
      const newLocale = user.settings?.[ProfileSetting.LANGUAGE] === Language.ES ? 'es' : 'en';
      if (locale !== newLocale) {
        void replace({ pathname, query }, asPath, { locale: newLocale });
      }
    }
  }, [ user.settings?.[ProfileSetting.LANGUAGE], user.nickname, locale, pathname, /*query,*/ asPath, isReady ]);
  
  useEffect(() => {
    document.querySelector('body')?.classList.remove('jk-theme-dark');
    document.querySelector('body')?.classList.remove('jk-theme-light');
    if (user.settings?.[ProfileSetting.THEME] === Theme.DARK) {
      document.querySelector('body')?.classList.add('jk-theme-dark');
    } else {
      document.querySelector('body')?.classList.add('jk-theme-light');
    }
  }, [ user.settings?.[ProfileSetting.THEME] ]);
  
  return (
    <UserContext.Provider value={{ flags, setFlags }}>
      {modal}
      {children}
    </UserContext.Provider>
  );
};
