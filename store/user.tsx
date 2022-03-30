import { T } from 'components';
import { DEFAULT_PERMISSIONS, OpenDialog, POST, PUT, QueryParam, USER_GUEST } from 'config/constants';
import { JUDGE_API_V1 } from 'config/constants/judge';
import { actionLoaderWrapper, addParamQuery, authorizedRequest, cleanRequest, isStringJson } from 'helpers';
import { useFetcher, useNotification, useT } from 'hooks';
import { useRouter } from 'next/router';
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from 'react';
import { ContentResponseType, ProfileSettingOptions, ScopeData, SetLoaderStatusOnClickType, Status, UserInterface } from 'types';
import { Language } from '../types';

export interface UserState extends UserInterface {
  isLogged: boolean,
  session: string,
}

export const UserContext = createContext<{ user: UserState, setUser: Dispatch<SetStateAction<UserState>> }>({
  user: USER_GUEST,
  setUser: () => {
  },
});

const getUserState = (object: any): UserState => {
  const myPermissions = {
    [ScopeData.USER]: object?.permissions?.find?.(s => s?.key === 'USER')?.value || DEFAULT_PERMISSIONS.USER,
    [ScopeData.CONTEST]: object?.permissions?.find?.(s => s?.key === 'CONTEST')?.value || DEFAULT_PERMISSIONS.CONTEST,
    [ScopeData.PROBLEM]: object?.permissions?.find?.(s => s?.key === 'PROBLEM')?.value || DEFAULT_PERMISSIONS.PROBLEM,
    [ScopeData.ATTEMPT]: object?.permissions?.find?.(s => s?.key === 'ATTEMPT')?.value || DEFAULT_PERMISSIONS.ATTEMPT,
  };
  
  return {
    givenName: object?.givenName || USER_GUEST.givenName,
    familyName: object?.familyName || USER_GUEST.familyName,
    nickname: object?.nickname || USER_GUEST.nickname,
    imageUrl: object?.imageUrl || USER_GUEST.imageUrl,
    aboutMe: object?.aboutMe || USER_GUEST.aboutMe,
    country: object?.country || USER_GUEST.country,
    city: object?.city || USER_GUEST.city,
    institution: object?.institution || USER_GUEST.institution,
    email: object?.email || USER_GUEST.email,
    telegramUsername: USER_GUEST.telegramUsername,
    preferredLanguage: object?.settings?.find(({ key }) => key === 'preferredLanguage')?.value || USER_GUEST.preferredLanguage,
    preferredTheme: object?.settings?.find(({ key }) => key === 'preferredTheme')?.value || USER_GUEST.preferredTheme,
    status: object?.status || USER_GUEST.status,
    userRole: USER_GUEST.userRole,
    teamRole: USER_GUEST.teamRole,
    courseRole: USER_GUEST.courseRole,
    myPermissions,
    isLogged: !!object?.nickname,
    session: object?.session || '',
  };
};

export const UserProvider = ({ children }: PropsWithChildren<{}>) => {
  
  const { i18n } = useT();
  const { push, locale, pathname, asPath, query, isReady } = useRouter();
  const { data } = useFetcher<ContentResponseType<any>>(JUDGE_API_V1.ACCOUNT.PING());
  
  const [user, setUser] = useState<UserState>(USER_GUEST);
  
  useEffect(() => {
    if (data?.success) {
      setUser(getUserState(data?.content));
    }
  }, [data]);
  
  useEffect(() => {
    if (isReady) {
      const newLocale = user.preferredLanguage === Language.EN ? 'en' : 'es';
      if (locale !== newLocale) {
        i18n?.changeLanguage?.(locale);
        push({ pathname, query }, asPath, { locale: newLocale });
      }
    }
  }, [user.preferredLanguage, user.nickname, locale, pathname, query, asPath, isReady]);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserState = (): UserState => {
  const { user } = useContext(UserContext);
  
  return {
    ...user,
  };
};

export const useUserDispatch = () => {
  
  const { addNotification, addSuccessNotification, addErrorNotification, addInfoNotification } = useNotification();
  const { setUser } = useContext(UserContext);
  const { push, query } = useRouter();
  
  return {
    setUser,
    signIn: (nickname: string, password: string, setLoader: SetLoaderStatusOnClickType) => actionLoaderWrapper({
      request: async () => cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.ACCOUNT.SIGNIN(), {
        method: POST,
        body: JSON.stringify({ nickname, password }),
      })),
      addNotification,
      onSuccess: (result) => {
        setUser(getUserState(result.content));
        addSuccessNotification(<T className="text-sentence-case">welcome back</T>);
      },
      setLoader,
    }),
    signUp: (givenName: string, familyName: string, nickname: string, email: string, password: string, setLoader: SetLoaderStatusOnClickType) => actionLoaderWrapper({
      request: async () => {
        return cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.ACCOUNT.SIGNUP(), {
          method: POST,
          body: JSON.stringify({
            givenName,
            familyName,
            nickname,
            email,
            password,
          }),
        }));
      },
      addNotification,
      onSuccess: async (result) => {
        addSuccessNotification(<T className="text-sentence-case">welcome</T>);
        await push({ query: addParamQuery(query, QueryParam.OPEN_DIALOG, OpenDialog.WELCOME) });
        setUser(getUserState(result.content));
      },
      setLoader,
    }),
    logout: async (setLoader: SetLoaderStatusOnClickType) => {
      setLoader(Status.LOADING);
      const response = await authorizedRequest(JUDGE_API_V1.ACCOUNT.LOGOUT(), { method: POST });
      if (isStringJson(response)) {
        const result = JSON.parse(response); // special endpoint that only return success
        if (result.success === true) {
          setLoader(Status.SUCCESS);
          addInfoNotification(<T className="text-sentence-case">see you</T>);
        } else {
          setLoader(Status.ERROR);
          addErrorNotification(<div><T className="text-sentence-case">force Logout</T>{result.message}</div>);
        }
      } else {
        setLoader(Status.ERROR);
        addErrorNotification(<T className="text-sentence-case">force Logout</T>);
      }
      setUser(USER_GUEST);
      await push('/');
    },
    recoverAccount: () => {
    
    },
    updateUserSettings: async (account: UserState, setLoader: SetLoaderStatusOnClickType) => {
      const accountBody: UserState & { settings: Array<{ key: ProfileSettingOptions, value: string }> } = JSON.parse(JSON.stringify(account));
      
      accountBody.settings = [
        { key: ProfileSettingOptions.LANGUAGE, value: account.preferredLanguage },
        { key: ProfileSettingOptions.THEME, value: account.preferredTheme },
      ];
      return actionLoaderWrapper({
        request: async () => cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.ACCOUNT.UPDATE(), {
          method: PUT,
          body: JSON.stringify(accountBody),
        })),
        addNotification,
        onSuccess: (result) => {
          addSuccessNotification(<T className="text-sentence-case">your personal information has been updated</T>);
          setUser(getUserState(result.content));
        },
        setLoader,
        onError: (result) => {
          addErrorNotification(<T>{result.message}</T>);
        },
      });
    },
  };
};
