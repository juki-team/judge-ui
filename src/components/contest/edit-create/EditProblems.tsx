'use client';

import {
  BalloonIcon,
  DeleteIcon,
  DragIndicatorIcon,
  Input,
  InputColor,
  InputDate,
  InputToggle,
  OpenInNewIcon,
  PlusIcon,
  ProblemSelector,
  SortableItems,
  T,
  Timer,
} from 'components';
import { jukiAppRoutes } from 'config';
import { classNames, disableOutOfRange, getJudgeOrigin, indexToLetters, lettersToIndex, roundTimestamp } from 'helpers';
import { useEffect, useJukiUI, useStableState, useUserStore } from 'hooks';
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { PALLETE } from 'src/constants';
import {
  ContestProblemBasicDataResponseDTO,
  ContestProblemPrerequisiteType,
  SortableItem,
  SortableItemComponent,
  UpsertContestDTOUI,
  UpsertContestProblemDTOUI,
} from 'types';
import { EditContestProps } from '../types';

export const RowProblem: SortableItemComponent<ContestProblemBasicDataResponseDTO, {
  setContest: Dispatch<SetStateAction<UpsertContestDTOUI>>,
  withTime: number,
  withPrerequisites: boolean,
  withMaxAcceptedUsers: boolean,
  contest: UpsertContestDTOUI,
  contestEndDate: Date,
  contestStartDate: Date,
  companyName: string
}> = ({ item: { value: problem }, style, listeners, attributes, setNodeRef, isDragging, index, props }) => {
  
  const {
    setContest,
    withTime,
    withPrerequisites,
    withMaxAcceptedUsers,
    contest,
    contestEndDate,
    contestStartDate,
  } = props!;
  
  const { components: { Link } } = useJukiUI();
  
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
  
  return (
    <div
      key={problem.key}
      ref={setNodeRef}
      className={classNames('jk-row left jk-table-inline-row bc-we', { 'elevation-1': isDragging })}
      style={{
        ...style,
        borderTop: isDragging ? '1px solid var(--t-color-gray-5)' : undefined,
      }}
      {...attributes}
    >
      <div className="jk-row" style={{ width: 30 }}>
        <div className="cr-py jk-row" style={{ cursor: isDragging ? 'grabbing' : 'grab' }}  {...listeners}>
          <DragIndicatorIcon />
        </div>
      </div>
      <div className="jk-row" style={{ width: 40 }}>
        {indexToLetters(index + 1)}
      </div>
      <div className="jk-col center gap stretch" style={{ flex: 1 }}>
        <div className="jk-row gap left">
          {problem.judge.name}
        </div>
        <div className="jk-row gap left">
          <Link
            href={jukiAppRoutes.JUDGE(getJudgeOrigin(problem.company.key)).problems.view({ key: problem.key })}
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
        <InputColor onChange={(props) => setProblemProp({ color: props.hex })}>
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
      <div className="jk-row left gap" style={{ width: 192 }}>
        {withTime === 1 && (
          <>
            <Input
              type="number"
              disabled={withPrerequisites}
              label={<T className="tx-t tt-se">starts at the minute</T>}
              value={(problem.startTimestamp - contest.settings.startTimestamp) / (1000 * 60)}
              onChange={v => {
                setProblemProp({
                  startTimestamp: Math.min(
                    contest.settings.endTimestamp,
                    Math.max(
                      contest.settings.startTimestamp,
                      roundTimestamp(contest.settings.startTimestamp + (v * 1000 * 60)),
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
              value={(problem.endTimestamp - contest.settings.startTimestamp) / (1000 * 60)}
              onChange={v => {
                setProblemProp({
                  endTimestamp: Math.min(
                    contest.settings.endTimestamp,
                    Math.max(
                      problem.startTimestamp,
                      roundTimestamp(contest.settings.startTimestamp + (v * 1000 * 60)),
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
              date={new Date(problem.startTimestamp)}
              isSelected={(date) => (
                {
                  day: date.isWithinInterval({
                    start: new Date(problem.startTimestamp).startOfDay(),
                    end: new Date(problem.endTimestamp).endOfDay(),
                  }),
                }
              )}
              isDisabled={(date) => disableOutOfRange(date, contestStartDate, contestEndDate)}
              baseDate={new Date(problem.startTimestamp)}
              onDatePick={(date) => {
                setProblemProp({
                  startTimestamp: Math.min(
                    contest.settings.endTimestamp,
                    Math.max(contest.settings.startTimestamp, roundTimestamp(date.getTime())),
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
              date={new Date(problem.endTimestamp)}
              isSelected={(date) => (
                {
                  day: date.isWithinInterval({
                    start: new Date(problem.startTimestamp).startOfDay(),
                    end: new Date(problem.endTimestamp).endOfDay(),
                  }),
                }
              )}
              isDisabled={(date) => disableOutOfRange(date, new Date(problem.startTimestamp), contestEndDate)}
              baseDate={new Date(problem.endTimestamp)}
              onDatePick={(date) => {
                setProblemProp({
                  endTimestamp: Math.min(
                    contest.settings.endTimestamp,
                    Math.max(problem.startTimestamp, roundTimestamp(date.getTime())),
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
          <Timer
            currentTimestamp={problem.endTimestamp - problem.startTimestamp}
            literal
            interval={0}
            ignoreTrailingZeros
            ignoreLeadingZeros
            type="weeks-days-hours-minutes"
          />
        </div>
      </div>
      {withPrerequisites && (
        <div className="jk-row" style={{ width: 100 }}>
          <div>
            {problem.prerequisites?.map((prerequisite, index) => (
              <div className="jk-row gap tx-s" key={index}>
                <div
                  style={{ color: contestProblems.find(p => p.index === prerequisite.problemIndex)?.color }}
                  className="cursor-pointer"
                >
                  <BalloonIcon />
                </div>
                <div className="fw-bd">{contestProblems.find(p => p.index === prerequisite.problemIndex)?.index}</div>
                {contestProblems.find(p => p.index === prerequisite.problemIndex)?.name}
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

export const EditProblems = ({ contest, setContest }: EditContestProps) => {
  let withTimeRestriction = false;
  let withPrerequisites = false;
  let withMaxAcceptedUsers = false;
  let typePrerequisite = ContestProblemPrerequisiteType.INDIVIDUALLY;
  let delayPrerequisites = 0;
  Object.values(contest.problems).forEach(problem => {
    if (problem.startTimestamp !== contest.settings.startTimestamp
      || problem.endTimestamp !== contest.settings.endTimestamp) {
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
  const [ withTime, setWithTime ] = useStableState(withTimeRestriction ? 1 : 0);
  
  const companyName = useUserStore(state => state.company.name);
  const contestStartDate = useMemo(() => new Date(contest.settings.startTimestamp), [ contest.settings.startTimestamp ]);
  const contestEndDate = useMemo(() => new Date(contest.settings.endTimestamp), [ contest.settings.endTimestamp ]);
  const parseProblems = useCallback((problems: { [key: string]: UpsertContestProblemDTOUI }) => {
    return Object.values(problems)
      .sort((a, b) => lettersToIndex(a.index) - lettersToIndex(b.index))
      .map((problem) => {
        const value: ContestProblemBasicDataResponseDTO = {
          index: problem.index,
          key: problem.key,
          judge: problem.judge,
          name: problem.name,
          points: problem.points,
          color: problem.color,
          startTimestamp: problem.startTimestamp,
          endTimestamp: problem.endTimestamp,
          tags: problem.tags,
          company: problem.company,
          prerequisites: problem.prerequisites,
          maxAcceptedUsers: problem.maxAcceptedUsers,
        };
        return {
          key: problem.key,
          value,
        };
      });
  }, []);
  const [ problems ] = useStableState<SortableItem<ContestProblemBasicDataResponseDTO>[]>(parseProblems(contest.problems));
  useEffect(() => {
    if (!withTime) {
      setContest(prevState => {
        const problems: { [key: string]: UpsertContestProblemDTOUI } = {};
        for (const problem of Object.values(prevState.problems)) {
          problems[problem.key] = {
            ...problem,
            startTimestamp: contest.settings.startTimestamp,
            endTimestamp: contest.settings.endTimestamp,
          };
        }
        
        return {
          ...prevState,
          problems,
        };
      });
    }
  }, [ contest.settings.endTimestamp, contest.settings.startTimestamp, withTime, setContest ]);
  const isTypePrerequisiteIndividually = typePrerequisite === ContestProblemPrerequisiteType.INDIVIDUALLY;
  
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
          <div style={{ width: 30 }} />
        </div>
        <div className="jk-col stretch">
          <SortableItems
            items={problems}
            onChange={(items) => {
              console.log({ items });
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
                    let colors = PALLETE.VIVOS.filter(color => !problems.some(p => p.value.color === color.color));
                    if (!colors.length) {
                      colors = [
                        ...PALLETE.OSCUROS.filter(color => !problems.some(p => p.value.color === color.color)),
                        ...PALLETE.AGRISADOS.filter(color => !problems.some(p => p.value.color === color.color)),
                        ...PALLETE.CLAROS.filter(color => !problems.some(p => p.value.color === color.color)),
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
                        startTimestamp: contest.settings.startTimestamp,
                        endTimestamp: contest.settings.endTimestamp,
                        tags: problem.tags,
                        company: problem.company,
                        prerequisites: [],
                        maxAcceptedUsers: 0,
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
