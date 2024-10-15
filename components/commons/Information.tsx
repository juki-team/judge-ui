import { ExclamationIcon, Popover } from 'components';
import { PropsWithChildren } from 'react';

export interface InformationProps {
  filledCircle?: boolean,
}

export const Information = ({ children, filledCircle }: PropsWithChildren<InformationProps>) => {
  return (
    <Popover content={<div style={{ width: '200px' }}>{children}</div>}>
      <div className="jk-row">
        {filledCircle
          ? <ExclamationIcon rotate={180} filledCircle size="small" />
          : <ExclamationIcon rotate={180} circle size="small" />}
      </div>
    </Popover>
  );
}
