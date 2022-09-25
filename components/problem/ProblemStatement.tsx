import { MdMathEditor, MdMathViewer, PlusIcon, T } from 'components';
import { classNames } from 'helpers';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { ContestTab, EditCreateProblem } from 'types';
import { ROUTES } from '../../config/constants';
import { ArrowIcon, ExclamationIcon, Popover } from '../index';
import { ProblemInfo } from './ProblemInfo';
import { SampleTest } from './SampleTest';

export const ProblemStatement = ({
  problem,
  contestIndex,
  setProblem,
  originalProblemRef,
}: { problem: EditCreateProblem, contestIndex?: string, setProblem?: (problem) => void, originalProblemRef?: { current: any } }) => {
  
  const { query: { key, index, tab, ...query } } = useRouter();
  
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
            <h6 className="title">{problem.name}</h6>
            <Popover content={<ProblemInfo problem={problem} />} triggerOn={['hover', 'click']} placement="bottom">
              <div className="jk-row"><ExclamationIcon filledCircle className="cr-py" rotate={180} /></div>
            </Popover>
          </div>
        </div>
      )}
      <div className="jk-row nowrap stretch left problem-content">
        <div className={classNames('problem-statement', { 'problem-contest-statement': !!contestIndex })}>
          <div>
            {setProblem ? (
              <MdMathEditor
                informationButton
                uploadImageButton
                source={problem?.statement?.description}
                onChange={value => setProblem({ ...problem, statement: { ...problem.statement, description: value } })}
              />
            ) : <MdMathViewer source={problem?.statement?.description} />}
          </div>
          <div>
            <h6><T>input</T></h6>
            {setProblem ? (
              <MdMathEditor
                informationButton
                uploadImageButton
                source={problem?.statement?.input}
                onChange={value => setProblem({ ...problem, statement: { ...problem.statement, input: value } })}
              />
            ) : <MdMathViewer source={problem?.statement?.input} />}
          </div>
          <div>
            <h6><T>output</T></h6>
            {setProblem ? (
              <MdMathEditor
                informationButton
                uploadImageButton
                source={problem?.statement?.output}
                onChange={value => setProblem({ ...problem, statement: { ...problem.statement, output: value } })}
              />
            ) : <MdMathViewer source={problem?.statement?.output} />}
          </div>
          <div>
            <div className="jk-row stretch gap">
              <div className="jk-row stretch gap nowrap flex-1">
                <h6><T>input sample</T></h6>
                <h6><T>output sample</T></h6>
              </div>
              {setProblem && (
                <div className="jk-row">
                  <PlusIcon
                    className="cr-py"
                    filledCircle
                    onClick={() => setProblem(prevState => ({
                      ...prevState,
                      sampleCases: [...prevState.sampleCases, { input: ' ', output: ' ' }],
                    }))}
                  />
                </div>
              )}
            </div>
            <div className="jk-col stretch gap">
              {(problem.sampleCases || [{ input: '', output: '' }]).map((sample, index) => (
                <SampleTest index={index} problem={problem} key={index} setProblem={setProblem} />
              ))}
            </div>
          </div>
        </div>
        {!contestIndex && <div className="screen lg hg"><ProblemInfo problem={problem} /></div>}
      </div>
    </div>
  );
};
