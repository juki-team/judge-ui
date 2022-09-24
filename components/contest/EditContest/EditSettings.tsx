import { FrozenInformation, Input, InputDate, InputToggle, MultiSelect, QuietInformation, T, Timer } from 'components';
import { ACCEPTED_PROGRAMMING_LANGUAGES, PROGRAMMING_LANGUAGE } from 'config/constants';
import { classNames, disableOutOfRange, roundTimestamp } from 'helpers';
import React, { useState } from 'react';
import { ContestProblemBasicType, EditCreateContestDTO } from 'types';
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
  const adjustContest = (contest: EditCreateContestDTO): EditCreateContestDTO => {
    const startTimestamp = roundTimestamp(contest.settings.startTimestamp);
    const endTimestamp = Math.max(roundTimestamp(contest.settings.endTimestamp), startTimestamp);
    const frozenTimestamp = Math.min(Math.max(roundTimestamp(contest.settings.frozenTimestamp), startTimestamp), endTimestamp);
    const quietTimestamp = Math.min(Math.max(roundTimestamp(contest.settings.quietTimestamp), frozenTimestamp), endTimestamp);
    const problems: { [key: string]: ContestProblemBasicType & { name: string } } = {};
    Object.values(contest.problems).forEach(problem => {
      problems[problem.key] = {
        ...problem,
        startTimestamp: Math.min(Math.max(roundTimestamp(problem.startTimestamp), contest.settings.startTimestamp), contest.settings.endTimestamp),
        endTimestamp: Math.min(Math.max(roundTimestamp(problem.endTimestamp), problem.startTimestamp), contest.settings.endTimestamp),
      };
    });
    return {
      ...contest,
      settings: {
        ...contest.settings,
        startTimestamp,
        frozenTimestamp,
        quietTimestamp,
        endTimestamp,
      },
      problems,
    };
  };
  
  return (
    <div className="jk-col left stretch jk-pad">
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
        />
      </div>
      <div className="jk-divider" />
      <div className="jk-col left stretch">
        <div className="jk-row space-between extend">
          <h6><T>duration</T></h6>
          <InputToggle
            checked={checks.duration}
            onChange={(value) => setChecks(prevState => ({ ...prevState, duration: value }))}
            leftLabel={<T className={classNames('text-sentence-case', { 'tx-wd-bold': !checks.duration })}>date</T>}
            rightLabel={<T className={classNames('text-sentence-case', { 'tx-wd-bold': checks.duration })}>minutes</T>}
          />
        </div>
        {checks.duration ? (
          <div className="jk-row left gap">
            <T className="text-sentence-case">ends within</T>
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
            <T className="text-sentence-case">ends on date</T>
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
      <div className="jk-divider" />
      <div className="jk-col left stretch">
        <div className="jk-row space-between extend gap">
          <div className="jk-row gap"><h6><T>frozen</T></h6><FrozenInformation /></div>
          <InputToggle
            checked={checks.frozen}
            onChange={(value) => setChecks(prevState => ({ ...prevState, frozen: value }))}
            leftLabel={<T className={classNames('text-sentence-case', { 'tx-wd-bold': !checks.frozen })}>date</T>}
            rightLabel={<T className={classNames('text-sentence-case', { 'tx-wd-bold': checks.frozen })}>minutes</T>}
          />
        </div>
        {checks.frozen ? (
          <div className="jk-row left gap">
            <T className="text-sentence-case">frozen within</T>
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
            <T className="text-sentence-case">frozen on date</T>
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
      <div className="jk-divider" />
      <div className="jk-col left stretch">
        <div className="jk-row space-between extend gap">
          <div className="jk-row gap"><h6><T>quiet</T></h6><QuietInformation /></div>
          <InputToggle
            checked={checks.quiet}
            onChange={(value) => setChecks(prevState => ({ ...prevState, quiet: value }))}
            leftLabel={<T className={classNames('text-sentence-case', { 'tx-wd-bold': !checks.quiet })}>date</T>}
            rightLabel={<T className={classNames('text-sentence-case', { 'tx-wd-bold': checks.quiet })}>minutes</T>}
          />
        </div>
        {checks.quiet ? (
          <div className="jk-row left gap">
            <T className="text-sentence-case">quiet within</T>
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
            <T className="text-sentence-case">quiet on date</T>
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
      <div className="jk-divider" />
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
      <div className="jk-divider" />
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
      <div className="jk-divider" />
      <div className="jk-row left gap">
        <h6><T>clarifications</T></h6>
        <InputToggle
          checked={contest.settings.clarifications}
          onChange={(value) => setContest(prevState => ({
            ...prevState,
            settings: { ...prevState.settings, clarifications: value },
          }))}
          leftLabel={<T className={classNames('text-sentence-case', { 'tx-wd-bold': !contest.settings.clarifications })}>no
            available</T>}
          rightLabel={<T className={classNames('text-sentence-case', { 'tx-wd-bold': contest.settings.clarifications })}>available</T>}
        />
      </div>
      <div className="jk-divider" />
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