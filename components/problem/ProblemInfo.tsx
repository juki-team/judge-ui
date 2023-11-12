import { ExclamationIcon, T, Tooltip } from 'components';
import { PROBLEM_MODE, PROBLEM_STATUS, PROBLEM_TYPE, PROGRAMMING_LANGUAGE } from 'config/constants';
import { classNames } from 'helpers';
import React, { Children } from 'react';
import { ProblemMode, ProblemSettingsType, ProblemStatus } from 'types';

export interface ProblemInfoProps {
  settings: ProblemSettingsType,
  tags: string[],
  author: string,
  status: ProblemStatus,
  horizontal?: boolean,
}

export const ExtraProblemInfo = ({ settings, tags, author, status, horizontal = false }: ProblemInfoProps) => {
  
  const languages = Object.values(settings?.byProgrammingLanguage || {});
  
  return (
    <>
      {!!languages.length && (
        <div>
          <T className="fw-bd tt-ce">languages</T>:&nbsp;
          {Children.toArray(languages.map(({ language }) => (
            <><span className="jk-tag gray-6">{PROGRAMMING_LANGUAGE[language].label}</span>&nbsp;</>
          )))}
        </div>
      )}
      {!!tags?.length && (
        <div>
          <T className="fw-bd tt-ce">tags</T>:&nbsp;
          {horizontal ? (
            <Tooltip
              content={
                <div className="jk-row gap">
                  {tags.map(tag => <span className="jk-tag gray-6" key={tag}>{tag}</span>)}
                </div>
              }
              placement="bottom"
            >
              <div><span className="count-tags">{tags.length}</span></div>
            </Tooltip>
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
    </>
  );
};

export const ProblemTypeInfo = ({ settings }: { settings: ProblemSettingsType, }) => {
  return (
    <div className="jk-row left nowrap">
      <T className="fw-bd tt-ce">type</T>:&nbsp;
      <T className="tt-ce">{PROBLEM_TYPE[settings?.type]?.label}</T>
    </div>
  );
};

export const ProblemModeInfo = ({ settings, expand }: { settings: ProblemSettingsType, expand: boolean }) => {
  
  const subTasks = (
    <>
      {Object.keys(settings?.pointsByGroups || {}).map(key => (
        <div key={key} className="jk-row left nowrap">
          {key === '0'
            ? <span className="label tt-ce fw-bd"><T className="ws-np">sample cases</T>: </span>
            : <span className="label tt-ce fw-bd"><T>subtask</T> {key}: </span>}
          &nbsp;{settings?.pointsByGroups[+key].points}&nbsp;<T>points</T>
        </div>
      ))}
      <div className="jk-divider tiny" style={{ height: '2px' }} />
      <div className="jk-row left nowrap">
        <span className="label tt-ce fw-bd"><T>total</T><span>:</span></span>
        {Object.values(settings?.pointsByGroups || {})
          .reduce((sum, { points }) => +sum + +points, 0)} <T>points</T>
      </div>
    </>
  );
  
  if (!expand) {
    return (
      <div className="jk-row nowrap">
        <T className="fw-bd tt-ce">mode</T>:&nbsp;<T className="tt-ce">{PROBLEM_MODE[settings?.mode]?.label}</T>
        {settings?.mode === ProblemMode.SUBTASK && (
          <Tooltip
            content={<div className="">{subTasks}</div>}
            placement="bottom"
          >
            <div className="jk-row">&nbsp;<ExclamationIcon filledCircle className="cr-py" rotate={180} /></div>
          </Tooltip>
        )}
      </div>
    );
  }
  
  return (
    <div className="jk-col nowrap stretch">
      <div className="jk-row nowrap left">
        <T className="fw-bd tt-ce">mode</T>:&nbsp;
        <T className="tt-ce">{PROBLEM_MODE[settings?.mode]?.label}</T>
      </div>
      {settings?.mode === ProblemMode.SUBTASK && <div className="problem-sub-info">{subTasks}</div>}
    </div>
  );
};

export const ProblemTimeLimitInfo = ({ settings, expand }: { settings: ProblemSettingsType, expand?: boolean }) => {
  
  const limitsLanguages = Object.values(settings?.byProgrammingLanguage || {})
    .filter(({ memoryLimit, timeLimit }) => memoryLimit !== settings.memoryLimit || timeLimit !== settings.timeLimit);
  
  if (expand) {
    return (
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
    );
  }
  
  return (
    <div className="jk-row">
      <T className="fw-bd tt-ce">time limit</T>:
      &nbsp;{(settings?.timeLimit / 1000).toFixed(1)}
      &nbsp;<T>seconds</T>
      {!!limitsLanguages.length && (
        <Tooltip
          content={
            <div>
              <div className="jk-row nowrap left">
                <span className="fw-bd ws-np"><T className="tt-se">general</T>:</span>&nbsp;
                {(settings?.timeLimit / 1000).toFixed(1)}&nbsp;<T>seconds</T>
              </div>
              {limitsLanguages.map((language) => (
                <div key={language.language} className="jk-row nowrap left">
                  <span className="fw-bd ws-np">{PROGRAMMING_LANGUAGE[language.language]?.label}:</span>&nbsp;
                  {(language?.timeLimit / 1000).toFixed(1)}&nbsp;<T>seconds</T>
                </div>
              ))}
            </div>
          }
          placement="bottom"
        >
          <div className="jk-row">&nbsp;<ExclamationIcon filledCircle className="cr-py" rotate={180} /></div>
        </Tooltip>
      )}
    </div>
  );
};

export const ProblemMemoryLimitInfo = ({ settings, expand }: { settings: ProblemSettingsType, expand?: boolean }) => {
  
  const limitsLanguages = Object.values(settings?.byProgrammingLanguage || {})
    .filter(({ memoryLimit, timeLimit }) => memoryLimit !== settings.memoryLimit || timeLimit !== settings.timeLimit);
  
  if (expand) {
    return (
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
    );
  }
  
  return (
    <div className="jk-row">
      <T className="fw-bd tt-ce">memory limit</T>:
      &nbsp;{(settings?.memoryLimit / 1000).toFixed(1)}
      &nbsp;<T>MB</T>
      {!!limitsLanguages.length && (
        <Tooltip
          content={
            <div>
              <div className="jk-row nowrap left">
                <span className="fw-bd ws-np"><T className="tt-se">general</T>:</span>&nbsp;
                {(settings?.memoryLimit / 1000).toFixed(1)}&nbsp;<T>MB</T>
              </div>
              {limitsLanguages.map((language) => (
                <div key={language.language} className="jk-row nowrap left">
                  <span className="fw-bd ws-np">{PROGRAMMING_LANGUAGE[language.language]?.label}:</span>&nbsp;
                  {(language?.memoryLimit / 1000).toFixed(1)}&nbsp;<T>MB</T>
                </div>
              ))}
            </div>
          }
          placement="bottom"
        >
          <div className="jk-row">&nbsp;<ExclamationIcon filledCircle className="cr-py" rotate={180} /></div>
        </Tooltip>
      )}
    </div>
  );
};

export const ProblemInfo = (props: ProblemInfoProps) => {
  
  const { settings, horizontal = false } = props;
  
  return (
    <div
      className={classNames('center problem-info', {
        gap: horizontal,
        'jk-row': horizontal,
        'jk-col': !horizontal,
        stretch: !horizontal,
        horizontal,
      })}
    >
      <ProblemTimeLimitInfo settings={settings} expand={!horizontal} />
      <ProblemMemoryLimitInfo settings={settings} expand={!horizontal} />
      <ProblemTypeInfo settings={settings} />
      <ProblemModeInfo settings={settings} expand={!horizontal} />
      <ExtraProblemInfo {...props} />
    </div>
  );
};
