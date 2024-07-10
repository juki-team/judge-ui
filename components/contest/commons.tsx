import { LinkCmpProps } from '@juki-team/base-ui';
import { CheckIcon, DateLiteral, EventIcon, Field, GroupIcon, Popover, ScheduleIcon, T, Timer } from 'components';
import { ROUTES } from 'config/constants';
import { classNames } from 'helpers';
import React, { FC, PropsWithChildren } from 'react';
import {
  ContestResponseDTO,
  ContestSummaryListResponseDTO,
  ContestTab,
  DataViewerHeadersType,
  JkTableHeaderFilterType,
} from 'types';

export const contestNameColumn = (auto: boolean, Link: FC<PropsWithChildren<LinkCmpProps>>): DataViewerHeadersType<ContestSummaryListResponseDTO> => ({
  head: 'contest name',
  index: 'name',
  Field: ({ record: { name, key, user }, isCard }) => (
    <Field className="jk-row left block">
      {user.isGuest || user.isAdmin || user.isContestant || user.isJudge || user.isSpectator ? (
        <Link href={ROUTES.CONTESTS.VIEW(key, ContestTab.OVERVIEW)}>
          <div className={classNames('gap nowrap link fw-bd space-between', { 'jk-col': isCard, 'jk-row': !isCard })}>
            <div style={{ textAlign: isCard ? undefined : 'left' }}>{name}</div>
            {user.isAdmin ? (
              <Popover
                content={<T className="tt-se ws-np">you are admin</T>}
                placement="top"
                showPopperArrow
              >
                <div className="jk-tag tx-s fw-bd letter-tag">A</div>
              </Popover>
            ) : user.isJudge ? (
              <Popover
                content={<T className="tt-se ws-np">you are judge</T>}
                placement="top"
                showPopperArrow
              >
                <div className="jk-tag tx-s fw-bd letter-tag">J</div>
              </Popover>
            ) : user.isContestant ? (
              <Popover
                content={<T className="tt-se ws-np">registered</T>}
                placement="top"
                showPopperArrow
              >
                <div><CheckIcon filledCircle className="cr-ss" /></div>
              </Popover>
            ) : user.isGuest ? (
              <Popover
                content={<T className="tt-se ws-np">you are guest</T>}
                placement="top"
                showPopperArrow
              >
                <div className="jk-tag tx-s fw-bd letter-tag">G</div>
              </Popover>
            ) : user.isSpectator && (
              <Popover
                content={<T className="tt-se ws-np">you are spectator</T>}
                placement="top"
                showPopperArrow
              >
                <div className="jk-tag tx-s fw-bd letter-tag">S</div>
              </Popover>
            )}
          </div>
        </Link>
      ) : (
        <div className={classNames('jk-row gap fw-bd', { center: isCard, left: !isCard })}>
          {name}
        </div>
      )}
    </Field>
  ),
  sort: auto ? { compareFn: () => (rowA, rowB) => rowB.name.localeCompare(rowA.name) } : true,
  filter: { type: auto ? 'text-auto' : 'text' } as JkTableHeaderFilterType<ContestSummaryListResponseDTO>,
  cardPosition: 'center',
  minWidth: 320,
});

export const contestStartDateColumn = (): DataViewerHeadersType<ContestSummaryListResponseDTO> => ({
  head: 'start date',
  index: 'startDate',
  Field: ({ record: { settings, isEndless }, isCard }) => (
    <Field className="jk-col extend">
      {isEndless ? (
          isCard ? '' : '-'
        ) :
        isCard ? (
          <div className="jk-row block extend nowrap space-between">
            <div className="jk-row gap nowrap">
              <EventIcon size="small" />
              <div className="jk-col">
                <div className="jk-row nowrap">{new Date(settings.startTimestamp).toLocaleDateString()}</div>
                <T className="cr-g4 tx-s tt-se ws-np">start date</T>
              </div>
            </div>
            <div className="jk-row gap nowrap">
              <ScheduleIcon size="small" />
              <div className="jk-col">
                <div className="jk-row ws-np">{new Date(settings.startTimestamp).toLocaleTimeString()}</div>
                <T className="cr-g4 tx-s tt-se">hour</T>
              </div>
            </div>
          </div>
        ) : (
          <DateLiteral date={new Date(settings.startTimestamp)} show="year-month-day-hours-minutes" twoLines />
        )}
    </Field>
  ),
  sort: true,
  filter: { type: 'date-range', pickerType: 'year-month-day-hours-minutes' },
  cardPosition: 'center',
  minWidth: 170,
});

export const contestEndDateColumn = (): DataViewerHeadersType<ContestSummaryListResponseDTO> => ({
  head: 'end date',
  index: 'endDate',
  Field: ({ record: { settings, isEndless }, isCard }) => (
    <Field className="jk-col extend">
      {isEndless ? (
          isCard ? '' : '-'
        ) :
        isCard ? (
          <div className="jk-row block extend nowrap space-between">
            <div className="jk-row gap nowrap">
              <EventIcon size="small" />
              <div className="jk-col">
                <div>{new Date(settings.endTimestamp).toLocaleDateString()}</div>
                <T className="cr-g4 tx-s tt-se">end date</T>
              </div>
            </div>
            <div className="jk-row gap nowrap">
              <ScheduleIcon size="small" />
              <div className="jk-col">
                <div>{new Date(settings.endTimestamp).toLocaleTimeString()}</div>
                <T className="cr-g4 tx-s tt-se">hour</T>
              </div>
            </div>
          </div>
        ) : (
          <DateLiteral date={new Date(settings.endTimestamp)} show="year-month-day-hours-minutes" twoLines />
        )}
    </Field>
  ),
  sort: true,
  filter: { type: 'date-range', pickerType: 'year-month-day-hours-minutes' },
  cardPosition: 'center',
  minWidth: 170,
});

export const contestantsColumn = (): DataViewerHeadersType<ContestSummaryListResponseDTO> => ({
  head: 'contestants',
  index: 'totalContestants',
  Field: ({ record: { totalContestants }, isCard }) => (
    <Field className="jk-row">
      {isCard ? (
        <div className="jk-row gap nowrap center">
          <GroupIcon size="small" />
          <div className="jk-col stretch">
            <div className="jk-row">{totalContestants}</div>
            <T className="cr-g4 tx-s tt-se ws-np">contestants</T>
          </div>
        </div>
      ) : (
        totalContestants
      )}
    </Field>
  ),
  sort: true,
  cardPosition: 'bottom',
});

export const getContestTimeLiteral = (contest: ContestResponseDTO) => {
  let timeInterval = 0;
  if (contest.isEndless) {
    timeInterval = -1;
  } else if (contest.isPast) {
    timeInterval = new Date().getTime() - contest.settings.endTimestamp;
  } else if (contest.isFuture) {
    timeInterval = contest.settings.startTimestamp - new Date().getTime();
  } else if (contest.isLive) {
    timeInterval = contest.settings.endTimestamp - new Date().getTime();
  }
  
  return contest.isEndless
    ? <T className="ws-np">endless</T>
    : (
      <>
        {contest.isLive
          ? <T className="ws-np">ends in</T>
          : contest.isPast
            ? <T className="ws-np">ends ago</T>
            : <T className="ws-np">stars in</T>}
        &nbsp;
        <div><Timer currentTimestamp={timeInterval} laps={2} interval={-1000} literal /></div>
      </>
    );
};
