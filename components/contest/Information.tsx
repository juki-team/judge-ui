import { ExclamationIcon, Popover, T } from '../index';

export const FrozenInformation = () => {
  return (
    <Popover
      content={
        <div style={{ width: '200px' }}>
          <T className="tt-se">
            in this period the scoreboard is not updated but the contestant will still be able to know the verdict of his
            submissions
          </T>
        </div>
      }
      triggerOn={['hover', 'click']}
      placement="top"
    >
      <div className="jk-row cr-py"><ExclamationIcon rotate={180} filledCircle size="small" /></div>
    </Popover>
  );
};

export const QuietInformation = () => {
  return (
    <Popover
      content={
        <div style={{ width: '200px' }}>
          <T className="tt-se">
            in this period the scoreboard is not updated and the contestant will not be able to know the verdict of his
            submissions
          </T>
        </div>
      }
      triggerOn={['hover', 'click']}
      placement="top"
    >
      <div className="jk-row cr-py"><ExclamationIcon rotate={180} filledCircle size="small" /></div>
    </Popover>
  );
};

export const SpectatorInformation = ({ filledCircle }: { filledCircle?: boolean, }) => {
  return (
    <Popover
      content={
        <div style={{ width: '200px' }}>
          <T className="tt-se">
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

export const JudgeInformation = ({ filledCircle }: { filledCircle?: boolean, }) => {
  return (
    <Popover
      content={
        <div style={{ width: '200px' }}>
          <T className="tt-se">
            the judge can judge the submissions if necessary and can see the problems, submissions and source codes at any stage
            of the
            contest
          </T>
          <T className="tt-se">
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

export const AdminInformation = ({ filledCircle }: { filledCircle?: boolean }) => {
  return (
    <Popover
      content={
        <div style={{ width: '200px' }}>
          <T className="tt-se">
            the administrator can change the parameters of the contest and see everything related to the contest
          </T>
          <T className="tt-se">
            the person who creates the contest is administrator by default
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
