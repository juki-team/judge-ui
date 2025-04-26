'use client';

import { Button, T, UserCodeEditor } from 'components';
import { downloadBlobAsFile } from 'helpers';
import { PROGRAMMING_LANGUAGE, RUNNER_ACCEPTED_PROGRAMMING_LANGUAGES } from 'src/constants';

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
        centerButtons={({ sourceCode, language }) => (
          <Button
            size="tiny"
            type="light"
            onClick={() => {
              const filename = `code.${PROGRAMMING_LANGUAGE[language]?.fileExtension?.[0] || 'txt'}`;
              downloadBlobAsFile(sourceCode as unknown as Blob, filename);
            }}
          >
            <T>download code</T>
          </Button>
        )}
      />
    </div>
  );
}
