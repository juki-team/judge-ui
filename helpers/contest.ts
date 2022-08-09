export const getContestStatus = (startTimestamp: number, endTimestamp: number) => {
  const currentDateMilliseconds = new Date().getTime();
  let contestStatus = 'upcoming';
  
  if (startTimestamp < currentDateMilliseconds && currentDateMilliseconds < endTimestamp) {
    contestStatus = 'live';
  } else if (currentDateMilliseconds > startTimestamp) {
    contestStatus = 'past';
  }
  return contestStatus;
};
