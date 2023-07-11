import { AddIcon, Button, ButtonLoader, DeleteIcon, Input, Modal, T } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useNotification } from 'hooks';
import React, { useEffect, useState } from 'react';
import { KeyedMutator } from 'swr';
import { ContentResponseType, HTTPMethod, Status } from 'types';

interface ModifyContactEmailsButtonProps {
  contactEmails: string [],
  mutate: KeyedMutator<any>,
}

export const ModifyContactEmailsButton = (props: ModifyContactEmailsButtonProps) => {
  
  const { contactEmails: initialContactEmails, mutate } = props;
  const [ contactEmails, setContactEmails ] = useState<string[]>(initialContactEmails);
  const [ open, setOpen ] = useState(false);
  const { notifyResponse } = useNotification();
  useEffect(() => {
    setContactEmails(initialContactEmails);
  }, [ JSON.stringify(initialContactEmails), open ]);
  
  return (
    <>
      <Modal onClose={() => setOpen(false)} isOpen={open} closeIcon>
        <div className="jk-col gap stretch jk-pad-lg">
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
                  JUDGE_API_V1.SYS.EMAIL_DATA(),
                  { method: HTTPMethod.PUT, body: JSON.stringify({ contactEmails }) },
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
