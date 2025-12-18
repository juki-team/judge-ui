'use client';

import { consoleInfo, isClientTrackWebSocketResponseEventDTO } from 'helpers';
import { useSubscribe, useUserStore, useWebsocketStore } from 'hooks';
import {
  ClientTrackScreenshotWebSocketEventDTO,
  SubscribeClientTrackWebSocketEventDTO,
  WebSocketMessageEvent,
  WebSocketSubscriptionEvent,
} from 'types';

const toPng = async () => {
  if (typeof window === 'undefined') {
    return;
  }
  const cmThemeNode = document.querySelector('#juki-app');
  if (!cmThemeNode) {
    return;
  }
  try {
    const { default: domToImage } = await import('dom-to-image-more');
    
    // const targetWidth = 1024;
    // const scale = targetWidth / cmThemeNode.clientWidth;
    // const targetHeight = cmThemeNode.clientHeight * scale;
    return await domToImage.toJpeg(cmThemeNode, {
      quality: 0.2,
      // width: targetWidth,
      // height: targetHeight,
      // style: {
      //   transform: `scale(${scale})`,
      //   transformOrigin: 'top left',
      // },
    });
  } catch (error) {
    console.error('Error al capturar imagen:', error);
  }
};

export const ScreenshotFrames = () => {
  
  const clientId = useUserStore(store => store.clientId);
  const channelPublishMessages = useWebsocketStore(store => store.channelPublishMessages);
  
  const event: Omit<SubscribeClientTrackWebSocketEventDTO, 'clientId'> = {
    event: WebSocketSubscriptionEvent.SUBSCRIBE_CLIENT_TRACK,
  };
  
  useSubscribe(event, async (data) => {
    if (isClientTrackWebSocketResponseEventDTO(data)) {
      if (data.screenshot) {
        consoleInfo('screenshot start!');
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
