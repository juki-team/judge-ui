import { authorizedRequest, cleanRequest } from '@juki-team/base-ui';
import { ContentResponseType, HTTPMethod } from '@juki-team/commons';
import { AddIcon, Button, ButtonLoader, DeleteIcon, Input, Modal, T } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { notifyResponse } from 'helpers';
import { useNotification } from 'hooks';
import React, { useEffect, useState } from 'react';
import { Status } from 'types';

export const ModifyContactEmailsButton = ({ contactEmails: initialContactEmails, mutate }) => {
  const [contactEmails, setContactEmails] = useState<string[]>(initialContactEmails);
  const [open, setOpen] = useState(false);
  const { addNotification } = useNotification();
  useEffect(() => {
    setContactEmails(initialContactEmails);
  }, [JSON.stringify(initialContactEmails), open]);
  
  return (
    <>
      <Modal onClose={() => setOpen(false)} isOpen={open} closeIcon>
        <div className="jk-col gap stretch jk-pad-lg">
          <h5><T>modify contact emails</T></h5>
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
              <div className="jk-row block jk-table-inline-row">
                <div className="jk-row">{index + 1}</div>
                <div className="jk-row">
                  <Input
                    value={contactEmail}
                    onChange={(newValue) => {
                      const newContactEmails = [...contactEmails];
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
              onClick={() => setContactEmails([...contactEmails, ''])}
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
                if (notifyResponse(response, addNotification)) {
                  setLoaderStatus(Status.SUCCESS);
                  setOpen(false);
                } else {
                  setLoaderStatus(Status.ERROR);
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
