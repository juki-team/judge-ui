import { FrozenInformation, Input, InputDate, InputToggle, MultiSelect, QuietInformation, Select, T, Timer } from 'components';
import {
  ACCEPTED_PROGRAMMING_LANGUAGES,
  CONTEST_DEFAULT,
  CONTEST_STATUS,
  CONTEST_TEMPLATE,
  MAX_DATE,
  MIN_DATE,
  PROGRAMMING_LANGUAGE,
} from 'config/constants';
import { adjustContest, classNames, disableOutOfRange, getContestTemplate, isEndlessContest } from 'helpers';
import React, { useState } from 'react';
import { ContestTemplate } from '../../../types';
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
  const contestTemplate = getContestTemplate(contest);
  
  return (
    <div className="jk-col left stretch jk-pad-md gap nowrap">
      <div className="jk-row center gap nowrap">
        <T className="fw-bd tt-se tx-xl cr-py">template</T>:&nbsp;
        <Select
          options={Object.values(CONTEST_TEMPLATE).map(template => ({ value: template.value, label: <T>{template.label}</T> }))}
          selectedOption={{ value: contestTemplate }}
          onChange={({ value }) => {
            if (contestTemplate === value) {
              return;
            }
            if (value === ContestTemplate.ENDLESS) {
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
                members: { ...prevState.members, spectators: ['*'], guests: ['*'] },
              }));
            } else if (value === ContestTemplate.CLASSIC || value === ContestTemplate.CUSTOM) {
              const contestDefault = CONTEST_DEFAULT();
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
              }));
            }
          }}
        />
      </div>
      {/*<div className="jk-divider" style={{ margin: 0, height: 4 }} />*/}
      <div className="jk-row left gap nowrap">
        <div className="jk-row nowrap fw-bd tx-xl cr-er"><T className="tt-se ws-np">contest status</T>:</div>
        <Select
          options={Object.values(CONTEST_STATUS).map(status => ({
            value: status.value,
            label: (
              <div className="jk-col left">
                <T className="fw-bd tt-se tx-xl cr-py">{status.label}</T>
                <T className="tt-se">{status.description}</T>
              </div>
            ),
          }))}
          selectedOption={{ value: contest.status }}
          onChange={({ value }) => setContest(prevState => ({ ...prevState, status: value }))}
          popoverClassName="max-popover-select-size"
          extend
        />
      </div>
      {/*<div className="jk-divider" style={{ margin: 0, height: 4 }} />*/}
      <div className="jk-row left gap nowrap">
        <div className="fw-bd tt-se tx-xl cr-py"><T>key</T>:</div>
        <Input
          value={contest.key}
          onChange={value => {
            setContest(prevState => ({
              ...prevState,
              key: value.trim().split(' ').join('-').replace(/[^0-9a-z_-]/gi, ''),
            }));
          }}
        />
      </div>
      {!competition && (
        <div className="jk-row left gap nowrap">
          <div className="fw-bd tt-se tx-xl cr-py"><T>start date</T>:</div>
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
            <div className="fw-bd tt-se tx-xl cr-py"><T>duration</T></div>
            <InputToggle
              checked={checks.duration}
              size="tiny"
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
            <div className="jk-row gap">
              <div className="fw-bd tt-se tx-xl cr-py"><T>frozen</T></div>
              <FrozenInformation /></div>
            <InputToggle
              checked={checks.frozen}
              size="tiny"
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
            <div className="jk-row gap">
              <div className="fw-bd tt-se tx-xl cr-py"><T>quiet</T></div>
              <QuietInformation /></div>
            <InputToggle
              checked={checks.quiet}
              size="tiny"
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
      )}
      <div className="jk-row left gap nowrap">
        <div className="jk-row nowrap fw-bd tx-xl cr-py"><T className="tt-se">languages</T>:</div>
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
          rightLabel={<T className={classNames('tt-se', { 'fw-bd': contest.settings.clarifications })}>available</T>}
        />
      </div>
      <div className="jk-row left gap">
        <div className="fw-bd tt-se tx-xl cr-py"><T>editorial of problems</T>:</div>
        <InputToggle
          size="small"
          checked={contest.settings.problemEditorials}
          onChange={(value) => setContest(prevState => ({
            ...prevState,
            settings: { ...prevState.settings, problemEditorials: value },
          }))}
          leftLabel={<T className={classNames('tt-se', { 'fw-bd': !contest.settings.problemEditorials })}>no
            available</T>}
          rightLabel={<T className={classNames('tt-se', { 'fw-bd': contest.settings.problemEditorials })}>available</T>}
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