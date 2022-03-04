import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { CopyIcon, CopyToClipboard, DeleteIcon, EditIcon, SaveIcon, TextArea } from '../../components';
import { ProblemNewState, ProblemOverview } from '../../types';

export const SampleTest = ({
  index,
  problem,
  setProblem,
}: { index: number, problem: ProblemOverview, setProblem?: Dispatch<SetStateAction<ProblemNewState>> }) => {
  
  const [sample, setSample] = useState(problem.samples?.[index] || { input: '', output: '' });
  const [editable, setEditable] = useState(false);
  useEffect(() => {
    setSample(problem.samples?.[index] || { input: '', output: '' });
    setEditable(false);
  }, [index, problem.samples]);
  
  const onSave = setProblem ? () => {
    setProblem(prevState => {
      const newSamples = [...prevState.samples];
      newSamples[index] = sample;
      return { ...prevState, samples: newSamples };
    });
    setEditable(false);
  } : () => null;
  
  return (
    <div className="jk-row block filled gap">
      <div className="jk-row nowrap start filled gap">
        {editable ? <TextArea
          // autoSize
          value={sample.input}
          onChange={value => setSample(prevState => ({ ...prevState, input: value }))}
        /> : (
          <>
            <div className="sample-text-content jk-border-radius">
              <span>{sample.input}</span>
            </div>
            <CopyToClipboard text={sample.input}>
              <CopyIcon />
            </CopyToClipboard>
          </>
        )}
      </div>
      <div className="jk-row nowrap start filled gap">
        {editable ? <TextArea
          // autoSize
          value={sample.output}
          onChange={value => setSample(prevState => ({ ...prevState, output: value }))}
        /> : (
          <>
            <div className="sample-text-content jk-border-radius">
              <span>{sample.output}</span>
            </div>
            <CopyToClipboard text={sample.output}>
              <CopyIcon />
            </CopyToClipboard>
          </>
        )}
      </div>
      {setProblem && (
        <div className="problem-sample-actions-box">
          {editable ? (
            <>
              <DeleteIcon
                onClick={() => setProblem(prevState => {
                  const newSamples = [...prevState.samples].filter((sample, sIndex) => sIndex !== index);
                  return { ...prevState, samples: newSamples };
                })}
              />
              <SaveIcon onClick={onSave} />
            </>
          ) : <EditIcon onClick={() => setEditable(true)} />}
        </div>
      )}
    </div>
  );
};