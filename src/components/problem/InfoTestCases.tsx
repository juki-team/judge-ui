import { InfoIIcon, Popover, SpinIcon, T } from 'components';
import { jukiApiManager } from 'config';
import { useFetcher } from 'hooks';
import { ContentResponseType, ProblemDataResponseDTO, ProblemTestCasesResponseDTO } from 'types';

export const InfoTestCases = ({ problem }: { problem: ProblemDataResponseDTO }) => {
  
  const {
    data,
    isLoading,
  } = useFetcher<ContentResponseType<ProblemTestCasesResponseDTO>>(jukiApiManager.API_V1.problem.getTestCases({ params: { key: problem.key } }).url);
  
  const testCases = data?.success ? data.content : [];
  
  let validTestCases = 0;
  for (const testCase of testCases) {
    if (testCase.testCaseKey && testCase.inputFileLastModified && testCase.outputFileLastModified) {
      validTestCases++;
    }
  }
  
  return (
    <Popover
      popoverClassName="bc-we jk-br-ie elevation-1"
      content={
        <div className="jk-pg-xsm">
          <T># test cases</T>: {validTestCases}
        </div>
      }
      placement="bottom"
    >
      <div className="jk-row link">
        {isLoading
          ? <SpinIcon />
          : <InfoIIcon circle />}
      </div>
    </Popover>
  );
};
