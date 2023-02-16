import {
  DownloadIcon,
  ExclamationIcon,
  FloatToolbar,
  MdMathViewer,
  OpenInNewIcon,
  PlusIcon,
  Popover,
  ProblemInfo,
  T,
  TextLangEdit,
} from 'components';
import { PROBLEM_MODE, PROBLEM_TYPE, PROGRAMMING_LANGUAGE } from 'config/constants';
import { classNames, downloadBlobAsFile, downloadJukiMarkdownAdPdf } from 'helpers';
import { useJukiBase, useT } from 'hooks';
import { useRouter } from 'next/router';
import React from 'react';
import {
  Language,
  ProblemSampleCasesType,
  ProblemSettingsType,
  ProblemStatementType,
  ProblemStatus,
  ProfileSetting,
} from 'types';
import { SampleTest } from './SampleTest';

interface ProblemStatementProps {
  problemKey: string,
  settings: ProblemSettingsType,
  name: string,
  tags: string[],
  author: string,
  status: ProblemStatus,
  statement: ProblemStatementType,
  setStatement?: (statement: ProblemStatementType) => void,
  sampleCases: ProblemSampleCasesType,
  setSampleCases?: (sampleCases: ProblemSampleCasesType) => void,
  contest?: { index: string, color: string },
}

