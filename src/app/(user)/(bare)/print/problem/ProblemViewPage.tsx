'use client';

import { ProblemView } from 'components';
import { ProblemDataResponseDto } from 'types';

export default function ProblemViewPage({ problem }: { problem: ProblemDataResponseDto }) {
  
  return (
    <ProblemView
      problem={problem}
      infoPlacement="none"
      codeEditorStoreKey={problem.key}
      forPrinting
    />
  );
}
