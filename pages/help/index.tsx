import { Breadcrumbs, HomeLink, T, TwoContentSection } from 'components';
import { ACCEPTED_PROGRAMMING_LANGUAGES, PROGRAMMING_LANGUAGE } from 'config/constants';
import { useJukiUser } from 'hooks';

export default function Home() {
  
  const breadcrumbs = [
    <HomeLink key="home" />,
  ];
  
  const { company: { name } } = useJukiUser();
  
  return (
    <TwoContentSection>
      <div className="jk-col extend stretch">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="pad-left-right jk-row nowrap extend stretch gap" style={{ boxSizing: 'border-box' }}>
          <h1 style={{ padding: 'var(--pad-md) 0' }}>
            <T>help</T>
          </h1>
        </div>
      </div>
      
      <div className="pad-left-right pad-top-bottom">
        <div className="jk-pad-md bc-we">
          <h3><T>compilation of submissions</T></h3>
          {/*<div className="jk-row left nowrap">*/}
          <T className="tt-se">
            source files submitted to the Juki Judge will be compiled using the following command
            line arguments for the respective language:
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
                        <pre className="ws-bs bc-w2 jk-pad-sm">
                        {PROGRAMMING_LANGUAGE[value].compilePattern
                          .replace('{{folder_path}}/{{compiled_file_name}}', '{file}')
                          .replace('{{folder_path}}/{{source_file_name}}', '{file_compiled}')
                        }
                      </pre>
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </TwoContentSection>
  );
}
