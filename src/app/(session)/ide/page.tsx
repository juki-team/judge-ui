'use client';

import { UserCodeEditor } from 'components';
import { PROGRAMMING_LANGUAGE, RUNNER_ACCEPTED_PROGRAMMING_LANGUAGES } from 'config/constants';

export default function IDEPage() {
  return (
    <div className="jk-pg-md" style={{ width: '100%', height: '100%' }}>
      <UserCodeEditor
        storeKey="*"
        languages={RUNNER_ACCEPTED_PROGRAMMING_LANGUAGES.map(language => ({
          label: PROGRAMMING_LANGUAGE[language].label,
          value: language,
        }))}
        enableAddCustomSampleCases
      />
    </div>
  );
}
