import { PROGRAMMING_LANGUAGE } from '@juki-team/commons';
import { Popover, T } from 'components';
import { PROBLEM_MODE, PROBLEM_STATUS, PROBLEM_TYPE } from 'config/constants';
import { classNames } from 'helpers';
import { ProblemMode, ProblemResponseDTO } from 'types';

export const ProblemInfo = ({ problem, horizontal = false }: { problem: ProblemResponseDTO, horizontal?: boolean }) => {
  
  const subTasks = (
    <>
      {Object.keys(problem?.pointsByGroups || {}).map(key => (
        <div key={key}>
          {key === '0'
            ? <span className="label text-capitalize text-semi-bold"><T>sample cases</T>: </span>
            : <span className="label text-capitalize text-semi-bold"><T>subtask</T> {key}: </span>}
          {problem?.pointsByGroups[key].points} <T>points</T>
        </div>
      ))}
      <div>
        <span className="label text-capitalize text-semi-bold"><T>total</T><span>:</span></span>
        {Object.values(problem?.pointsByGroups || {})
          .reduce((sum, { points }) => +sum + +points, 0)} <T>points</T>
      </div>
    </>
  );
  
  const limits = () => {
    const languages = Object.values(problem?.languages || {});
    const timeLimit = languages[0]?.timeLimit || 0;
    const memoryLimit = languages[0]?.memoryLimit || 0;
    
    return (
      <>
        <div>
          <span className="label text-bold text-capitalize"><T>time limit</T><span>:</span></span>
          {languages.reduce((totalValue, language) => totalValue && (language.timeLimit === timeLimit), true) ? (
            <>{(timeLimit / 1000).toFixed(1)}&nbsp;<T>seconds</T></>
          ) : (
            <div className="problem-sub-info">
              <div>
                {languages.map((language) => (
                  <div>
                    <span className="label text-semi-bold">{PROGRAMMING_LANGUAGE[language.language]?.label}:</span>
                    {(language?.timeLimit / 1000).toFixed(1)}&nbsp;<T>seconds</T>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
          <span className="label text-bold text-capitalize"><T>memory limit</T><span>:</span></span>
          {languages.reduce((totalValue, language) => totalValue && (language.memoryLimit === memoryLimit), true) ? (
            <>{(memoryLimit / 1000).toFixed(1)}&nbsp;<T>MB</T></>
          ) : (
            <div className="problem-sub-info">
              <div>
                {languages.map((language) => (
                  <div>
                    <span className="label text-semi-bold">{PROGRAMMING_LANGUAGE[language.language]?.label}:</span>
                    {(language?.memoryLimit / 1000).toFixed(1)}&nbsp;<T>MB</T>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
  };
  console.log({ problem });
  
  return (
    <div className={classNames('center problem-info  jk-pad', {
      gap: horizontal,
      'jk-row': horizontal,
      'jk-col': !horizontal,
      stretch: !horizontal,
      horizontal,
    })}>
      {limits()}
      <div>
        <span className="label text-bold text-capitalize"><T>type</T><span>:</span></span>
        <T className="text-capitalize">{PROBLEM_TYPE[problem?.type]?.label}</T>
      </div>
      <div>
        <span className="label text-bold text-capitalize"><T>mode</T><span>:</span></span>
        {(horizontal && problem?.mode === ProblemMode.SUBTASK) ? (
          <Popover
            content={<div className="groups-popover">{subTasks}</div>}
            placement="bottom"
          >
            <div><T className="text-capitalize">{PROBLEM_MODE[problem?.mode]?.label}</T></div>
          </Popover>
        ) : <T className="text-capitalize">{PROBLEM_MODE[problem?.mode].label}</T>}
        {!horizontal && problem?.mode === ProblemMode.SUBTASK && <div className="problem-sub-info">{subTasks}</div>}
      </div>
      {!!problem?.tags?.length && (
        <div>
          <span className="label text-bold text-capitalize"><T>tags</T><span>:</span></span>
          {horizontal ? (
            <Popover
              content={
                <div className="jk-row gap">
                  {problem.tags.map(tag => <span className="jk-tag gray-6" key={tag}>{tag}</span>)}
                </div>
              }
              placement="bottom"
            >
              <div><span className="count-tags">{problem.tags.length}</span></div>
            </Popover>
          ) : (
            <span className="jk-row left gap">
              {problem.tags.filter(tag => !!tag.trim()).map(tag => <span className="jk-tag gray-6" key={tag}>{tag}</span>)}
            </span>
          )}
        </div>
      )}
      {problem?.author && (
        <div>
          <span className="label text-bold text-capitalize"><T>author</T><span>:</span></span>
          {problem.author}
        </div>
      )}
      {problem?.status && (
        <div>
          <span className="label text-bold text-capitalize"><T>visibility</T><span>:</span></span>
          <T className="text-capitalize">{PROBLEM_STATUS[problem.status]?.label}</T>
        </div>
      )}
    </div>
  );
};