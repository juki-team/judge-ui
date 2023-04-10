import { SignUpModalComponent } from 'components';
import { addParamQuery, removeParamQuery } from 'helpers';
import { useRouter } from 'next/router';
import React from 'react';
import { OpenDialog, QueryParam, Status } from 'types';

export const SignUpModal = () => {
  
  const { push, query } = useRouter();
  
  const onSuccess = async () => await push({ query: addParamQuery(query, QueryParam.DIALOG, OpenDialog.WELCOME) });
  
  return (
    <SignUpModalComponent
      onClose={async (setLoaderStatus) => {
        setLoaderStatus(Status.LOADING);
        await push({ query: removeParamQuery(query, QueryParam.DIALOG, OpenDialog.SIGN_UP) });
        setLoaderStatus(Status.LOADING);
      }}
      onSuccess={onSuccess}
    />
  );
};
