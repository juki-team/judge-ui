'use client';

import { ExclamationIcon, InformationProps, Modal, T } from 'components';
import { useState } from 'hooks';
import { ProblemVerdict } from 'types';
import { Verdict } from './Verdict';

export const ProblemScoringModeInformation = ({ filledCircle }: InformationProps) => {
  const [ isOpen, setIsOpen ] = useState(false);
  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="jk-col left stretch gap jk-pg">
          <h3><T className="tt-se">problem scoring mode</T></h3>
          <div><T className="tx-l cr-py fw-bd tt-se">total</T></div>
          <div className="jk-row left">
            <T className="tt-se">if all test cases are</T>&nbsp;<Verdict verdict={ProblemVerdict.AC} />&nbsp;
            <T>the result is</T>&nbsp;<Verdict verdict={ProblemVerdict.AC} />&nbsp;
            <T>otherwise it will be</T>&nbsp;
            <Verdict verdict={ProblemVerdict.RE} />,&nbsp;
            <Verdict verdict={ProblemVerdict.TLE} />,&nbsp;
            <Verdict verdict={ProblemVerdict.MLE} />,&nbsp;
            <Verdict verdict={ProblemVerdict.WA} />&nbsp;
            <T>or</T>&nbsp;
            <Verdict verdict={ProblemVerdict.PE} />&nbsp;
            <T>in that order</T>.
          </div>
          <div><T className="tx-l cr-py fw-bd tt-se">subtask</T></div>
          <div className="jk-row left" style={{ display: 'ruby' }}>
            <T className="tt-se">the test cases</T>&nbsp;<T>are grouped and each group is assigned a score</T>,&nbsp;
            <T>if all test cases in a group are</T>&nbsp;<Verdict verdict={ProblemVerdict.AC} />&nbsp;
            <T>then the score assigned to that group is added to the total score</T>,&nbsp;
            <T>if total score is equal to the sum of the assigned scores of all groups then the result is</T>&nbsp;
            <Verdict verdict={ProblemVerdict.AC} />,&nbsp;
            <T>otherwise if the total score is greater than zero the result is</T>&nbsp;
            <Verdict verdict={ProblemVerdict.PA} />&nbsp;<T>with the total accumulated score</T>,&nbsp;
            <T>otherwise it will be</T>&nbsp;
            <Verdict verdict={ProblemVerdict.RE} />,&nbsp;
            <Verdict verdict={ProblemVerdict.TLE} />,&nbsp;
            <Verdict verdict={ProblemVerdict.MLE} />,&nbsp;
            <Verdict verdict={ProblemVerdict.WA} />&nbsp;
            <T>or</T>&nbsp;
            <Verdict verdict={ProblemVerdict.PE} />&nbsp;
            <T>in that order</T>.
          </div>
          <div><T className="tx-l cr-py fw-bd tt-se">partial</T></div>
          <div className="jk-row left" style={{ display: 'ruby' }}>
            <T className="tt-se">the test cases</T>&nbsp;
            <T>are grouped and each group is assigned a partial score</T>,&nbsp;
            <T>if the result of a test case is</T>&nbsp;<Verdict verdict={ProblemVerdict.AC} />&nbsp;
            <T>then the partial score assigned to its group is added to the total score</T>&nbsp;
            <T>if total score is equal to the sum of the assigned scores of all groups then the result is</T>&nbsp;
            <Verdict verdict={ProblemVerdict.AC} />,&nbsp;
            <T>otherwise if the total score is greater than zero the result is</T>&nbsp;
            <Verdict verdict={ProblemVerdict.PA} />&nbsp;<T>with the total accumulated score</T>,&nbsp;
            <T>otherwise it will be</T>&nbsp;
            <Verdict verdict={ProblemVerdict.RE} />,&nbsp;
            <Verdict verdict={ProblemVerdict.TLE} />,&nbsp;
            <Verdict verdict={ProblemVerdict.MLE} />,&nbsp;
            <Verdict verdict={ProblemVerdict.WA} />&nbsp;
            <T>or</T>&nbsp;
            <Verdict verdict={ProblemVerdict.PE} />&nbsp;
            <T>in that order</T>.
          </div>
        </div>
      </Modal>
      <div
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen(true);
        }}
        className="jk-row cr-pr br-50-pc"
      >
        {filledCircle
          ? <ExclamationIcon rotate={180} filledCircle size="small" />
          : <ExclamationIcon rotate={180} circle size="small" />}
      </div>
    </>
  );
};
