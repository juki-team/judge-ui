'use client';

import { AddIcon, DeleteIcon, EditIcon, WarningIcon } from '@juki-team/base-ui/server-components';
import { TimerDisplay } from '@juki-team/base-ui/server-components';
import { Button, FrozenInformation, Input, InputDate, InputToggle, MultiSelect, QuietInformation, Select, T, useUserStore } from '@juki-team/base-ui';
import { adjustContest, disableOutOfRange, getContestTemplate, isEndlessContest } from 'helpers';
import { classNames } from '@juki-team/base-ui/helpers';
import { ACCEPTED_PROGRAMMING_LANGUAGES, CODE_LANGUAGE, MAX_DATE, MIN_DATE } from '@juki-team/commons/constants';
import { EntityMembersRank } from '@juki-team/commons/enums';
import { endOfDay, isDayBefore, isGlobalContest, isHoursBefore, isMillisecondsBefore, isMinutesBefore, isMonthBefore, isSecondsBefore, isWithinInterval, isYearBefore, startOfDay } from '@juki-team/commons/helpers';
import { useState } from 'hooks';
import { CONTEST_DEFAULT, CONTEST_TEMPLATE } from 'src/constants';
import { ContestTemplate, UpsertContestDTOUI } from 'types';
import { v4 } from 'uuid';
import { EditContestProps } from '../types';
import { ContestTimeProgress } from '../view/ContestTimeProgress';
import { NewGroup } from './NewGroup';

