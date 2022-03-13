import { LoginModal } from 'components';
import { OpenDialog, QueryParam } from 'config/constants';
import { addParamQuery, removeParamQuery } from 'helpers';
import { useRouter } from 'hooks';
import React from 'react';
import { useUserDispatch } from 'store';
import { LoginInputType, SetLoaderStatusOnClickType } from 'types';

export const Login = () => {
  
  const { query, push } = useRouter();
  const { signIn } = useUserDispatch();
  
  const onSubmit = (data: LoginInputType, setLoading: SetLoaderStatusOnClickType) => (
    signIn(data.nickname, data.password, setLoading)
  );
  
  return (
    <LoginModal
      onCancel={() => push({ query: removeParamQuery(query, QueryParam.OPEN_DIALOG, OpenDialog.SIGN_IN) })}
      onSubmit={onSubmit}
      onSignUpButton={() => push({
        query: addParamQuery(
          removeParamQuery(query, QueryParam.OPEN_DIALOG, OpenDialog.SIGN_IN),
          QueryParam.OPEN_DIALOG,
          OpenDialog.SIGN_UP,
        ),
      })}
    />
  );
};
