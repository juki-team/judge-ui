'use client';

import { BalloonIcon, DeleteIcon, DragIndicatorIcon, OpenInNewIcon, PlusIcon } from '@juki-team/base-ui/server-components';
import { TimerDisplay } from '@juki-team/base-ui/server-components';
import { Input, InputColor, InputDate, InputToggle, ProblemSelector, Select, SortableItems, T, useSyncedState, useUIStore, useUserStore } from '@juki-team/base-ui';
import { jukiAppRoutes } from '@juki-team/base-ui/settings';
import { disableOutOfRange, roundTimestamp } from 'helpers';
import { classNames, getJudgeOrigin } from '@juki-team/base-ui/helpers';
import { PALETTE as PALLETE } from '@juki-team/commons/constants';
import { type ContestProblemBasicDataResponseDTO } from '@juki-team/commons/dto';
import { ContestProblemPrerequisiteType } from '@juki-team/commons/enums';
import { endOfDay, indexToLetters, isWithinInterval, lettersToIndex, startOfDay } from '@juki-team/commons/helpers';
import { useEffect } from 'hooks';
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { UpsertContestDTOUI, UpsertContestProblemDTOUI } from 'types';
import { type SortableItem, type SortableItemComponent } from '@juki-team/base-ui/types';
import { EditContestProps } from '../types';

