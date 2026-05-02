import { InfoIIcon, SpinIcon } from '@juki-team/base-ui/server-components';
import { Popover, T, useFetcher } from '@juki-team/base-ui';
import { jukiApiManager } from '@juki-team/base-ui/settings';
import { type IconProps } from '@juki-team/base-ui/types';
import { type ProblemDataResponseDTO, type ProblemTestCasesResponseDTO } from '@juki-team/commons/dto';
import { type ContentResponse } from '@juki-team/commons/types';

export const InfoTestCases = ({ problem, size }: { problem: ProblemDataResponseDTO, size?: IconProps['size'] }) => {

  const {
    data,
    isLoading,
  } = useFetcher<ContentResponse<ProblemTestCasesResponseDTO>>(jukiApiManager.apiV2.problem.getTestCases({ params: { key: problem.key } }).url);

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
          ? <SpinIcon size={size} />
          : <InfoIIcon circle size={size} />}
      </div>
    </Popover>
  );
};
