import { OpenDialog, QueryParam } from 'config/constants';
import { addSubQuery, removeSubQuery } from 'helpers';
import { useRouter } from 'next/router';
import React from 'react';
import { useUserDispatch } from 'store';
import { LoginInputType, SetLoaderStatusOnClickType } from 'types';
import { LoginModal } from '../';

export const Login = () => {
  
  const { query, push } = useRouter();
  const { signIn } = useUserDispatch();
  
  const onSubmit = (data: LoginInputType, setLoading: SetLoaderStatusOnClickType) => {
    signIn(data.nickname, data.password, setLoading);
  };
  
  return (
    <LoginModal
      onCancel={() => push({ query: removeSubQuery(query, QueryParam.OPEN_DIALOG, OpenDialog.SIGN_IN) })}
      onSubmit={onSubmit}
      onSignUpButton={() => push({
        query: addSubQuery(
          removeSubQuery(query, QueryParam.OPEN_DIALOG, OpenDialog.SIGN_IN),
          QueryParam.OPEN_DIALOG,
          OpenDialog.SIGN_UP,
        ),
      })}
    />
  );
};