const RowProblem: SortableItemComponent<ContestProblemBasicDataResponseDTO, {
  setContest: Dispatch<SetStateAction<UpsertContestDTOUI>>,
  withTime: 0 | 1 | 2,
  withPrerequisites: boolean,
  withMaxAcceptedUsers: boolean,
  contest: UpsertContestDTOUI,
  contestEndDate: Date,
  contestStartDate: Date,
  companyName: string
}> = ({ item: { value: problem }, style, listeners, attributes, setNodeRef, isDragging, props }) => {
  
  const {
    setContest,
    withTime,
    withPrerequisites,
    withMaxAcceptedUsers,
    contest,
    contestEndDate,
    contestStartDate,
  } = props!;
  
  const { Link } = useUIStore(store => store.components);
  
  const setProblemProp = (props: Partial<UpsertContestProblemDTOUI>) => {
    setContest(prevState => {
      const problems: { [key: string]: UpsertContestProblemDTOUI } = {};
      for (const p of Object.values(prevState.problems)) {
        problems[p.key] = { ...p };
        if (p.key === problem.key) {
          problems[p.key] = { ...p, ...props };
        }
      }
      
      return {
        ...prevState,
        problems,
      };
    });
  };
  const contestProblems = Object.values(contest.problems);
  const getPreProblem = (prerequisite: UpsertContestDTOUI['problems'][string]['prerequisites'][number]) => contestProblems.find(p => p.index === prerequisite.problemIndex);
  const withGroups = !!Object.values(contest.groups).length;
  
  return (
    <div
      key={problem.key}
      ref={setNodeRef}
      className={classNames('jk-row left jk-table-inline-row bc-we', { 'elevation-1': isDragging })}
      style={{
        ...style,
        borderTop: isDragging ? '1px solid var(--cr-gy-5)' : undefined,
      }}
      {...attributes}
    >
      <div className="jk-row" style={{ width: 30 }}>
        <div className="cr-py jk-row" style={{ cursor: isDragging ? 'grabbing' : 'grab' }}  {...listeners}>
          <DragIndicatorIcon />
        </div>
      </div>
      <div className="jk-row" style={{ width: 40 }}>
        {problem.index}
      </div>
      <div className="jk-col center gap stretch" style={{ flex: 1 }}>
        <div className="jk-row gap left">
          {problem.judge.name}
        </div>
        <div className="jk-row gap left">
          <Link
            href={jukiAppRoutes.JUDGE(getJudgeOrigin(problem.organization.key)).problems.view({ key: problem.key })}
            target="_blank"
            className="link jk-row tx-t"
            style={{ fontFamily: 'monospace' }}
          >
            {problem.key}&nbsp;
            <div className="jk-row"><OpenInNewIcon size="tiny" /></div>
          </Link>
          <span className="fw-bd">{problem.name}</span>
        </div>
        <div className="jk-row gap left">
          {problem.tags.map(tag => (
            <div key={tag} className="jk-tag bc-hl">{tag}</div>
          ))}
        </div>
      </div>
      <div className="jk-row" style={{ width: 40 }}>
        <InputColor
          value={problem.color}
          onChange={(props) => setProblemProp({ color: props.hex })}
          size={4}
          inputClassName="display-none"
          labelClassName="display-none"
        >
          <div style={{ color: problem.color }} className="cursor-pointer"><BalloonIcon /></div>
        </InputColor>
      </div>
      <div className="jk-row" style={{ width: 100 }}>
        <Input
          type="number"
          expand
          value={problem.points}
          onChange={(props) => setProblemProp({ points: Math.max(props, 1) })}
        />
      </div>
      {!!withTime && (
        <div className="jk-row left gap" style={{ width: 192 }}>
          {withTime === 1 && (
            <>
              <Input
                type="number"
                disabled={withPrerequisites}
                label={<T className="tx-t tt-se">starts at the minute</T>}
                value={(problem.startsAt - contest.settings.startsAt) / (1000 * 60)}
                onChange={v => {
                  setProblemProp({
                    startsAt: Math.min(
                      contest.settings.endsAt,
                      Math.max(
                        contest.settings.startsAt,
                        roundTimestamp(contest.settings.startsAt + (v * 1000 * 60)),
                      ),
                    ),
                  });
                }}
                expand
              />
              <Input
                label={<T className="tx-t tt-se">ends at the minute</T>}
                type="number"
                disabled={withPrerequisites}
                value={(problem.endsAt - contest.settings.startsAt) / (1000 * 60)}
                onChange={v => {
                  setProblemProp({
                    endsAt: Math.min(
                      contest.settings.endsAt,
                      Math.max(
                        problem.startsAt,
                        roundTimestamp(contest.settings.startsAt + (v * 1000 * 60)),
                      ),
                    ),
                  });
                }}
                expand
              />
            </>
          )}
          {withTime === 2 && (
            <>
              <T className="tx-t tt-se">starts on the date</T>
              <InputDate
                type="year-month-day-hours-minutes"
                disabled={withPrerequisites}
                date={new Date(problem.startsAt)}
                isSelected={(date) => (
                  {
                    day: isWithinInterval(date, {
                      start: startOfDay(new Date(problem.startsAt)),
                      end: endOfDay(new Date(problem.endsAt)),
                    }),
                  }
                )}
                isDisabled={(date) => disableOutOfRange(date, contestStartDate, contestEndDate)}
                baseDate={new Date(problem.startsAt)}
                onDatePick={(date) => {
                  setProblemProp({
                    startsAt: Math.min(
                      contest.settings.endsAt,
                      Math.max(contest.settings.startsAt, roundTimestamp(date.getTime())),
                    ),
                  });
                }}
                twoLines
                extend
              />
              <T className="tx-t tt-se">ends on the date</T>
              <InputDate
                type="year-month-day-hours-minutes"
                disabled={withPrerequisites}
                date={new Date(problem.endsAt)}
                isSelected={(date) => (
                  {
                    day: isWithinInterval(date, {
                      start: startOfDay(new Date(problem.startsAt)),
                      end: endOfDay(new Date(problem.endsAt)),
                    }),
                  }
                )}
                isDisabled={(date) => disableOutOfRange(date, new Date(problem.startsAt), contestEndDate)}
                baseDate={new Date(problem.endsAt)}
                onDatePick={(date) => {
                  setProblemProp({
                    endsAt: Math.min(
                      contest.settings.endsAt,
                      Math.max(problem.startsAt, roundTimestamp(date.getTime())),
                    ),
                  });
                }}
                twoLines
                extend
              />
            </>
          )}
          <div className="jk-row tx-t">
            <T className="tt-se">duration</T>:&nbsp;
            <TimerDisplay
              counter={problem.endsAt - problem.startsAt}
              literal
              ignoreTrailingZeros
              ignoreLeadingZeros
              type="weeks-days-hours-minutes"
            />
          </div>
        </div>
      )}
      {withPrerequisites && (
        <div className="jk-row" style={{ width: 100 }}>
          <div>
            {problem.prerequisites?.map((prerequisite, index) => (
              <div className="jk-row gap tx-s" key={index}>
                <div
                  style={{ color: getPreProblem(prerequisite)?.color }}
                  className="cursor-pointer"
                >
                  <BalloonIcon />
                </div>
                <div className="fw-bd">{getPreProblem(prerequisite)?.index}</div>
                {getPreProblem(prerequisite)?.name}
              </div>
            ))}
          </div>
        </div>
      )}
      {withMaxAcceptedUsers && (
        <div className="jk-row" style={{ width: 60 }}>
          <Input
            type="number"
            value={problem.maxAcceptedUsers}
            expand
            onChange={value => setProblemProp({ maxAcceptedUsers: +value || 0 })}
          />
        </div>
      )}
      {withGroups && (
        <div className="jk-row tx-s" style={{ width: 128 }}>
          <Select
            style={{ width: 'auto' }}
            options={Object.values(contest.groups).map(group => ({ value: group.value, label: group.label }))}
            selectedOption={{ value: problem.group }}
            onChange={({ value }) => setProblemProp({ group: value })}
          />
        </div>
      )}
      <div className="jk-row" style={{ width: 30 }}>
        <DeleteIcon
          className="cursor-pointer"
          onClick={() => {
            setContest(prevState => {
              const problems: { [key: string]: UpsertContestProblemDTOUI } = {};
              for (const p of Object.values(prevState.problems)) {
                if (p.key !== problem.key) {
                  problems[p.key] = { ...p };
                }
              }
              
              return {
                ...prevState,
                problems,
              };
            });
          }}
        />
      </div>
    </div>
  );
};

