import { Button, ButtonLoader, ImageLoaderCropper, Modal, T } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { toBlob } from 'helpers';
import { useJukiUser, useSWR } from 'hooks';
import { useState } from 'react';
import { CropImageType, Status } from 'types';

export const ImageProfileModal = ({ onClose, nickname }: { onClose: () => void, nickname: string }) => {
  
  const { updateUserProfileImage, mutatePing } = useJukiUser();
  const { mutate } = useSWR();
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
            onClick={async (setLoader) => {
              if (cropImage?.previewCanvasRef.current) {
                const blob = (await toBlob(cropImage.previewCanvasRef.current));
                if (blob) {
                  const formData = new FormData();
                  formData.append('image', blob);
                  await updateUserProfileImage({
                    params: { nickname },
                    body: formData,
                    onSuccess: async () => {
                      setLoader?.(Status.LOADING);
                      await mutatePing();
                      await mutate(JUDGE_API_V1.USER.PROFILE(nickname as string));
                      setLoader?.(Status.SUCCESS);
                      onClose();
                    },
                  });
                }
              }
            }}
            disabled={!cropImage || !cropImage?.previewCanvasRef.current}
          >
            <T>save image</T>
          </ButtonLoader>
        </div>
      </div>
    </Modal>
  );
};
