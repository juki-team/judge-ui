import { AlertModal, CodeEditor, T } from 'components';
import { diff } from 'deep-object-diff';
import React, { cloneElement, useRef, useState } from 'react';
import { ProgrammingLanguage } from 'types';

export const CheckUnsavedChanges = ({ children, onSafeClick, value }) => {
  
  const originalProblemRef = useRef(value);
  const [modal, setModal] = useState(null);
  const handleOnClick = () => {
    if (JSON.stringify(originalProblemRef.current) === JSON.stringify(value)) {
      onSafeClick();
    } else {
      const text = JSON.stringify(diff(originalProblemRef.current, value), null, 2);
      const height = text.split('\n').length;
      setModal(
        <AlertModal
          title={<h4><T>attention</T></h4>}
          accept={{ onClick: () => setModal(null), label: <T>close</T> }}
          content={
            <div>
              <T className="tt-se">there are unsaved changes</T>:
              <div
                className="alert-modal-json-viewer jk-border-radius-inline"
                style={{ height: height * 24 + 'px' }}
              >
                <CodeEditor
                  sourceCode={text}
                  language={ProgrammingLanguage.JSON}
                  readOnly
                />
              </div>
            </div>
          }
          decline={{ onClick: onSafeClick, label: <T>continue without saving</T> }}
          onCancel={() => setModal(null)}
        />,
      );
    }
  };
  
  return (
    <>
      {cloneElement(children, { onClick: handleOnClick })}
      {modal}
    </>
  );
};
