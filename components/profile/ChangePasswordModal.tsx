import { yupResolver } from '@hookform/resolvers/yup';
import { ButtonLoader, InputPassword, Modal, T } from 'components';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { SetLoaderStatusOnClickType } from 'types';
import * as yup from 'yup';
import { useUserDispatch } from '../../store';

export type ProfileChangePasswordInput = {
  oldPassword: string,
  newPassword: string,
  newPasswordConfirmation: string,
}

const profileSettingsChangePasswordSchema = yup.object().shape({
  oldPassword: yup.string()
    .required('required in order to update the password'),
  newPassword: yup.string()
    .required('cannot be empty')
    .min(8, 'password must be at least 8 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!.?"()-_]{8,}$/,
      'must have at least one uppercase, one lowercase letter and one number'),
  newPasswordConfirmation: yup.string()
    .required('cannot be empty')
    .oneOf([yup.ref('newPassword'), ''], 'both passwords must match'),
});

export const ChangePasswordModal = ({ onClose, nickname: userNickname }: { onClose: () => void, nickname: string }) => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<ProfileChangePasswordInput>({
    resolver: yupResolver(profileSettingsChangePasswordSchema),
    mode: 'onChange',
    reValidateMode: 'onBlur',
  });
  
  const { updatePassword } = useUserDispatch();
  
  const setLoaderRef = useRef<SetLoaderStatusOnClickType>();
  
  return (
    <Modal
      isOpen={true}
      className="modal-change-password"
      onClose={onClose}
    >
      <div className="jk-pad-md">
        <form
          onSubmit={handleSubmit((data: ProfileChangePasswordInput) => updatePassword(userNickname, data.newPassword, onClose)(setLoaderRef.current!, null, null))}>
          <div className="jk-form-item">
            <label>
              <T>new password</T>
              <InputPassword register={register('newPassword')} />
            </label>
            <p><T>{errors.newPassword?.message || ''}</T></p>
          </div>
          <div className="jk-form-item">
            <label>
              <T>confirm new password</T>
              <InputPassword register={register('newPasswordConfirmation')} />
            </label>
            <p><T>{errors.newPasswordConfirmation?.message || ''}</T></p>
          </div>
          <div className="jk-form-item">
            <label>
              <T>put your password to update</T>
              <InputPassword register={register('oldPassword')} />
            </label>
            <p><T>{errors.oldPassword?.message || ''}</T></p>
          </div>
          <div className="jk-row gap right">
            <ButtonLoader type="text" onClick={onClose}>
              <T>cancel</T>
            </ButtonLoader>
            <ButtonLoader
              type="primary"
              setLoaderStatusRef={setLoader => setLoaderRef.current = setLoader}
              disabled={!isValid}
              submit
            >
              <T>update password</T>
            </ButtonLoader>
          </div>
        </form>
      </div>
    </Modal>
  );
};
