import {
  ButtonLoader,
  DownloadIcon,
  ExtraProblemInfo,
  FloatToolbar,
  MdMathEditor,
  MdMathViewer,
  PlusIcon,
  ProblemMemoryLimitInfo,
  ProblemModeInfo,
  ProblemTimeLimitInfo,
  ProblemTypeInfo,
  T,
  TabsInline,
} from 'components';
import { PROBLEM_MODE, PROBLEM_TYPE, PROGRAMMING_LANGUAGE } from 'config/constants';
import { classNames, downloadBlobAsFile, downloadJukiMarkdownAdPdf } from 'helpers';
import { useJukiUI, useJukiUser, useRouter, useT } from 'hooks';
import React, { useState } from 'react';
import {
  Judge,
  Language,
  ProblemSettingsType,
  ProblemStatementType,
  ProblemStatus,
  ProfileSetting,
  Status,
} from 'types';
import { ProblemLetter } from './ProblemLetter';
import { SampleTest } from './SampleTest';

interface ProblemStatementProps {
  judge: Judge,
  problemKey: string,
  settings: ProblemSettingsType,
  name: string,
  tags: string[],
  author: string,
  status: ProblemStatus,
  statement: ProblemStatementType,
  setStatement?: (statement: ProblemStatementType) => void,
  contest?: { index: string, color: string },
}

