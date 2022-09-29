import { ArrowIcon, ExclamationIcon, MdMathEditor, MdMathViewer, PlusIcon, Popover, ProblemInfo, T, TextLangEdit } from 'components';
import { ROUTES } from 'config/constants';
import { classNames } from 'helpers';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useUserState } from 'store';
import { ContestTab, ProblemSampleCasesType, ProblemSettingsType, ProblemStatementType, ProblemStatus } from 'types';
import { SampleTest } from './SampleTest';

interface ProblemStatementProps {
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
  
  return (
    <div className="problem-statement-layout">
      {contestIndex && (
        <div className="problem-head-box tx-xh fw-br jk-row">
          <div className="jk-row cr-py back-link">
            <Link href={{ pathname: ROUTES.CONTESTS.VIEW('' + key, ContestTab.PROBLEMS), query }}>
              <a className="jk-row nowrap fw-bd link">
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
          {setStatement ? (
            <TextLangEdit
              text={statement.description}
              setText={(description) => setStatement({ ...statement, description })}
            />
          ) : <MdMathViewer source={statement?.description[preferredLanguage]} />}
          <h6><T>input</T></h6>
          {!setStatement && !statement?.input.trim() && <em><T className="tt-se fw-bd">no input description</T></em>}
          {setStatement ? (
            <MdMathEditor
              informationButton
              uploadImageButton
              source={statement?.input}
              onChange={input => setStatement({ ...statement, input })}
            />
          ) : <MdMathViewer source={statement?.input} />}
          <h6><T>output</T></h6>
          {!setStatement && !statement?.output.trim() && <em><T className="tt-se fw-bd">no output description</T></em>}
          {setStatement ? (
            <MdMathEditor
              informationButton
              uploadImageButton
              source={statement?.output}
              onChange={output => setStatement({ ...statement, output })}
            />
          ) : <MdMathViewer source={statement?.output} />}
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
