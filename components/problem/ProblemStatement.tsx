import {
  ArrowIcon,
  DownloadIcon,
  ExclamationIcon,
  ExternalIcon,
  FloatToolbar,
  MdMathViewer,
  PlusIcon,
  Popover,
  ProblemInfo,
  T,
  TextLangEdit,
} from 'components';
import { PROBLEM_MODE, PROBLEM_TYPE, PROGRAMMING_LANGUAGE, ROUTES } from 'config/constants';
import { classNames, downloadBlobAsFile, handleShareMdPdf } from 'helpers';
import { useT } from 'hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useUserState } from 'store';
import { ContestTab, Language, ProblemSampleCasesType, ProblemSettingsType, ProblemStatementType, ProblemStatus } from 'types';
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
  contestIndex?: string,
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
  contestIndex,
}: ProblemStatementProps) => {
  
  const { query: { key, index, tab, ...query } } = useRouter();
  const { settings: { preferredLanguage } } = useUserState();
  const { t } = useT();
  
  const statementDescription = statement?.description[preferredLanguage] || statement?.description[Language.EN] || statement?.description[Language.ES];
  const statementInput = (statement?.input[preferredLanguage] || statement?.input[Language.EN] || statement?.input[Language.ES]).trim();
  const statementOutput = (statement?.output[preferredLanguage] || statement?.output[Language.EN] || statement?.output[Language.ES]).trim();
  
  const languages = Object.values(settings?.byProgrammingLanguage || {});
  const source = `
# \\textAlign=center (${t('problem')} ${contestIndex}) ${name}

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
  const [sourceUrl, setSourceUrl] = useState('');
  useEffect(() => setSourceUrl(''), [source]);
  
  return (
    <div className="problem-statement-layout">
      {contestIndex && (
        <div className="problem-head-box tx-xh fw-br jk-row">
          <div className="jk-row cr-py back-link">
            <Link href={{ pathname: ROUTES.CONTESTS.VIEW('' + key, ContestTab.PROBLEMS), query }} className="jk-row nowrap fw-bd link">
              <a>
                <ArrowIcon rotate={-90} />
              </a>
            </Link>
          </div>
          <div className="jk-row center gap nowrap">
            <div className="index">{contestIndex}</div>
            <h6 className="title">{name}</h6>
            <Popover
              content={<ProblemInfo author={author} status={status} tags={tags} settings={settings} />}
              triggerOn={['hover', 'click']}
              placement="bottom"
            >
              <div className="jk-row"><ExclamationIcon filledCircle className="cr-py" rotate={180} /></div>
            </Popover>
          </div>
        </div>
      )}
      <div className="jk-row nowrap stretch left problem-content">
        <div className={classNames('problem-statement', { 'problem-contest-statement': !!contestIndex, 'editing': !!setStatement })}>
          {!setStatement && (
            <FloatToolbar
              actionButtons={[
                {
                  icon: <DownloadIcon />,
                  buttons: [
                    // {
                    //   icon: <DownloadIcon />,
                    //   label: <T>pdf</T>,
                    //   onClick: handleShareMdPdf('pdf', source, sourceUrl, setSourceUrl),
                    // },
                    {
                      icon: <ExternalIcon />,
                      label: <T>md</T>,
                      onClick: async () => await downloadBlobAsFile(new Blob([source], { type: 'text/plain' }), `JUKI-JUDGE-${problemKey}.md`),
                    },
                  ],
                },
              ]}
            />
          )}
          <h6><T>description</T></h6>
          {setStatement ? (
            <TextLangEdit
              text={statement.description}
              setText={(description) => setStatement({ ...statement, description })}
            />
          ) : (
            <MdMathViewer source={statementDescription} />
          )}
          <h6><T>input</T></h6>
          {}
          {setStatement ? (
            <TextLangEdit
              text={statement.input}
              setText={(input) => setStatement({ ...statement, input })}
            />
          ) : statementInput
            ? <MdMathViewer source={statementInput} />
            : <em><T className="tt-se fw-bd">no input description</T></em>}
          <h6><T>output</T></h6>
          {setStatement ? (
            <TextLangEdit
              text={statement.output}
              setText={(output) => setStatement({ ...statement, output })}
            />
          ) : statementOutput
            ? <MdMathViewer source={statementOutput} />
            : <em><T className="tt-se fw-bd">no output description</T></em>}
          <div className="jk-row stretch gap">
            <div className="jk-row stretch gap nowrap flex-1">
              <h6><T>input sample</T></h6>
              <h6><T>output sample</T></h6>
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
        {!contestIndex && (
          <div className="screen lg hg">
            <ProblemInfo author={author} status={status} tags={tags} settings={settings} />
          </div>
        )}
      </div>
    </div>
  );
};
