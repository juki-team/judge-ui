import { diff } from 'deep-object-diff';
import dynamic from 'next/dynamic';
import React, { cloneElement, useRef, useState } from 'react';
import { AlertModal, T } from '../index';

const ReactJson = dynamic(import('react-json-view'), { ssr: false });

export const CheckUnsavedChanges = ({ children, onSafeClick, value }) => {
  
  const originalProblemRef = useRef(value);
  const [modal, setModal] = useState(null);
  
  const handleOnClick = () => {
    if (JSON.stringify(originalProblemRef.current) === JSON.stringify(value)) {
      onSafeClick();
    } else {
      setModal(
        <AlertModal
          title={<h4><T>attention</T></h4>}
          accept={{ onClick: () => setModal(null), label: <T>close</T> }}
          content={
            <div>
              <T className="tt-se">there are unsaved changes</T>:
              <div className="alert-modal-json-viewer jk-border-radius-inline">
                <ReactJson
                  src={diff(originalProblemRef.current, value)}
                  enableClipboard={false}
                  collapsed={true}
                  name={false}
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