import { Button, ButtonLoader, ImageLoaderCropper, Modal, T } from 'components';
import { toBlob } from 'helpers';
import { useNotification } from 'hooks';
import { useState } from 'react';
import { CropImageType, SetLoaderStatusOnClickType, Status } from 'types';

export const ImageProfileModal = ({ onClose }: { onClose: () => void }) => {
  
  const { addSuccessNotification, addErrorNotification } = useNotification();
  const [cropImage, setCropImage] = useState<CropImageType>();
  const handleSaveImage = async (setLoader: SetLoaderStatusOnClickType) => {
    if (cropImage?.previewCanvasRef.current) {
      const blob = await toBlob(cropImage.previewCanvasRef.current);
      if (blob) {
        setLoader?.(Status.LOADING);
        const { status, message, content } = {} as any;
        if (status === Status.SUCCESS) {
          addSuccessNotification(<T>{message}</T>);
          setLoader?.(Status.SUCCESS);
        } else {
          addErrorNotification(<T>{message}</T>);
          setLoader?.(Status.ERROR);
        }
      }
    }
  };
  
  return (
    <Modal onClose={onClose} isOpen={true}>
      <div className="jk-pad-lg jk-col gap">
        <ImageLoaderCropper
          aspect={1}
          onCropChange={setCropImage}
          rotate={0}
          scale={1}
          withRotate
          withScale
          circularCrop
        />
        <div className="jk-row right gap extend">
          <Button type="text" onClick={onClose}><T>cancel</T></Button>
          <ButtonLoader onClick={handleSaveImage} disabled={!cropImage || !cropImage?.previewCanvasRef.current}>
            <T>save image</T>
          </ButtonLoader>
        </div>
      </div>
    </Modal>
  );
};