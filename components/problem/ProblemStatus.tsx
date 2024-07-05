import { CheckIcon, PendingActionsIcon, T, Tooltip } from 'components';
import { IconProps } from 'types';

export const ProblemStatus = ({ solved, tried, size }: {
  solved: boolean,
  tried: boolean,
  size?: IconProps['size']
}) => {
  return solved ? (
    <Tooltip
      content={<T className="tt-se ws-np">you solved it</T>}
      placement="top"
      withPortal
    >
      <div className="jk-row"><CheckIcon size={size} filledCircle className="cr-ss" /></div>
    </Tooltip>
  ) : tried && (
    <Tooltip
      content={<T className="tt-se ws-np">you tried it</T>}
      placement="top"
      withPortal
    >
      <div className="jk-row"><PendingActionsIcon size={size} filledCircle className="cr-wg" /></div>
    </Tooltip>
  );
};
