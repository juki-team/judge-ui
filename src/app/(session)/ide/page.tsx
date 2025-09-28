'use client';

import { UserCodeEditor } from 'components';
import { useCheckAndStartServices } from 'hooks';
import { CODE_LANGUAGE, RUNNER_ACCEPTED_PROGRAMMING_LANGUAGES } from 'src/constants';

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
