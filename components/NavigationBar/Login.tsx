import { useRouter } from 'next/router';
import React from 'react';
import { LoginModal } from '../';
import { OpenDialog, QueryParam } from '../../config/constants';
import { addSubQuery, removeSubQuery } from '../../helpers';
import { useUserDispatch } from '../../store';
import { LoaderAction, LoginInput } from '../../types';

export const Login = () => {
  
  const { query, push } = useRouter();
  const { signIn } = useUserDispatch();
  
  const onSubmit = (data: LoginInput, setLoading: LoaderAction) => {
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
