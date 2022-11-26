import { T } from 'components';
import {
  JUDGE_API_V1,
  JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL,
  JUKI_TOKEN_NAME,
  OpenDialog,
  QueryParam,
  USER_GUEST,
} from 'config/constants';
import { actionLoaderWrapper, addParamQuery, authorizedRequest, cleanRequest, notifyResponse, toBlob } from 'helpers';
import { useJukiBase, useMatchMutate, useNotification, useSWR, useT } from 'hooks';
import { useRouter } from 'next/router';
import React, { createContext, PropsWithChildren, useEffect } from 'react';
import {
  ButtonLoaderOnClickType,
  ContentResponseType,
  HTTPMethod,
  Language,
  SetLoaderStatusOnClickType,
  Status,
  Theme,
  UserPingResponseDTO,
  UserState,
} from 'types';

export const UserContext = createContext<{}>({});

export const UserProvider = ({ children }: PropsWithChildren<{}>) => {
  
  const { i18n } = useT();
  const { locale, pathname, asPath, query, isReady, replace } = useRouter();
  const { user } = useJukiBase();
  
  useEffect(() => {
    if (isReady) {
      const newLocale = user.settings?.preferredLanguage === Language.ES ? 'es' : 'en';
      i18n?.changeLanguage?.(newLocale);
    }
  }, [user.settings?.preferredLanguage, isReady]);
  
  useEffect(() => {
    if (isReady) {
      const newLocale = user.settings?.preferredLanguage === Language.ES ? 'es' : 'en';
      if (locale !== newLocale) {
        replace({ pathname, query }, asPath, { locale: newLocale });
      }
    }
  }, [user.settings?.preferredLanguage, user.nickname, locale, pathname, /*query,*/ asPath, isReady]);
  
  useEffect(() => {
    document.querySelector('body')?.classList.remove('jk-theme-dark');
    document.querySelector('body')?.classList.remove('jk-theme-light');
    if (user.settings?.preferredTheme === Theme.DARK) {
      document.querySelector('body')?.classList.add('jk-theme-dark');
    } else {
      document.querySelector('body')?.classList.add('jk-theme-light');
    }
  }, [user.settings?.preferredTheme]);
  
  return (
    <UserContext.Provider value={{}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserState = (): (UserState & { isLoading: boolean }) => {
  const { user, userIsLoading: isLoading } = useJukiBase();
  
  return {
    ...user,
    isLoading,
  };
};

export const useUserDispatch = () => {
  
  const { addNotification, addSuccessNotification, addErrorNotification, addInfoNotification } = useNotification();
  const { setUser } = useJukiBase();
  const { push, query } = useRouter();
  const { mutate } = useSWR();
  const matchMutate = useMatchMutate();
  
  const refreshAllRequest = async () => {
    await matchMutate(new RegExp(`^${JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}/api`, 'g'));
  };
  
  return {
    setUser,
    updateProfileData: (nickname: string, body, onSuccess): ButtonLoaderOnClickType => async (setLoaderStatus) => {
      const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.USER.UPDATE_PROFILE_DATA(nickname as string), {
        method: HTTPMethod.PUT,
        body: JSON.stringify(body),
      }));
      if (notifyResponse(response, addNotification)) {
        await mutate(JUDGE_API_V1.AUTH.PING());
        await mutate(JUDGE_API_V1.USER.PROFILE(nickname as string));
        setLoaderStatus(Status.SUCCESS);
        onSuccess();
      } else {
        setLoaderStatus(Status.ERROR);
      }
    },
    updateProfileImage: (nickname: string, cropImage, onSuccess): ButtonLoaderOnClickType => async (setLoader) => {
      if (cropImage?.previewCanvasRef.current) {
        const blob = (await toBlob(cropImage.previewCanvasRef.current));
        if (blob) {
          setLoader?.(Status.LOADING);
          const formData = new FormData();
          formData.append('image', blob);
          const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.USER.UPDATE_PROFILE_IMAGE(nickname), {
            method: HTTPMethod.PUT,
            body: formData,
          }));
          if (notifyResponse(response, addNotification)) {
            await mutate(JUDGE_API_V1.AUTH.PING());
            await mutate(JUDGE_API_V1.USER.PROFILE(nickname as string));
            onSuccess();
            setLoader(Status.SUCCESS);
          } else {
            setLoader(Status.ERROR);
          }
        }
      }
    },
    updatePassword: (nickname, newPassword, onSuccess): ButtonLoaderOnClickType => async (setLoaderStatus) => {
      setLoaderStatus?.(Status.LOADING);
      const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.AUTH.UPDATE(nickname), {
        method: HTTPMethod.PUT,
        body: JSON.stringify({ newPassword }),
      }));
      if (response.success) {
        addSuccessNotification(<T className="tt-se">password changed successfully</T>);
        setLoaderStatus?.(Status.SUCCESS);
        onSuccess();
      } else {
        addErrorNotification(response.message || <T>error</T>);
        setLoaderStatus?.(Status.ERROR);
      }
    },
    resetPassword: (nickname, newPassword, onSuccess): ButtonLoaderOnClickType => async (setLoaderStatus) => {
      setLoaderStatus?.(Status.LOADING);
      const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.AUTH.RESET(nickname), {
        method: HTTPMethod.PUT,
        body: JSON.stringify({ newPassword }),
      }));
      if (response.success) {
        addSuccessNotification(<T className="tt-se">password changed successfully</T>);
        setLoaderStatus?.(Status.SUCCESS);
        onSuccess();
      } else {
        addErrorNotification(<T>error</T>);
        setLoaderStatus?.(Status.ERROR);
      }
    },
    signIn: (nickname: string, password: string, setLoader: SetLoaderStatusOnClickType) => actionLoaderWrapper<ContentResponseType<UserPingResponseDTO>>({
      request: async () => cleanRequest<ContentResponseType<UserPingResponseDTO>>(await authorizedRequest(JUDGE_API_V1.AUTH.SIGN_IN(), {
        method: HTTPMethod.POST,
        body: JSON.stringify({ nickname, password }),
      })),
      addNotification,
      onSuccess: (result) => {
        localStorage.setItem(JUKI_TOKEN_NAME, result.content.sessionId);
        setUser({ ...result.content, isLogged: true });
        addSuccessNotification(<T className="tt-se">welcome back</T>);
        refreshAllRequest();
      },
      setLoader,
    }),
    signUp: (givenName: string, familyName: string, nickname: string, email: string, password: string, setLoader: SetLoaderStatusOnClickType, withRedirectAndLogin: boolean) => actionLoaderWrapper<ContentResponseType<UserPingResponseDTO>>({
      request: async () => {
        return cleanRequest<ContentResponseType<UserPingResponseDTO>>(await authorizedRequest(JUDGE_API_V1.AUTH.SIGN_UP(), {
          method: HTTPMethod.POST,
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
        if (withRedirectAndLogin) {
          localStorage.setItem(JUKI_TOKEN_NAME, result.content.sessionId);
          addSuccessNotification(<T className="tt-se">welcome</T>);
          await push({ query: addParamQuery(query, QueryParam.DIALOG, OpenDialog.WELCOME) });
          setUser({ ...result.content, isLogged: true });
          refreshAllRequest();
        }
      },
      setLoader,
    }),
    logout: async (setLoader: SetLoaderStatusOnClickType) => {
      setLoader(Status.LOADING);
      const result = cleanRequest(await authorizedRequest(JUDGE_API_V1.AUTH.SIGN_OUT(), { method: HTTPMethod.POST }));
      if (result.success === true) {
        setLoader(Status.SUCCESS);
        addInfoNotification(<T className="tt-se">see you</T>);
      } else {
        setLoader(Status.ERROR);
        addErrorNotification(<div><T className="tt-se">force Logout</T>{result.message}</div>);
      }
      localStorage.removeItem(JUKI_TOKEN_NAME);
      setUser(USER_GUEST);
      refreshAllRequest();
    },
    deleteSession: (sessionId: string): ButtonLoaderOnClickType => async (setLoaderStatus) => {
      setLoaderStatus?.(Status.LOADING);
      const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.USER.SESSION_SESSION_ID(sessionId), {
        method: HTTPMethod.DELETE,
      }));
      if (notifyResponse(response, addNotification)) {
        await mutate(JUDGE_API_V1.USER.ONLINE_USERS());
        setLoaderStatus(Status.SUCCESS);
      } else {
        setLoaderStatus(Status.ERROR);
      }
    },
    updateUserSettings: async (nickname: string, settings: { preferredTheme: Theme, preferredLanguage: Language }, setLoader: SetLoaderStatusOnClickType) => {
      return actionLoaderWrapper<ContentResponseType<any>>({
        request: async () => cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.USER.UPDATE_PREFERENCES(nickname), {
          method: HTTPMethod.PUT,
          body: JSON.stringify(settings),
        })),
        addNotification,
        onSuccess: async () => {
          await mutate(JUDGE_API_V1.AUTH.PING());
          addSuccessNotification(<T className="tt-se">your personal information has been updated</T>);
        },
        setLoader,
        onError: (result) => {
          addErrorNotification(<T>{result.message}</T>);
        },
      });
    },
  };
};
