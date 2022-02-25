import { SignUpInput, SignUpModal } from 'components/commons';
import React from 'react';
// import { useAccountDispatch, useFlagsDispatch } from '~/hooks';
import { ButtonLoaderAction } from 'types';

const SignUp = () => {
  
  // const { signUp } = useAccountDispatch();
  // const { updateFlags } = useFlagsDispatch();
  
  const onSubmit = (data: SignUpInput, setLoading: ButtonLoaderAction) => {
    // signUp(data.givenName, data.familyName, data.nickname, data.email, data.password, setLoading)();
    console.log({ data });
  };
  
  return (
    <SignUpModal
      imageSource="/images/juki-sign-person.svg"
      // onCancel={updateFlags({ openSignUpModal: false })}
      onSubmit={onSubmit}
      onCancel={() => {
      }}
    />
  );
};

export default SignUp;
