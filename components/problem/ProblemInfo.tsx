import { Popover, T } from 'components';
import { PROBLEM_MODE, PROBLEM_STATUS, PROBLEM_TYPE, PROGRAMMING_LANGUAGE } from 'config/constants';
import { classNames } from 'helpers';
import { Children } from 'react';
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
  const languages = Object.values(settings?.byProgrammingLanguage || {});
  const limits = () => {
    const limitsLanguages = languages.filter(({
      memoryLimit,
      timeLimit,
    }) => memoryLimit !== settings.memoryLimit || timeLimit !== settings.timeLimit);
    return (
      <>
        <div>
          <T className="fw-bd tt-ce">time limit</T>:&nbsp;
          {!!limitsLanguages.length ? (
            <div className="problem-sub-info">
              <div>
                <T className="fw-bd tt-se">general</T>:&nbsp;
                {(settings?.timeLimit / 1000).toFixed(1)}&nbsp;<T>seconds</T>
              </div>
            </div>
          ) : (
            <>{(settings?.timeLimit / 1000).toFixed(1)}&nbsp;<T>seconds</T></>
          )}
          <div className="problem-sub-info">
            {limitsLanguages.map((language) => (
              <div key={language.language}>
                <span className="label fw-bd">{PROGRAMMING_LANGUAGE[language.language]?.label}:</span>
                {(language?.timeLimit / 1000).toFixed(1)}&nbsp;<T>seconds</T>
              </div>
            ))}
          </div>
        </div>
        <div>
          <T className="fw-bd tt-ce">memory limit</T>:&nbsp;
          {!!limitsLanguages.length ? (
            <div className="problem-sub-info">
              <div>
                <T className="fw-bd tt-se">general</T>:&nbsp;
                {(settings?.memoryLimit / 1000).toFixed(1)}&nbsp;<T>MB</T>
              </div>
            </div>
          ) : (
            <>{(settings?.memoryLimit / 1000).toFixed(1)}&nbsp;<T>MB</T></>
          )}
          <div className="problem-sub-info">
            {limitsLanguages.map((language) => (
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
    <div className={classNames('center problem-info jk-border-radius-inline jk-pad-md bc-we', {
      gap: horizontal,
      'jk-row': horizontal,
      'jk-col': !horizontal,
      stretch: !horizontal,
      horizontal,
    })}>
      {limits()}
      {!!languages.length && (
        <div>
          <T className="fw-bd tt-ce">languages</T>:&nbsp;
          {Children.toArray(languages.map(({ language }) => (
            <><span className="jk-tag gray-6">{PROGRAMMING_LANGUAGE[language].label}</span>&nbsp;</>
          )))}
        </div>
      )}
      <div>
        <T className="fw-bd tt-ce">type</T>:&nbsp;
        <T className="tt-ce">{PROBLEM_TYPE[settings?.type]?.label}</T>
      </div>
      <div>
        <T className="fw-bd tt-ce">mode</T>:&nbsp;
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
          <T className="fw-bd tt-ce">tags</T>:&nbsp;
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
            Children.toArray(tags.filter(tag => !!tag.trim()).map(tag => (
              <><span className="jk-tag gray-6">{tag}</span>&nbsp;</>
            )))
          )}
        </div>
      )}
      {author && (
        <div>
          <T className="fw-bd tt-ce">author</T>:&nbsp;{author}
        </div>
      )}
      {status && (
        <div>
          <T className="fw-bd tt-ce">visibility</T>:&nbsp;
          <T className="tt-ce">{PROBLEM_STATUS[status]?.label}</T>
        </div>
      )}
    </div>
  );
};
