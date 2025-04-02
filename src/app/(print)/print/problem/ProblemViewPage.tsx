'use client';

import { ProblemView } from 'components';
import { ProblemDataResponseDTO } from 'types';

export default function ProblemViewPage({ problem }: { problem: ProblemDataResponseDTO }) {
  
  return (
    <div id="juki-app" style={{ overflow: 'auto' }}>
      <ProblemView
        problem={problem}
        infoPlacement="none"
        codeEditorStoreKey={problem.key}
        forPrinting
      />
    </div>
  );
}
