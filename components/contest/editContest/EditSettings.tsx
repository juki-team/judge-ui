import { CONTEST_STATUS } from '@juki-team/commons';
import { FrozenInformation, Input, InputDate, InputToggle, MultiSelect, QuietInformation, Select, T, Timer } from 'components';
import { ACCEPTED_PROGRAMMING_LANGUAGES, PROGRAMMING_LANGUAGE } from 'config/constants';
import { adjustContest, classNames, disableOutOfRange, isEndlessContest } from 'helpers';
import React, { useState } from 'react';
import { EditContestProps } from '../types';

export const EditSettings = ({ contest, setContest }: EditContestProps) => {
  
  const [checks, setChecks] = useState({ duration: true, frozen: true, quiet: true });
  
  const startDate = new Date(contest.settings.startTimestamp);
  const endDate = new Date(contest.settings.endTimestamp);
  const frozenDate = new Date(contest.settings.frozenTimestamp);
  const quietDate = new Date(contest.settings.quietTimestamp);
  const isSelected = (date) => {
    return {
      day: date.isWithinInterval({
        start: startDate.startOfDay(),
        end: endDate.endOfDay(),
      }, '[]'),
    };
  };
  
  const competition = isEndlessContest(contest);
  
  return (
    <div className="jk-col left stretch jk-pad gap">
      <div className="jk-row left gap">
        <div className="jk-row gap">
          <h6 className="cr-er"><T>contest status</T></h6>
        </div>
        <div style={{ width: 500 }}>
          <Select
            options={Object.values(CONTEST_STATUS).map(status => ({
              value: status.value,
              label: (
                <div className="jk-col left">
                  <T className="fw-bd tt-se">{status.label}</T>
                  <T className="tt-se">{status.description}</T>
                </div>
              ),
            }))}
            selectedOption={{ value: contest.status }}
            onChange={({ value }) => setContest(prevState => ({ ...prevState, status: value }))}
            className="max-select-size"
            popoverClassName="max-popover-select-size"
          />
        </div>
      </div>
      <div className="jk-divider" style={{ margin: 0, height: 4 }} />
      {!competition && (
        <div className="jk-row left gap">
          <h6><T>start date</T></h6>
          <InputDate
            type="year-month-day-hours-minutes"
            date={startDate}
            baseDate={startDate}
            isSelected={isSelected}
            onDatePick={(date) => setContest(prevState => adjustContest({
              ...prevState,
              settings: { ...prevState.settings, startTimestamp: date.getTime() },
            }))}
            todayButton
          />
        </div>
      )}
      {!competition && (
        <div className="jk-col left stretch">
          <div className="jk-row gap left extend">
            <h6><T>duration</T></h6>
            <InputToggle
              checked={checks.duration}
              size="small"
              onChange={(value) => setChecks(prevState => ({ ...prevState, duration: value }))}
              leftLabel={<T className={classNames('tt-se tx-s', { 'fw-bd': !checks.duration })}>date</T>}
              rightLabel={<T className={classNames('tt-se tx-s', { 'fw-bd': checks.duration })}>minutes</T>}
            />
          </div>
          {checks.duration ? (
            <div className="jk-row left gap">
              <T className="tt-se">ends within</T>
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
                }))}
              />
              <T>minutes of the start of the contest</T>
            </div>
          ) : (
            <div className="jk-row left gap">
              <T className="tt-se">ends on date</T>
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
                }))}
                todayButton
              />
            </div>
          )}
          <div className="jk-row left">
            <div className="jk-col left">
              <Timer
                currentTimestamp={contest.settings.endTimestamp - contest.settings.startTimestamp}
                interval={0}
                laps={6}
                literal
                ignoreLeadingZeros
                ignoreTrailingZeros
              />
            </div>
            &nbsp;
            <T>of the start of the contest</T>
          </div>
        </div>
      )}
      {!competition && (
        <div className="jk-col left stretch">
          <div className="jk-row left extend gap">
            <div className="jk-row gap"><h6><T>frozen</T></h6><FrozenInformation /></div>
            <InputToggle
              checked={checks.frozen}
              size="small"
              onChange={(value) => setChecks(prevState => ({ ...prevState, frozen: value }))}
              leftLabel={<T className={classNames('tt-se tx-s', { 'fw-bd': !checks.frozen })}>date</T>}
              rightLabel={<T className={classNames('tt-se tx-s', { 'fw-bd': checks.frozen })}>minutes</T>}
            />
          </div>
          {checks.frozen ? (
            <div className="jk-row left gap">
              <T className="tt-se">frozen within</T>
              <Input
                type="number"
                size="auto"
                value={(contest.settings.frozenTimestamp - contest.settings.startTimestamp) / (1000 * 60)}
                onChange={value => setContest(prevState => adjustContest({
                  ...prevState,
                  settings: {
                    ...prevState.settings,
                    frozenTimestamp: contest.settings.startTimestamp + (value * 1000 * 60),
                  },
                }))}
              />
              <T>minutes of the start of the contest</T>
            </div>
          ) : (
            <div className="jk-row left gap">
              <T className="tt-se">frozen on date</T>
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
                }))}
                todayButton
              />
            </div>
          )}
          <div className="jk-row left">
            <div className="jk-col left">
              <Timer
                currentTimestamp={contest.settings.frozenTimestamp - contest.settings.startTimestamp}
                interval={0}
                laps={6}
                literal
                ignoreLeadingZeros
                ignoreTrailingZeros
              />
            </div>
            &nbsp;
            <T>of the start of the contest</T>
          </div>
        </div>
      )}
      {!competition && (
        <div className="jk-col left stretch">
          <div className="jk-row left extend gap">
            <div className="jk-row gap"><h6><T>quiet</T></h6><QuietInformation /></div>
            <InputToggle
              checked={checks.quiet}
              onChange={(value) => setChecks(prevState => ({ ...prevState, quiet: value }))}
              leftLabel={<T className={classNames('tt-se tx-s', { 'fw-bd': !checks.quiet })}>date</T>}
              rightLabel={<T className={classNames('tt-se tx-s', { 'fw-bd': checks.quiet })}>minutes</T>}
            />
          </div>
          {checks.quiet ? (
            <div className="jk-row left gap">
              <T className="tt-se">quiet within</T>
              <Input
                type="number"
                size="auto"
                value={(contest.settings.quietTimestamp - contest.settings.startTimestamp) / (1000 * 60)}
                onChange={value => setContest(prevState => ({
                  ...prevState,
                  settings: {
                    ...prevState.settings,
                    quietTimestamp: contest.settings.startTimestamp + (value * 1000 * 60),
                  },
                }))}
              />
              <T>minutes of the start of the contest</T>
            </div>
          ) : (
            <div className="jk-row left gap">
              <T className="tt-se">quiet on date</T>
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
          <div className="jk-row left">
            <div className="jk-col left">
              <Timer
                currentTimestamp={contest.settings.quietTimestamp - contest.settings.startTimestamp}
                interval={0}
                laps={6}
                literal
                ignoreLeadingZeros
                ignoreTrailingZeros
              />
            </div>
            &nbsp;
            <T>of the start of the contest</T>
          </div>
        </div>
      )}
      {!competition && (
        <div className="jk-row left gap">
          <h6><T>penalty</T></h6>
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
      )}
      <div className="jk-col left stretch gap">
        <h6><T>languages</T></h6>
        <div className="jk-row extend">
          <MultiSelect
            options={ACCEPTED_PROGRAMMING_LANGUAGES.map(language => ({
              label: PROGRAMMING_LANGUAGE[language].label,
              value: language,
            }))}
            selectedOptions={contest.settings.languages.map(language => ({ value: language }))}
            onChange={options => setContest(prevState => ({
              ...prevState,
              settings: { ...prevState.settings, languages: options.map(option => option.value) },
            }))}
            block
            optionsPlacement="top"
          />
        </div>
      </div>
      <div className="jk-row left gap">
        <h6><T>clarifications</T></h6>
        <InputToggle
          checked={contest.settings.clarifications}
          onChange={(value) => setContest(prevState => ({
            ...prevState,
            settings: { ...prevState.settings, clarifications: value },
          }))}
          leftLabel={<T className={classNames('tt-se', { 'fw-bd': !contest.settings.clarifications })}>no
            available</T>}
          rightLabel={<T className={classNames('tt-se', { 'fw-bd': contest.settings.clarifications })}>available</T>}
        />
      </div>
      {/*<div className="jk-divider" />*/}
      {/*<h6><T>number judge validations</T></h6>*/}
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