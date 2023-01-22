import {
  BalloonIcon,
  ColorPicker,
  DeleteIcon,
  Input,
  InputDate,
  InputToggle,
  OpenInNewIcon,
  PlusIcon,
  ProblemSelector,
  Select,
  SimpleSortableRows,
  T,
} from 'components';
import { JUDGE, PALLETE } from 'config/constants';
import { classNames, disableOutOfRange, getProblemJudgeKey, indexToLetters, lettersToIndex, roundTimestamp } from 'helpers';
import React, { useEffect, useRef, useState } from 'react';
import { ContestProblemBasicType, RowSortableItem, RowSortableItemContentType } from 'types';
import { EditContestProps } from '../types';

type Problem = Omit<ContestProblemBasicType, 'index'> & {
  name: string,
}

export const EditProblems = ({ contest, setContest }: EditContestProps) => {
  const [withTime, setWithTime] = useState(0);
  const contestStartDate = new Date(contest.settings.startTimestamp);
  const contestEndDate = new Date(contest.settings.endTimestamp);
  const renderRowProblem = (problem): RowSortableItemContentType => ({
    previewRef,
    dragComponent,
    isDragging,
    index,
  }) => {
    return (
      <div className="jk-row left jk-table-inline-row" ref={previewRef} style={{ opacity: isDragging ? 0.4 : 1 }}>
        <div className="jk-row" style={{ width: 30 }}>{dragComponent}</div>
        <div className="jk-row" style={{ width: 40 }}>
          {indexToLetters(index + 1)}
        </div>
        <div className="jk-row center gap" style={{ flex: 1 }}>
          <span className="fw-bd">{problem.key}</span>
          {problem.name}
          <a href={`/problem/view/${problem.key}`} target="_blank">
            <div className="jk-row"><OpenInNewIcon size="small" /></div>
          </a>
        </div>
        <div className="jk-row" style={{ width: 40 }}>
          <ColorPicker
            onChange={(props) => {
              setProblems(prevState => prevState.map(p => {
                if (p.key === problem.key) {
                  const value = { ...p.value, color: props.hex };
                  return { ...p, value, content: renderRowProblem(value) };
                }
                return p;
              }));
            }}
          >
            <div style={{ color: problem.color }} className="cursor-pointer"><BalloonIcon /></div>
          </ColorPicker>
        </div>
        <div className="jk-row" style={{ width: 100 }}>
          <Input
            type="number"
            // size="auto"
            extend
            value={problem.points}
            onChange={(props) => {
              setProblems(prevState => prevState.map(p => {
                if (p.key === problem.key) {
                  const value = { ...p.value, points: Math.max(props, 1) };
                  return { ...p, value, content: renderRowProblem(value) };
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
                      startTimestamp: Math.min(contest.settings.endTimestamp, Math.max(contest.settings.startTimestamp, roundTimestamp(contest.settings.startTimestamp + (v * 1000 * 60)))),
                    };
                    return { ...p, value, content: renderRowProblem(value) };
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
              isSelected={(date) => ({
                day: date.isWithinInterval({
                  start: new Date(problem.startTimestamp).startOfDay(),
                  end: new Date(problem.endTimestamp).endOfDay(),
                }),
              })}
              isDisabled={(date) => disableOutOfRange(date, contestStartDate, contestEndDate)}
              baseDate={new Date(problem.startTimestamp)}
              onDatePick={(date) => {
                setProblems(prevState => prevState.map(p => {
                  if (p.key === problem.key) {
                    const value = {
                      ...p.value,
                      startTimestamp: Math.min(contest.settings.endTimestamp, Math.max(contest.settings.startTimestamp, roundTimestamp(date.getTime()))),
                    };
                    return { ...p, value, content: renderRowProblem(value) };
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
                      endTimestamp: Math.min(contest.settings.endTimestamp, Math.max(problem.startTimestamp, roundTimestamp(problem.startTimestamp + (v * 1000 * 60)))),
                    };
                    return { ...p, value, content: renderRowProblem(value) };
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
              isSelected={(date) => ({
                day: date.isWithinInterval({
                  start: new Date(problem.startTimestamp).startOfDay(),
                  end: new Date(problem.endTimestamp).endOfDay(),
                }),
              })}
              isDisabled={(date) => disableOutOfRange(date, new Date(problem.startTimestamp), contestEndDate)}
              baseDate={new Date(problem.endTimestamp)}
              onDatePick={(date) => {
                setProblems(prevState => prevState.map(p => {
                  if (p.key === problem.key) {
                    const value = {
                      ...p.value,
                      endTimestamp: Math.min(contest.settings.endTimestamp, Math.max(problem.startTimestamp, roundTimestamp(date.getTime()))),
                    };
                    return { ...p, value, content: renderRowProblem(value) };
                  }
                  return p;
                }));
              }}
              twoLines
              extend
            />
          </div>
        )}
        <div className="jk-row" style={{ width: 150 }}>{problem.judge}</div>
        <div className="jk-row" style={{ width: 30 }}>
          <DeleteIcon
            className="cursor-pointer"
            onClick={() => setProblems(prevState => (prevState.filter(p => p.key !== problem.key)))}
          />
        </div>
      </div>
    );
  };
  const parseProblems = (problems: { [key: string]: ContestProblemBasicType & { name: string } }) => {
    return Object.values(problems).sort((a, b) => lettersToIndex(a.index) - lettersToIndex(b.index)).map((problem, index) => {
      const value: Problem = {
        key: problem.key,
        judge: problem.judge,
        name: problem.name,
        points: problem.points,
        color: problem.color,
        startTimestamp: problem.startTimestamp,
        endTimestamp: problem.endTimestamp,
      };
      return {
        key: problem.key,
        content: renderRowProblem(value),
        value,
      };
    });
  };
  const [problems, setProblems] = useState<RowSortableItem<Problem>[]>(parseProblems(contest.problems));
  useEffect(() => {
    setProblems(prevState => prevState.map(problem => {
      const value = { ...problem.value };
      if (!withTime) {
        value.startTimestamp = contest.settings.startTimestamp;
        value.endTimestamp = contest.settings.endTimestamp;
      }
      return { ...problem, content: renderRowProblem(value), value };
    }));
  }, [withTime]);
  const lastContest = useRef(contest);
  useEffect(() => {
    if (JSON.stringify(contest) !== JSON.stringify(lastContest.current)) {
      setProblems(parseProblems(contest.problems));
      lastContest.current = contest;
    }
  }, [contest]);
  useEffect(() => {
    setContest(prevState => {
      const problemsObj = {};
      problems.forEach((problem, index) => {
        problemsObj[getProblemJudgeKey(problem.value.judge, problem.value.key)] = {
          key: problem.value.key + '',
          index: indexToLetters(index + 1),
          judge: problem.value.judge,
          name: problem.value.name,
          points: problem.value.points,
          color: problem.value.color,
          startTimestamp: prevState.settings.startTimestamp,
          endTimestamp: prevState.settings.endTimestamp,
        };
      });
      return {
        ...prevState,
        problems: problemsObj,
      };
    });
  }, [problems]);
  
  return (
    <div className="jk-col top nowrap gap stretch">
      <div className="jk-col left gap stretch">
        <div className="jk-row left gap">
          <div className="fw-bd tt-se tx-xl cr-py"><T>Problems with period time restriction</T></div>
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
            <div><T>Set a the time start relative to start of contest and the duration to resolve for each problem</T>:</div>
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
          <SimpleSortableRows rows={problems} setRows={setProblems} />
          <div className="jk-row left">
            <div className="jk-row" style={{ width: 30, padding: '0 var(--pad-xt)' }}>
              <PlusIcon />
            </div>
            <div className="jk-row" style={{ width: 40, padding: '0 var(--pad-xt)' }}>
              {indexToLetters(problems.length + 1)}
            </div>
            <div className="jk-row" style={{ flex: 1 }}>
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
                    const value: Problem = {
                      name: problem.name,
                      key: problem.key,
                      color: colors.length ? colors[Math.floor(Math.random() * colors.length)].color : '#000000',
                      points: 1,
                      judge: JUDGE.JUKI_JUDGE.value,
                      startTimestamp: contest.settings.startTimestamp,
                      endTimestamp: contest.settings.endTimestamp,
                    };
                    setProblems(prevState => ([
                      ...prevState,
                      { key: problem.key, content: renderRowProblem(value), value },
                    ]));
                  }
                }}
              />
            </div>
            <div className="jk-row" style={{ width: 'var(--pad-t)' }} />
            <div className="jk-row" style={{ width: 150 }}>
              <Select
                options={[
                  { value: JUDGE.JUKI_JUDGE.value, label: JUDGE.JUKI_JUDGE.label },
                  { value: JUDGE.CODEFORCES.value, label: JUDGE.CODEFORCES.label, disabled: true },
                  { value: JUDGE.AT_CODER.value, label: JUDGE.AT_CODER.label, disabled: true },
                  { value: JUDGE.UVA_ONLINE_JUDGE.value, label: JUDGE.UVA_ONLINE_JUDGE.label, disabled: true },
                  { value: JUDGE.CODECHEF.value, label: JUDGE.CODECHEF.label, disabled: true },
                ]}
                selectedOption={{ value: JUDGE.JUKI_JUDGE.value }}
              />
            </div>
            <div className="jk-row" style={{ width: 'var(--pad-t)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
