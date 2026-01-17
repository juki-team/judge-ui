'use client';

import { DeleteIcon, EditIcon, NewlineInfo, SaveIcon, TextArea } from 'components';
import { useEffect, useState } from 'hooks';
import { ProblemSampleCasesType } from 'types';

interface SampleTestProps {
  index: number,
  sampleCases: ProblemSampleCasesType,
  setSampleCases: (sampleCases: ProblemSampleCasesType) => void,
}

export const SampleTest = ({ index, sampleCases, setSampleCases }: SampleTestProps) => {
  
  const [ sample, setSample ] = useState(sampleCases?.[index] || { input: '', output: '' });
  const [ editable, setEditable ] = useState(false);
  useEffect(() => {
    setSample(prevState => {
      const newSampleCase = sampleCases?.[index] || { input: '', output: '' };
      if (JSON.stringify(prevState) !== JSON.stringify(newSampleCase)) {
        setEditable(false);
      }
      return newSampleCase;
    });
  }, [ index, sampleCases ]);
  
  const onSave = () => {
    const newSamples = [ ...sampleCases ];
    newSamples[index] = sample;
    setSampleCases(newSamples);
    setEditable(false);
  };
  
  return (
    <div className="jk-row stretch gap">
      <div className="jk-row block stretch gap flex-1">
        <div className="jk-row nowrap left stretch gap bc-we jk-br-ie">
          {editable ? (
            <TextArea
              value={sample.input || ''}
              onChange={value => setSample(prevState => ({ ...prevState, input: value }))}
            />
          ) : (
            <div className="sample-text-content jk-br-ie">
              <div className="jk-row gap sample-text-icons">
                <NewlineInfo text={sample.input} />
              </div>
              <span>{sample.input}</span>
            </div>
          )}
        </div>
        <div className="jk-row nowrap left stretch gap bc-we jk-br-ie">
          {editable ? (
            <TextArea
              value={sample.output || ''}
              onChange={value => setSample(prevState => ({ ...prevState, output: value }))}
            />
          ) : (
            <div className="sample-text-content jk-br-ie">
              <div className="jk-row gap sample-text-icons">
                <NewlineInfo text={sample.output} />
              </div>
              <span>
                {sample.output}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="jk-row gap cr-py">
        {editable
          ? <SaveIcon size="small" className="cursor-pointer" onClick={onSave} />
          : <EditIcon size="small" className="cursor-pointer" onClick={() => setEditable(true)} />}
        <DeleteIcon
          size="small"
          className="cursor-pointer"
          onClick={() => setSampleCases([ ...sampleCases ].filter((_, sIndex) => sIndex !== index))}
        />
      </div>
    </div>
  );
};
