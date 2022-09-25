import { PROGRAMMING_LANGUAGE } from '@juki-team/commons';
import { Popover, T } from 'components';
import { PROBLEM_MODE, PROBLEM_STATUS, PROBLEM_TYPE } from 'config/constants';
import { classNames } from 'helpers';
import { EditCreateProblem, ProblemMode, ProblemResponseDTO } from 'types';

export const ProblemInfo = ({ problem, horizontal = false }: { problem: EditCreateProblem, horizontal?: boolean }) => {
  
  const subTasks = (
    <>
      {Object.keys(problem?.settings?.pointsByGroups || {}).map(key => (
        <div key={key}>
          {key === '0'
            ? <span className="label tt-ce fw-bd"><T>sample cases</T>: </span>
            : <span className="label tt-ce fw-bd"><T>subtask</T> {key}: </span>}
          {problem?.settings?.pointsByGroups[key].points} <T>points</T>
        </div>
      ))}
      <div>
        <span className="label tt-ce fw-bd"><T>total</T><span>:</span></span>
        {Object.values(problem?.settings?.pointsByGroups || {})
          .reduce((sum, { points }) => +sum + +points, 0)} <T>points</T>
      </div>
    </>
  );
  
  const limits = () => {
    const languages = Object.values(problem?.settings?.byProgrammingLanguage || {});
    
    return (
      <>
        <div>
          <span className="label fw-br tt-ce"><T>time limit</T></span>
          <div className="problem-sub-info">
            <div>
              <span className="label fw-bd tt-se"><T>general</T>:</span>
              {(problem.settings?.timeLimit / 1000).toFixed(1)}&nbsp;<T>seconds</T>
            </div>
          </div>
          <div className="problem-sub-info">
            {languages.map((language) => (
              <div>
                <span className="label fw-bd">{PROGRAMMING_LANGUAGE[language.language]?.label}:</span>
                {(language?.timeLimit / 1000).toFixed(1)}&nbsp;<T>seconds</T>
              </div>
            ))}
          </div>
        </div>
        <div>
          <span className="label fw-br tt-ce"><T>memory limit</T></span>
          <div className="problem-sub-info">
            <div>
              <span className="label fw-bd tt-se"><T>general</T>:</span>
              {(problem.settings?.memoryLimit / 1000).toFixed(1)}&nbsp;<T>MB</T>
            </div>
          </div>
          <div className="problem-sub-info">
            {languages.map((language) => (
              <div>
                <span className="label fw-bd">{PROGRAMMING_LANGUAGE[language.language]?.label}:</span>
                {(language?.memoryLimit / 1000).toFixed(1)}&nbsp;<T>MB</T>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };
  
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
        <span className="label fw-br tt-ce"><T>type</T><span>:</span></span>
        <T className="tt-ce">{PROBLEM_TYPE[problem?.settings?.type]?.label}</T>
      </div>
      <div>
        <span className="label fw-br tt-ce"><T>mode</T><span>:</span></span>
        {(horizontal && problem?.settings?.mode === ProblemMode.SUBTASK) ? (
          <Popover
            content={<div className="groups-popover">{subTasks}</div>}
            placement="bottom"
          >
            <div><T className="tt-ce">{PROBLEM_MODE[problem?.settings?.mode]?.label}</T></div>
          </Popover>
        ) : <T className="tt-ce">{PROBLEM_MODE[problem?.settings?.mode]?.label}</T>}
        {!horizontal && problem?.settings?.mode === ProblemMode.SUBTASK && <div className="problem-sub-info">{subTasks}</div>}
      </div>
      {!!problem?.tags?.length && (
        <div>
          <span className="label fw-br tt-ce"><T>tags</T><span>:</span></span>
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
          <span className="label fw-br tt-ce"><T>author</T><span>:</span></span>
          {problem.author}
        </div>
      )}
      {problem?.status && (
        <div>
          <span className="label fw-br tt-ce"><T>visibility</T><span>:</span></span>
          <T className="tt-ce">{PROBLEM_STATUS[problem.status]?.label}</T>
        </div>
      )}
    </div>
  );
};