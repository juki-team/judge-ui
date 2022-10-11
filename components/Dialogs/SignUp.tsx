import { SignUpModalComponent } from 'components';
import { OpenDialog, QueryParam } from 'config/constants';
import { removeParamQuery } from 'helpers';
import { useRouter } from 'next/router';
import React from 'react';
import { useUserDispatch } from 'store';
import { SetLoaderStatusOnClickType, SignUpInputType } from 'types';

export const SignUpModal = () => {
  
  const { signUp } = useUserDispatch();
  const { push, query } = useRouter();
  
  const onSubmit = async (data: SignUpInputType, setLoading: SetLoaderStatusOnClickType) => {
    await signUp(data.givenName, data.familyName, data.nickname, data.email, data.password, setLoading);
  };
  
  return (
    <SignUpModalComponent
      onCancel={() => push({ query: removeParamQuery(query, QueryParam.DIALOG, OpenDialog.SIGN_UP) })}
      onSubmit={onSubmit}
    />
  );
};
