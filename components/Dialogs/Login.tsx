import { LoginModalComponent } from 'components';
import { OpenDialog, QueryParam } from 'config/constants';
import { addParamQuery, removeParamQuery } from 'helpers';
import { useRouter } from 'hooks';
import React from 'react';
import { useUserDispatch } from 'store';
import { LoginInputType, SetLoaderStatusOnClickType } from 'types';

export const LoginModal = () => {
  
  const { query, push } = useRouter();
  const { signIn } = useUserDispatch();
  
  const onSubmit = (data: LoginInputType, setLoading: SetLoaderStatusOnClickType) => (
    signIn(data.nickname, data.password, setLoading)
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
    />
  );
};