export const ProblemStatement = ({
  problemKey,
  name,
  settings,
  tags,
  author,
  status,
  statement,
  setStatement,
  sampleCases,
  setSampleCases,
  contest,
}: ProblemStatementProps) => {
  const { index: problemIndex, color: problemColor } = contest || {};
  const { query: { key, index, tab, ...query } } = useRouter();
  const { user: { settings: { [ProfileSetting.LANGUAGE]: preferredLanguage } } } = useJukiBase();
  const { t } = useT();
  
  const statementDescription = statement?.description[preferredLanguage] || statement?.description[Language.EN] || statement?.description[Language.ES];
  const statementInput = (statement?.input[preferredLanguage] || statement?.input[Language.EN] || statement?.input[Language.ES]).trim();
  const statementOutput = (statement?.output[preferredLanguage] || statement?.output[Language.EN] || statement?.output[Language.ES]).trim();
  
  const languages = Object.values(settings?.byProgrammingLanguage || {});
  const problemName = problemIndex ? `(${t('problem')} ${problemIndex}) ${name}` : `(${t('id')} ${problemKey}) ${name}`;
  const source = `
# \\textAlign=center ${problemName}

\\textAlign=center **${t('type')}:** ${PROBLEM_TYPE[settings?.type]?.label}, **${t('mode')}:** ${PROBLEM_MODE[settings?.mode]?.label}

|${t('language')}|${t('time limit')}|${t('memory limit')}|
|--|--|--|
| ${t('general')} | ${(settings?.timeLimit / 1000).toFixed(1)} ${t('seconds')} | ${(settings?.memoryLimit / 1000).toFixed(1)} ${t('MB')} |
${languages.map((language) => (
    `| ${PROGRAMMING_LANGUAGE[language.language]?.label} | ${(language?.timeLimit / 1000).toFixed(1)} ${t('seconds')} | ${(language?.memoryLimit / 1000).toFixed(1)} ${t('MB')}|`
  )).join('\n')}

# ${t('description')}

${statementDescription}

# ${t('input')}

${statementInput}

# ${t('output')}

${statementOutput}
  
${sampleCases.map((sample, index) => (
    `### ${t('input sample')} ${index + 1}
\`\`\`
${sample.input}
\`\`\`
### ${t('output sample')} ${index + 1}
\`\`\`
${sample.output}
\`\`\`
`)).join('')}
`;
  
  return (
    <div className="jk-row extend" style={{ overflow: 'auto', height: '100%', width: '100%' }}>
      {problemIndex && (
        <div className="jk-row center extend gap nowrap pad-left-right pad-top fw-bd">
          <div className="jk-row jk-tag" style={{ backgroundColor: problemColor }}>
            <p style={{
              textShadow: 'var(--t-color-white) 0px 1px 2px, var(--t-color-white) 0px -1px 2px, ' +
                'var(--t-color-white) 1px 0px 2px, var(--t-color-white) -1px 0px 2px',
              color: 'var(--t-color-gray-1)',
            }}>{problemIndex}</p>
          </div>
          <h3 className="title" style={{ textAlign: 'center' }}>{name}</h3>
          <Popover
            content={<ProblemInfo author={author} status={status} tags={tags} settings={settings} />}
            triggerOn={['hover', 'click']}
            placement="bottom"
          >
            <div className="jk-row"><ExclamationIcon filledCircle className="cr-py" rotate={180} /></div>
          </Popover>
        </div>
      )}
      <div className="jk-row extend top gap nowrap stretch left pad-left-right pad-top-bottom">
        <div className={classNames('jk-col top gap stretch flex-3', {
          'editing': !!setStatement,
        })}>
          {!setStatement && (
            <FloatToolbar
              actionButtons={[
                {
                  icon: <DownloadIcon />,
                  buttons: [
                    {
                      icon: <DownloadIcon />,
                      label: <T>pdf</T>,
                      onClick: async () => {
                        await downloadJukiMarkdownAdPdf(source, `Juki Judge ${problemName}.pdf`);
                      },
                    },
                    {
                      icon: <OpenInNewIcon />,
                      label: <T>md</T>,
                      onClick: async () => await downloadBlobAsFile(new Blob([source], { type: 'text/plain' }), `Juki Judge ${problemName}.md`),
                    },
                  ],
                },
              ]}
            />
          )}
          <div>
            <h3><T>description</T></h3>
            {setStatement ? (
              <TextLangEdit
                text={statement.description}
                setText={(description) => setStatement({ ...statement, description })}
              />
            ) : (
              <div className="br-g6 bc-we jk-pad-md jk-border-radius-inline">
                <MdMathViewer source={statementDescription} />
              </div>
            )}
          </div>
          <div>
            <h3><T>input</T></h3>
            {}
            {setStatement ? (
              <TextLangEdit
                text={statement.input}
                setText={(input) => setStatement({ ...statement, input })}
              />
            ) : statementInput
              ? <div className="br-g6 bc-we jk-pad-md jk-border-radius-inline">
                <MdMathViewer source={statementInput} />
              </div>
              : <em><T className="tt-se fw-bd">no input description</T></em>}
          </div>
          <div>
            <h3><T>output</T></h3>
            {setStatement ? (
              <TextLangEdit
                text={statement.output}
                setText={(output) => setStatement({ ...statement, output })}
              />
            ) : statementOutput
              ? <div className="br-g6 bc-we jk-pad-md jk-border-radius-inline">
                <MdMathViewer source={statementOutput} />
              </div>
              : <em><T className="tt-se fw-bd">no output description</T></em>}
          </div>
          <div className="jk-row stretch gap">
            <div className="jk-row stretch gap nowrap flex-1">
              <h3><T>input sample</T></h3>
              <h3><T>output sample</T></h3>
            </div>
            {setSampleCases && (
              <div className="jk-row">
                <PlusIcon
                  className="cr-py"
                  filledCircle
                  onClick={() => setSampleCases([...sampleCases, { input: '', output: '' }])}
                />
              </div>
            )}
          </div>
          <div className="jk-col stretch gap">
            {(sampleCases || [{ input: '', output: '' }]).map((sample, index) => (
              <SampleTest index={index} sampleCases={sampleCases} key={index} setSampleCases={setSampleCases} />
            ))}
          </div>
        </div>
        {!problemIndex && (
          <div className="screen lg hg flex-1">
            <ProblemInfo author={author} status={status} tags={tags} settings={settings} />
          </div>
        )}
      </div>
    </div>
  );
};
