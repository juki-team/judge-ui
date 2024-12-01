'use client';

import {
  BalloonIcon,
  DeleteIcon,
  Input,
  InputColor,
  InputDate,
  InputToggle,
  OpenInNewIcon,
  PlusIcon,
  ProblemSelector,
  SimpleSortableRows,
  T,
} from 'components';
import { jukiAppRoutes } from 'config';
import { PALLETE } from 'config/constants';
import { classNames, disableOutOfRange, indexToLetters, lettersToIndex, roundTimestamp } from 'helpers';
import { useEffect, useJukiUI, useJukiUser, useRef, useState } from 'hooks';
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import {
  ContestProblemBasicDataResponseDTO,
  RowSortableItem,
  SimpleSortableRowsProps,
  UpsertContestDTOUI,
  UpsertContestProblemDTOUI,
} from 'types';
import { EditContestProps } from '../types';

export const RowProblem: SimpleSortableRowsProps<ContestProblemBasicDataResponseDTO, {
  setProblems: Dispatch<SetStateAction<RowSortableItem<ContestProblemBasicDataResponseDTO>[]>>,
  withTime: number,
  contest: UpsertContestDTOUI,
  contestEndDate: Date,
  contestStartDate: Date,
  companyName: string
}>['Cmp'] = ({ value: problem, isPreview, dragComponentRef, dragComponent, isDragging, index, props }) => {
  const {
    setProblems,
    withTime,
    contest,
    contestEndDate,
    contestStartDate,
    companyName,
  } = props!;
  
  const { components: { Link } } = useJukiUI();
  
  return (
    <div
      className={classNames('jk-row left jk-table-inline-row', { 'bc-we elevation-1': isPreview })}
      style={{
        opacity: (isDragging && !isPreview) ? 0.4 : 1,
        borderTop: isPreview ? '1px solid var(--t-color-gray-5)' : undefined,
      }}
      ref={dragComponentRef}
    >
      <div className="jk-row" style={{ width: 30 }}>{dragComponent}</div>
      <div className="jk-row" style={{ width: 40 }}>
        {indexToLetters(index + 1)}
      </div>
      <div className="jk-row center gap" style={{ flex: 1 }}>
        <span className="fw-bd">{problem.key}</span>
        {problem.name}
        <Link
          href={jukiAppRoutes.JUDGE(problem.judge.isMain ? '' : `https://${problem.judge.key}.jukijudge.com'`).problems.view({ key: problem.key })}
          target="_blank"
        >
          <div className="jk-row"><OpenInNewIcon size="small" /></div>
        </Link>
      </div>
      <div className="jk-row" style={{ width: 40 }}>
        <InputColor
          onChange={(props) => {
            setProblems(prevState => prevState.map(p => {
              if (p.key === problem.key) {
                const value: ContestProblemBasicDataResponseDTO = { ...p.value, color: props.hex };
                return { ...p, value };
              }
              return p;
            }));
          }}
        >
          <div style={{ color: problem.color }} className="cursor-pointer"><BalloonIcon /></div>
        </InputColor>
      </div>
      <div className="jk-row" style={{ width: 100 }}>
        <Input
          type="number"
          extend
          value={problem.points}
          onChange={(props) => {
            setProblems(prevState => prevState.map(p => {
              if (p.key === problem.key) {
                const value = { ...p.value, points: Math.max(props, 1) };
                return { ...p, value };
              }
              return p;
            }));
          }}
        />
      </div>
      {withTime === 1 && (
        <div className="jk-row left gap" style={{ width: 100 }}>
          <Input
            type="number"
            value={(problem.startTimestamp - contest.settings.startTimestamp) / (1000 * 60)}
            onChange={v => {
              setProblems(prevState => prevState.map(p => {
                if (p.key === problem.key) {
                  const value = {
                    ...p.value,
                    startTimestamp: Math.min(
                      contest.settings.endTimestamp,
                      Math.max(
                        contest.settings.startTimestamp,
                        roundTimestamp(contest.settings.startTimestamp + (v * 1000 * 60)),
                      ),
                    ),
                  };
                  return { ...p, value };
                }
                return p;
              }));
            }}
            extend
          />
        </div>
      )}
      {withTime === 2 && (
        <div className="jk-row left gap" style={{ width: 200 }}>
          <InputDate
            type="year-month-day-hours-minutes"
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
              setProblems(prevState => prevState.map(p => {
                if (p.key === problem.key) {
                  const value = {
                    ...p.value,
                    startTimestamp: Math.min(
                      contest.settings.endTimestamp,
                      Math.max(contest.settings.startTimestamp, roundTimestamp(date.getTime())),
                    ),
                  };
                  return { ...p, value };
                }
                return p;
              }));
            }}
            twoLines
            extend
          />
        </div>
      )}
      {withTime === 1 && (
        <div className="jk-row left gap" style={{ width: 100 }}>
          <Input
            type="number"
            value={(problem.endTimestamp - problem.startTimestamp) / (1000 * 60)}
            onChange={v => {
              setProblems(prevState => prevState.map(p => {
                if (p.key === problem.key) {
                  const value = {
                    ...p.value,
                    endTimestamp: Math.min(
                      contest.settings.endTimestamp,
                      Math.max(
                        problem.startTimestamp,
                        roundTimestamp(problem.startTimestamp + (v * 1000 * 60)),
                      ),
                    ),
                  };
                  return { ...p, value };
                }
                return p;
              }));
            }}
            extend
          />
        </div>
      )}
      {withTime === 2 && (
        <div className="jk-row left gap" style={{ width: 200 }}>
          <InputDate
            type="year-month-day-hours-minutes"
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
              setProblems(prevState => prevState.map(p => {
                if (p.key === problem.key) {
                  const value = {
                    ...p.value,
                    endTimestamp: Math.min(
                      contest.settings.endTimestamp,
                      Math.max(problem.startTimestamp, roundTimestamp(date.getTime())),
                    ),
                  };
                  return { ...p, value };
                }
                return p;
              }));
            }}
            twoLines
            extend
          />
        </div>
      )}
      <div className="jk-row" style={{ width: 150 }}>
        {problem.judge.name}
      </div>
      <div className="jk-row" style={{ width: 30 }}>
        <DeleteIcon
          className="cursor-pointer"
          onClick={() => setProblems(prevState => (
            prevState.filter(p => p.key !== problem.key)
          ))}
        />
      </div>
    </div>
  );
};

