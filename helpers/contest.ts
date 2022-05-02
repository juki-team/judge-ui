export const getContestStatus = (startDate: Date, duration: number) => {
  const currentDateMilliseconds = new Date().getTime();
  const startContestDateMilliseconds = startDate.getTime();
  const endContestDateMilliseconds = startContestDateMilliseconds + duration;
  let contestStatus = 'upcoming';
  
  if (startContestDateMilliseconds < currentDateMilliseconds && currentDateMilliseconds < endContestDateMilliseconds) {
    contestStatus = 'live';
  } else if (currentDateMilliseconds > startContestDateMilliseconds) {
    contestStatus = 'past';
  }
  return contestStatus;
};

export const getDataContest = (contest: any) => {
  const timestamp = Date.now();
  const isFrozenTime = timestamp > contest?.timing?.frozen + contest?.settings?.start;
  const isQuietTime = timestamp > contest?.timing?.unJudged + contest?.settings?.start;
  const isScoreboardLocked = !!contest?.settings?.scoreboardLocked; // To hide or reveal the frozen and quit scoreboard
  const isRegistrationOpen = !!contest?.settings?.openRegistration; //
  const isPrivate = !!contest?.settings?.private; // Only guests, spectators, contestants, admins and judges can view the data of contest
  const isLive = contest?.settings?.start <= Date.now() && Date.now() <= contest?.settings?.start + contest?.timing.duration;
  const isPast = Date.now() > contest?.settings?.start + contest?.timing?.duration;
  const isFuture = contest?.settings?.start > Date.now();
  // UI
  const statusLabel = isLive ? 'live' : isPast ? 'past' : 'upcoming';
  const isAdmin = !!contest?.canUpdate;
  const isContestant = !!contest?.registered;
  const isJudge = !!contest?.canRejudge;
  const isGuest = isPrivate ? !!contest.canRegister : true;
  const isSpectator = !!contest?.canViewScoreBoard;
  return {
    isFrozenTime,
    isQuietTime,
    isScoreboardLocked,
    isLive,
    isPast,
    isFuture,
    isPrivate,
    isRegistrationOpen,
    statusLabel,
    isAdmin,
    isContestant,
    isJudge,
    isGuest,
    isSpectator,
  };
};
