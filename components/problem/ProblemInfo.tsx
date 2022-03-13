import { PROBLEM_MODE, PROBLEM_STATUS, PROBLEM_TYPE } from '../../config/constants';
import { classNames } from '../../helpers';
import { Popover, T } from '../index';

export const ProblemInfo = ({ problem, horizontal = false }) => {
  
  const subTasks = () => {
    return (
      <>
        {Object.keys(problem?.settings?.groupsPoint || {}).map(key => (
          <div key={key}>
            <span className="label text-capitalize text-semi-bold"><T>subtask</T> {key}</span>:
            {problem?.settings?.groupsPoint[key]}
          </div>
        ))}
        <div>
          <span className="label text-capitalize text-semi-bold"><T>total</T><span>:</span></span>
          {Object.values(problem?.settings?.groupsPoint || {})
            .reduce((sum, value) => +sum + +value, 0)} <T>points</T>
        </div>
      </>
    );
  };
  
  return (
    <div className={classNames(' center problem-info  jk-pad', {
      gap: horizontal,
      'jk-row': horizontal,
      'jk-col': !horizontal,
      filled: !horizontal,
      horizontal,
    })}>
      <div>
        <span className="label text-bold text-capitalize text-s"><T>time limit</T><span>:</span></span>
        {(problem?.settings?.timeLimit / 1000).toFixed(1)} s
      </div>
      <div>
        <span className="label text-bold text-capitalize text-s"><T>memory limit</T><span>:</span></span>
        {(problem?.settings?.memoryLimit / 1000).toFixed(1)} MB
      </div>
      <div>
        <span className="label text-bold text-capitalize text-s"><T>type</T><span>:</span></span>
        <T className="text-capitalize">{PROBLEM_TYPE[problem?.settings?.typeInput].print}</T>
      </div>
      <div>
        <span className="label text-bold text-capitalize text-s"><T>mode</T><span>:</span></span>
        {horizontal ? (
          <Popover
            content={<div className="groups-popover">{subTasks()}</div>}
            placement="bottom"
          >
            <div><T className="text-capitalize">{PROBLEM_MODE[problem?.settings?.mode].print}</T></div>
          </Popover>
        ) : <T className="text-capitalize">{PROBLEM_MODE[problem?.settings?.mode].print}</T>}
        {!horizontal && <div className="points">{subTasks()}</div>}
      </div>
      {problem?.tags && (
        <div>
          <span className="label text-bold text-capitalize text-s"><T>tags</T><span>:</span></span>
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
            <span className="jk-row start gap">{problem.tags.map(tag => <span className="jk-tag gray-6" key={tag}>{tag}</span>)}</span>
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
          <span className="label text-bold text-capitalize text-s"><T>visibility</T><span>:</span></span>
          <T className="text-capitalize">{PROBLEM_STATUS[problem.status].print}</T>
        </div>
      )}
    </div>
  );
};