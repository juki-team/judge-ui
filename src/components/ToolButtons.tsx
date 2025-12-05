'use client';

import { usePageStore } from '@juki-team/base-ui';
import { PresentationToolButtons } from 'components';

export const ToolButtons = () => {
  const isSmallScreen = usePageStore(store => store.viewPort.isSmallScreen);
  if (!isSmallScreen) {
    return <PresentationToolButtons />;
  }
  return null;
};
