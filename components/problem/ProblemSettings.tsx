import {
  Button,
  CloseIcon,
  DeleteIcon,
  Input,
  InputToggle,
  Modal,
  MultiSelect,
  PlusIcon,
  Popover,
  Select,
  T,
  UserCodeEditor,
  WarningIcon,
} from 'components';
import {
  ACCEPTED_PROGRAMMING_LANGUAGES,
  EmptyTextLanguages,
  PROBLEM_MODE,
  PROBLEM_STATUS,
  PROBLEM_TYPE,
  PROGRAMMING_LANGUAGE,
  RUNNER_ACCEPTED_PROBLEM_MODES,
  RUNNER_ACCEPTED_PROBLEM_TYPES,
} from 'config/constants';
import { classNames } from 'helpers';
import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  EditCreateProblemType,
  Language,
  ProblemMode,
  ProblemSettingsByProgrammingLanguageType,
  ProblemSettingsPointsByGroupsType,
  ProblemType,
  ProgrammingLanguage,
  SubmissionRunStatus,
} from 'types';

export const Tags = ({ tags, onChange }: { tags: string[], onChange: (newTags: string[]) => void }) => {
  
  const [ text, setText ] = useState('');
  
  return (
    <div className="jk-row left gap">
      <div className="jk-row left gap">
        {tags?.map(tag => (
          <div className="jk-tag gray-6" key={tag}>
            <div className="jk-row gap">
              {tag}
              <CloseIcon
                filledCircle
                size="small"
                className="cr-g3"
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
          onChange([ ...tags, text ]);
          setText('');
        }}
      />
    </div>
  );
};

interface ProblemSettingsProps {
  problem: EditCreateProblemType,
  setProblem: Dispatch<SetStateAction<EditCreateProblemType>>
}

export const ProblemSettings = ({ problem, setProblem }: ProblemSettingsProps) => {
  
  const [ open, setOpen ] = useState(false);
  const [ source, setSource ] = useState('');
  const onCloseModal = () => setOpen(false);
  
  const fixPointsByGroups = (_pointsByGroups: ProblemSettingsPointsByGroupsType, toFilter?: number): ProblemSettingsPointsByGroupsType => {
    const pointsByGroups: ProblemSettingsPointsByGroupsType = {};
    let index = 1;
    Object.values(_pointsByGroups)
      .filter(a => !(a.group === 0 || a.group === toFilter))
      .sort((a, b) => a.group - b.group)
      .forEach((group) => {
        if (!Number.isNaN(+group.points) && !Number.isNaN(+group.partial)) {
          pointsByGroups[index] = {
            group: index,
            points: +group.points,
            partial: +group.partial,
            description: {
              [Language.EN]: group.description?.[Language.EN] || '',
              [Language.ES]: group.description?.[Language.ES] || '',
            },
          };
          index++;
        }
      });
    pointsByGroups[0] = {
      group: 0,
      partial: 0,
      points: 0,
      description: {
        [Language.EN]: 'Group 0 are the sample test cases which have no score.',
        [Language.ES]: 'El grupo 0 son los casos de ejemplo los cuales no tienen puntaje.',
      },
    };
    if (index === 1) {
      return {};
    }
    return pointsByGroups;
  };
  
  return (
    <div className="jk-col left stretch gap nowrap">
      <div className="jk-row left nowrap gap bc-we jk-br-ie jk-pad-sm">
        <div className="jk-row nowrap fw-bd tx-xl cr-er"><T className="tt-se ws-np">problem status</T>:</div>
        <Select
          options={Object.values(PROBLEM_STATUS).map(status => ({
            value: status.value,
            label: (
              <div className="jk-col left">
                <div className="jk-row extend"><T className="fw-bd tt-se">{status.label}</T></div>
                <div className="jk-row extend"><T className="tt-se">{status.description}</T></div>
              </div>
            ),
          }))}
          selectedOption={{ value: problem.status }}
          onChange={({ value }) => setProblem(prevState => ({ ...prevState, status: value }))}
          extend
        />
      </div>
      <div className="jk-col gap left stretch bc-we jk-br-ie jk-pad-sm">
        <div className="jk-row left nowrap gap">
          <div className="fw-bd tt-se"><T>problem mode</T>:</div>
          <Select
            options={RUNNER_ACCEPTED_PROBLEM_MODES.map(mode => ({
              value: mode,
              label: (
                <div className="jk-col left">
                  <div className="jk-row extend"><T className="fw-bd tt-se">{PROBLEM_MODE[mode].label}</T></div>
                  <div className="jk-row extend"><T className="tt-se">{PROBLEM_MODE[mode].description}</T></div>
                </div>
              ),
            }))}
            selectedOption={{ value: problem.settings?.mode }}
            onChange={({ value }) => setProblem({ ...problem, settings: { ...problem.settings, mode: value } })}
            extend
          />
        </div>
        {(problem.settings.mode === ProblemMode.SUBTASK || problem.settings.mode === ProblemMode.PARTIAL) && (
          <div className="jk-row left gap">
            <div className="fw-bd tt-se nowrap"><T className="ws-np">points by groups</T>:</div>
            <div>
              <div className="jk-row jk-table-inline-header block">
                <div className="jk-row"><T className="tt-se">group</T></div>
                {problem.settings.mode === ProblemMode.SUBTASK && (
                  <div className="jk-row"><T className="tt-se">subtask points</T></div>
                )}
                {problem.settings.mode === ProblemMode.PARTIAL && (
                  <div className="jk-row"><T className="tt-se">partial points</T></div>
                )}
              </div>
              {Object.values(problem.settings.pointsByGroups).map(({ group, points, partial }) => (
                <div key={group} className="jk-row jk-table-inline-row block">
                  <div className="jk-row center">
                    <T className="tt-se">group</T>&nbsp;{group}
                    {!!group && (
                      <DeleteIcon
                        size="small"
                        className="cr-py"
                        onClick={() => setProblem({
                          ...problem,
                          settings: {
                            ...problem.settings,
                            pointsByGroups: fixPointsByGroups(problem.settings.pointsByGroups, group),
                          },
                        })}
                      />
                    )}
                  </div>
                  {problem.settings.mode === ProblemMode.SUBTASK && (
                    <div className="jk-row">
                      <Input
                        disabled={group === 0}
                        type="number"
                        value={points}
                        onChange={points => setProblem({
                          ...problem,
                          settings: {
                            ...problem.settings,
                            pointsByGroups: fixPointsByGroups({
                              ...problem.settings.pointsByGroups,
                              [group]: { ...problem.settings.pointsByGroups[group], points },
                            }),
                          },
                        })}
                        extend
                      />
                    </div>
                  )}
                  {problem.settings.mode === ProblemMode.PARTIAL && (
                    <div className="jk-row">
                      <Input
                        disabled={group === 0}
                        type="number"
                        value={partial}
                        onChange={partial => setProblem({
                          ...problem,
                          settings: {
                            ...problem.settings,
                            pointsByGroups: fixPointsByGroups({
                              ...problem.settings.pointsByGroups,
                              [group]: { ...problem.settings.pointsByGroups[group], partial },
                            }),
                          },
                        })}
                        extend
                      />
                    </div>
                  )}
                </div>
              ))}
              <div className="jk-row jk-table-inline-row block">
                <div className="jk-row"><T className="tt-se">total</T></div>
                {problem.settings.mode === ProblemMode.SUBTASK && (
                  <div className="jk-row">
                    {Object.values(problem.settings.pointsByGroups).reduce((sum, group) => sum + group.points, 0)}
                  </div>
                )}
                {problem.settings.mode === ProblemMode.PARTIAL && (
                  <div className="jk-row">
                    {Object.values(problem.settings.pointsByGroups).reduce((sum, group) => sum + group.partial, 0)}
                  </div>
                )}
              </div>
              <div className="jk-row center jk-table-inline-row block">
                <div
                  className="jk-row center extend link"
                  onClick={() => {
                    const groupIndex = Object.keys(problem.settings.pointsByGroups).length || 1;
                    setProblem({
                      ...problem,
                      settings: {
                        ...problem.settings,
                        pointsByGroups: fixPointsByGroups({
                          ...problem.settings.pointsByGroups,
                          [groupIndex]: { group: groupIndex, points: 0, partial: 0, description: EmptyTextLanguages },
                        }),
                      },
                    });
                  }}
                >
                  <PlusIcon />&nbsp;<T>add group</T>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="jk-row left nowrap gap">
          <div className="fw-bd tt-se"><T>problem type</T>:</div>
          <Select
            options={RUNNER_ACCEPTED_PROBLEM_TYPES.map(type => ({
              value: type,
              label: (
                <div className="jk-col left">
                  <div className="jk-row extend"><T className="fw-bd tt-se">{PROBLEM_TYPE[type].label}</T></div>
                  <div className="jk-row extend"><T className="tt-se">{PROBLEM_TYPE[type].description}</T></div>
                </div>
              ),
            }))}
            selectedOption={{ value: problem.settings?.type }}
            onChange={({ value }) => setProblem({ ...problem, settings: { ...problem.settings, type: value } })}
            extend
          />
        </div>
        {problem.settings.type === ProblemType.DYNAMIC && (
          <div className="jk-row left gap">
            <div className="fw-bd tt-se"><T>evaluator source</T>:</div>
            <Button size="small" onClick={() => setOpen(true)}><T>save / view evaluator source</T></Button>
            <Modal isOpen={open} onClose={onCloseModal}>
              <div className="jk-pad-md jk-col gap nowrap">
                <div
                  className="jk-border-radius-inline"
                  style={{
                    height: 'calc(var(--vh) * 100 - 200px)',
                    width: '100%',
                    border: '1px solid var(--t-color-gray-6)',
                  }}
                >
                  <UserCodeEditor
                    className="br-g6"
                    expandPosition={{
                      // width: 'var(--screen-content-width)',
                      // height: 'calc(var(--content-height) - var(--pad-md) - var(--pad-md))',
                      width: '100vw',
                      height: 'calc(100vh - 41px)',
                      // top: 'calc(var(--top-horizontal-menu-height) + var(--pad-md))',
                      top: '41px',
                      left: '0',
                      // left: 'calc((100vw - var(--screen-content-width)) / 2)',
                    }}
                    languages={[
                      {
                        value: ProgrammingLanguage.CPP17,
                        label: PROGRAMMING_LANGUAGE[ProgrammingLanguage.CPP17].label,
                      },
                    ]}
                    onSourceChange={setSource}
                    initialTestCases={{
                      'custom-0': {
                        in: '',
                        out: '',
                        key: 'custom-0',
                        index: 0,
                        status: SubmissionRunStatus.NONE,
                        err: '',
                        sample: false,
                        log: '',
                      },
                    }}
                    initialSource={{ [PROGRAMMING_LANGUAGE[ProgrammingLanguage.CPP17].mime]: problem.settings.evaluatorSource }}
                  />
                </div>
                <div className="jk-row extend gap right">
                  <Button type="text" onClick={onCloseModal}><T>close</T></Button>
                  <Button
                    onClick={() => {
                      setProblem({ ...problem, settings: { ...problem.settings, evaluatorSource: source } });
                      onCloseModal();
                    }}
                  >
                    <T>save</T>
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        )}
      </div>
      <div className="jk-col gap left stretch bc-we jk-br-ie jk-pad-sm">
        <div className="jk-row left nowrap gap">
          <div className="fw-bd tt-se"><T>time limit per test</T>:</div>
          <Input
            type="number"
            value={problem.settings.timeLimit}
            onChange={value => setProblem({ ...problem, settings: { ...problem.settings, timeLimit: value } })}
          />
          {problem.settings.timeLimit > 1 ? <T>milliseconds</T> : <T>millisecond</T>}
        </div>
        <div className="jk-row left nowrap gap">
          <div className="fw-bd tt-se"><T>memory limit per test</T>:</div>
          <Input
            type="number"
            value={problem.settings.memoryLimit}
            onChange={value => setProblem({ ...problem, settings: { ...problem.settings, memoryLimit: value } })}
          />
          <T>KB</T>
        </div>
      </div>
      <div className="jk-col gap left stretch bc-we jk-br-ie jk-pad-sm">
        <div className="jk-row left gap">
          <div className="fw-bd tt-se"><T>presentation error</T>:</div>
          <InputToggle
            checked={problem.settings.withPE}
            size="small"
            onChange={(value) => setProblem(prevState => ({
              ...prevState,
              settings: { ...prevState.settings, withPE: value },
            }))}
            leftLabel={
              <T className={classNames('tt-se', { 'fw-bd': !problem.settings.withPE })}>without presentation error</T>
            }
            rightLabel={
              <T className={classNames('tt-se', { 'fw-bd': problem.settings.withPE })}>with presentation error</T>
            }
          />
        </div>
      </div>
      <div className="jk-col gap left stretch bc-we jk-br-ie jk-pad-sm">
        <div className="jk-row left nowrap gap">
          <div className="jk-row fw-bd tt-se nowrap">
            <T className="ws-np tt-se">programming languages</T>
            {!Object.keys(problem.settings?.byProgrammingLanguage).length && (
              <Popover content={<T>there must be at least one language selected</T>}>
                <div><WarningIcon className="cr-er" /></div>
              </Popover>
            )}
            :
          </div>
          <MultiSelect
            options={ACCEPTED_PROGRAMMING_LANGUAGES.map(p => ({ value: p, label: PROGRAMMING_LANGUAGE[p].label }))}
            selectedOptions={Object.values(problem.settings?.byProgrammingLanguage).map?.(({ language }) => ({
              value: language,
            }))}
            onChange={(values) => {
              const byProgrammingLanguage: ProblemSettingsByProgrammingLanguageType = {};
              values.forEach((value) => {
                const language = value.value;
                byProgrammingLanguage[language] = {
                  timeLimit: problem.settings.byProgrammingLanguage?.[language]?.timeLimit || problem.settings.timeLimit,
                  memoryLimit: problem.settings.byProgrammingLanguage?.[language]?.memoryLimit
                    || problem.settings.memoryLimit,
                  language,
                };
              });
              setProblem({
                ...problem,
                settings: {
                  ...problem.settings,
                  byProgrammingLanguage,
                },
              });
            }}
            extend
          />
        </div>
        <div className="jk-row left">
          <div className="jk-row block extend gap jk-table-inline-header">
            <div style={{ maxWidth: 200 }} className="jk-row"><T>language</T></div>
            <div className="jk-row"><T>time limit per test</T></div>
            <div className="jk-row"><T>memory limit per test</T></div>
          </div>
          {Object.values(problem.settings?.byProgrammingLanguage).map(({ language }) => {
            return (
              <div className="jk-row block gap extend jk-table-inline-row" key={language}>
                <div style={{ maxWidth: 200 }} className="jk-row">{PROGRAMMING_LANGUAGE[language].label}</div>
                <div className="jk-row center gap nowrap">
                  <Input
                    type="number"
                    value={problem.settings.byProgrammingLanguage[language]?.timeLimit}
                    onChange={value => setProblem({
                      ...problem,
                      settings: {
                        ...problem.settings,
                        byProgrammingLanguage: {
                          ...problem.settings.byProgrammingLanguage,
                          [language]: { ...problem.settings.byProgrammingLanguage[language], timeLimit: value },
                        },
                      },
                    })}
                    extend
                  />
                  {/*{problem.settings.timeLimit > 1 ? <T>milliseconds</T> : <T>millisecond</T>}*/}
                  ms
                </div>
                <div className="jk-row center gap nowrap">
                  <Input
                    type="number"
                    value={problem.settings.byProgrammingLanguage[language]?.memoryLimit}
                    onChange={value => setProblem({
                      ...problem,
                      settings: {
                        ...problem.settings,
                        byProgrammingLanguage: {
                          ...problem.settings.byProgrammingLanguage,
                          [language]: { ...problem.settings.byProgrammingLanguage[language], memoryLimit: value },
                        },
                      },
                    })}
                    extend
                  />
                  <T>KB</T>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="jk-col gap left stretch bc-we jk-br-ie jk-pad-sm">
        <div className="jk-row left gap nowrap">
          <div className="fw-bd tt-se"><T>autor</T>:</div>
          <Input
            onChange={value => setProblem({ ...problem, author: value })}
            value={problem.author}
            extend
          />
        </div>
        <div className="jk-row left gap">
          <div className="fw-bd tt-se"><T>tags</T>:</div>
          <Tags tags={problem.tags} onChange={tags => setProblem({ ...problem, tags })} />
        </div>
      </div>
    </div>
  );
};
