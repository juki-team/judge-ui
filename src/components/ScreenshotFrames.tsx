'use client';

import { usePageStore } from '@juki-team/base-ui';
import domToImage from 'dom-to-image-more';
import { isClientTrackWebSocketResponseEventDTO } from 'helpers';
import { useSubscribe, useUserStore, useWebsocketStore } from 'hooks';
import {
  ClientTrackScreenshotWebSocketEventDTO,
  SubscribeClientTrackWebSocketEventDTO,
  WebSocketMessageEvent,
  WebSocketSubscriptionEvent,
} from 'types';

const toPng = async () => {
  const cmThemeNode = document.querySelector('#juki-app');
  if (!cmThemeNode) {
    return;
  }
  try {
    const targetWidth = 320;
    const scale = targetWidth / cmThemeNode.clientWidth;
    const targetHeight = cmThemeNode.clientHeight * scale;
    return await domToImage.toJpeg(cmThemeNode, {
      quality: 0.3,
      width: targetWidth,
      height: targetHeight,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      },
    });
  } catch (error) {
    console.error('Error al capturar imagen:', error);
  }
};

export const ScreenshotFrames = () => {
  
  const clientId = useUserStore(store => store.clientId);
  const channelPublishMessages = useWebsocketStore(store => store.channelPublishMessages);
  
  const storePageStore = usePageStore();
  console.log({ storePageStore }, storePageStore.isFocus, storePageStore.isVisible, storePageStore.isOnline);
  const event: Omit<SubscribeClientTrackWebSocketEventDTO, 'clientId'> = {
    event: WebSocketSubscriptionEvent.SUBSCRIBE_CLIENT_TRACK,
  };
  useSubscribe(event, async (data) => {
    console.log('>>>> data', { data });
    if (isClientTrackWebSocketResponseEventDTO(data)) {
      console.log('if', { data });
      if (data.screenshot) {
        const screenshot = await toPng();
        const event: ClientTrackScreenshotWebSocketEventDTO = {
          clientId,
          event: WebSocketMessageEvent.CLIENT_TRACK_SCREENSHOT,
          screenshot,
        };
        void channelPublishMessages?.publish('', event);
      }
    }
  });
  
  return null;
};
