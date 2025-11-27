'use client';

import { usePageStore } from '@juki-team/base-ui';
import { PresentationToolButtons } from 'components';
import React from 'react';

export const ToolButtons = () => {
  const viewPortSize = usePageStore(store => store.viewPort.size);
  if (viewPortSize !== 'sm') {
    return <PresentationToolButtons />;
  }
  return null;
};