export const EditProblems = ({ contest, setContest }: EditContestProps) => {
  
  let withTimeRestriction = false;
  Object.values(contest.problems).forEach(problem => {
    if (problem.startTimestamp !== contest.settings.startTimestamp
      || problem.endTimestamp !== contest.settings.endTimestamp) {
      withTimeRestriction = true;
    }
  });
  const [ withTime, setWithTime ] = useState(withTimeRestriction ? 1 : 0);
  const { company: { name: companyName } } = useJukiUser();
  useEffect(() => {
    if (withTimeRestriction && withTime === 0) {
      setWithTime(1);
    }
  }, [ withTimeRestriction, withTime ]);
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
          url: '',
        };
        return {
          key: problem.key,
          value,
        };
      });
  }, []);
  const [ problems, setProblems ] = useState<RowSortableItem<ContestProblemBasicDataResponseDTO>[]>(parseProblems(contest.problems));
  useEffect(() => {
    setProblems(prevState => prevState.map(problem => {
      const value: ContestProblemBasicDataResponseDTO = { ...problem.value };
      if (!withTime) {
        value.startTimestamp = contest.settings.startTimestamp;
        value.endTimestamp = contest.settings.endTimestamp;
      }
      return { ...problem, value };
    }));
  }, [ contest.settings.endTimestamp, contest.settings.startTimestamp, withTime ]);
  const lastContest = useRef(contest);
  useEffect(() => {
    if (JSON.stringify(contest) !== JSON.stringify(lastContest.current)) {
      setProblems(parseProblems(contest.problems));
      lastContest.current = contest;
    }
  }, [ contest, parseProblems ]);
  useEffect(() => {
    setContest(prevState => {
      const problemsObj: { [key: string]: UpsertContestProblemDTOUI } = {};
      problems.forEach((problem, index) => {
        problemsObj[problem.value.key] = {
          key: problem.value.key + '',
          index: indexToLetters(index + 1),
          judge: problem.value.judge,
          name: problem.value.name,
          points: problem.value.points,
          color: problem.value.color,
          startTimestamp: problem.value.startTimestamp,
          endTimestamp: problem.value.endTimestamp,
        };
      });
      return {
        ...prevState,
        problems: problemsObj,
      };
    });
  }, [ problems, setContest ]);
  
  return (
    <div className="jk-col top nowrap gap stretch bc-we jk-br-ie jk-pg-sm">
      <div className="jk-col left gap stretch">
        <div className="jk-row left gap">
          <div className="fw-bd tt-se tx-xl cr-py"><T>problems with period time restriction</T></div>
          <InputToggle
            size="small"
            checked={!!withTime}
            onChange={value => setWithTime(value ? 1 : 0)}
            leftLabel={<T className={classNames('tt-se', { 'fw-bd': !withTime })}>no</T>}
            rightLabel={<T className={classNames('tt-se', { 'fw-bd': !!withTime })}>yes</T>}
          />
        </div>
        {!!withTime && (
          <div className="jk-col  gap left stretch">
            <div><T>Set a the time start relative to start of contest and the duration to resolve for each
              problem</T>:
            </div>
            <InputToggle
              checked={withTime === 1}
              onChange={(value) => setWithTime(value ? 1 : 2)}
              leftLabel={<T className={classNames('tt-se', { 'fw-bd': withTime === 2 })}>date</T>}
              rightLabel={<T className={classNames('tt-se', { 'fw-bd': withTime === 1 })}>minutes</T>}
            />
          </div>
        )}
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
          <div className="jk-row fw-bd tt-se" style={{ width: 100 }}><T>points</T></div>
          {!!withTime && (
            <>
              <div className="jk-row fw-bd tt-se" style={{ width: withTime === 1 ? 100 : 200 }}>
                <T>{withTime === 1 ? 'start minutes' : 'start date'}</T>
              </div>
              <div className="jk-row fw-bd tt-se" style={{ width: withTime === 1 ? 100 : 200 }}>
                <T>{withTime === 1 ? 'duration minutes' : 'end date'}</T>
              </div>
            </>
          )}
          <div className="jk-row fw-bd tt-se" style={{ width: 150 }}><T>judge</T></div>
          <div style={{ width: 30 }} />
        </div>
        <div className="jk-col extend stretch gap">
          <SimpleSortableRows
            rows={problems}
            setRows={setProblems}
            props={{ setProblems, withTime, contest, contestEndDate, contestStartDate, companyName }}
            Cmp={RowProblem}
          />
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
                    const value: ContestProblemBasicDataResponseDTO = {
                      name: problem.name,
                      index: '',
                      key: problem.key,
                      color: colors.length ? colors[Math.floor(Math.random() * colors.length)].color : '#000000',
                      points: 1,
                      judge: problem.judge,
                      startTimestamp: contest.settings.startTimestamp,
                      endTimestamp: contest.settings.endTimestamp,
                      url: '',
                    };
                    setProblems(prevState => (
                      [
                        ...prevState,
                        { key: problem.key, value },
                      ]
                    ));
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
