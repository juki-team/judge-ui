'use client';

import { T, TwoContentLayout } from 'components';
import { ACCEPTED_PROGRAMMING_LANGUAGES, PROGRAMMING_LANGUAGE } from 'config/constants';
import { oneTab } from 'helpers';

export default function Page() {
  
  return (
    <TwoContentLayout
      breadcrumbs={[]}
      tabs={oneTab(
        <div className="jk-pg bc-we">
          <h3><T>compilation of submissions</T></h3>
          {/*<div className="jk-row left nowrap">*/}
          <T className="tt-se">
            source files submitted to the Juki Judge will be compiled and running using the following command
            line arguments for the respective language.
          </T>
          {/*</div>*/}
          {ACCEPTED_PROGRAMMING_LANGUAGES.map((value) => {
            return (
              <div key={value}>
                <ul>
                  <li>
                    <div className="jk-row left fw-bd">
                      {PROGRAMMING_LANGUAGE[value].label}&nbsp;
                      <div className="cr-g5 tx-s">[{PROGRAMMING_LANGUAGE[value].value}]</div>
                    </div>
                    <div>
                      <div><T className="tt-se">compilation command</T>:</div>
                      {!PROGRAMMING_LANGUAGE[value].hasBuildFile && (
                        <>
                          <div className="cr-ss"><T className="tt-se">no compilation required</T></div>
                        </>
                      )}
                      <div className="cr-g4">
                        {!PROGRAMMING_LANGUAGE[value].hasBuildFile && PROGRAMMING_LANGUAGE[value].compilePattern && (
                          <T className="tt-se">the following command is only to verify the integrity of the code</T>
                        )}
                      </div>
                      {PROGRAMMING_LANGUAGE[value].compilePattern && (
                        <pre className="ws-bs bc-wd jk-pg-sm">
                          {PROGRAMMING_LANGUAGE[value].compilePattern
                            .replace('{{folder_path}}/{{compiled_file_name}}', '{file_compiled}')
                            .replace('{{folder_path}}/{{source_file_name}}', '{source_file}')
                          }
                        </pre>
                      )}
                      <div><T className="tt-se">run command</T>:</div>
                      {PROGRAMMING_LANGUAGE[value].runPattern && (
                        <pre className="ws-bs bc-wd jk-pg-sm">
                          {PROGRAMMING_LANGUAGE[value].runPattern
                            .replace('{{folder_path}}/{{compiled_file_name}}', '{file_compiled}')
                            .replace('{{folder_path}}/{{source_file_name}}', '{source_file}')
                          }
                        </pre>
                      )}
                      {PROGRAMMING_LANGUAGE[value].executable && (
                        <div>
                          <T className="tt-se">executable</T>: <div className="jk-tag gray-3">{PROGRAMMING_LANGUAGE[value].executable}</div>
                        </div>
                      )}
                      {PROGRAMMING_LANGUAGE[value].executableVersion && (
                        <>
                          <div><T className="tt-se">executable version</T>:</div>
                          <pre className="ws-bs bc-wd jk-pg-sm">
                          {PROGRAMMING_LANGUAGE[value].executableVersion
                            .replace('{{folder_path}}/{{compiled_file_name}}', '{file_compiled}')
                            .replace('{{folder_path}}/{{source_file_name}}', '{source_file}')
                          }
                        </pre>
                        </>
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            );
          })}
        </div>,
      )}
    >
      <div className="jk-col extend stretch">
        <div className="jk-row nowrap extend stretch gap" style={{ boxSizing: 'border-box' }}>
          <h1><T>help</T></h1>
        </div>
      </div>
    </TwoContentLayout>
  );
}