const getContestPrerequisitesData = (contest: UpsertContestDTOUI) => {
  let withPrerequisites = false;
  let withTimeRestriction = false;
  let withMaxAcceptedUsers = false;
  let typePrerequisite: ContestProblemPrerequisiteType = ContestProblemPrerequisiteType.INDIVIDUALLY;
  let delayPrerequisites = 0;
  Object.values(contest.problems).forEach(problem => {
    if (problem.startsAt !== contest.settings.startsAt
      || problem.endsAt !== contest.settings.endsAt) {
      withTimeRestriction = true;
    }
    if (problem.prerequisites?.length > 0) {
      withPrerequisites = true;
    }
    if (problem.maxAcceptedUsers > 0) {
      withMaxAcceptedUsers = true;
    }
    if (problem.prerequisites?.[0]?.type === ContestProblemPrerequisiteType.CONTEST) {
      typePrerequisite = ContestProblemPrerequisiteType.CONTEST;
    } else {
      typePrerequisite = ContestProblemPrerequisiteType.INDIVIDUALLY;
    }
    delayPrerequisites = problem.prerequisites?.[0]?.delay || 0;
  });
  const isTypePrerequisiteIndividually = typePrerequisite === ContestProblemPrerequisiteType.INDIVIDUALLY;
  return {
    withPrerequisites,
    withTimeRestriction,
    withMaxAcceptedUsers,
    typePrerequisite,
    delayPrerequisites,
    isTypePrerequisiteIndividually,
  };
};

const cutDate = (timestamp: number) => {
  const rounded = new Date(timestamp);
  rounded.setSeconds(0, 0);
  return rounded.getTime();
};

const fixOrder = (contest: UpsertContestDTOUI) => {
  const prerequisitesData = getContestPrerequisitesData(contest);
  const response: UpsertContestDTOUI = {
    ...contest,
    settings: {
      ...contest.settings,
      startsAt: Math.max(0, cutDate(contest.settings.startsAt)),
      endsAt: cutDate(contest.settings.endsAt),
      frozenAt: cutDate(contest.settings.frozenAt),
      silencedAt: cutDate(contest.settings.silencedAt),
    },
  };
  
  response.settings = {
    ...contest.settings,
    endsAt: Math.max(contest.settings.endsAt, contest.settings.startsAt),
  };
  response.settings = {
    ...contest.settings,
    frozenAt: Math.min(Math.max(contest.settings.frozenAt, contest.settings.startsAt), contest.settings.endsAt),
  };
  response.settings = {
    ...contest.settings,
    silencedAt: Math.min(Math.max(contest.settings.silencedAt, contest.settings.frozenAt), contest.settings.endsAt),
  };
  
  const newProblems = Object.values(contest.problems)
    .sort((a, b) => lettersToIndex(a.index) - lettersToIndex(b.index))
    .map((problem, index, problems) => {
      return fixProblem(problem, index, problems, prerequisitesData);
    });
  
  for (const problem of newProblems) {
    response.problems[problem.key] = problem;
  }
  
  return response;
};

