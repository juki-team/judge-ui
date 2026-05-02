'use client';

import { PresentationToolButtons, usePageStore } from '@juki-team/base-ui';

export const ToolButtons = () => {
  const isSmallScreen = usePageStore(store => store.viewPort.isSmallScreen);
  if (!isSmallScreen) {
    return <PresentationToolButtons />;
  }
  return null;
};
