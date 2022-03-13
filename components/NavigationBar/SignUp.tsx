import { OpenDialog, QueryParam } from 'config/constants';
import { removeSubQuery } from 'helpers';
import { useRouter } from 'next/router';
import React from 'react';
import { useUserDispatch } from 'store';
import { SetLoaderStatusOnClickType, SignUpInputType } from 'types';
import { SignUpModal } from '../';

export const SignUp = () => {
  
  const { signUp } = useUserDispatch();
  const { push, query } = useRouter();
  
  const onSubmit = async (data: SignUpInputType, setLoading: SetLoaderStatusOnClickType) => {
    await signUp(data.givenName, data.familyName, data.nickname, data.email, data.password, setLoading);
  };
  
  return (
    <SignUpModal
      onCancel={() => push({ query: removeSubQuery(query, QueryParam.OPEN_DIALOG, OpenDialog.SIGN_UP) })}
      onSubmit={onSubmit}
    />
  );
};
