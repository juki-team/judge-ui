import { PlacementType } from 'types';
import { ExclamationIcon, Popover, T } from '../index';

export const ContestTypeInformation = () => {
  return (
    <Popover
      content={
        <div style={{ width: '200px' }}>
          <T className="text-sentence-case">
            if the contest is public, it will appear in the list of contests in view of all users, if the contest is private, it will
            only appear for the contest members
          </T>
        </div>
      }
      triggerOn={['hover', 'click']}
      placement="top"
    >
      <div className="jk-row color-primary"><ExclamationIcon rotate={180} filledCircle size="small" /></div>
    </Popover>
  );
};

export const FrozenInformation = () => {
  return (
    <Popover
      content={
        <div style={{ width: '200px' }}>
          <T className="text-sentence-case">
            in this period the scoreboard is not updated but the contestant will still be able to know the verdict of his submissions
          </T>
        </div>
      }
      triggerOn={['hover', 'click']}
      placement="top"
    >
      <div className="jk-row color-primary"><ExclamationIcon rotate={180} filledCircle size="small" /></div>
    </Popover>
  );
};

export const QuietInformation = () => {
  return (
    <Popover
      content={
        <div style={{ width: '200px' }}>
          <T className="text-sentence-case">
            in this period the scoreboard is not updated and the contestant will not be able to know the verdict of his submissions
          </T>
        </div>
      }
      triggerOn={['hover', 'click']}
      placement="top"
    >
      <div className="jk-row color-primary"><ExclamationIcon rotate={180} filledCircle size="small" /></div>
    </Popover>
  );
};

export const SpectatorInformation = ({ filledCircle, placement = 'bottom' }: { filledCircle?: boolean, placement?: PlacementType }) => {
  return (
    <Popover
      content={
        <div style={{ width: '200px' }}>
          <T className="text-sentence-case">
            the spectator can only see the problems, the scoreboard, the submissions and the clarifications
          </T>
        </div>
      }
      triggerOn={['hover', 'click']}
      placement="top"
    >
      <div className="jk-row">
        {filledCircle
          ? <ExclamationIcon rotate={180} filledCircle size="small" />
          : <ExclamationIcon rotate={180} circle size="small" />}
      </div>
    </Popover>
  );
};

export const JudgeInformation = ({ filledCircle, placement = 'bottom' }: { filledCircle?: boolean, placement?: PlacementType }) => {
  return (
    <Popover
      content={
        <div style={{ width: '200px' }}>
          <T className="text-sentence-case">
            the judge can judge the submissions if necessary and can see the problems, submissions and source codes at any stage of the
            contest
          </T>
          <T className="text-sentence-case">
            the person who creates the contest is judge by default
          </T>
        </div>
      }
      triggerOn={['hover', 'click']}
      placement="top"
    >
      <div className="jk-row">
        {filledCircle
          ? <ExclamationIcon rotate={180} filledCircle size="small" />
          : <ExclamationIcon rotate={180} circle size="small" />}
      </div>
    </Popover>
  );
};

export const AdminInformation = ({ filledCircle, placement = 'bottom' }: { filledCircle?: boolean, placement?: PlacementType }) => {
  return (
    <Popover
      content={
        <div style={{ width: '200px' }}>
          <T className="text-sentence-case">
            the administrator can change the parameters of the contest and see everything related to the contest
          </T>
          <T className="text-sentence-case">
            the person who creates the contest is administrator by default
          </T>
        </div>
      }
      triggerOn={['hover', 'click']}
      placement={placement}
    >
      <div className="jk-row">
        {filledCircle
          ? <ExclamationIcon rotate={180} filledCircle size="small" />
          : <ExclamationIcon rotate={180} circle size="small" />}
      </div>
    </Popover>
  );
};
