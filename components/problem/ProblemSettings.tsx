import { Button, CloseIcon, Input, MultiSelect, PlusIcon, Select, T } from 'components';
import {
  ACCEPTED_PROGRAMMING_LANGUAGES,
  PROBLEM_MODE,
  PROBLEM_STATUS,
  PROBLEM_TYPE,
  PROGRAMMING_LANGUAGE,
  RUNNER_ACCEPTED_PROBLEM_MODES,
  RUNNER_ACCEPTED_PROBLEM_TYPES,
} from 'config/constants';
import { classNames } from 'helpers';
import { useState } from 'react';

export const Tags = ({ tags, onChange }: { tags: string[], onChange: (newTags: string[]) => void }) => {
  
  const [text, setText] = useState('');
  
  return (
    <div className="jk-row start gap">
      <div className="jk-row start gap">
        {tags?.map(tag => (
          <div className="jk-tag gray-6" key={tag}>
            <div className="jk-row gap">
              {tag}
              <CloseIcon
                filledCircle
                size="small"
                className="color-gray-3"
                onClick={() => onChange(tags.filter(t => t !== tag))}
              />
            </div>
          </div>
        ))}
      </div>
      <Input onChange={newValue => setText(newValue)} value={text} />
      <Button
        disabled={text === '' || tags.some(tag => tag === text)}
        icon={<PlusIcon />}
        size="small"
        onClick={() => {
          onChange([...tags, text]);
          setText('');
        }}
      />
    </div>
  );
};

export const ProblemSettings = ({ problem, setProblem, originalProblemRef }) => {
    
    return (
      <div className="jk-pad jk-row start">
        <div className="jk-col filled gap">
          <div
            className={classNames('jk-row start gap', { 'color-info': JSON.stringify(problem.settings?.languages) !== JSON.stringify(originalProblemRef.current.settings?.languages) })}>
            <div className="text-semi-bold text-sentence-case"><T>programming languages</T>:</div>
            <MultiSelect
              options={ACCEPTED_PROGRAMMING_LANGUAGES.map(p => ({ value: p, label: PROGRAMMING_LANGUAGE[p].name }))}
              optionsSelected={problem.settings?.languages?.map?.(lang => ({
                value: lang,
                label: PROGRAMMING_LANGUAGE[lang]?.name || lang,
              }))}
              onChange={(values) => setProblem({
                ...problem,
                settings: { ...problem.settings, languages: values.map(value => value.value) },
              })}
            />
          </div>
          <div
            className={classNames(
              'jk-row start gap',
              { 'color-info': JSON.stringify(problem.settings?.mode) !== JSON.stringify(originalProblemRef.current.settings?.mode) },
            )}
          >
            <div className="text-semi-bold text-sentence-case"><T>problem mode</T>:</div>
            <Select
              options={RUNNER_ACCEPTED_PROBLEM_MODES.map(mode => ({ value: mode, label: PROBLEM_MODE[mode]?.print }))}
              optionSelected={{
                value: problem.settings?.mode,
                label: PROBLEM_MODE[problem.settings?.mode]?.name || problem.settings?.mode,
              }}
              onChange={({ value }) => setProblem({ ...problem, settings: { ...problem.settings, mode: value } })}
            />
          </div>
          <div
            className={classNames(
              'jk-row start gap',
              { 'color-info': JSON.stringify(problem.settings?.typeInput) !== JSON.stringify(originalProblemRef.current.settings?.typeInput) },
            )}
          >
            <div className="text-semi-bold text-sentence-case"><T>problem type</T>:</div>
            <Select
              options={RUNNER_ACCEPTED_PROBLEM_TYPES.map(type => ({ value: type, label: PROBLEM_TYPE[type]?.print }))}
              optionSelected={{
                value: problem.settings?.typeInput,
                label: PROBLEM_TYPE[problem.settings?.typeInput]?.name || problem.settings?.typeInput,
              }}
              onChange={({ value }) => setProblem({ ...problem, settings: { ...problem.settings, typeInput: value } })}
            />
          </div>
          <div
            className={classNames(
              'jk-row start gap',
              { 'color-info': JSON.stringify(problem.settings?.timeLimit) !== JSON.stringify(originalProblemRef.current.settings?.timeLimit) },
            )}
          >
            <div className="text-semi-bold text-sentence-case"><T>time limit per test</T>:</div>
            <Input
              type="number"
              value={problem.settings.timeLimit}
              onChange={value => setProblem({ ...problem, settings: { ...problem.settings, timeLimit: value } })} />
            {problem.settings.timeLimit > 1 ? <T>seconds</T> : <T>second</T>}
          </div>
          <div
            className={classNames(
              'jk-row start gap',
              { 'color-info': JSON.stringify(problem.settings?.memoryLimit) !== JSON.stringify(originalProblemRef.current.settings?.memoryLimit) },
            )}
          >
            <div className="text-semi-bold text-sentence-case"><T>memory limit per test</T></div>
            <Input
              type="number"
              value={problem.settings.memoryLimit}
              onChange={value => setProblem({ ...problem, settings: { ...problem.settings, memoryLimit: value } })}
            />
            <T>kb</T>
          </div>
          <div
            className={classNames(
              'jk-row start gap',
              { 'color-info': JSON.stringify(problem.status) !== JSON.stringify(originalProblemRef.current.status) },
            )}
          >
            <div className="text-semi-bold text-sentence-case"><T>visibility</T></div>
            <Select
              options={Object.values(PROBLEM_STATUS).map(status => ({ value: status.value, label: status.print }))}
              optionSelected={{ value: problem.status, label: PROBLEM_STATUS[problem.status]?.print || problem.status }}
              onChange={({ value }) => setProblem({ ...problem, status: value })}
            />
          </div>
          <div
            className={classNames(
              'jk-row start gap',
              { 'color-info': JSON.stringify(problem.author) !== JSON.stringify(originalProblemRef.current.author) },
            )}
          >
            <div className="text-semi-bold text-sentence-case"><T>autor</T></div>
            <Input
              onChange={value => setProblem({ ...problem, author: value })}
              value={problem.author}
            />
          </div>
          <div
            className={classNames(
              'jk-row start gap',
              { 'color-info': JSON.stringify(problem.tags) !== JSON.stringify(originalProblemRef.current.tags) },
            )}
          >
            <div className="text-semi-bold text-sentence-case"><T>tags</T>:</div>
            <Tags tags={problem.tags} onChange={tags => setProblem({ ...problem, tags })} />
          </div>
        </div>
      </div>
    );
  }
;