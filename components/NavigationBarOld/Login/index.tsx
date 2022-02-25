import { LoginInput, LoginModal } from 'components/commons';
import React from 'react';
import { ButtonLoaderAction } from '../../../types';

const Login = () => {
  
  // const { signIn, recoverAccount } = useAccountDispatch();
  // const { updateFlags } = useFlagsDispatch();
  
  const onSubmit = (data: LoginInput, setLoading: ButtonLoaderAction) => {
    // signIn(data.nickname, data.password, setLoading)();
    console.log({ data });
  };
  
  return (
    <LoginModal
      // onCancel={updateFlags({ openLoginModal: false })}
      onSubmit={onSubmit}
      imageSource="/images/juki-sign-person.svg"
      // onSignUpButton={updateFlags({ openLoginModal: false, openSignUpModal: true })}
      // onForgotPassword={recoverAccount}
      onCancel={() => {
      }}
      onSignUpButton={() => {
      }}
    />
  );
};

export default Login;
