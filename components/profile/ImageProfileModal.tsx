import { Button, ButtonLoader, ImageLoaderCropper, Modal, T } from 'components';
import { useUserDispatch } from 'hooks';
import { useState } from 'react';
import { CropImageType } from 'types';

export const ImageProfileModal = ({ onClose, nickname }: { onClose: () => void, nickname: string }) => {
  
  const { updateProfileImage } = useUserDispatch();
  const [cropImage, setCropImage] = useState<CropImageType>();
  
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
          <ButtonLoader
            onClick={updateProfileImage(nickname, cropImage, onClose)}
            disabled={!cropImage || !cropImage?.previewCanvasRef.current}
          >
            <T>save image</T>
          </ButtonLoader>
        </div>
      </div>
    </Modal>
  );
};