export const EditSettings = ({ contest, setContest }: EditContestProps) => {
  
  const isAdminServices = useUserStore(store => store.user.permissions.services.administrate);
  const [ checks, setChecks ] = useState({ duration: true, frozen: true, quiet: true });
  const [ newTag, setNewTag ] = useState('');
  const [ group, setGroup ] = useState<UpsertContestDTOUI['groups'][string] | null>(null);
  const startDate = new Date(contest.settings.startsAt);
  const endDate = new Date(contest.settings.endsAt);
  const frozenDate = new Date(contest.settings.frozenAt);
  const quietDate = new Date(contest.settings.silencedAt);
  const isSelected = (date: Date) => {
    return {
      day: isWithinInterval(date, {
        start: startOfDay(startDate),
        end: endOfDay(endDate),
      }, '[]'),
    };
  };
  const competition = isEndlessContest(contest);
  const isGlobal = isGlobalContest(contest.settings);
  
  const contestTemplate = getContestTemplate(contest);
  const contestDuration = Math.max(contest.settings.endsAt - contest.settings.startsAt, 0);
  const frozenDuration = Math.max(contest.settings.silencedAt - contest.settings.frozenAt, 0);
  const quietDuration = Math.max(contest.settings.endsAt - contest.settings.silencedAt, 0);
  
  const frozenAtMinutes = (contest.settings.frozenAt - contest.settings.startsAt) / (1000 * 60);
  const quietAtMinutes = (contest.settings.silencedAt - contest.settings.startsAt) / (1000 * 60);
  
  return (
    <div className="jk-col left top stretch gap nowrap">
      <div className="jk-col gap left stretch bc-we jk-br-ie jk-pg-sm">
        <div className="jk-row left gap nowrap">
          <T className="fw-bd tt-se tx-xl cr-py">template</T>:&nbsp;
          <Select
            options={CONTEST_TEMPLATE(isAdminServices).map(template => ({
              value: template.value,
              label: <T className="tt-se">{template.label}</T>,
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
                    startsAt: 0,
                    frozenAt: 0,
                    silencedAt: 0,
                    endsAt: 0,
                    penalty: 0,
                  },
                }, prevState));
              } else if (value === ContestTemplate.ENDLESS) {
                setContest(prevState => adjustContest({
                  ...prevState,
                  settings: {
                    ...prevState.settings,
                    startsAt: MIN_DATE.getTime(),
                    frozenAt: MAX_DATE.getTime(),
                    silencedAt: MAX_DATE.getTime(),
                    endsAt: MAX_DATE.getTime(),
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
              } else if (value === ContestTemplate.CLASSIC || value === ContestTemplate.CUSTOMIZED) {
                const contestDefault = CONTEST_DEFAULT(contest.owner);
                setContest(prevState => adjustContest({
                  ...prevState,
                  settings: {
                    ...prevState.settings,
                    startsAt: contestDefault.settings.startsAt,
                    frozenAt: contestDefault.settings.frozenAt,
                    silencedAt: contestDefault.settings.silencedAt,
                    endsAt: contestDefault.settings.endsAt,
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
          <ContestTimeProgress
            contest={{
              ...contest,
              isLive: false,
              isFrozenTime: false,
              isQuietTime: false,
              isEndless: false,
              isPast: false,
              isFuture: false,
              isGlobal: false,
            }}
          />
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
                    settings: { ...prevState.settings, startsAt: date.getTime() },
                  }, prevState))}
                  todayButton
                />
              </div>
            </div>
            <div className="jk-col left stretch br-hl jk-br-ie jk-pg-xsm">
              <div className="jk-row left extend gap">
                <div className="jk-row gap">
                  <div className="fw-bd tt-se tx-xl cr-py"><T>frozen period</T></div>
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
                        frozenAt: contest.settings.startsAt + (value * 1000 * 60),
                      },
                    }, prevState))}
                  />
                  <T>minutes</T>
                </div>
              ) : (
                <div className="jk-row left gap">
                  <InputDate
                    type="year-month-day-hours-minutes"
                    date={new Date(contest.settings.frozenAt)}
                    isSelected={(date) => ({
                      day: isWithinInterval(date, {
                        start: startOfDay(frozenDate),
                        end: endOfDay(frozenDate),
                      }, '[]'),
                    })}
                    isDisabled={(date) => disableOutOfRange(date, startDate, endDate)}
                    baseDate={new Date(contest.settings.frozenAt)}
                    onDatePick={(date) => setContest(prevState => adjustContest({
                      ...prevState,
                      settings: {
                        ...prevState.settings,
                        frozenAt: date.getTime(),
                      },
                    }, prevState))}
                    todayButton
                  />
                </div>
              )}
              {!!frozenDuration ? (
                <>
                  {contest.settings.frozenAt - contest.settings.startsAt > 0 ? (
                    <div className="jk-row left fw-lt tx-s">
                      <T className="tt-se">_at</T>&nbsp;
                      <div className="jk-col left">
                        <TimerDisplay
                          counter={contest.settings.frozenAt - contest.settings.startsAt}
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
                      <TimerDisplay
                        counter={frozenDuration}
                        type="weeks-days-hours-minutes-seconds"
                        literal
                        ignoreLeadingZeros
                        ignoreTrailingZeros
                      />
                    </div>
                  </div>
                </>
              ) : frozenAtMinutes === 0
                ? <T className="tt-se tx-s fw-lt cr-er">frozen period starts at the beginning</T>
                : <T className="tt-se tx-s fw-lt cr-wg">there is not frozen period</T>}
            </div>
            <div className="jk-col left stretch br-hl jk-br-ie jk-pg-xsm">
              <div className="jk-row left extend gap">
                <div className="jk-row gap">
                  <div className="fw-bd tt-se tx-xl cr-py"><T>quiet period</T></div>
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
                        silencedAt: contest.settings.startsAt + (value * 1000 * 60),
                        frozenAt: Math.min(contest.settings.frozenAt, contest.settings.startsAt + (value * 1000 * 60)),
                      },
                    }))}
                  />
                  <T>minutes</T>
                </div>
              ) : (
                <div className="jk-row left gap">
                  <InputDate
                    type="year-month-day-hours-minutes"
                    date={new Date(contest.settings.silencedAt)}
                    isSelected={(date) => ({
                      day: isWithinInterval(date, {
                        start: startOfDay(quietDate),
                        end: endOfDay(quietDate),
                      }, '[]'),
                    })}
                    isDisabled={(date) => disableOutOfRange(date, frozenDate, endDate)}
                    baseDate={new Date(contest.settings.silencedAt)}
                    onDatePick={(date) => setContest(prevState => ({
                      ...prevState,
                      settings: {
                        ...prevState.settings,
                        silencedAt: date.getTime(),
                      },
                    }))}
                    todayButton
                  />
                </div>
              )}
              {!!quietDuration ? (
                <>
                  {contest.settings.silencedAt - contest.settings.startsAt > 0 ? (
                    <div className="jk-row left tx-s fw-lt">
                      <T className="tt-se">_at</T>&nbsp;
                      <div className="jk-col left">
                        <TimerDisplay
                          counter={contest.settings.silencedAt - contest.settings.startsAt}
                          type="weeks-days-hours-minutes-seconds"
                          literal
                          ignoreLeadingZeros
                          ignoreTrailingZeros
                        />
                      </div>
                    </div>
                  ) : quietAtMinutes === 0
                    ? <T className="tt-se tx-s fw-lt cr-er">quiet period starts at the beginning</T>
                    : <T className="tt-se tx-s fw-lt cr-wg">there is not quiet period</T>}
                  <div className="jk-row left tx-s fw-lt">
                    <T className="tt-se">duration</T>:&nbsp;
                    <div className="jk-col left">
                      <TimerDisplay
                        counter={quietDuration}
                        type="weeks-days-hours-minutes-seconds"
                        literal
                        ignoreLeadingZeros
                        ignoreTrailingZeros
                      />
                    </div>
                  </div>
                </>
              ) : <T className="tt-se tx-s fw-lt cr-wg">there is not quiet period</T>}
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
                    value={(contest.settings.endsAt - contest.settings.startsAt) / (1000 * 60)}
                    onChange={value => setContest(prevState => adjustContest({
                      ...prevState,
                      settings: {
                        ...prevState.settings,
                        endsAt: prevState.settings.startsAt + (value * 1000 * 60),
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
                      year: isYearBefore(date, startDate),
                      month: isMonthBefore(date, startDate),
                      day: isDayBefore(date, startDate),
                      hours: isHoursBefore(date, startDate),
                      minutes: isMinutesBefore(date, startDate),
                      seconds: isSecondsBefore(date, startDate),
                      milliseconds: isMillisecondsBefore(date, startDate),
                    })}
                    onDatePick={(date) => setContest(prevState => adjustContest({
                      ...prevState,
                      settings: {
                        ...prevState.settings,
                        endsAt: date.getTime(),
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
                      <TimerDisplay
                        counter={contest.settings.endsAt - contest.settings.startsAt}
                        type="weeks-days-hours-minutes-seconds"
                        literal
                        ignoreLeadingZeros
                        ignoreTrailingZeros
                      />
                    </div>
                  </div>
                  <div className="jk-row left tx-s fw-lt">
                    <T className="tt-se tx-s">duration</T>:&nbsp;
                    <TimerDisplay
                      counter={contestDuration}
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
      <div className="jk-col gap left stretch bc-we jk-br-ie jk-pg-sm">
        <div className="jk-row nowrap gap extend left">
          <div className="jk-row left nowrap">
            <T className="tt-se fw-bd">tags</T>&nbsp;
            <span className="fw-bd">:</span>
            &nbsp;
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
            disabled={!newTag}
            onClick={() => {
              setContest(prevState => ({
                ...prevState,
                tags: Array.from(new Set([ ...prevState.tags, newTag ])),
              }));
              setNewTag('');
            }}
            icon={<AddIcon />}
          />
        </div>
      </div>
      <div className="jk-col gap left stretch bc-we jk-br-ie jk-pg-sm">
        <div className="jk-row nowrap gap extend left">
          <div className="jk-row left nowrap">
            <T className="tt-se fw-bd">groups</T>&nbsp;
            <span className="fw-bd">:</span>
            &nbsp;
            <div className="jk-row gap">
              {Object.values(contest.groups).map(({ value, label, color }) => (
                <div key={value} className="jk-tag info jk-row" style={{ backgroundColor: color }}>
                  {label}&nbsp;
                  <EditIcon
                    size="small"
                    onClick={() => setGroup({ value, label, color })}
                  />
                  <DeleteIcon
                    size="small"
                    onClick={() => {
                      setContest(prevState => ({
                        ...prevState,
                        groups: Object.fromEntries(Object.values(contest.groups).filter(group => group.value !== value).map(group => [ group.value, group ])),
                      }));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <Button
            onClick={() => setGroup({ value: v4(), label: '', color: '' })}
            icon={<AddIcon />}
          />
        </div>
      </div>
      {group && (
        <NewGroup
          isOpen={!!group}
          onSave={(group) => {
            setContest(prevState => ({
              ...prevState,
              groups: {
                ...prevState.groups,
                [group.value]: group,
              },
            }));
            setGroup(null);
          }}
          onClose={() => setGroup(null)}
          group={group}
        />
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
