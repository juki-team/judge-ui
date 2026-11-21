// the response of GET /contest/:key/statistics (juki-service src/app-private-api/contest/statistics.ts)

type VerdictCount = { [verdict: string]: number };

export type ContestStatisticsResponseDto = {
  // the submissions of a locked scoreboard after the freeze are not counted for whom cannot see them
  limitedToTimestamp: number | null,
  bucketMinutes: number,
  summary: {
    submissions: number,
    accepted: number,
    pending: number,
    participants: number,
    usersWithSubmissions: number,
    usersWithAccepted: number,
    judgeTime: { average: number, p50: number, p90: number, max: number, count: number },
  },
  verdicts: VerdictCount,
  languages: { language: string, submissions: number, accepted: number }[],
  problems: {
    key: string,
    index: string,
    name: string,
    submissions: number,
    accepted: number,
    usersTried: number,
    usersSolved: number,
    firstAccepted: { nickname: string, timestamp: number } | null,
    verdicts: VerdictCount,
    averageJudgeTime: number,
  }[],
  timeline: { timestamp: number, submissions: number, accepted: number, rejected: number, pending: number, averageJudgeTime: number }[],
  solvedDistribution: { solved: number, users: number }[],
  topUsers: { nickname: string, submissions: number, solved: number }[],
};
