'use client';

import { PresentationToolButtons } from 'components';
import { usePageStore } from 'hooks';

export const ToolButtons = () => {
  const isSmallScreen = usePageStore(store => store.viewPort.isSmallScreen);
  if (!isSmallScreen) {
    return <PresentationToolButtons />;
  }
  return null;
};
