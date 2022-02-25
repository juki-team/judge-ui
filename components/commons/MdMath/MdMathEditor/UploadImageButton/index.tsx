import React, { MutableRefObject, useState } from 'react';
import { CloudUploadIcon, ImageUploaderModal, Popover, T } from '../../../';

export const UploadImageButton = ({ isOpenRef }: { isOpenRef: MutableRefObject<boolean> }) => {
  const [open, setOpen] = useState(false);
  isOpenRef.current = open;
  
  return (
    <>
      <Popover
        content={<div className="text-nowrap"><T>upload image</T></div>}
        showPopperArrow
        triggerOn="hover"
        placement="bottom"
      >
        <div>
          <CloudUploadIcon onClick={() => setOpen(true)} />
        </div>
      </Popover>
      <ImageUploaderModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
};
