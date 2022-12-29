import { authorizedRequest, cleanRequest, notifyResponse, useNotification } from '@juki-team/base-ui';
import { ContentResponseType, HTTPMethod } from '@juki-team/commons';
import { LoginModalComponent } from 'components';
import { JUDGE_API_V1, OpenDialog, QueryParam } from 'config/constants';
import { addParamQuery, removeParamQuery } from 'helpers';
import { useRouter, useUserDispatch } from 'hooks';
import React, { useState } from 'react';
import { LoginInputType, SetLoaderStatusOnClickType, Status } from 'types';

export const LoginModal = () => {
  
  const { query, push } = useRouter();
  const { signIn } = useUserDispatch();
  const { addNotification } = useNotification();
  const [highlightForgotPassword, setHighlightForgotPassword] = useState(false);
  const onSubmit = (data: LoginInputType, setLoading: SetLoaderStatusOnClickType) => (
    signIn(data.nickname, data.password, setLoading, () => setHighlightForgotPassword(true))
  );
  
  return (
    <LoginModalComponent
      onCancel={() => push({ query: removeParamQuery(query, QueryParam.DIALOG, OpenDialog.SIGN_IN) })}
      onSubmit={onSubmit}
      onSignUpButton={() => push({
        query: addParamQuery(
          removeParamQuery(query, QueryParam.DIALOG, OpenDialog.SIGN_IN),
          QueryParam.DIALOG,
          OpenDialog.SIGN_UP,
        ),
      })}
      onForgotPassword={async (email, setStatus) => {
        setStatus?.(Status.LOADING);
        const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.AUTH.INITIATE_RESET_PASSWORD(), {
          method: HTTPMethod.POST,
          body: JSON.stringify({ email }),
        }));
        notifyResponse(response, addNotification, setStatus);
      }}
      highlightForgotPassword={highlightForgotPassword}
    />
  );
};