const fixProblem = (
  problem: UpsertContestProblemDTOUI,
  index: number,
  problems: UpsertContestProblemDTOUI[],
  { delayPrerequisites, isTypePrerequisiteIndividually, withPrerequisites }: {
    delayPrerequisites: number,
    isTypePrerequisiteIndividually: boolean,
    withPrerequisites: boolean,
  },
) => {
  const problemIndex = indexToLetters(index + 1);
  const preIndex = indexToLetters(index);
  const preProblem = problems[index];
  
  const prerequisites = withPrerequisites && preProblem && index > 0 ? [ {
    problemIndex: preIndex,
    type: isTypePrerequisiteIndividually ? ContestProblemPrerequisiteType.INDIVIDUALLY : ContestProblemPrerequisiteType.CONTEST,
    delay: delayPrerequisites,
  } ] : [];
  
  const value: ContestProblemBasicDataResponseDTO = {
    index: problemIndex,
    key: problem.key,
    judge: problem.judge,
    name: problem.name,
    points: problem.points,
    color: problem.color,
    startsAt: cutDate(problem.startsAt),
    endsAt: cutDate(problem.endsAt),
    tags: problem.tags,
    organization: problem.organization,
    prerequisites,
    maxAcceptedUsers: problem.maxAcceptedUsers,
    group: problem.group ?? '',
  };
  return value;
};

