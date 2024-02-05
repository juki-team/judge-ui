import { Button, ButtonLoader, ImageLoaderCropper, Modal, T } from 'components';
import { jukiSettings } from 'config';
import { useNotification } from 'hooks';
import { useState } from 'react';
import { CompanyLogoType, ContentResponseType, CropImageType, ModalProps, Status } from 'types';
import { authorizedRequest, cleanRequest, toBlob } from '../../../helpers';

interface IconModalProps extends ModalProps {
  onClose: () => void,
  companyKey: string,
  name: string,
  logoType: CompanyLogoType | '',
  mutate: () => Promise<void>,
}

const sizes: { [key in (CompanyLogoType | '')]: { height: number, width: number } } = {
  ['']: {
    height: 1,
    width: 1,
  },
  [CompanyLogoType.HORIZONTAL_WHITE]: {
    height: 60,
    width: 120,
  },
  [CompanyLogoType.HORIZONTAL_COLOR]: {
    height: 60,
    width: 120,
  },
  [CompanyLogoType.VERTICAL_WHITE]: {
    height: 120,
    width: 60,
  },
  [CompanyLogoType.VERTICAL_COLOR]: {
    height: 120,
    width: 60,
  },
}

export const IconModal = ({ name: initialName, mutate, companyKey, logoType, ...modalProps }: IconModalProps) => {
  
  const [ cropImage, setCropImage ] = useState<CropImageType>();
  const { notifyResponse } = useNotification();
  
  return (
    <Modal {...modalProps}>
      <div className="jk-col gap stretch jk-pad-md">
        <h3><T>set icon</T></h3>
        <div>
          <T className="tt-se fw-bd">minimum image size</T>: {`${sizes[logoType].height} ${sizes[logoType].width}`}
        </div>
        <ImageLoaderCropper
          withScale
          withRotate
          aspect={sizes[logoType].width / sizes[logoType].height}
          onCropChange={setCropImage}
        />
        <div className="jk-row gap right">
          <Button type="light" onClick={modalProps.onClose}><T>cancel</T></Button>
          <ButtonLoader
            onClick={async (setLoaderStatus) => {
              if (cropImage?.previewCanvasRef.current) {
                const blob = (await toBlob(cropImage.previewCanvasRef.current));
                if (blob) {
                  const formData = new FormData();
                  formData.append('image', blob);
                  formData.append('logoType', logoType);
                  setLoaderStatus(Status.LOADING);
                  const { url, ...options } = jukiSettings.API.company.updateImage({
                    params: { companyKey },
                    body: formData,
                  })
                  const response = cleanRequest<ContentResponseType<{}>>(
                    await authorizedRequest(url, options),
                  );
                  await mutate();
                  if (notifyResponse(response, setLoaderStatus)) {
                    modalProps.onClose();
                  }
                }
              }
            }}
            disabled={!cropImage || !cropImage?.previewCanvasRef.current}
          >
            <T>save</T>
          </ButtonLoader>
        </div>
      </div>
    </Modal>
  );
}
