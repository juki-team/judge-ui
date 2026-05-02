'use client';

import { ProblemView } from '@juki-team/base-ui';
import { type ProblemDataResponseDTO } from '@juki-team/commons/dto';

export default function ProblemViewPage({ problem }: { problem: ProblemDataResponseDTO }) {
  
  return (
    <ProblemView
      problem={problem}
      infoPlacement="none"
      codeEditorStoreKey={problem.key}
      forPrinting
    />
  );
}
