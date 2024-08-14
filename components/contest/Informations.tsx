import { Information, InformationProps, T } from '../';

export const FrozenInformation = (props: InformationProps) => {
  return (
    <Information {...props}>
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
      <T className="tt-se">
        in this period the scoreboard is not updated and the contestant will not be able to know the verdict of his
        submissions
      </T>
    </Information>
  );
};

export const CAN_SEE_CONTEST = 'can see the problems, the scoreboard, the submission list and the clarifications';

export const GuestInformationContent = () => (
  <>
    <T className="tt-se">
      {`a guest ${CAN_SEE_CONTEST}.`}
    </T>
    <T className="tt-se">
      a guest can register for the contest.
    </T>
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
  <T className="tt-se">
    {`a spectator ${CAN_SEE_CONTEST}.`}
  </T>
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
      {`a contestant ${CAN_SEE_CONTEST}.`}
    </T>
    <T className="tt-se">
      a contestant can submit solutions on the problems.
    </T>
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
      {`a judge ${CAN_SEE_CONTEST}.`}
    </T>
    <T className="tt-se">
      a judge can view source codes at any stage of the contest.
    </T>
    <T className="tt-se">
      a judge can rejudge submissions if necessary.
    </T>
    <T className="tt-se">
      the person who creates the contest is judge by default.
    </T>
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
      a administrator can change the parameters of the contest and see everything related to the contest.
    </T>
    <T className="tt-se">
      the person who creates the contest is administrator by default.
    </T>
  </>
);

export const AdminInformation = (props: InformationProps) => {
  return (
    <Information {...props}>
      <AdminInformationContent />
    </Information>
  );
};
