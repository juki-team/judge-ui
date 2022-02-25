import React, { MutableRefObject, useState } from 'react';
import { ExclamationIcon, Modal, Popover, T } from '../../../';
import { MdMathEditor } from '../index';
import { SAMPLE_MD_CONTENT } from './contants';

export const InformationButton = ({ isOpenRef }: { isOpenRef: MutableRefObject<boolean> }) => {
  
  const [open, setOpen] = useState(false);
  isOpenRef.current = open;
  
  return (
    <>
      <Popover
        content={<div className="text-nowrap"><T>information</T></div>}
        showPopperArrow
        triggerOn="hover"
        placement="bottom"
      >
        <div>
          <ExclamationIcon circle rotate={180} onClick={() => setOpen(true)} />
        </div>
      </Popover>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        className="modal-info-markdown"
      >
        <MdMathEditor source={SAMPLE_MD_CONTENT} />
      </Modal>
    </>
  );
};