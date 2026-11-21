'use client';

import { PROBLEM_VERDICT, ProblemVerdict } from '@juki-team/commons';
import { T } from 'components';
import { useI18nStore } from 'hooks';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ContestStatisticsResponseDto } from './types';

// recharts is heavy: this file is only loaded by the statistics tab (next/dynamic in ViewStatistics)

const AXIS_TICK = { fill: 'currentColor', fontSize: 12 };
const TOOLTIP_STYLE = { backgroundColor: 'var(--cr-we, #fff)', borderRadius: 4, fontSize: 12 };

// the verdicts in the order they are stacked, the accepted first
const STACKED_VERDICTS = [
  ProblemVerdict.AC,
  ProblemVerdict.PA,
  ProblemVerdict.WA,
  ProblemVerdict.TLE,
  ProblemVerdict.MLE,
  ProblemVerdict.RE,
  ProblemVerdict.PE,
  ProblemVerdict.CE,
  ProblemVerdict.PENDING,
];
// PA and PE share a green with AC in commons: distinct colors so the stacks can be told apart
const VERDICT_COLORS: { [key: string]: string } = {
  ...Object.fromEntries(Object.values(PROBLEM_VERDICT).map(({ value, color }) => [ value, color ])),
  [ProblemVerdict.WA]: '#F25C54',
  [ProblemVerdict.TLE]: '#F4A259',
  [ProblemVerdict.MLE]: '#B56576',
  [ProblemVerdict.RE]: '#9D4EDD',
  [ProblemVerdict.CE]: '#8D99AE',
  [ProblemVerdict.PE]: '#2EC4B6',
  [ProblemVerdict.PA]: '#90BE6D',
};

const ChartCard = ({ title, children, height = 300 }: { title: string, children: React.ReactElement, height?: number }) => (
  <div className="jk-col gap stretch bc-we jk-br-ie jk-pg-sm flex-1" style={{ minWidth: 320 }}>
    <T className="tt-se fw-bd">{title}</T>
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </div>
  </div>
);

const timeLabel = (timestamp: number, bucketMinutes: number) => {
  const date = new Date(timestamp);
  if (bucketMinutes >= 1440) {
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
  }
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function StatisticsCharts({ statistics }: { statistics: ContestStatisticsResponseDto }) {

  const t = useI18nStore(store => store.i18n.t);

  const timelineData = statistics.timeline.map(bucket => ({
    ...bucket,
    label: timeLabel(bucket.timestamp, statistics.bucketMinutes),
    averageJudgeTimeSeconds: +(bucket.averageJudgeTime / 1000).toFixed(2),
  }));

  const presentVerdicts = STACKED_VERDICTS.filter(verdict => statistics.problems.some(problem => problem.verdicts[verdict]));
  const problemsData = statistics.problems.map(problem => ({ label: problem.index, ...problem.verdicts }));

  const solvedData = statistics.solvedDistribution.map(({ solved, users }) => ({ label: `${solved}`, users }));

  const verdictsData = STACKED_VERDICTS
    .filter(verdict => statistics.verdicts[verdict])
    .map(verdict => ({ label: verdict, value: statistics.verdicts[verdict], fill: VERDICT_COLORS[verdict] }));

  const languagesData = statistics.languages.map(({ language, submissions, accepted }) => ({
    label: language,
    accepted,
    rejected: submissions - accepted,
  }));

  return (
    <div className="jk-col gap stretch">
      <ChartCard title={`${t('submissions over time')} (${statistics.bucketMinutes} min)`} height={340}>
        <ComposedChart data={timelineData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={AXIS_TICK} minTickGap={16} />
          <YAxis yAxisId="submissions" tick={AXIS_TICK} allowDecimals={false} />
          <YAxis yAxisId="judgeTime" orientation="right" tick={AXIS_TICK} unit="s" />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend />
          <Bar yAxisId="submissions" dataKey="accepted" name={t('accepted')} stackId="s" fill={VERDICT_COLORS[ProblemVerdict.AC]} />
          <Bar yAxisId="submissions" dataKey="rejected" name={t('rejected')} stackId="s" fill={VERDICT_COLORS[ProblemVerdict.WA]} />
          <Bar yAxisId="submissions" dataKey="pending" name={t('pending')} stackId="s" fill={VERDICT_COLORS[ProblemVerdict.PENDING]} />
          <Line
            yAxisId="judgeTime"
            dataKey="averageJudgeTimeSeconds"
            name={t('average judge time')}
            stroke="#3D5A80"
            dot={false}
            strokeWidth={2}
          />
        </ComposedChart>
      </ChartCard>
      <div className="jk-row gap stretch top">
        <ChartCard title={t('verdicts by problem')}>
          <BarChart data={problemsData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={AXIS_TICK} />
            <YAxis tick={AXIS_TICK} allowDecimals={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend />
            {presentVerdicts.map(verdict => (
              <Bar key={verdict} dataKey={verdict} stackId="v" fill={VERDICT_COLORS[verdict]} />
            ))}
          </BarChart>
        </ChartCard>
        <ChartCard title={t('users by solved problems')}>
          <BarChart data={solvedData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={AXIS_TICK} />
            <YAxis tick={AXIS_TICK} allowDecimals={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="users" name={t('users')} fill="#3D5A80" />
          </BarChart>
        </ChartCard>
      </div>
      <div className="jk-row gap stretch top">
        <ChartCard title={t('submissions by verdict')} height={260}>
          <BarChart data={verdictsData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={AXIS_TICK} />
            <YAxis tick={AXIS_TICK} allowDecimals={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="value" name={t('submissions')}>
              {verdictsData.map(entry => <Cell key={entry.label} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ChartCard>
        <ChartCard title={t('submissions by language')} height={260}>
          <BarChart data={languagesData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={AXIS_TICK} />
            <YAxis tick={AXIS_TICK} allowDecimals={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend />
            <Bar dataKey="accepted" name={t('accepted')} stackId="l" fill={VERDICT_COLORS[ProblemVerdict.AC]} />
            <Bar dataKey="rejected" name={t('rejected')} stackId="l" fill={VERDICT_COLORS[ProblemVerdict.WA]} />
          </BarChart>
        </ChartCard>
      </div>
    </div>
  );
}
