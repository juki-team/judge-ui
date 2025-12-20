import { Information, InformationProps, T } from '../index';

export const FrozenInformation = (props: InformationProps) => {
  return (
    <Information {...props}>
      <T className="tt-se fw-bd">frozen period</T>
      <T className="tt-se">
        in this period the scoreboard is not updated but the contestant will still be able to know the verdict of
        his submissions
      </T>
    </Information>
  );
};

export const QuietInformation = (props: InformationProps) => {
  return (
    <Information {...props}>
      <T className="tt-se fw-bd">quiet period</T>
      <T className="tt-se">
        in this period the scoreboard is not updated and the contestant will not be able to know the verdict of his
        submissions
      </T>
    </Information>
  );
};

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

export const GuestInformation = (props: InformationProps) => {
  return (
    <Information {...props}>
      <GuestInformationContent />
    </Information>
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

export const SpectatorInformation = (props: InformationProps) => {
  return (
    <Information {...props}>
      <SpectatorInformationContent />
    </Information>
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

export const ContestantInformation = (props: InformationProps) => {
  return (
    <Information {...props}>
      <ContestantInformationContent />
    </Information>
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

export const JudgeInformation = (props: InformationProps) => {
  return (
    <Information {...props}>
      <JudgeInformationContent />
    </Information>
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

export const AdminInformation = (props: InformationProps) => {
  return (
    <Information {...props}>
      <AdminInformationContent />
    </Information>
  );
};
