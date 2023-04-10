import { LoginModalComponent } from 'components';
import { addParamQuery, removeParamQuery } from 'helpers';
import { useRouter } from 'hooks';
import React from 'react';
import { OpenDialog, QueryParam, Status } from 'types';

export const LoginModal = () => {
  
  const { query, push } = useRouter();
  
  return (
    <LoginModalComponent
      onClose={async (setLoaderStatus) => {
        setLoaderStatus(Status.LOADING);
        await push({ query: removeParamQuery(query, QueryParam.DIALOG, OpenDialog.SIGN_IN) });
        setLoaderStatus(Status.SUCCESS);
      }}
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
