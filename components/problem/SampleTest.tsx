import { CopyIcon, CopyToClipboard, DeleteIcon, EditIcon, SaveIcon, TextArea } from 'components';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ProblemNewState, ProblemOverview } from 'types';

interface SampleTestProps {
  index: number,
  problem: ProblemOverview,
  setProblem?: Dispatch<SetStateAction<ProblemNewState>>,
}

export const SampleTest = ({ index, problem, setProblem }: SampleTestProps) => {
  
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
    <div className="jk-row stretch gap">
      <div className="jk-row block stretch gap flex-1">
        <div className="jk-row nowrap left stretch gap">
          {editable ? (
            <TextArea
              value={sample.input || ''}
              onChange={value => setSample(prevState => ({ ...prevState, input: value }))}
            />
          ) : (
            <div className="sample-text-content jk-border-radius-inline">
              <CopyToClipboard text={sample.input}><CopyIcon size="small" /></CopyToClipboard>
              <span>{sample.input}</span>
            </div>
          )}
        </div>
        <div className="jk-row nowrap left stretch gap">
          {editable ? (
            <TextArea
              value={sample.output || ''}
              onChange={value => setSample(prevState => ({ ...prevState, output: value }))}
            />
          ) : (
            <div className="sample-text-content jk-border-radius-inline">
              <CopyToClipboard text={sample.output}><CopyIcon size="small" /></CopyToClipboard>
              <span>{sample.output}</span>
            </div>
          )}
        </div>
      </div>
      {setProblem && (
        <div className="jk-row gap color-primary">
          {editable ? <SaveIcon onClick={onSave} /> : <EditIcon onClick={() => setEditable(true)} />}
          <DeleteIcon
            onClick={() => setProblem(prevState => {
              const newSamples = [...prevState.samples].filter((sample, sIndex) => sIndex !== index);
              return { ...prevState, samples: newSamples };
            })}
          />
        </div>
      )}
    </div>
  );
};