export const EditProblems = ({ contest, setContest }: EditContestProps) => {
  
  const {
    withPrerequisites,
    withTimeRestriction,
    withMaxAcceptedUsers,
    isTypePrerequisiteIndividually,
    delayPrerequisites,
  } = getContestPrerequisitesData(contest);
  const [ withTime, setWithTime ] = useSyncedState<0 | 1 | 2>(withTimeRestriction ? 1 : 0);
  
  const companyName = useUserStore(state => state.organization.name);
  const organizationKey = useUserStore(state => state.organization.key);
  const contestStartDate = useMemo(() => new Date(contest.settings.startsAt), [ contest.settings.startsAt ]);
  const contestEndDate = useMemo(() => new Date(contest.settings.endsAt), [ contest.settings.endsAt ]);
  const parseProblems = useCallback((problems: { [key: string]: UpsertContestProblemDTOUI }) => {
    return Object.values(problems)
      .sort((a, b) => lettersToIndex(a.index) - lettersToIndex(b.index))
      .map((problem, index, problems) => {
        const problemV = fixProblem(problem, index, problems, {
          delayPrerequisites,
          isTypePrerequisiteIndividually,
          withPrerequisites,
        });
        return {
          key: problem.key,
          value: problemV,
        };
      });
  }, [ delayPrerequisites, isTypePrerequisiteIndividually, withPrerequisites ]);
  const [ problems ] = useSyncedState<SortableItem<ContestProblemBasicDataResponseDTO>[]>(parseProblems(contest.problems));
  useEffect(() => {
    if (!withTime) {
      setContest(prevState => {
        const problems: { [key: string]: UpsertContestProblemDTOUI } = {};
        for (const problem of Object.values(prevState.problems)) {
          problems[problem.key] = {
            ...problem,
            startsAt: contest.settings.startsAt,
            endsAt: contest.settings.endsAt,
          };
        }
        
        return {
          ...prevState,
          problems,
        };
      });
    }
  }, [ contest.settings.endsAt, contest.settings.startsAt, withTime, setContest ]);
  
  useEffect(() => {
    const newContest = fixOrder(contest);
    if (JSON.stringify(contest) !== JSON.stringify(newContest)) {
      setContest(newContest);
    }
  }, [ contest, setContest ]);
  
  const withGroups = !!Object.values(contest.groups).length;
  
  return (
    <div className="jk-col top nowrap gap stretch bc-we jk-br-ie jk-pg-sm">
      <div className={classNames('jk-row left gap', { disabled: withPrerequisites })}>
        <div className="tt-se tx-xl"><T>problems with period time restriction</T></div>
        <InputToggle
          size="small"
          checked={!!withTime}
          disabled={withPrerequisites}
          onChange={value => setWithTime(value ? 1 : 0)}
          leftLabel={<T className={classNames('tt-se', { 'fw-bd': !withTime })}>no</T>}
          rightLabel={<T className={classNames('tt-se', { 'fw-bd': !!withTime })}>yes</T>}
        />
      </div>
      <div className="jk-col stretch">
        <div className="jk-row left gap">
          <div className="tt-se tx-xl"><T>problems with prerequisite restriction</T></div>
          <InputToggle
            size="small"
            checked={withPrerequisites}
            onChange={value => {
              setContest(prevState => {
                const problems = Object.values(prevState.problems);
                const newProblems: { [key: string]: UpsertContestProblemDTOUI } = { ...prevState.problems };
                for (const problem of problems) {
                  if (value) {
                    const preIndex = indexToLetters(lettersToIndex(problem.index) - 1);
                    const preProblem = problems.find(p => p.index === preIndex);
                    newProblems[problem.key] = {
                      ...newProblems[problem.key],
                      prerequisites: preProblem ? [ {
                        problemIndex: preIndex,
                        type: isTypePrerequisiteIndividually ? ContestProblemPrerequisiteType.INDIVIDUALLY : ContestProblemPrerequisiteType.CONTEST,
                        delay: delayPrerequisites,
                      } ] : [],
                    };
                  } else {
                    newProblems[problem.key] = {
                      ...newProblems[problem.key],
                      prerequisites: [],
                    };
                  }
                }
                return {
                  ...prevState,
                  problems: newProblems,
                };
              });
            }}
            leftLabel={<T className={classNames('tt-se', { 'fw-bd': !withPrerequisites })}>no</T>}
            rightLabel={<T className={classNames('tt-se', { 'fw-bd': withPrerequisites })}>yes</T>}
          />
        </div>
        <div className={classNames('jk-row left jk-pg-l', { disabled: !withPrerequisites })}>
          <T className="tt-se">the requirements must be met</T>:&nbsp;
          <InputToggle
            size="small"
            disabled={!withPrerequisites}
            checked={isTypePrerequisiteIndividually}
            onChange={value => {
              setContest(prevState => {
                const problems = Object.values(prevState.problems);
                const newProblems: { [key: string]: UpsertContestProblemDTOUI } = { ...prevState.problems };
                for (const problem of problems) {
                  newProblems[problem.key] = {
                    ...newProblems[problem.key],
                    prerequisites: newProblems[problem.key].prerequisites.map(prerequisite => ({
                      ...prerequisite,
                      type: value ? ContestProblemPrerequisiteType.INDIVIDUALLY : ContestProblemPrerequisiteType.CONTEST,
                    })),
                  };
                }
                return {
                  ...prevState,
                  problems: newProblems,
                };
              });
            }}
            leftLabel={
              <T className={classNames('tt-se', { 'fw-bd': !isTypePrerequisiteIndividually })}>by any participant</T>
            }
            rightLabel={<T className={classNames('tt-se', { 'fw-bd': isTypePrerequisiteIndividually })}>individually
              per user</T>}
          />
        </div>
        <div className={classNames('jk-row left jk-pg-l', { disabled: !withPrerequisites })}>
          <T className="tt-se">enable problem after</T>&nbsp;
          <Input
            size="auto"
            disabled={!withPrerequisites}
            value={delayPrerequisites / 1000}
            onChange={value => {
              setContest(prevState => {
                const problems = Object.values(prevState.problems);
                const newProblems: { [key: string]: UpsertContestProblemDTOUI } = { ...prevState.problems };
                for (const problem of problems) {
                  newProblems[problem.key] = {
                    ...newProblems[problem.key],
                    prerequisites: newProblems[problem.key].prerequisites.map(prerequisite => ({
                      ...prerequisite,
                      delay: (+value * 1000) || 0,
                    })),
                  };
                }
                return {
                  ...prevState,
                  problems: newProblems,
                };
              });
            }}
          />&nbsp;
          <T>seconds of meeting prerequisites</T>
        </div>
      </div>
      <div className="jk-row left gap">
        <div className="tt-se tx-xl"><T>problems with a maximum number of accepted submissions</T></div>
        <InputToggle
          size="small"
          checked={withMaxAcceptedUsers}
          onChange={value => {
            setContest(prevState => {
              const problems = Object.values(prevState.problems);
              const newProblems: { [key: string]: UpsertContestProblemDTOUI } = { ...prevState.problems };
              for (const problem of problems) {
                newProblems[problem.key] = {
                  ...newProblems[problem.key],
                  maxAcceptedUsers: value ? 1 : 0,
                };
              }
              return {
                ...prevState,
                problems: newProblems,
              };
            });
          }}
          leftLabel={<T className={classNames('tt-se', { 'fw-bd': !withMaxAcceptedUsers })}>no</T>}
          rightLabel={<T className={classNames('tt-se', { 'fw-bd': withMaxAcceptedUsers })}>yes</T>}
        />
      </div>
      <div className="jk-col stretch">
        <div className="jk-row left jk-table-inline-header">
          <div className="jk-row" style={{ width: 30 }} />
          <div className="jk-row fw-bd" style={{ width: 40 }}>
            <T className="tt-se">index</T>
          </div>
          <div className="jk-row fw-bd" style={{ flex: 1 }}>
            <div><T className="tt-se">id</T> <T className="tt-se">name</T></div>
          </div>
          <div className="jk-row" style={{ width: 40, color: '#164066' }}><BalloonIcon /></div>
          <div className="jk-row fw-bd tt-se" style={{ width: 100 }}><T className="tt-se">points</T></div>
          {!!withTime && (
            <>
              <div
                className="jk-row fw-bd tt-se" style={{ width: 192 }}
                data-tooltip-id="jk-tooltip"
                data-tooltip-content="set a start and end date for resolving each problem"
              >
                <T className="tt-se">duration</T>
                <InputToggle
                  checked={withTime === 1}
                  size="tiny"
                  onChange={(value) => setWithTime(value ? 1 : 2)}
                  leftLabel={<T className={classNames('tt-se tx-t fw-rr', { 'fw-bd': withTime === 2 })}>date</T>}
                  rightLabel={<T className={classNames('tt-se tx-t fw-rr', { 'fw-bd': withTime === 1 })}>minutes</T>}
                />
              </div>
            </>
          )}
          {withPrerequisites && (
            <div style={{ width: 100 }}>
              <T className="tt-se">prerequisites</T>
            </div>
          )}
          {withMaxAcceptedUsers && (
            <div className="jk-row" style={{ width: 60 }}>
              <T className="tt-se">max users</T>
            </div>
          )}
          {withGroups && (
            <div className="jk-row" style={{ width: 128 }}>
              <T className="tt-se">group</T>
            </div>
          )}
          <div style={{ width: 30 }} />
        </div>
        <div className="jk-col stretch">
          <SortableItems
            items={problems}
            onChange={(items) => {
              const newProblems: UpsertContestDTOUI['problems'] = {};
              let index = 1;
              for (const item of items) {
                newProblems[item.value.key] = { ...item.value, index: indexToLetters(index) };
              }
              setContest(prevState => (fixOrder({ ...prevState, problems: newProblems })));
            }}
            props={{
              setContest,
              withTime,
              contest,
              contestEndDate,
              contestStartDate,
              companyName,
              withPrerequisites,
              withMaxAcceptedUsers,
            }}
            Cmp={RowProblem}
          />
        </div>
        <div className="jk-col extend stretch">
          <div className="jk-row left">
            <div className="jk-row" style={{ width: 30, padding: '0 var(--pad-xt)' }}>
              <PlusIcon />
            </div>
            <div className="jk-row" style={{ width: 40, padding: '0 var(--pad-xt)' }}>
              {indexToLetters(problems.length + 1)}
            </div>
            <div className="jk-row block" style={{ flex: 1 }}>
              <ProblemSelector
                onSelect={(problem) => {
                  if (!problems.some(p => p.key === problem.key)) {
                    let colors = PALLETE.vivos.filter(color => !problems.some(p => p.value.color === color.color));
                    if (!colors.length) {
                      colors = [
                        ...PALLETE.oscuros.filter(color => !problems.some(p => p.value.color === color.color)),
                        ...PALLETE.agrisados.filter(color => !problems.some(p => p.value.color === color.color)),
                        ...PALLETE.claros.filter(color => !problems.some(p => p.value.color === color.color)),
                      ];
                    }
                    setContest(prevState => {
                      const problems: { [key: string]: UpsertContestProblemDTOUI } = { ...prevState.problems };
                      problems[problem.key] = {
                        name: problem.name,
                        index: indexToLetters(Object.keys(problems).length + 1),
                        key: problem.key,
                        color: colors.length ? colors[Math.floor(Math.random() * colors.length)].color : '#000000',
                        points: 1,
                        judge: problem.judge,
                        startsAt: contest.settings.startsAt,
                        endsAt: contest.settings.endsAt,
                        tags: problem.tags,
                        organization: { key: organizationKey },
                        prerequisites: [],
                        maxAcceptedUsers: 0,
                        group: '',
                      };
                      
                      return {
                        ...prevState,
                        problems,
                      };
                    });
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
