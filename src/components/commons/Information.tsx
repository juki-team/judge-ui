'use client';

import { ExclamationIcon, Popover } from 'components';
import { PropsWithChildren, ReactNode } from 'react';

export interface InformationProps {
  filledCircle?: boolean,
  icon?: ReactNode,
}

export const Information = ({ children, filledCircle, icon }: PropsWithChildren<InformationProps>) => {
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
        {icon ?? (filledCircle
          ? <ExclamationIcon rotate={180} filledCircle size="small" />
          : <ExclamationIcon rotate={180} circle size="small" />)}
      </div>
    </Popover>
  );
};
