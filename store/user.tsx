import { NewVersionAvailableTrigger } from 'components';
import { createContext } from 'helpers';
import { useEffect, useJukiUser, useState } from 'hooks';
import { FlagsType, ProfileSetting, PropsWithChildren, SetFlagsType, Theme } from 'types';

export const UserContext = createContext<{ flags: FlagsType, setFlags: SetFlagsType }>({
  flags: {
    isHelpOpen: false,
    isHelpFocused: false,
  }, setFlags: () => null,
});

export const _setFlags: { current: SetFlagsType } = { current: () => null };

export const UserProvider = ({ children }: PropsWithChildren<{}>) => {
  
  const { user } = useJukiUser();
  const [ flags, setFlags ] = useState<FlagsType>({ isHelpOpen: false, isHelpFocused: false });
  _setFlags.current = setFlags;
  
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
      <NewVersionAvailableTrigger apiVersionUrl="/api/version" />
      {children}
    </UserContext.Provider>
  );
};
