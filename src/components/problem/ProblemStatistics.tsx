'use client';

import { BarChart, Button, LineChart, T } from 'components';
import { JUDGE_API_V1, MONTH_NAMES } from 'config/constants';
import { classNames, showOfDateDisplayType } from 'helpers';
import { useFetcher, useI18nStore, usePageStore, useState } from 'hooks';
import { i18n } from 'i18next';
import type { ContentType } from 'recharts/types/component/Tooltip';
import {
  ContentResponseType,
  DateLiteralProps,
  GroupByTimestampKey,
  ProblemDataResponseDTO,
  StatisticsProblemResponseDTO,
} from 'types';

const now = Date.now();

const capitalized = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const CustomTooltip: ContentType<number, number> = ({ active, payload, label }) => {
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

const CustomTooltipA: ContentType<number, number> = ({ active, payload, label }) => {
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

const customizedAxisTick = (angle: number) => function Cmp({ x, y, payload }: { x: number, y: number, payload: any }) {
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

const getDateLiteral = (date: Date, show: Required<DateLiteralProps>['show'], t: i18n['t']) => {
  
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
      ', ' + date.getHours().padStart(2) +
      (showMinutes ? ':' + date.getMinutes().padStart(2) : '') +
      (showSeconds ? ':' + date.getSeconds().padStart(2) : '') +
      (showMilliseconds ? '.' + date.getMilliseconds().padStart(3) : '')
    ) : '')
  );
};

const groupBy: GroupByTimestampKey[] = [ 'day', 'month', 'year' ];

export const ProblemStatistics = ({ problem }: { problem: ProblemDataResponseDTO }) => {
  
  const {
    data,
  } = useFetcher<ContentResponseType<StatisticsProblemResponseDTO>>(JUDGE_API_V1.PROBLEM.STATISTICS(problem.key, 0, now, groupBy));
  const t = useI18nStore(store => store.i18n.t);
  const { screen: viewPortScreen, height: viewPortHeight } = usePageStore(store => store.viewPort);
  const [ dateType, setDateType ] = useState<GroupByTimestampKey>('day');
  const languagesStats = data?.success ? data.content.language : {};
  const verdictsStats = data?.success ? data.content.verdict : {};
  const verdictsDate = data?.success ? data.content.date : {} as StatisticsProblemResponseDTO['date'];
  const languagesData = [];
  const verdictsData = [];
  const dateData = [];
  
  const oneColumn = viewPortHeight < 900 || viewPortScreen === 'sm';
  
  const sum = Object.values(languagesStats).reduce((sum, language) => sum + language.value, 0);
  for (const { label, value } of Object.values(languagesStats)) {
    languagesData.push({ label: capitalized(label), value, percent: value * 100 / sum });
  }
  for (const { label, value } of Object.values(verdictsStats)) {
    verdictsData.push({ label: capitalized(t(label)), value, percent: value * 100 / sum });
  }
  let accum = 0;
  const showDate: { [key: string]: DateLiteralProps['show'] } = {
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
              type={dateType === value ? 'primary' : 'light'}
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
