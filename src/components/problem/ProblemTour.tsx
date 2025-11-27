'use client';

import { TourProvider } from '@reactour/tour';
import { T } from 'components';
import { PropsWithChildren } from 'react';

const ContentStatistics = () => {
  return (
    <div>
      <T className="tt-se fw-bd">¡new!</T>&nbsp;<T className="tt-se">explore the statistics of the problem</T>
    </div>
  );
};

const steps = [
  {
    selector: '.jk-tabs-inline-tab-statistics',
    content: ContentStatistics,
  },
];

export const ProblemTour = ({ children }: PropsWithChildren) => {
  return (
    <TourProvider
      steps={steps}
      onClickHighlighted={(_, { setIsOpen }) => {
        setIsOpen(false);
      }}
      highlightedMaskClassName="testing-abc"
      maskClassName="jk-tour-mask"
      disableInteraction
      showBadge={false}
      showNavigation={false}
      showCloseButton={false}
    >
      {children}
    </TourProvider>
  );
};
