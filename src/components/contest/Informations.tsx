import { InformationPopoverProps } from 'types';
import { InformationPopover, T } from '../index';

const CAN_SEE_CONTEST = 'can see the problems, the scoreboard, the submission list, and the clarifications';
const CAN_PARTICIPANT = 'can submit solutions to the problems and send clarifications if the contest allows it';
const CAN_JUDGE = 'can view source codes at any stage of the contest and can rejudge submissions if necessary';
const CAN_REGISTER = 'can register for the contest';
const CAN_EDIT = 'can edit any parameter of the contest';

export const GuestInformationContent = () => (
  <>
    <T className="tt-se">
      a guest:
    </T>
    <ul>
      <li>
        <T className="tt-se">
          {CAN_SEE_CONTEST}
        </T>
      </li>
      <li>
        <T className="tt-se">
          {CAN_REGISTER}
        </T>
      </li>
    </ul>
  </>
);

export const GuestInformation = (props: InformationPopoverProps) => {
  return (
    <InformationPopover {...props}>
      <GuestInformationContent />
    </InformationPopover>
  );
};

export const SpectatorInformationContent = () => (
  <>
    <T className="tt-se">
      a viewer:
    </T>
    <ul>
      <li>
        <T className="tt-se">
          {CAN_SEE_CONTEST}
        </T>
      </li>
    </ul>
  </>
);

export const SpectatorInformation = (props: InformationPopoverProps) => {
  return (
    <InformationPopover {...props}>
      <SpectatorInformationContent />
    </InformationPopover>
  );
};

export const ContestantInformationContent = () => (
  <>
    <T className="tt-se">
      a contestant:
    </T>
    <ul>
      <li>
        <T className="tt-se">
          {CAN_SEE_CONTEST}
        </T>
      </li>
      <li>
        <T className="tt-se">
          {CAN_PARTICIPANT}
        </T>
      </li>
    </ul>
  </>
);

export const ContestantInformation = (props: InformationPopoverProps) => {
  return (
    <InformationPopover {...props}>
      <ContestantInformationContent />
    </InformationPopover>
  );
};

export const JudgeInformationContent = () => (
  <>
    <T className="tt-se">
      a judge:
    </T>
    <ul>
      <li>
        <T className="tt-se">
          {CAN_SEE_CONTEST}
        </T>
      </li>
      <li>
        <T className="tt-se">
          {CAN_PARTICIPANT}
        </T>
      </li>
      <li>
        <T className="tt-se">
          {CAN_JUDGE}
        </T>
      </li>
    </ul>
  </>
);

export const JudgeInformation = (props: InformationPopoverProps) => {
  return (
    <InformationPopover {...props}>
      <JudgeInformationContent />
    </InformationPopover>
  );
};

export const AdminInformationContent = () => (
  <>
    <T className="tt-se">
      an administrator:
    </T>
    <ul>
      <li>
        <T className="tt-se">
          {CAN_SEE_CONTEST}
        </T>
      </li>
      <li>
        <T className="tt-se">
          {CAN_PARTICIPANT}
        </T>
      </li>
      <li>
        <T className="tt-se">
          {CAN_JUDGE}
        </T>
      </li>
      <li>
        <T className="tt-se">
          {CAN_EDIT}
        </T>
      </li>
    </ul>
  </>
);

export const AdminInformation = (props: InformationPopoverProps) => {
  return (
    <InformationPopover {...props}>
      <AdminInformationContent />
    </InformationPopover>
  );
};
