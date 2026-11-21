'use client';

import { ONE_MINUTE } from '@juki-team/commons';
import { InputToggle, MultiSelect, Select, SpinIcon, T } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { classNames } from 'helpers';
import { useFetcher, useMemo, useState } from 'hooks';
import dynamic from 'next/dynamic';
import { CODE_LANGUAGE } from 'src/constants';
import { CodeLanguage, ContentResponseType } from 'types';
import type { ContestDataUI } from '../types';
import { useLastSuccessfulResponse } from '../useContestData';
import type { ContestStatisticsResponseDto } from './types';

const StatisticsCharts = dynamic(() => import('./StatisticsCharts'), {
  ssr: false,
  loading: () => <div className="jk-row pn-re" style={{ height: 340 }}><SpinIcon /></div>,
});

type TimeRange = 'all' | 'before-freeze' | 'freeze' | 'first-hour' | 'last-hour' | 'last-day' | 'last-week' | 'last-month';

const formatDuration = (ms: number) => {
  if (!ms) {
    return '-';
  }
  return ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(ms < 10000 ? 2 : 1)} s`;
};

const percent = (value: number, total: number) => total ? `${Math.round((value * 100) / total)}%` : '-';

const KpiCard = ({ label, value, detail }: { label: string, value: string | number, detail?: string }) => (
  <div className="jk-col gap-xsm bc-we jk-br-ie jk-pg-sm flex-1" style={{ minWidth: 150 }}>
    <T className="tt-se tx-s cr-g3">{label}</T>
    <div className="fw-bd tx-xl">{value}</div>
    {detail && <div className="tx-s cr-g3">{detail}</div>}
  </div>
);

export const ViewStatistics = ({ contest }: { contest: ContestDataUI }) => {

  const [ problemKeys, setProblemKeys ] = useState<string[]>([]);
  const [ languages, setLanguages ] = useState<CodeLanguage[]>([]);
  const [ timeRange, setTimeRange ] = useState<TimeRange>('all');
  const [ participantsOnly, setParticipantsOnly ] = useState(true);

  const isJudge = contest.user.isAdministrator || contest.user.isManager;
  const hasTimeRange = !contest.isGlobal && !contest.isEndless;
  const { startsAt, frozenAt, endsAt } = contest.settings;
  const hasFreeze = hasTimeRange && frozenAt < endsAt;

  const timeRanges = useMemo(() => {
    const ranges: { value: TimeRange, label: string }[] = [ { value: 'all', label: 'all the time' } ];
    if (hasTimeRange) {
      ranges.push({ value: 'first-hour', label: 'first hour' }, { value: 'last-hour', label: 'last hour' });
      if (hasFreeze) {
        ranges.push({ value: 'before-freeze', label: 'before the freeze' }, { value: 'freeze', label: 'frozen period' });
      }
    } else {
      ranges.push(
        { value: 'last-day', label: 'last day' },
        { value: 'last-week', label: 'last week' },
        { value: 'last-month', label: 'last month' },
      );
    }
    return ranges;
  }, [ hasTimeRange, hasFreeze ]);

  const { from, to } = useMemo(() => {
    const end = Math.min(endsAt, Date.now());
    switch (timeRange) {
      case 'first-hour':
        return { from: startsAt, to: startsAt + ONE_MINUTE * 60 };
      case 'last-hour':
        return { from: end - ONE_MINUTE * 60, to: 0 };
      case 'before-freeze':
        return { from: 0, to: frozenAt };
      case 'freeze':
        return { from: frozenAt, to: 0 };
      case 'last-day':
        return { from: Date.now() - ONE_MINUTE * 60 * 24, to: 0 };
      case 'last-week':
        return { from: Date.now() - ONE_MINUTE * 60 * 24 * 7, to: 0 };
      case 'last-month':
        return { from: Date.now() - ONE_MINUTE * 60 * 24 * 30, to: 0 };
      default:
        return { from: 0, to: 0 };
    }
    // the moving ranges ("last hour") are taken when the filter is chosen, not on every render
  }, [ timeRange, startsAt, frozenAt, endsAt ]);

  const { data: fetchedData, isLoading } = useFetcher<ContentResponseType<ContestStatisticsResponseDto>>(
    JUDGE_API_V1.CONTEST.STATISTICS(contest.key, {
      problemKeys,
      languages,
      from,
      to,
      participantsOnly: isJudge ? participantsOnly : true,
    }),
  );
  const data = useLastSuccessfulResponse(fetchedData);
  const statistics = data?.success ? data.content : null;

  const problems = useMemo(
    () => Object.values(contest.problems).sort((a, b) => a.index.localeCompare(b.index)),
    [ contest.problems ],
  );

  return (
    <div className="jk-col gap stretch top jk-pg-sm">
      <div className="jk-row gap left bc-we jk-br-ie jk-pg-sm">
        <T className="tt-se tx-s cr-g3">an empty filter includes all</T>
        <div className="jk-row gap nowrap">
          <T className="tt-se fw-bd">problems</T>:
          <MultiSelect
            options={problems.map(problem => ({ value: problem.key, label: `${problem.index} - ${problem.name}` }))}
            selectedOptions={problemKeys.map(key => ({ value: key }))}
            onChange={options => setProblemKeys(options.map(option => option.value))}
          />
        </div>
        <div className="jk-row gap nowrap">
          <T className="tt-se fw-bd">languages</T>:
          <MultiSelect
            options={contest.settings.languages.map(language => ({
              value: language,
              label: CODE_LANGUAGE[language]?.label ?? language,
            }))}
            selectedOptions={languages.map(language => ({ value: language }))}
            onChange={options => setLanguages(options.map(option => option.value))}
          />
        </div>
        <div className="jk-row gap nowrap">
          <T className="tt-se fw-bd">time</T>:
          <Select
            options={timeRanges.map(({ value, label }) => ({ value, label: <T className="tt-se">{label}</T> }))}
            selectedOption={{ value: timeRange }}
            onChange={({ value }) => setTimeRange(value)}
          />
        </div>
        {isJudge && !contest.isGlobal && (
          <InputToggle
            size="small"
            checked={!participantsOnly}
            onChange={value => setParticipantsOnly(!value)}
            leftLabel={<T className={classNames('tt-se', { 'fw-bd': participantsOnly })}>only participants</T>}
            rightLabel={<T className={classNames('tt-se', { 'fw-bd': !participantsOnly })}>include judges</T>}
          />
        )}
      </div>
      {statistics?.limitedToTimestamp && (
        <div className="jk-row left gap bc-wl jk-br-ie jk-pg-sm">
          <T className="tt-se">
            the scoreboard is locked: only the submissions before the freeze are counted until it is unlocked
          </T>
        </div>
      )}
      {!statistics && (isLoading ? <div className="jk-row pn-re" style={{ height: 200 }}><SpinIcon /></div> : (
        <div className="jk-row bc-we jk-br-ie jk-pg-sm"><T className="tt-se">no statistics available</T></div>
      ))}
      {statistics && (
        <>
          <div className="jk-row gap stretch">
            <KpiCard
              label="submissions"
              value={statistics.summary.submissions}
              detail={statistics.summary.pending ? `${statistics.summary.pending} pending` : undefined}
            />
            <KpiCard
              label="accepted"
              value={statistics.summary.accepted}
              detail={percent(statistics.summary.accepted, statistics.summary.submissions)}
            />
            <KpiCard
              label="users with submissions"
              value={statistics.summary.usersWithSubmissions}
              detail={statistics.summary.participants ? `/ ${statistics.summary.participants}` : undefined}
            />
            <KpiCard
              label="users with accepted"
              value={statistics.summary.usersWithAccepted}
              detail={percent(statistics.summary.usersWithAccepted, statistics.summary.usersWithSubmissions)}
            />
            <KpiCard
              label="average judge time"
              value={formatDuration(statistics.summary.judgeTime.average)}
              detail={`p50 ${formatDuration(statistics.summary.judgeTime.p50)} · p90 ${formatDuration(statistics.summary.judgeTime.p90)} · max ${formatDuration(statistics.summary.judgeTime.max)}`}
            />
          </div>
          <StatisticsCharts statistics={statistics} />
          <div className="jk-col gap stretch bc-we jk-br-ie jk-pg-sm">
            <T className="tt-se fw-bd">problems</T>
            <div style={{ overflowX: 'auto' }}>
              <table className="wh-100" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr className="tx-s">
                    <th><T className="tt-se">problem</T></th>
                    <th><T className="tt-se">submissions</T></th>
                    <th><T className="tt-se">accepted</T></th>
                    <th><T className="tt-se">users tried</T></th>
                    <th><T className="tt-se">users solved</T></th>
                    <th><T className="tt-se">first accepted</T></th>
                    <th><T className="tt-se">average judge time</T></th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.problems.map(problem => (
                    <tr key={problem.key} className="tx-s" style={{ textAlign: 'center', borderTop: '1px solid var(--cr-g6, #ddd)' }}>
                      <td style={{ textAlign: 'left', padding: 4 }}><span className="fw-bd">{problem.index}</span> {problem.name}</td>
                      <td>{problem.submissions}</td>
                      <td>{problem.accepted} ({percent(problem.accepted, problem.submissions)})</td>
                      <td>{problem.usersTried}</td>
                      <td>{problem.usersSolved}</td>
                      <td>
                        {problem.firstAccepted
                          ? `${problem.firstAccepted.nickname} · ${hasTimeRange
                            ? `${Math.floor((problem.firstAccepted.timestamp - startsAt) / ONE_MINUTE)} min`
                            : new Date(problem.firstAccepted.timestamp).toLocaleDateString()}`
                          : '-'}
                      </td>
                      <td>{formatDuration(problem.averageJudgeTime)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="jk-col gap stretch bc-we jk-br-ie jk-pg-sm">
            <T className="tt-se fw-bd">most active users</T>
            <div style={{ overflowX: 'auto' }}>
              <table className="wh-100" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr className="tx-s">
                    <th>#</th>
                    <th><T className="tt-se">nickname</T></th>
                    <th><T className="tt-se">solved</T></th>
                    <th><T className="tt-se">submissions</T></th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.topUsers.map((user, index) => (
                    <tr key={user.nickname + index} className="tx-s" style={{ textAlign: 'center', borderTop: '1px solid var(--cr-g6, #ddd)' }}>
                      <td>{index + 1}</td>
                      <td className="fw-bd">{user.nickname}</td>
                      <td>{user.solved}</td>
                      <td>{user.submissions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
