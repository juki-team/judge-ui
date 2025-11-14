'use client';

import {
  AddIcon,
  Button,
  DeleteIcon,
  FrozenInformation,
  Input,
  InputDate,
  InputToggle,
  MultiSelect,
  QuietInformation,
  Select,
  T,
  Timer,
  WarningIcon,
} from 'components';
import {
  adjustContest,
  classNames,
  disableOutOfRange,
  getContestTemplate,
  isEndlessContest,
  isGlobalContest,
} from 'helpers';
import { useState } from 'hooks';
import React from 'react';
import {
  ACCEPTED_PROGRAMMING_LANGUAGES,
  CODE_LANGUAGE,
  CONTEST_DEFAULT,
  CONTEST_TEMPLATE,
  MAX_DATE,
  MIN_DATE,
} from 'src/constants';
import { ContestTemplate, EntityMembersRank } from 'types';
import { EditContestProps } from '../types';
import { ContestTimeProgress } from '../view/ContestTimeProgress';

export const EditSettings = ({ contest, setContest }: EditContestProps) => {
  
  const [ checks, setChecks ] = useState({ duration: true, frozen: true, quiet: true });
  const [ newTag, setNewTag ] = useState('');
  const startDate = new Date(contest.settings.startTimestamp);
  const endDate = new Date(contest.settings.endTimestamp);
  const frozenDate = new Date(contest.settings.frozenTimestamp);
  const quietDate = new Date(contest.settings.quietTimestamp);
  const isSelected = (date: Date) => {
    return {
      day: date.isWithinInterval({
        start: startDate.startOfDay(),
        end: endDate.endOfDay(),
      }, '[]'),
    };
  };
  const competition = isEndlessContest(contest);
  const isGlobal = isGlobalContest(contest.settings);
  
  const contestTemplate = getContestTemplate(contest);
  const contestDuration = Math.max(contest.settings.endTimestamp - contest.settings.startTimestamp, 0);
  const frozenDuration = Math.max(contest.settings.quietTimestamp - contest.settings.frozenTimestamp, 0);
  const quietDuration = Math.max(contest.settings.endTimestamp - contest.settings.quietTimestamp, 0);
  
  const frozenAtMinutes = (contest.settings.frozenTimestamp - contest.settings.startTimestamp) / (1000 * 60);
  const quietAtMinutes = (contest.settings.quietTimestamp - contest.settings.startTimestamp) / (1000 * 60);
  
  return (
    <div className="jk-col left top stretch gap nowrap">
      <div className="jk-col gap left stretch bc-we jk-br-ie jk-pg-sm">
        <div className="jk-row left gap nowrap">
          <T className="fw-bd tt-se tx-xl cr-py">template</T>:&nbsp;
          <Select
            options={Object.values(CONTEST_TEMPLATE).map(template => ({
              value: template.value,
              label: <T>{template.label}</T>,
            }))}
            selectedOption={{ value: contestTemplate }}
            onChange={({ value }) => {
              if (contestTemplate === value) {
                return;
              }
              if (value === ContestTemplate.GLOBAL) {
                setContest(prevState => adjustContest({
                  ...prevState,
                  settings: {
                    ...prevState.settings,
                    startTimestamp: 0,
                    frozenTimestamp: 0,
                    quietTimestamp: 0,
                    endTimestamp: 0,
                    penalty: 0,
                  },
                }, prevState));
              } else if (value === ContestTemplate.ENDLESS) {
                setContest(prevState => adjustContest({
                  ...prevState,
                  settings: {
                    ...prevState.settings,
                    startTimestamp: MIN_DATE.getTime(),
                    frozenTimestamp: MAX_DATE.getTime(),
                    quietTimestamp: MAX_DATE.getTime(),
                    endTimestamp: MAX_DATE.getTime(),
                    penalty: 0,
                  },
                  members: {
                    ...prevState.members,
                    rankSpectators: EntityMembersRank.OPEN,
                    spectators: {},
                    rankGuests: EntityMembersRank.OPEN,
                    guests: {},
                  },
                }, prevState));
              } else if (value === ContestTemplate.CLASSIC || value === ContestTemplate.CUSTOM) {
                const contestDefault = CONTEST_DEFAULT(contest.owner);
                setContest(prevState => adjustContest({
                  ...prevState,
                  settings: {
                    ...prevState.settings,
                    startTimestamp: contestDefault.settings.startTimestamp,
                    frozenTimestamp: contestDefault.settings.frozenTimestamp,
                    quietTimestamp: contestDefault.settings.quietTimestamp,
                    endTimestamp: contestDefault.settings.endTimestamp,
                    penalty: contestDefault.settings.penalty,
                  },
                }, prevState));
              }
            }}
          />
        </div>
      </div>
      {!competition && !isGlobal && (
        <div className="jk-col gap left stretch bc-we jk-br-ie jk-pg-sm">
          <ContestTimeProgress contest={{ ...contest, isLive: false }} />
          <div className="jk-row gap top space-between tx-s">
            <div className="jk-col left stretch br-hl jk-br-ie jk-pg-xsm">
              <div className="jk-row left gap nowrap">
                <div className="fw-bd tt-se tx-xl cr-py"><T>start date</T></div>
              </div>
              <div className="jk-row left gap">
                <InputDate
                  type="year-month-day-hours-minutes"
                  date={startDate}
                  baseDate={startDate}
                  isSelected={isSelected}
                  onDatePick={(date) => setContest(prevState => adjustContest({
                    ...prevState,
                    settings: { ...prevState.settings, startTimestamp: date.getTime() },
                  }, prevState))}
                  todayButton
                />
              </div>
            </div>
            <div className="jk-col left stretch br-hl jk-br-ie jk-pg-xsm">
              <div className="jk-row left extend gap">
                <div className="jk-row gap">
                  <div className="fw-bd tt-se tx-xl cr-py"><T>frozen time</T></div>
                  <FrozenInformation />
                </div>
                <InputToggle
                  checked={checks.frozen}
                  size="tiny"
                  onChange={(value) => setChecks(prevState => ({ ...prevState, frozen: value }))}
                  leftLabel={<T className={classNames('tt-se tx-t', { 'fw-bd': !checks.frozen })}>date</T>}
                  rightLabel={<T className={classNames('tt-se tx-t', { 'fw-bd': checks.frozen })}>minutes</T>}
                />
              </div>
              {checks.frozen ? (
                <div className="jk-row left gap">
                  <T className="tt-se">_at</T>
                  <Input
                    type="number"
                    size="auto"
                    value={frozenAtMinutes}
                    onChange={value => setContest(prevState => adjustContest({
                      ...prevState,
                      settings: {
                        ...prevState.settings,
                        frozenTimestamp: contest.settings.startTimestamp + (value * 1000 * 60),
                      },
                    }, prevState))}
                  />
                  <T>minutes</T>
                </div>
              ) : (
                <div className="jk-row left gap">
                  <InputDate
                    type="year-month-day-hours-minutes"
                    date={new Date(contest.settings.frozenTimestamp)}
                    isSelected={(date) => ({
                      day: date.isWithinInterval({
                        start: frozenDate.startOfDay(),
                        end: frozenDate.endOfDay(),
                      }, '[]'),
                    })}
                    isDisabled={(date) => disableOutOfRange(date, startDate, endDate)}
                    baseDate={new Date(contest.settings.frozenTimestamp)}
                    onDatePick={(date) => setContest(prevState => adjustContest({
                      ...prevState,
                      settings: {
                        ...prevState.settings,
                        frozenTimestamp: date.getTime(),
                      },
                    }, prevState))}
                    todayButton
                  />
                </div>
              )}
              {!!frozenDuration ? (
                <>
                  {contest.settings.frozenTimestamp - contest.settings.startTimestamp > 0 ? (
                    <div className="jk-row left fw-lt tx-s">
                      <T className="tt-se">_at</T>&nbsp;
                      <div className="jk-col left">
                        <Timer
                          currentTimestamp={contest.settings.frozenTimestamp - contest.settings.startTimestamp}
                          interval={0}
                          type="weeks-days-hours-minutes-seconds"
                          literal
                          ignoreLeadingZeros
                          ignoreTrailingZeros
                        />
                      </div>
                    </div>
                  ) : <T className="tt-se tx-s fw-lt cr-er">at the beginning</T>}
                  <div className="jk-row left tx-s fw-lt">
                    <T className="tt-se">duration</T>:&nbsp;
                    <div className="jk-col left">
                      <Timer
                        currentTimestamp={frozenDuration}
                        interval={0}
                        type="weeks-days-hours-minutes-seconds"
                        literal
                        ignoreLeadingZeros
                        ignoreTrailingZeros
                      />
                    </div>
                  </div>
                </>
              ) : frozenAtMinutes === 0
                ? <T className="tt-se tx-s fw-lt cr-er">frozen time starts at the beginning</T>
                : <T className="tt-se tx-s fw-lt cr-wg">there is not frozen time</T>}
            </div>
            <div className="jk-col left stretch br-hl jk-br-ie jk-pg-xsm">
              <div className="jk-row left extend gap">
                <div className="jk-row gap">
                  <div className="fw-bd tt-se tx-xl cr-py"><T>quiet time</T></div>
                  <QuietInformation />
                </div>
                <InputToggle
                  checked={checks.quiet}
                  size="tiny"
                  onChange={(value) => setChecks(prevState => ({ ...prevState, quiet: value }))}
                  leftLabel={<T className={classNames('tt-se tx-t', { 'fw-bd': !checks.quiet })}>date</T>}
                  rightLabel={<T className={classNames('tt-se tx-t', { 'fw-bd': checks.quiet })}>minutes</T>}
                />
              </div>
              {checks.quiet ? (
                <div className="jk-row left gap">
                  <T className="tt-se">_at</T>
                  <Input
                    type="number"
                    size="auto"
                    value={quietAtMinutes}
                    onChange={value => setContest(prevState => ({
                      ...prevState,
                      settings: {
                        ...prevState.settings,
                        quietTimestamp: contest.settings.startTimestamp + (value * 1000 * 60),
                        frozenTimestamp: Math.min(contest.settings.frozenTimestamp, contest.settings.startTimestamp + (value * 1000 * 60)),
                      },
                    }))}
                  />
                  <T>minutes</T>
                </div>
              ) : (
                <div className="jk-row left gap">
                  <InputDate
                    type="year-month-day-hours-minutes"
                    date={new Date(contest.settings.quietTimestamp)}
                    isSelected={(date) => ({
                      day: date.isWithinInterval({
                        start: quietDate.startOfDay(),
                        end: quietDate.endOfDay(),
                      }, '[]'),
                    })}
                    isDisabled={(date) => disableOutOfRange(date, frozenDate, endDate)}
                    baseDate={new Date(contest.settings.quietTimestamp)}
                    onDatePick={(date) => setContest(prevState => ({
                      ...prevState,
                      settings: {
                        ...prevState.settings,
                        quietTimestamp: date.getTime(),
                      },
                    }))}
                    todayButton
                  />
                </div>
              )}
              {!!quietDuration ? (
                <>
                  {contest.settings.quietTimestamp - contest.settings.startTimestamp > 0 ? (
                    <div className="jk-row left tx-s fw-lt">
                      <T className="tt-se">_at</T>&nbsp;
                      <div className="jk-col left">
                        <Timer
                          currentTimestamp={contest.settings.quietTimestamp - contest.settings.startTimestamp}
                          interval={0}
                          type="weeks-days-hours-minutes-seconds"
                          literal
                          ignoreLeadingZeros
                          ignoreTrailingZeros
                        />
                      </div>
                    </div>
                  ) : quietAtMinutes === 0
                    ? <T className="tt-se tx-s fw-lt cr-er">quiet time starts at the beginning</T>
                    : <T className="tt-se tx-s fw-lt cr-wg">there is not quiet time</T>}
                  <div className="jk-row left tx-s fw-lt">
                    <T className="tt-se">duration</T>:&nbsp;
                    <div className="jk-col left">
                      <Timer
                        currentTimestamp={quietDuration}
                        interval={0}
                        type="weeks-days-hours-minutes-seconds"
                        literal
                        ignoreLeadingZeros
                        ignoreTrailingZeros
                      />
                    </div>
                  </div>
                </>
              ) : <T className="tt-se tx-s fw-lt cr-wg">there is not quiet time</T>}
            </div>
            <div className="jk-col left stretch br-hl jk-br-ie jk-pg-xsm">
              <div className="jk-row gap left">
                <div className="fw-bd tt-se tx-xl cr-py">
                  <T>end time</T>
                </div>
                <InputToggle
                  checked={checks.duration}
                  size="tiny"
                  onChange={(value) => setChecks(prevState => ({ ...prevState, duration: value }))}
                  leftLabel={<T className={classNames('tt-se tx-s', { 'fw-bd': !checks.duration })}>date</T>}
                  rightLabel={<T className={classNames('tt-se tx-s', { 'fw-bd': checks.duration })}>minutes</T>}
                />
              </div>
              {checks.duration ? (
                <div className="jk-row left">
                  <T className="tt-se">_at</T>&nbsp;
                  <Input
                    type="number"
                    size="auto"
                    value={(contest.settings.endTimestamp - contest.settings.startTimestamp) / (1000 * 60)}
                    onChange={value => setContest(prevState => adjustContest({
                      ...prevState,
                      settings: {
                        ...prevState.settings,
                        endTimestamp: prevState.settings.startTimestamp + (value * 1000 * 60),
                      },
                    }, prevState))}
                  />
                  &nbsp;
                  <T>minutes</T>
                </div>
              ) : (
                <div className="jk-row left gap">
                  <InputDate
                    type="year-month-day-hours-minutes"
                    date={endDate}
                    baseDate={endDate}
                    isSelected={isSelected}
                    isDisabled={(date) => ({
                      year: date.isYearBefore(startDate),
                      month: date.isMonthBefore(startDate),
                      day: date.isDayBefore(startDate),
                      hours: date.isHoursBefore(startDate),
                      minutes: date.isMinutesBefore(startDate),
                      seconds: date.isSecondsBefore(startDate),
                      milliseconds: date.isMillisecondsBefore(startDate),
                    })}
                    onDatePick={(date) => setContest(prevState => adjustContest({
                      ...prevState,
                      settings: {
                        ...prevState.settings,
                        endTimestamp: date.getTime(),
                      },
                    }, prevState))}
                    todayButton
                  />
                </div>
              )}
              {!!contestDuration ? (
                <>
                  <div className="jk-row left tx-s fw-lt">
                    <T className="tt-se">_at</T>&nbsp;
                    <div className="jk-col left">
                      <Timer
                        currentTimestamp={contest.settings.endTimestamp - contest.settings.startTimestamp}
                        interval={0}
                        type="weeks-days-hours-minutes-seconds"
                        literal
                        ignoreLeadingZeros
                        ignoreTrailingZeros
                      />
                    </div>
                  </div>
                  <div className="jk-row left tx-s fw-lt">
                    <T className="tt-se tx-s">duration</T>:&nbsp;
                    <Timer
                      currentTimestamp={contestDuration}
                      interval={0}
                      type="weeks-days-hours-minutes-seconds"
                      literal
                      ignoreLeadingZeros
                      ignoreTrailingZeros
                      className="fw-lt tx-s"
                    />
                  </div>
                </>
              ) : <T className="tt-se tx-s cr-er">the is no contest time</T>}
            </div>
          </div>
        </div>
      )}
      {!competition && !isGlobal && (
        <div className="jk-col gap left stretch bc-we jk-br-ie jk-pg-sm">
          <div className="jk-row left gap">
            <div className="fw-bd tt-se tx-xl cr-py"><T>penalty</T>:</div>
            <div className="jk-row gap left">
              <Input
                type="number"
                size="auto"
                value={contest.settings.penalty}
                onChange={value => setContest(prevState => ({
                  ...prevState,
                  settings: { ...prevState.settings, penalty: value },
                }))}
              />
              <T>minutes of penalty by incorrect answer</T>
            </div>
          </div>
        </div>
      )}
      {!isGlobal && (
        <div className="jk-col gap left stretch bc-we jk-br-ie jk-pg-sm">
          <div className="jk-row left gap nowrap">
            <div className="jk-row nowrap fw-bd tx-xl cr-py"><T className="tt-se">languages</T>
              {!Object.keys(contest.settings.languages).length && (
                <div
                  className="jk-row nowrap"
                  data-tooltip-id="jk-tooltip"
                  data-tooltip-content="there must be at least one language selected"
                >
                  &nbsp;<WarningIcon className="cr-er" />&nbsp;
                </div>
              )}
              :
            </div>
            <MultiSelect
              options={ACCEPTED_PROGRAMMING_LANGUAGES.map(language => ({
                label: CODE_LANGUAGE[language].label,
                value: language,
              }))}
              selectedOptions={contest.settings.languages.map(language => ({ value: language }))}
              onChange={options => setContest(prevState => ({
                ...prevState,
                settings: { ...prevState.settings, languages: options.map(option => option.value) },
              }))}
              expand
              optionsPlacement="top"
            />
          </div>
          <div className="jk-row left gap">
            <div className="fw-bd tt-se tx-xl cr-py"><T>clarifications</T>:</div>
            <InputToggle
              size="small"
              checked={contest.settings.clarifications}
              onChange={(value) => setContest(prevState => ({
                ...prevState,
                settings: { ...prevState.settings, clarifications: value },
              }))}
              leftLabel={<T className={classNames('tt-se', { 'fw-bd': !contest.settings.clarifications })}>no
                available</T>}
              rightLabel={
                <T className={classNames('tt-se', { 'fw-bd': contest.settings.clarifications })}>available</T>}
            />
          </div>
        </div>
      )}
      {isGlobal && (
        <div className="jk-col gap left stretch bc-we jk-br-ie jk-pg-sm">
          <div className="jk-row nowrap gap extend left">
            <div className="jk-row left nowrap">
              <T className="tt-se fw-bd">tags</T>&nbsp;<span className="fw-bd">:</span>&nbsp;
              <div className="jk-row gap">
                {contest.tags.map(tag => (
                  <div key={tag} className="jk-tag info jk-row">
                    {tag}&nbsp;
                    <DeleteIcon
                      size="small"
                      onClick={() => {
                        setContest(prevState => ({
                          ...prevState,
                          tags: prevState.tags.filter(t => tag !== t),
                        }));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <Input value={newTag} onChange={setNewTag} />
            <Button
              onClick={() => {
                setContest(prevState => ({
                  ...prevState,
                  tags: Array.from(new Set([ ...prevState.tags, newTag ])),
                }));
              }}
              icon={<AddIcon />}
            />
          </div>
        </div>
      )}
      {/*<div className="jk-divider" />*/}
      {/*<T>number judge validations</T>*/}
      {/*<Input*/}
      {/*  type="number"*/}
      {/*  value={contest.settings.numberJudgeValidations}*/}
      {/*  onChange={value => setContest(prevState => ({*/}
      {/*    ...prevState,*/}
      {/*    settings: { ...prevState.settings, numberJudgeValidations: Math.max(value, 0) },*/}
      {/*  }))}*/}
      {/*/>*/}
      {/*<p><T className="color-gray-4">put 0 so that the validation of any judge is not needed to show the result to the user</T></p>*/}
    </div>
  );
};
