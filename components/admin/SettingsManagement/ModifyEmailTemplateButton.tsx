import { Button, ButtonLoader, CodeEditor, Modal, T } from 'components/index';
import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useNotification } from 'hooks';
import React, { useEffect, useState } from 'react';
import { ContentResponseType, HTTPMethod, ProgrammingLanguage, Status } from 'types';

export const ModifyEmailTemplateButton = ({ emailTemplate: initialEmailTemplate, mutate }) => {
  const [emailTemplate, setEmailTemplate] = useState(initialEmailTemplate);
  const [open, setOpen] = useState(false);
  const { notifyResponse } = useNotification();
  useEffect(() => {
    setEmailTemplate(initialEmailTemplate);
  }, [initialEmailTemplate, open]);
  
  return (
    <>
      <Modal onClose={() => setOpen(false)} isOpen={open} closeIcon>
        <div className="jk-col gap stretch jk-pad-lg">
          <h2><T>modify email template</T></h2>
          <div style={{ height: '400px', width: '100%' }} className="jk-row nowrap br-g6 jk-br-ie">
            <div style={{ height: '100%', width: '50%' }}>
              <CodeEditor
                sourceCode={emailTemplate}
                language={ProgrammingLanguage.HTML}
                onChange={({ sourceCode }) => setEmailTemplate(sourceCode)}
                tabSize={2}
              />
            </div>
            <iframe style={{ width: '50%', height: '100%' }} srcDoc={emailTemplate}></iframe>
          </div>
          <div className="jk-row gap right">
            <Button onClick={() => setOpen(false)} type="text"><T>cancel</T></Button>
            <ButtonLoader
              onClick={async (setLoaderStatus) => {
                setLoaderStatus(Status.LOADING);
                const response = cleanRequest<ContentResponseType<string>>(await authorizedRequest(
                  JUDGE_API_V1.SYS.EMAIL_DATA(),
                  { method: HTTPMethod.PUT, body: JSON.stringify({ emailTemplate }) },
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
      <Button size="small" onClick={() => setOpen(true)}><T>modify email template</T></Button>
    </>
  );
};