export const ProblemStatement = (props: ProblemStatementProps) => {
  const { judge, problemKey, name, settings, tags, author, status, statement, setStatement, contest } = props;
  
  //const { index: problemIndex, color: problemColor } = contest || {};
  const { query: { key, index, tab, ...query } } = useRouter();
  const { viewPortSize } = useJukiUI();
  const { user: { settings: { [ProfileSetting.LANGUAGE]: preferredLanguage } } } = useJukiUser();
  const { t } = useT();
  
  const statementDescription = (statement?.description?.[preferredLanguage] ||
    statement?.description?.[Language.EN] ||
    statement?.description?.[Language.ES] ||
    '').trim();
  const statementInput = (statement?.input[preferredLanguage] ||
    statement?.input[Language.EN] ||
    statement?.input[Language.ES] ||
    '').trim();
  const statementOutput = (statement?.output[preferredLanguage] ||
    statement?.output[Language.EN] ||
    statement?.output[Language.ES] ||
    '').trim();
  const statementSampleCases = statement?.sampleCases || [];
  
  const languages = Object.values(settings?.byProgrammingLanguage || {});
  const problemName = contest?.index ? `(${t('problem')} ${contest?.index}) ${name}` : `(${t('id')} ${problemKey}) ${name}`;
  const source = `
# \\textAlign=center ${problemName}

\\textAlign=center **${t('type')}:** ${PROBLEM_TYPE[settings?.type]?.label}, **${t('mode')}:** ${PROBLEM_MODE[settings?.mode]?.label}

|${t('language')}|${t('time limit')}|${t('memory limit')}|
|--|--|--|
| ${t('general')} | ${(settings?.timeLimit / 1000).toFixed(1)} ${t('seconds')} | ${(settings?.memoryLimit /
    1000).toFixed(1)} ${t('MB')} |
${languages.map((language) => (
    `| ${PROGRAMMING_LANGUAGE[language.language]?.label} | ${(language?.timeLimit /
      1000).toFixed(1)} ${t('seconds')} | ${(language?.memoryLimit / 1000).toFixed(1)} ${t('MB')}|`
  )).join('\n')}

# ${t('description')}

${statementDescription}

# ${t('input')}

${statementInput}

# ${t('output')}

${statementOutput}
  
${statementSampleCases.map((sample, index) => (
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
  
  if ([ Judge.CODEFORCES, Judge.JV_UMSA ].includes(judge)) {
    return (
      <div className="jk-row extend top" style={{ overflow: 'auto', height: '100%', width: '100%' }}>
        <div
          className="jk-row extend top gap nowrap stretch left pad-left-right pad-top-bottom"
          style={{ position: 'relative' }}
        >
          {contest && (
            <ProblemLetter
              index={contest.index}
              color={contest.color}
              style={{ position: 'absolute', top: 'var(--pad-m)', left: 'var(--pad-m)' }}
            />
          )}
          <div
            className={`${judge}-statement`}
            dangerouslySetInnerHTML={{ __html: statement.html[Language.EN] || statement.html[Language.ES] }}
          />
        </div>
      </div>
    );
  }
  
  const handleDownloadPdf = async () => {
    await downloadJukiMarkdownAdPdf(source, `Juki Judge ${problemName}.pdf`);
  };
  
  const handleDownloadMd = async () => {
    await downloadBlobAsFile(new Blob([ source ], { type: 'text/plain' }), `Juki Judge ${problemName}.md`);
  };
  
  const [ language, setLanguage ] = useState<Language>(Language.EN);
  
  const tabs = {
    [Language.EN]: {
      key: Language.EN,
      header: <span>english</span>,
    },
    [Language.ES]: {
      key: Language.ES,
      header: <span>español</span>,
    },
  };
  
  return (
    <div className="jk-row extend top" style={{ overflow: 'auto', height: '100%', width: '100%' }}>
      <div className="jk-row extend top gap nowrap stretch left pad-left-right pad-top-bottom">
        <div
          className={classNames('jk-col top gap stretch flex-3', {
            'editing': !!setStatement,
          })}
        >
          {!setStatement && viewPortSize !== 'hg' && viewPortSize !== 'lg' && (
            <FloatToolbar
              actionButtons={[
                {
                  icon: <DownloadIcon />,
                  buttons: [
                    {
                      icon: <DownloadIcon />,
                      label: <T>pdf</T>,
                      onClick: handleDownloadPdf,
                    },
                    {
                      icon: <DownloadIcon />,
                      label: <T>md</T>,
                      onClick: handleDownloadMd,
                    },
                  ],
                },
              ]}
            />
          )}
          <div className="jk-row center extend gap nowrap fw-bd">
            {contest && <ProblemLetter index={contest.index} color={contest.color} />}
            {!setStatement && (
              <div className="jk-col fw-nl">
                <h3>{name}</h3>
                <div className={classNames({ 'screen sm md': !contest })}>
                  <div className={classNames('jk-row-col', { gap: viewPortSize !== 'sm' })}>
                    <ProblemTimeLimitInfo settings={settings} />
                    <ProblemMemoryLimitInfo settings={settings} />
                  </div>
                  <div className={classNames('jk-row-col', { gap: viewPortSize !== 'sm' })}>
                    <ProblemTypeInfo settings={settings} />
                    <ProblemModeInfo settings={settings} expand={false} />
                  </div>
                </div>
              </div>
            )}
          </div>
          {setStatement && (
            <div className="jk-col">
              <div className="jk-row">
                <TabsInline<Language>
                  tabs={tabs}
                  onChange={(language) => setLanguage(language)}
                  selectedTabKey={language}
                />
              </div>
            </div>
          )}
          <div>
            <h3><T>description</T></h3>
            {setStatement ? (
              <div className="text-edit">
                <MdMathEditor
                  informationButton
                  uploadImageButton
                  source={statement.description?.[language]}
                  onChange={value => setStatement({
                    ...statement,
                    description: { ...statement.description, [language]: value },
                  })}
                />
              </div>
            ) : (
              <div className="br-g6 bc-we jk-pad-md jk-border-radius-inline">
                <MdMathViewer source={statementDescription} />
              </div>
            )}
          </div>
          <div>
            <h3><T>input</T></h3>
            {setStatement ? (
              <div className="text-edit">
                <MdMathEditor
                  informationButton
                  uploadImageButton
                  source={statement.input?.[language]}
                  onChange={value => setStatement({
                    ...statement,
                    input: { ...statement.input, [language]: value },
                  })}
                />
              </div>
            ) : statementInput
              ? <div className="br-g6 bc-we jk-pad-md jk-border-radius-inline">
                <MdMathViewer source={statementInput} />
              </div>
              : <em><T className="tt-se fw-bd">no input description</T></em>}
          </div>
          <div>
            <h3><T>output</T></h3>
            {setStatement ? (
              <div className="text-edit">
                <MdMathEditor
                  informationButton
                  uploadImageButton
                  source={statement.output?.[language]}
                  onChange={value => setStatement({
                    ...statement,
                    output: { ...statement.output, [language]: value },
                  })}
                />
              </div>
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
            {setStatement && (
              <div className="jk-row">
                <PlusIcon
                  className="cr-py"
                  filledCircle
                  onClick={() => setStatement({
                    ...statement,
                    sampleCases: [ ...statement.sampleCases, { input: '', output: '' } ],
                  })}
                />
              </div>
            )}
          </div>
          <div className="jk-col stretch gap">
            {(statement.sampleCases || [ { input: '', output: '' } ]).map((sample, index) => (
              <SampleTest
                index={index}
                sampleCases={statement.sampleCases}
                key={index}
                setSampleCases={setStatement ? (sampleCases) => setStatement({ ...statement, sampleCases }) : undefined}
              />
            ))}
          </div>
        </div>
        {!contest && (
          <div className="screen lg hg flex-1">
            <div className="jk-border-radius-inline jk-pad-md bc-we jk-col gap stretch">
              <ProblemTimeLimitInfo settings={settings} expand />
              <ProblemMemoryLimitInfo settings={settings} expand />
              <ProblemTypeInfo settings={settings} />
              <ProblemModeInfo settings={settings} expand />
              <ExtraProblemInfo author={author} status={status} tags={tags} settings={settings} />
              <ButtonLoader
                size="small"
                icon={<DownloadIcon />}
                onClick={async (setLoaderStatus) => {
                  setLoaderStatus(Status.LOADING);
                  try {
                    await handleDownloadPdf();
                    setLoaderStatus(Status.SUCCESS);
                  } catch (error) {
                    setLoaderStatus(Status.ERROR);
                  }
                }}
              >
                <T>download as pdf</T>
              </ButtonLoader>
              <ButtonLoader
                size="small"
                icon={<DownloadIcon />}
                onClick={async (setLoaderStatus) => {
                  setLoaderStatus(Status.LOADING);
                  try {
                    await handleDownloadMd();
                    setLoaderStatus(Status.SUCCESS);
                  } catch (error) {
                    setLoaderStatus(Status.ERROR);
                  }
                }}
              >
                <T>download as md</T>
              </ButtonLoader>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
