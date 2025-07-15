'use client';

import { Button, T, UserCodeEditor } from 'components';
import { downloadBlobAsFile } from 'helpers';
import { useCheckAndStartServices } from 'hooks';
import { CODE_LANGUAGE, RUNNER_ACCEPTED_PROGRAMMING_LANGUAGES } from 'src/constants';
import { CodeLanguage } from 'types';

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
        centerButtons={({ files, currentFileName }) => {
          const { source = '', language = CodeLanguage.TEXT } = files[currentFileName] ?? {};
          return (
            <Button
              size="tiny"
              type="light"
              onClick={() => {
                const filename = `code.${CODE_LANGUAGE[language]?.fileExtension?.[0] || 'txt'}`;
                downloadBlobAsFile(source as unknown as Blob, filename);
              }}
            >
              <T className="tt-se">download code</T>
            </Button>
          );
        }}
      />
    </div>
  );
}
