'use client';

import { CodeViewer, Select, T, UserCodeEditor } from 'components';
import domToImage from 'dom-to-image-more';
import { downloadBlobAsFile } from 'helpers';
import { useCheckAndStartServices, useJukiNotification } from 'hooks';
import { CODE_LANGUAGE, RUNNER_ACCEPTED_PROGRAMMING_LANGUAGES } from 'src/constants';
import { CodeLanguage } from 'types';

export default function IDEPage() {
  
  useCheckAndStartServices();
  
  const { addSuccessNotification } = useJukiNotification();
  
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
          
          const { source = '', name = '', language = CodeLanguage.TEXT } = files[currentFileName] ?? {};
          
          const toPng = async () => {
            const cmThemeNode = document.querySelector('.code-viewer-to-print');
            if (!cmThemeNode) {
              return;
            }
            try {
              return await domToImage.toBlob(cmThemeNode);
            } catch (error) {
              console.error('Error al capturar imagen:', error);
            }
          };
          
          return (
            <div className="jk-row gap">
              <div className="code-viewer-to-print bc-we jk-pg jk-br-ie">
                <CodeViewer code={source} language={language} />
              </div>
              <Select
                options={[
                  { value: 'text', label: <T className="tt-se">download as file</T> },
                  { value: 'png', label: <T className="tt-se">download as png</T> },
                ]}
                selectedOption={{ value: '', label: <T className="tt-se">download</T> }}
                onChange={async ({ value }) => {
                  switch (value) {
                    case 'text':
                      downloadBlobAsFile(source as unknown as Blob, name);
                      break;
                    case 'png':
                      downloadBlobAsFile(await toPng(), `${name}.png`);
                  }
                  addSuccessNotification(<T className="tt-se">downloaded</T>);
                }}
              />
              <Select
                options={[
                  { value: 'text', label: <T className="tt-se">copy as text</T> },
                  { value: 'png', label: <T className="tt-se">copy as png</T> },
                ]}
                selectedOption={{ value: '', label: <T className="tt-se">copy</T> }}
                onChange={async ({ value }) => {
                  switch (value) {
                    case 'text':
                      try {
                        await navigator.clipboard.writeText(source);
                      } catch (err) {
                        console.error('Failed to copy:', err);
                      }
                      break;
                    case 'png':
                      try {
                        await navigator.clipboard.write([
                          new ClipboardItem({ 'image/png': await toPng() }),
                        ]);
                      } catch (err) {
                        console.error('Failed to copy image:', err);
                      }
                      break;
                  }
                  addSuccessNotification(<T className="tt-se">copied</T>);
                }}
              />
            </div>
          );
        }}
      />
    </div>
  );
}
