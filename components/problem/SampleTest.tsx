import {
  ContentCopyIcon,
  CopyToClipboard,
  DeleteIcon,
  EditIcon,
  InfoIcon,
  SaveIcon,
  T,
  TextArea,
  Tooltip,
} from 'components';
import React, { useEffect, useState } from 'react';
import { ProblemSampleCasesType } from 'types';

interface SampleTestProps {
  index: number,
  sampleCases: ProblemSampleCasesType,
  setSampleCases?: (sampleCases: ProblemSampleCasesType) => void,
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
  
  const onSave = setSampleCases ? () => {
    const newSamples = [ ...sampleCases ];
    newSamples[index] = sample;
    setSampleCases(newSamples);
    setEditable(false);
  } : () => null;
  
  return (
    <div className="jk-row stretch gap">
      <div className="jk-row block stretch gap flex-1">
        <div className="jk-row nowrap left stretch gap bc-we jk-border-radius-inline">
          {editable ? (
            <TextArea
              value={sample.input || ''}
              onChange={value => setSample(prevState => ({ ...prevState, input: value }))}
            />
          ) : (
            <div className="sample-text-content jk-border-radius-inline">
              <CopyToClipboard text={sample.input}>
                <ContentCopyIcon
                  size="small"
                  className="clickable br-50-pc copy-test-icon"
                />
              </CopyToClipboard>
              <Tooltip
                content={
                  <T>{`${sample.input.lastIndexOf('\n') === sample.input.length - 1 ? '' : 'no '}newline at end of file`}</T>
                }
                placement="left"
              >
                <div className="newline-eof"><InfoIcon size="small" /></div>
              </Tooltip>
              <span>{sample.input}</span>
            </div>
          )}
        </div>
        <div className="jk-row nowrap left stretch gap bc-we jk-border-radius-inline">
          {editable ? (
            <TextArea
              value={sample.output || ''}
              onChange={value => setSample(prevState => ({ ...prevState, output: value }))}
            />
          ) : (
            <div className="sample-text-content jk-border-radius-inline">
              <CopyToClipboard text={sample.output}>
                <ContentCopyIcon
                  size="small"
                  className="clickable br-50-pc copy-test-icon"
                />
              </CopyToClipboard>
              <Tooltip
                content={
                  <T>{`${sample.output.lastIndexOf('\n') === sample.output.length - 1 ? '' : 'no '}newline at end of file`}</T>
                }
                placement="left"
              >
                <div className="newline-eof"><InfoIcon size="small" /></div>
              </Tooltip>
              <span>
                {sample.output}
              </span>
            </div>
          )}
        </div>
      </div>
      {setSampleCases && (
        <div className="jk-row gap cr-py">
          {editable
            ? <SaveIcon size="small" className="cursor-pointer" onClick={onSave} />
            : <EditIcon size="small" className="cursor-pointer" onClick={() => setEditable(true)} />}
          <DeleteIcon
            size="small"
            className="cursor-pointer"
            onClick={() => setSampleCases([ ...sampleCases ].filter((sample, sIndex) => sIndex !== index))}
          />
        </div>
      )}
    </div>
  );
};
