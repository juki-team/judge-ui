'use client';

import { BarChart, Button, LineChart, T, useFetcher, usePageStore, useT } from '@juki-team/base-ui';
import { classNames, showOfDateDisplayType } from '@juki-team/base-ui/helpers';
import { jukiApiManager } from '@juki-team/base-ui/settings';
import { MONTH_NAMES } from '@juki-team/commons/constants';
import {
  type GroupByTimestampKey,
  type ProblemDataResponseDTO,
  type StatisticsProblemResponseDTO,
} from '@juki-team/commons/dto';
import { type ContentResponse } from '@juki-team/commons/types';
import { useState } from 'hooks';
import type { ContentType } from 'recharts/types/component/Tooltip';

type DateDisplayType =
  'year'
  | 'year-month'
  | 'year-month-day'
  | 'year-month-day-hours'
  | 'year-month-day-hours-minutes'
  | 'year-month-day-hours-minutes-seconds'
  | 'year-month-day-hours-minutes-seconds-milliseconds'
  | 'hours'
  | 'hours-minutes'
  | 'hours-minutes-seconds'
  | 'hours-minutes-seconds-milliseconds';

const now = Date.now();

const capitalized = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const CustomTooltip: ContentType = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="jk-pg-xsm bc-we jk-br-ie elevation-1">
        <p className="fw-bd">{label}</p>
        <p><T className="tt-se">submissions</T>: {payload[0].value}</p>
        <p><T className="tt-se">percent</T>: {(payload[0].payload.percent as number)?.toFixed(2)} %</p>
      </div>
    );
  }

  return null;
};

const CustomTooltipA: ContentType = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="jk-pg-xsm bc-we jk-br-ie elevation-1">
        <p className="fw-bd">{label}</p>
        <p><T className="tt-se">submissions</T>: {payload[0].payload.value}</p>
        <p><T className="tt-se">accumulated</T>: {payload[0].payload.accum}</p>
      </div>
    );
  }

  return null;
};

const customizedAxisTick = (angle: number) => function Cmp({ x, y, payload }: {
  x: string | number,
  y: string | number,
  payload: any
}) {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform={`rotate(${angle})`}
        className="fw-bd cr-b2 tx-s"
      >
        {payload.value}
      </text>
    </g>
  );
};

const getDateLiteral = (date: Date, show: DateDisplayType, t: (key: string) => string) => {

  const {
    showYears,
    showMonths,
    showDays,
    showHours,
    showMinutes,
    showSeconds,
    showMilliseconds,
  } = showOfDateDisplayType(show);

  return (
    // withDayName && <><T>{DAY_NAMES[date.getDay()]}</T>,&nbsp;</>}
    (showDays ? date.getDate() : '') +
    (showMonths ? ' ' + t(MONTH_NAMES[date.getMonth()]) : '') +
    (showYears ? ' ' + date.getFullYear() : '') +
    (showHours ? (
      ', ' + String(date.getHours()).padStart(2, '0') +
      (showMinutes ? ':' + String(date.getMinutes()).padStart(2, '0') : '') +
      (showSeconds ? ':' + String(date.getSeconds()).padStart(2, '0') : '') +
      (showMilliseconds ? '.' + String(date.getMilliseconds()).padStart(3, '0') : '')
    ) : '')
  );
};

const groupBy: GroupByTimestampKey[] = [ 'day', 'month', 'year' ];

export const ProblemStatistics = ({ problem }: { problem: ProblemDataResponseDTO }) => {

  const { url } = jukiApiManager.apiV2.statistics.getProblemStats({
    params: {
      problemKey: problem.key,
      startsAt: 0,
      endsAt: now,
      groupBy,
    },
  });
  const {
    data,
  } = useFetcher<ContentResponse<StatisticsProblemResponseDTO>>(url);
  const t = useT();
  const { screen: viewPortScreen, height: viewPortHeight } = usePageStore(store => store.viewPort);
  const [ dateType, setDateType ] = useState<GroupByTimestampKey>('day');
  const languagesStats: StatisticsProblemResponseDTO['language'] = data?.success ? data.content.language : {};
  const verdictsStats: StatisticsProblemResponseDTO['verdict'] = data?.success ? data.content.verdict : {};
  const verdictsDate: StatisticsProblemResponseDTO['date'] = data?.success ? data.content.date : {};
  const languagesData = [];
  const verdictsData = [];
  const dateData = [];

  const oneColumn = viewPortHeight < 900 || viewPortScreen === 'sm';

  const sum = Object.values(languagesStats).reduce((sum, language) => sum + language.value, 0);
  console.log({ languagesStats, verdictsStats });
  for (const { label, value } of Object.values(languagesStats)) {
    languagesData.push({ label: capitalized(label), value, percent: value * 100 / sum });
  }
  for (const { label, value } of Object.values(verdictsStats)) {
    verdictsData.push({ label: capitalized(t(label)), value, percent: value * 100 / sum });
  }
  let accum = 0;
  const showDate: { [key: string]: DateDisplayType } = {
    day: 'year-month-day',
    month: 'year-month',
    year: 'year',
  };
  for (const [ timestamp, value ] of Object.entries(verdictsDate[dateType] ?? {})) {
    accum += value;
    dateData.push({
      label: getDateLiteral(new Date(+timestamp), showDate[dateType] ?? 'year-month-day', t),
      timestamp,
      value,
      accum,
    });
  }

  return (
    <div className="jk-col gap top ht-100 stretch nowrap">
      <div className="jk-col gap nowrap flex-1 bc-we jk-pg-sm" style={{ height: '80%' }}>
        <T className="tt-se fw-bd">submissions by date</T>
        <div className="jk-row gap">
          {[
            { value: 'day' as GroupByTimestampKey, label: 'day' },
            { value: 'month' as GroupByTimestampKey, label: 'month' },
            { value: 'year' as GroupByTimestampKey, label: 'year' },
          ].map(({ value, label }) => (
            <Button
              size="small"
              type={dateType === value ? 'primary' : 'secondary'}
              key={value}
              onClick={() => {
                setDateType(value);
              }}
            >
              <T className="tt-se">{label}</T>
            </Button>
          ))}
        </div>
        <LineChart
          data={dateData}
          margin={{ bottom: 128, right: 24, left: 0, top: 16 }}
          tooltipContent={CustomTooltipA}
          xAxisTick={customizedAxisTick(-75)}
        />
      </div>
      <div className={classNames('top gap ht-100 nowrap', { 'jk-row': !oneColumn, 'jk-col': oneColumn })}>
        <div
          className={classNames(
            'jk-col gap nowrap bc-we jk-pg-sm',
            { 'ht-100 flex-1': !oneColumn, 'wh-100': oneColumn },
          )}
        >
          <T className="tt-se fw-bd">submissions by language</T>
          <BarChart
            data={languagesData}
            margin={{ bottom: 150, right: 24, left: 0, top: 16 }}
            tooltipContent={CustomTooltip}
            xAxisTick={customizedAxisTick(-35)}
          />
        </div>
        <div
          className={classNames(
            'jk-col gap nowrap bc-we jk-pg-sm',
            { 'ht-100 flex-1': !oneColumn, 'wh-100': oneColumn },
          )}
        >
          <T className="tt-se fw-bd">submissions by verdict</T>
          <BarChart
            data={verdictsData}
            margin={{ bottom: 150, right: 24, left: 0, top: 16 }}
            tooltipContent={CustomTooltip}
            xAxisTick={customizedAxisTick(-35)}
          />
        </div>
      </div>
    </div>
  );
};
