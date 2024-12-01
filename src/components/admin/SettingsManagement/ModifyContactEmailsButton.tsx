import React, { useEffect, useState } from 'react';
import { AddIcon, Button, ButtonLoader, DeleteIcon, Input, Modal, T } from 'src/components/index';
import { jukiApiSocketManager } from 'src/config';
import { authorizedRequest, cleanRequest } from 'src/helpers';
import { useJukiNotification } from 'src/hooks';
import { ContentResponseType, HTTPMethod, Status } from 'src/types';
import { KeyedMutator } from 'swr';

interface ModifyContactEmailsButtonProps {
  companyKey: string,
  contactEmails: string [],
  mutate: KeyedMutator<any>,
}

export const ModifyContactEmailsButton = (props: ModifyContactEmailsButtonProps) => {
  
  const { companyKey, contactEmails: initialContactEmails, mutate } = props;
  const [ contactEmails, setContactEmails ] = useState<string[]>(initialContactEmails);
  const [ open, setOpen ] = useState(false);
  const { notifyResponse } = useJukiNotification();
  useEffect(() => {
    setContactEmails(initialContactEmails);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ JSON.stringify(initialContactEmails), open ]);
  
  return (
    <>
      <Modal onClose={() => setOpen(false)} isOpen={open} closeIcon>
        <div className="jk-col gap stretch jk-pg-lg">
          <h2><T>modify contact emails</T></h2>
          <div className="jk-col stretch">
            <div className="jk-row block jk-table-inline-header">
              <div className="jk-row">#</div>
              <div className="jk-row"><T>email</T></div>
              <div className="jk-row"><T>delete</T></div>
            </div>
            {!contactEmails.length && (
              <div className="jk-row jk-table-inline-row">
                <em><T>empty table</T></em>
              </div>
            )}
            {contactEmails.map((contactEmail, index) => (
              <div className="jk-row block jk-table-inline-row" key={contactEmail}>
                <div className="jk-row">{index + 1}</div>
                <div className="jk-row">
                  <Input
                    value={contactEmail}
                    onChange={(newValue) => {
                      const newContactEmails = [ ...contactEmails ];
                      newContactEmails[index] = newValue;
                      setContactEmails(newContactEmails);
                    }}
                  />
                </div>
                <div className="jk-row">
                  <DeleteIcon
                    className="clickable jk-br-ie"
                    onClick={() => setContactEmails(contactEmails.filter((_, _index) => index !== _index))}
                  />
                </div>
              </div>
            ))}
            
            <Button
              size="small"
              className="jk-table-inline-row"
              onClick={() => setContactEmails([ ...contactEmails, '' ])}
              icon={<AddIcon />}
              extend
            >
              <T>add</T>
            </Button>
          </div>
          <div className="jk-row gap right">
            <Button onClick={() => setOpen(false)} type="text"><T>cancel</T></Button>
            <ButtonLoader
              disabled={contactEmails.includes('')}
              onClick={async (setLoaderStatus) => {
                setLoaderStatus(Status.LOADING);
                const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
                  jukiApiSocketManager.API_V1.company.get({ params: { companyKey } }).url,
                  { method: HTTPMethod.PATCH, body: JSON.stringify({ contactEmails }) },
                ));
                await mutate();
                if (notifyResponse(response, setLoaderStatus)) {
                  setOpen(false);
                }
              }}
            >
              <T>save</T>
            </ButtonLoader>
          </div>
        </div>
      </Modal>
      <Button size="small" onClick={() => setOpen(true)}><T>modify contact emails</T></Button>
    </>
  );
};
