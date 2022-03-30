import { MdMathEditor, MdMathViewer, PlusIcon, T } from 'components';
import React from 'react';
import { ProblemInfo } from './ProblemInfo';
import { SampleTest } from './SampleTest';

export const ProblemStatement = ({
  problem,
  setProblem,
  originalProblemRef,
}: { problem: any, setProblem?: (problem) => void, originalProblemRef?: { current: any } }) => {
  
  return (
    <div>
      <div className="problem-head-box text-xh bold child-center">
        {/*{subTab && <div className="index shadow">{subTab}</div>}*/}
        {/*{subTab && <h6 className="title">{problem.name}</h6>}*/}
      </div>
      <div className="jk-row nowrap filled start problem-content">
        <div className="jk-pad">
          <div>
            {setProblem ? (
              <MdMathEditor
                informationButton
                uploadImageButton
                source={problem?.description?.general}
                onChange={value => setProblem({ ...problem, description: { ...problem.description, general: value } })}
              />
            ) : <MdMathViewer source={problem?.description?.general} />}
          </div>
          <div>
            <h6><T>input</T></h6>
            {setProblem ? (
              <MdMathEditor
                informationButton
                uploadImageButton
                source={problem?.description?.input}
                onChange={value => setProblem({ ...problem, description: { ...problem.description, input: value } })}
              />
            ) : <MdMathViewer source={problem?.description?.input} />}
          </div>
          <div>
            <h6><T>output</T></h6>
            {setProblem ? (
              <MdMathEditor
                informationButton
                uploadImageButton
                source={problem?.description?.output}
                onChange={value => setProblem({ ...problem, description: { ...problem.description, output: value } })}
              />
            ) : <MdMathViewer source={problem?.description?.output} />}
          </div>
          <div>
            <div className="jk-row filled gap">
              <div className="jk-row filled gap flex-1">
                <h6><T>input sample</T></h6>
                <h6><T>output sample</T></h6>
              </div>
              {setProblem && (
                <div className="jk-row">
                  <PlusIcon
                    className="color-primary"
                    filledCircle
                    onClick={() => setProblem(prevState => ({
                      ...prevState,
                      samples: [...prevState.samples, { input: ' ', output: ' ' }],
                    }))}
                  />
                </div>
              )}
            </div>
            <div className="jk-col filled gap">
              {(problem.samples || [{ input: '', output: '' }]).map((sample, index) => (
                <SampleTest index={index} problem={problem} key={index} setProblem={setProblem} />
              ))}
            </div>
          </div>
        </div>
        <div className="screen lg hg"><ProblemInfo problem={problem} /></div>
      </div>
    </div>
  );
};
