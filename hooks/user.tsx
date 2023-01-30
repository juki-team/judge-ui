import { T } from 'components';
import {
  JUDGE_API_V1,
  JUKI_SERVICE_BASE_URL,
  JUKI_TOKEN_NAME,
  OpenDialog,
  QueryParam,
  ROUTES,
  USER_GUEST,
} from 'config/constants';
import { actionLoaderWrapper, addParamQuery, authorizedRequest, cleanRequest, notifyResponse, toBlob } from 'helpers';
import { useJukiBase, useMatchMutate, useNotification, useSWR } from 'hooks';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { UserContext } from 'store';
import {
  ButtonLoaderOnClickType,
  ContentResponseType,
  FlagsType,
  HTTPMethod,
  PingResponseDTO,
  ProfileTab,
  SetFlagsType,
  SetLoaderStatusOnClickType,
  Status,
  UserSettingsType,
} from 'types';

export const useJukiFlags = (): { flags: FlagsType, setFlags: SetFlagsType } => {
  const { flags, setFlags } = useContext(UserContext);
  return {
    flags,
    setFlags,
  };
};

export const useUserDispatch = () => {
  
  const { addNotification, addSuccessNotification, addErrorNotification, addInfoNotification } = useNotification();
  const { setUser } = useJukiBase();
  const { push, query } = useRouter();
  const { mutate } = useSWR();
  const matchMutate = useMatchMutate();
  
  const refreshAllRequest = async () => {
    await matchMutate(new RegExp(`^${JUKI_SERVICE_BASE_URL}/api`, 'g'));
  };
  
  return {
    setUser,
    updateProfileData: (nickname: string, body, onSuccess): ButtonLoaderOnClickType => async (setLoaderStatus) => {
      setLoaderStatus?.(Status.LOADING);
      const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.USER.UPDATE_PROFILE_DATA(nickname as string), {
        method: HTTPMethod.PUT,
        body: JSON.stringify(body),
      }));
      if (notifyResponse(response, addNotification, setLoaderStatus)) {
        setLoaderStatus?.(Status.LOADING);
        let tab = ProfileTab.PROFILE;
        if (query.tab === ProfileTab.SUBMISSIONS) {
          tab = ProfileTab.SUBMISSIONS;
        }
        await push({ pathname: ROUTES.PROFILE.PAGE(body.nickname, tab), query });
        await mutate(JUDGE_API_V1.AUTH.PING());
        await mutate(JUDGE_API_V1.USER.PROFILE(nickname as string));
        onSuccess();
        setLoaderStatus?.(Status.SUCCESS);
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
          if (notifyResponse(response, addNotification, setLoader)) {
            setLoader?.(Status.LOADING);
            await mutate(JUDGE_API_V1.AUTH.PING());
            await mutate(JUDGE_API_V1.USER.PROFILE(nickname as string));
            onSuccess();
            setLoader?.(Status.SUCCESS);
          }
        }
      }
    },
    updatePassword: (newPassword, oldPassword, onSuccess): ButtonLoaderOnClickType => async (setLoaderStatus) => {
      setLoaderStatus?.(Status.LOADING);
      const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.AUTH.UPDATE_PASSWORD(), {
        method: HTTPMethod.POST,
        body: JSON.stringify({ newPassword, oldPassword }),
      }));
      if (notifyResponse(response, addNotification, setLoaderStatus)) {
        onSuccess();
      }
    },
    resetPassword: (nickname, onSuccess): ButtonLoaderOnClickType => async (setLoaderStatus) => {
      setLoaderStatus?.(Status.LOADING);
      const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.AUTH.RESET_PASSWORD(nickname), {
        method: HTTPMethod.POST,
      }));
      if (notifyResponse(response, addNotification, setLoaderStatus)) {
        onSuccess();
      }
    },
    signIn: async (nickname: string, password: string, setLoader: SetLoaderStatusOnClickType, onError: () => void) => {
      setLoader?.(Status.LOADING);
      const response = cleanRequest<ContentResponseType<PingResponseDTO>>(await authorizedRequest(JUDGE_API_V1.AUTH.SIGN_IN(), {
        method: HTTPMethod.POST,
        body: JSON.stringify({ nickname, password }),
      }));
      if (notifyResponse(response, addNotification, setLoader)) {
        localStorage.setItem(JUKI_TOKEN_NAME, response.content.user.sessionId);
        setUser({ ...response.content.user, isLogged: true });
        refreshAllRequest();
      } else {
        onError();
      }
    },
    signUp: (givenName: string, familyName: string, nickname: string, email: string, password: string, setLoader: SetLoaderStatusOnClickType, withRedirectAndLogin: boolean) => actionLoaderWrapper<ContentResponseType<PingResponseDTO>>({
      request: async () => {
        return cleanRequest<ContentResponseType<PingResponseDTO>>(await authorizedRequest(JUDGE_API_V1.AUTH.SIGN_UP(), {
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
          localStorage.setItem(JUKI_TOKEN_NAME, result.content.user.sessionId);
          addSuccessNotification(<T className="tt-se">welcome</T>);
          await push({ query: addParamQuery(query, QueryParam.DIALOG, OpenDialog.WELCOME) });
          setUser({ ...result.content.user, isLogged: true });
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
      if (notifyResponse(response, addNotification, setLoaderStatus)) {
        setLoaderStatus(Status.LOADING);
        await mutate(JUDGE_API_V1.USER.ONLINE_USERS());
        setLoaderStatus(Status.SUCCESS);
      }
    },
    updateUserSettings: async (nickname: string, settings: UserSettingsType, setLoader: SetLoaderStatusOnClickType) => {
      setLoader?.(Status.LOADING);
      const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.USER.UPDATE_PREFERENCES(nickname), {
        method: HTTPMethod.PUT,
        body: JSON.stringify(settings),
      }));
      if (notifyResponse(response, addNotification, setLoader)) {
        setLoader?.(Status.LOADING);
        await mutate(JUDGE_API_V1.AUTH.PING());
        setLoader?.(Status.SUCCESS);
      }
    },
  };
};
