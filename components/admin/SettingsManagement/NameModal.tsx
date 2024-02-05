import { Button, ButtonLoader, Input, Modal, T } from 'components';
import { jukiSettings } from 'config';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useNotification } from 'hooks';
import { useEffect, useState } from 'react';
import { ContentResponseType, HTTPMethod, ModalProps, Status } from 'types';

interface NameModalProps extends ModalProps {
  onClose: () => void,
  companyKey: string,
  name: string,
  mutate: () => Promise<void>,
}

export const NameModal = ({ name: initialName, mutate, companyKey, ...modalProps }: NameModalProps) => {
  
  const [ name, setName ] = useState(initialName);
  useEffect(() => {
    if (modalProps.isOpen) {
      setName(initialName);
    }
  }, [ initialName, modalProps.isOpen ]);
  const { notifyResponse } = useNotification();
  
  return (
    <Modal {...modalProps} closeWhenClickOutside closeWhenKeyEscape>
      <div className="jk-col gap stretch jk-pad-md">
        <h3><T>set name</T></h3>
        <Input value={name} onChange={setName} />
        <div className="jk-row gap right">
          <Button type="light" onClick={modalProps.onClose}><T>cancel</T></Button>
          <ButtonLoader
            onClick={async (setLoaderStatus) => {
              setLoaderStatus(Status.LOADING);
              const response = cleanRequest<ContentResponseType<{}>>(
                await authorizedRequest(
                  jukiSettings.API.company.get({ params: { companyKey } }).url,
                  {
                    method: HTTPMethod.PATCH,
                    body: JSON.stringify({ name }),
                  }));
              await mutate();
              if (notifyResponse(response, setLoaderStatus)) {
                modalProps.onClose();
              }
            }}
          >
            <T>save</T>
          </ButtonLoader>
        </div>
      </div>
    </Modal>
  );
}
