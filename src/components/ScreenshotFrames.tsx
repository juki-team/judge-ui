'use client';

import domToImage from 'dom-to-image-more';
import { useRouterStore, useUserStore, useWebsocketStore } from 'hooks';
import { useEffect } from 'react';
import { UserTrackScreenshotWebSocketEventDTO, WebSocketMessageEvent } from 'types';

const toPng = async () => {
  const cmThemeNode = document.querySelector('#juki-app');
  if (!cmThemeNode) {
    return;
  }
  try {
    const scale = 0.8;
    return await domToImage.toJpeg(cmThemeNode, {
      quality: 0.3,
      width: 320,
      height: cmThemeNode.clientHeight * scale,
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
  const origin = useRouterStore(store => store.origin);
  const pathname = useRouterStore(store => store.pathname);
  const searchParams = useRouterStore(store => store.searchParams);
  const channelPublishMessages = useWebsocketStore(store => store.channelPublishMessages);
  
  useEffect(() => {
    const cb = async () => {
      const screenshot = await toPng();
      console.log({ screenshot });
      const event: UserTrackScreenshotWebSocketEventDTO = {
        clientId,
        event: WebSocketMessageEvent.USER_TRACK_SCREENSHOT,
        href: `${origin}${pathname}?${searchParams.toString()}`,
        screenshot,
      };
      void channelPublishMessages?.publish('', event);
    };
    cb();
    const t = setInterval(cb, 2000);
    return () => {
      clearInterval(t);
    };
  }, [ channelPublishMessages, clientId, origin, pathname, searchParams ]);
  
  return null;
};
