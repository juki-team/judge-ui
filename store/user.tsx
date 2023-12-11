import { NewVersionAvailableModal } from 'components'
import { createContext } from 'helpers';
import { useEffect, useFetcher, useJukiRouter, useJukiUser, usePrevious, useState } from 'hooks';
import { useRouter } from 'next/router';
import {
  ContentResponseType,
  FlagsType,
  Language,
  ProfileSetting,
  PropsWithChildren,
  SetFlagsType,
  Theme,
} from 'types';

export const UserContext = createContext<{ flags: FlagsType, setFlags: SetFlagsType }>({
  flags: {
    isHelpOpen: false,
    isHelpFocused: false,
  }, setFlags: () => null,
});

export const _setFlags: { current: SetFlagsType } = { current: () => null };

export const UserProvider = ({ children }: PropsWithChildren<{}>) => {
  
  const { locale, pathname, asPath, query, replace, isReady } = useRouter();
  const { reloadRoute } = useJukiRouter();
  const { user } = useJukiUser();
  const { data, isLoading } = useFetcher<ContentResponseType<{ version: string }>>(
    '/api/version',
    { revalidateOnFocus: true, revalidateOnReconnect: true, revalidateIfStale: true, revalidateOnMount: true },
  );
  const version = (data?.success && data.content.version) || '';
  const previousVersion = usePrevious(version);
  const [ modal, setModal ] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (previousVersion && version && version !== previousVersion) {
      setModal(true);
    }
  }, [ version, previousVersion, router ]);
  
  const [ flags, setFlags ] = useState<FlagsType>({ isHelpOpen: false, isHelpFocused: false });
  _setFlags.current = setFlags;
  
  const userLanguage = user.settings?.[ProfileSetting.LANGUAGE] === Language.ES ? Language.ES : Language.EN;
  
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
      <NewVersionAvailableModal
        isOpen={modal}
        onClose={() => setModal(false)}
        previousVersion={previousVersion + ''}
        newVersion={version + ''}
        reload={reloadRoute}
      />
      {modal}
      {children}
    </UserContext.Provider>
  );
};
