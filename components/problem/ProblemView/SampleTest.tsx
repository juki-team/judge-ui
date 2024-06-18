import { ContentCopyIcon, CopyToClipboard, InfoIcon, T, Tooltip } from 'components';
import React from 'react';
import { ProblemSampleCasesType } from 'types';

interface SampleTestProps {
  index: number,
  sampleCases: ProblemSampleCasesType,
}

export const SampleTest = ({ index, sampleCases }: SampleTestProps) => {
  
  const sample = sampleCases?.[index] || { input: '', output: '' };
  
  return (
    <div className="jk-row stretch gap">
      <div className="jk-row block stretch gap flex-1">
        <div className="jk-row nowrap left stretch gap bc-we jk-border-radius-inline">
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
        </div>
        <div className="jk-row nowrap left stretch gap bc-we jk-border-radius-inline">
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
        </div>
      </div>
    </div>
  );
};
