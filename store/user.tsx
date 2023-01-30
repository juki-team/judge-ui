import { useJukiBase, useT } from 'hooks';
import { useRouter } from 'next/router';
import React, { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { FlagsType, Language, ProfileSetting, SetFlagsType, Theme } from 'types';

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
  const { user } = useJukiBase();
  const [flags, setFlags] = useState<FlagsType>({ isHelpOpen: false, isHelpFocused: false });
  _setFlags.current = setFlags;
  useEffect(() => {
    if (isReady) {
      const newLocale = user.settings?.[ProfileSetting.LANGUAGE] === Language.ES ? 'es' : 'en';
      i18n?.changeLanguage?.(newLocale);
    }
  }, [user.settings?.[ProfileSetting.LANGUAGE], isReady]);
  
  useEffect(() => {
    if (isReady) {
      const newLocale = user.settings?.[ProfileSetting.LANGUAGE] === Language.ES ? 'es' : 'en';
      if (locale !== newLocale) {
        replace({ pathname, query }, asPath, { locale: newLocale });
      }
    }
  }, [user.settings?.[ProfileSetting.LANGUAGE], user.nickname, locale, pathname, /*query,*/ asPath, isReady]);
  
  useEffect(() => {
    document.querySelector('body')?.classList.remove('jk-theme-dark');
    document.querySelector('body')?.classList.remove('jk-theme-light');
    if (user.settings?.[ProfileSetting.THEME] === Theme.DARK) {
      document.querySelector('body')?.classList.add('jk-theme-dark');
    } else {
      document.querySelector('body')?.classList.add('jk-theme-light');
    }
  }, [user.settings?.[ProfileSetting.THEME]]);
  
  return (
    <UserContext.Provider value={{ flags, setFlags }}>
      {children}
    </UserContext.Provider>
  );
};
