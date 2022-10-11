import { Popover, T } from 'components';
import { PROBLEM_MODE, PROBLEM_STATUS, PROBLEM_TYPE, PROGRAMMING_LANGUAGE } from 'config/constants';
import { classNames } from 'helpers';
import { ProblemMode, ProblemSettingsType, ProblemStatus } from 'types';

export interface ProblemInfoProps {
  settings: ProblemSettingsType,
  tags: string[],
  author: string,
  status: ProblemStatus,
  horizontal?: boolean,
}

export const ProblemInfo = ({ settings, tags, author, status, horizontal = false }: ProblemInfoProps) => {
  
  const subTasks = (
    <>
      {Object.keys(settings?.pointsByGroups || {}).map(key => (
        <div key={key}>
          {key === '0'
            ? <span className="label tt-ce fw-bd"><T>sample cases</T>: </span>
            : <span className="label tt-ce fw-bd"><T>subtask</T> {key}: </span>}
          {settings?.pointsByGroups[key].points} <T>points</T>
        </div>
      ))}
      <div>
        <span className="label tt-ce fw-bd"><T>total</T><span>:</span></span>
        {Object.values(settings?.pointsByGroups || {})
          .reduce((sum, { points }) => +sum + +points, 0)} <T>points</T>
      </div>
    </>
  );
  
  const limits = () => {
    const languages = Object.values(settings?.byProgrammingLanguage || {});
    
    return (
      <>
        <div>
          <span className="label fw-br tt-ce"><T>time limit</T></span>
          <div className="problem-sub-info">
            <div>
              <span className="label fw-bd tt-se"><T>general</T>:</span>
              {(settings?.timeLimit / 1000).toFixed(1)}&nbsp;<T>seconds</T>
            </div>
          </div>
          <div className="problem-sub-info">
            {languages.map((language) => (
              <div key={language.language}>
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
              {(settings?.memoryLimit / 1000).toFixed(1)}&nbsp;<T>MB</T>
            </div>
          </div>
          <div className="problem-sub-info">
            {languages.map((language) => (
              <div key={language.language}>
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
    <div className={classNames('center problem-info  jk-pad-md', {
      gap: horizontal,
      'jk-row': horizontal,
      'jk-col': !horizontal,
      stretch: !horizontal,
      horizontal,
    })}>
      {limits()}
      <div>
        <span className="label fw-br tt-ce"><T>type</T><span>:</span></span>
        <T className="tt-ce">{PROBLEM_TYPE[settings?.type]?.label}</T>
      </div>
      <div>
        <span className="label fw-br tt-ce"><T>mode</T><span>:</span></span>
        {(horizontal && settings?.mode === ProblemMode.SUBTASK) ? (
          <Popover
            content={<div className="groups-popover">{subTasks}</div>}
            placement="bottom"
          >
            <div><T className="tt-ce">{PROBLEM_MODE[settings?.mode]?.label}</T></div>
          </Popover>
        ) : <T className="tt-ce">{PROBLEM_MODE[settings?.mode]?.label}</T>}
        {!horizontal && settings?.mode === ProblemMode.SUBTASK && <div className="problem-sub-info">{subTasks}</div>}
      </div>
      {!!tags?.length && (
        <div>
          <span className="label fw-br tt-ce"><T>tags</T><span>:</span></span>
          {horizontal ? (
            <Popover
              content={
                <div className="jk-row gap">
                  {tags.map(tag => <span className="jk-tag gray-6" key={tag}>{tag}</span>)}
                </div>
              }
              placement="bottom"
            >
              <div><span className="count-tags">{tags.length}</span></div>
            </Popover>
          ) : (
            <span className="jk-row left gap">
              {tags.filter(tag => !!tag.trim()).map(tag => <span className="jk-tag gray-6" key={tag}>{tag}</span>)}
            </span>
          )}
        </div>
      )}
      {author && (
        <div>
          <span className="label fw-br tt-ce"><T>author</T><span>:</span></span>
          {author}
        </div>
      )}
      {status && (
        <div>
          <span className="label fw-br tt-ce"><T>visibility</T><span>:</span></span>
          <T className="tt-ce">{PROBLEM_STATUS[status]?.label}</T>
        </div>
      )}
    </div>
  );
};
