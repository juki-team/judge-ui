import { Information, InformationProps, T } from '../';

export const TotalProblemInformation = (props: InformationProps) => {
  return (
    <Information {...props}>
      <T className="tt-se">
        total
      </T>
    </Information>
  );
};

export const SubtaskProblemInformation = (props: InformationProps) => {
  return (
    <Information {...props}>
      <T className="tt-se">
        subtask
      </T>
    </Information>
  );
};

export const PartialProblemInformation = (props: InformationProps) => {
  return (
    <Information {...props}>
      <T className="tt-se">
        partial
      </T>
    </Information>
  );
};
