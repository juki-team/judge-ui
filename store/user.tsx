import { useRouter } from 'next/router';
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { T } from '../components';
import { DEFAULT_PERMISSIONS, OpenDialog, QueryParam, USER_GUEST } from '../config/constants';
import { addSubQuery, isStringJson } from '../helpers';
import { actionLoaderWrapper, authorizedRequest, clean, POST, PUT } from '../helpers/services';
import { useFetcher, useNotification } from '../hooks';
import { JUDGE_API_V1 } from '../services/judge';
import { ContentResponseType, Language, LoaderAction, ProfileSettingOptions, ScopeData, Status, UserInterface } from '../types';

export interface UserState extends UserInterface {
  isLogged: boolean;
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
  };
};

export const UserProvider = ({ children }: PropsWithChildren<{}>) => {
  const { i18n } = useTranslation();
  const { push, locale, pathname, asPath, query } = useRouter();
  const { data } = useFetcher<ContentResponseType<any>>(JUDGE_API_V1.ACCOUNT.PING());
  
  const [user, setUser] = useState<UserState>(USER_GUEST);
  
  useEffect(() => {
    if (data?.success) {
      setUser(getUserState(data?.content));
    }
  }, [data]);
  
  useEffect(() => {
    const newLocale = user.preferredLanguage === Language.EN ? 'en' : 'es';
    if (user.isLogged && locale !== newLocale) {
      push({ pathname, query }, asPath, { locale: newLocale });
    }
  }, [user.preferredLanguage, user.nickname, locale, pathname, query, asPath]);
  
  useEffect(() => {
    i18n?.changeLanguage?.(locale);
  }, [locale]);
  
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
    signIn: (nickname: string, password: string, setLoader: LoaderAction) => {
      actionLoaderWrapper(
        async () => clean<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.ACCOUNT.SIGNIN(), POST, JSON.stringify({
          nickname,
          password,
        }))),
        addNotification,
        (result) => {
          setUser(getUserState(result.content));
          addSuccessNotification(<T className="sentence-case">welcome back</T>);
        },
        setLoader,
      );
    },
    signUp: async (givenName: string, familyName: string, nickname: string, email: string, password: string, setLoader: LoaderAction) => {
      await actionLoaderWrapper(
        async () => {
          return clean<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.ACCOUNT.SIGNUP(), POST, JSON.stringify({
            givenName,
            familyName,
            nickname,
            email,
            password,
          })));
        },
        addNotification,
        async (result) => {
          addSuccessNotification(<T className="sentence-case">welcome</T>);
          await push({ query: addSubQuery(query, QueryParam.OPEN_DIALOG, OpenDialog.WELCOME) });
          setUser(getUserState(result.content));
        },
        setLoader,
      );
    },
    logout: async (setLoader: LoaderAction) => {
      setLoader([1, Status.LOADING]);
      const response = await authorizedRequest(JUDGE_API_V1.ACCOUNT.LOGOUT(), POST);
      if (isStringJson(response)) {
        const result = JSON.parse(response); // special endpoint that only return success
        if (result.success === true) {
          setLoader([1, Status.SUCCESS]);
          addInfoNotification(<T className="sentence-case">see you</T>);
        } else {
          setLoader([1, Status.ERROR]);
          addErrorNotification(<div><T className="sentence-case">force Logout</T>{result.message}</div>);
        }
      } else {
        setLoader([1, Status.ERROR]);
        addErrorNotification(<T className="sentence-case">force Logout</T>);
      }
      setUser(USER_GUEST);
      await push('/');
    },
    recoverAccount: () => {
    
    },
    updateUserSettings: async (account: UserState, setLoader: LoaderAction) => {
      
      const accountBody: UserState & { settings: Array<{ key: ProfileSettingOptions, value: string }> } = JSON.parse(JSON.stringify(account));
      
      accountBody.settings = [
        { key: ProfileSettingOptions.LANGUAGE, value: account.preferredLanguage },
        { key: ProfileSettingOptions.THEME, value: account.preferredTheme },
      ];
      return await actionLoaderWrapper(
        async () => clean<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.ACCOUNT.UPDATE(), PUT, JSON.stringify(accountBody))),
        addNotification,
        (result) => {
          addSuccessNotification(<T className="sentence-case">your personal information has been updated</T>);
          setUser(getUserState(result.content));
        },
        setLoader,
        (result) => {
          addErrorNotification(result.message);
        },
      );
    },
  };
};