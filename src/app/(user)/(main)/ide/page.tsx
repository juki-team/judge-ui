'use client';

import { UserCodeEditor, useCheckAndStartServices } from '@juki-team/base-ui';
import { CODE_LANGUAGE, RUNNER_ACCEPTED_PROGRAMMING_LANGUAGES } from '@juki-team/commons/constants';

export default function IDEPage() {
  
  useCheckAndStartServices();
  
  return (
    <div className="jk-pg-md" style={{ width: '100%', height: '100%' }}>
      <UserCodeEditor
        storeKey="*"
        languages={RUNNER_ACCEPTED_PROGRAMMING_LANGUAGES.map(language => ({
          label: CODE_LANGUAGE[language].label,
          value: language,
        }))}
        enableAddCustomSampleCases
      />
    </div>
  );
}
