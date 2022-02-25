export const can = {
  // USERS
  createUser(account: AccountState): boolean {
    return account.permissions[ScopeData.USER]?.charAt(0) === '0';
  },
  updateStatusUser(account: AccountState): boolean {
    return account.permissions[ScopeData.USER]?.charAt(1) === '0';
  },
  archiveMyUser(account: AccountState): boolean {
    return (account.permissions[ScopeData.USER]?.charAt(1) === '0' ||
      account.permissions[ScopeData.USER]?.charAt(1) === '1');
  },
  updatePermissionsUser(account: AccountState): boolean {
    return account.permissions[ScopeData.USER]?.charAt(2) === '0';
  },
  updateMyUser(account: AccountState): boolean {
    return (account.permissions[ScopeData.USER]?.charAt(2) === '0' ||
      account.permissions[ScopeData.USER]?.charAt(2) === '1');
  },
  viewAllUsers(account: AccountState): boolean {
    return account.permissions[ScopeData.USER]?.charAt(3) === '0';
  },
  viewActiveUsers(account: AccountState): boolean {
    return (account.permissions[ScopeData.USER]?.charAt(3) === '0' ||
      account.permissions[ScopeData.USER]?.charAt(3) === '1');
  },
  viewPublicUsers(account: AccountState): boolean {
    return (account.permissions[ScopeData.USER]?.charAt(3) === '0' ||
      account.permissions[ScopeData.USER]?.charAt(3) === '1' ||
      account.permissions[ScopeData.USER]?.charAt(3) === '2');
  },
  // CONTESTS
  createContest(account: AccountState): boolean {
    return account.permissions[ScopeData.CONTEST]?.charAt(0) === '0';
  },
  changeStatusContest(account: AccountState, contest: ContestState): boolean {
    return (account.permissions[ScopeData.CONTEST]?.charAt(1) === '0') ||
      (account.permissions[ScopeData.CONTEST]?.charAt(1) === '1' && account.nickname === contest.ownerNickname);
  },
  // PROBLEMS
  createProblem(account: AccountState): boolean {
    return account.permissions[ScopeData.PROBLEM]?.charAt(0) === '0';
  },
  updateProblem(account: AccountState, problem: ProblemState): boolean {
    return (account.permissions[ScopeData.PROBLEM]?.charAt(2) === '0') ||
      (account.permissions[ScopeData.PROBLEM]?.charAt(2) === '1' && problem.status !== ProblemStatus.ARCHIVED && problem.ownerNickname === account.nickname);
  },
  viewStatusProblem(account: AccountState): boolean {
    return account.permissions[ScopeData.PROBLEM]?.charAt(0) !== '9' ||
      account.permissions[ScopeData.PROBLEM]?.charAt(1) !== '9' ||
      account.permissions[ScopeData.PROBLEM]?.charAt(2) !== '9' ||
      account.permissions[ScopeData.PROBLEM]?.charAt(3) === '0' ||
      account.permissions[ScopeData.PROBLEM]?.charAt(3) === '1' ||
      account.permissions[ScopeData.PROBLEM]?.charAt(3) === '2';
  },
};