import { AuthorizedRequestType } from '@juki-team/base-ui';
import { Button, ButtonLoader, ImageLoaderCropper, Modal, T } from 'components';
import { toBlob } from 'helpers';
import { useNotification } from 'hooks';
import { useState } from 'react';
import { CropImageType, SetLoaderStatusOnClickType, Status } from 'types';
import { JUDGE_API_V1 } from '../../config/constants';
import { authorizedRequest, cleanRequest } from '../../helpers';
import { ContentResponseType, HTTPMethod } from '../../types';

export const ImageProfileModal = ({ onClose }: { onClose: () => void }) => {
  
  const { addSuccessNotification, addErrorNotification } = useNotification();
  const [cropImage, setCropImage] = useState<CropImageType>();
  const handleSaveImage = async (setLoader: SetLoaderStatusOnClickType) => {
    if (cropImage?.previewCanvasRef.current) {
      const blob = (await toBlob(cropImage.previewCanvasRef.current));
      console.log({ cropImage, blob });
      // return;
      if (blob) {
        setLoader?.(Status.LOADING);
        const formData = new FormData();
        formData.append('file', blob);
        const authorizedRequest = async (url: string, options?: AuthorizedRequestType): Promise<any> => {
          const { method, body, signal } = options || {};
          const requestHeaders: HeadersInit = new Headers();
          requestHeaders.set('Accept', 'application/json');
          // requestHeaders.set('Content-Type', 'application/json');
          return await fetch(url, {
            method: method ? method : HTTPMethod.GET,
            headers: requestHeaders,
            credentials: 'include',
            ...(body ? { body } : {}),
            ...(signal ? { signal } : {}),
          })
            .then((response: any) => {
              return response.text();
            })
            .catch((error) => {
              return '';
              // consoleWarn(error);
              if (signal?.aborted) {
                // return JSON.stringify({
                //   success: false,
                //   message: ERROR[ErrorCode.ERR9997].message,
                //   errors: [{ code: ErrorCode.ERR9997, detail: `[${method}] ${url} \n ${body}` }],
                // } as ErrorResponseType);
              }
              // return JSON.stringify({
              //   success: false,
              //   message: ERROR[ErrorCode.ERR9998].message,
              //   errors: [{ code: ErrorCode.ERR9998, detail: `FETCH CATCH ERROR : ` + JSON.stringify({ method, url, body, error }) }],
              // } as ErrorResponseType);
            });
        };
        const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.ACCOUNT.UPDATE_IMAGE(), {
          method: HTTPMethod.PUT,
          body: formData
        }));
        if (response.success) {
          // addSuccessNotification(<T>{message}</T>);
          setLoader?.(Status.SUCCESS);
        } else {
          // addErrorNotification(<T>{message}</T>);
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