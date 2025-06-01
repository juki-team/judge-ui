'use client';

import { ExclamationIcon, Popover } from 'components';
import { PropsWithChildren } from 'react';

export interface InformationProps {
  filledCircle?: boolean,
}

export const Information = ({ children, filledCircle }: PropsWithChildren<InformationProps>) => {
  return (
    <Popover
      popoverClassName="bc-we jk-br-ie elevation-1 jk-pg-xsm"
      content={
        <div style={{ maxWidth: '200px' }}>
          {children}
        </div>
      }
    >
      <div className="jk-row">
        {filledCircle
          ? <ExclamationIcon rotate={180} filledCircle size="small" />
          : <ExclamationIcon rotate={180} circle size="small" />}
      </div>
    </Popover>
  );
};
