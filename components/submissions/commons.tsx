import { ButtonLoader, ReloadIcon, T } from 'components';
import { jukiSettings } from 'config';
import { useMatchMutate, useRejudgeServices } from 'hooks';

export const RejudgeButton = ({ submissionId }: { submissionId: string }) => {
  
  const { rejudgeSubmission } = useRejudgeServices();
  
  const { matchMutate } = useMatchMutate();
  
  return (
    <ButtonLoader
      onClick={async (...props) => {
        await rejudgeSubmission(submissionId)(...props);
        // TODO Fix the next
        await matchMutate(new RegExp(`^${jukiSettings.SERVICE_API_URL}/submissions`, 'g'));
      }}
      size="tiny"
      icon={<ReloadIcon />}
    >
      <T>rejudge</T>
    </ButtonLoader>
  );
};
