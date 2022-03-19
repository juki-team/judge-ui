import { UserState } from '../store';
import { ScopeData } from '../types';

export const can = {
  // USERS
  viewUsersTab(account: UserState): boolean {
    return this.createUser(account) || this.viewAllUsers(account) || this.updateStatusUser(account) || this.updatePermissionsUser(account);
  },
  createUser(account: UserState): boolean {
    return account.myPermissions[ScopeData.USER]?.charAt(0) === '0';
  },
  updateStatusUser(account: UserState): boolean {
    return account.myPermissions[ScopeData.USER]?.charAt(1) === '0';
  },
  archiveMyUser(account: UserState): boolean {
    return (account.myPermissions[ScopeData.USER]?.charAt(1) === '0' ||
      account.myPermissions[ScopeData.USER]?.charAt(1) === '1');
  },
  updatePermissionsUser(account: UserState): boolean {
    return account.myPermissions[ScopeData.USER]?.charAt(2) === '0';
  },
  updateMyUser(account: UserState): boolean {
    return (account.myPermissions[ScopeData.USER]?.charAt(2) === '0' ||
      account.myPermissions[ScopeData.USER]?.charAt(2) === '1');
  },
  viewAllUsers(account: UserState): boolean {
    return account.myPermissions[ScopeData.USER]?.charAt(3) === '0';
  },
  viewActiveUsers(account: UserState): boolean {
    return (account.myPermissions[ScopeData.USER]?.charAt(3) === '0' ||
      account.myPermissions[ScopeData.USER]?.charAt(3) === '1');
  },
  viewPublicUsers(account: UserState): boolean {
    return (account.myPermissions[ScopeData.USER]?.charAt(3) === '0' ||
      account.myPermissions[ScopeData.USER]?.charAt(3) === '1' ||
      account.myPermissions[ScopeData.USER]?.charAt(3) === '2');
  },
  // CONTESTS
  createContest(account: UserState): boolean {
    return account.myPermissions[ScopeData.CONTEST]?.charAt(0) === '0';
  },
  // changeStatusContest(account: UserState, contest: ContestState): boolean {
  //   return (account.myPermissions[ScopeData.CONTEST]?.charAt(1) === '0') ||
  //     (account.myPermissions[ScopeData.CONTEST]?.charAt(1) === '1' && account.nickname === contest.ownerNickname);
  // },
  // PROBLEMS
  createProblem(account: UserState): boolean {
    return account.myPermissions[ScopeData.PROBLEM]?.charAt(0) === '0';
  },
  // updateProblem(account: UserState, problem: ProblemState): boolean {
  //   return (account.myPermissions[ScopeData.PROBLEM]?.charAt(2) === '0') ||
  //     (account.myPermissions[ScopeData.PROBLEM]?.charAt(2) === '1' && problem.status !== ProblemStatus.ARCHIVED && problem.ownerNickname === account.nickname);
  // },
  viewStatusProblem(account: UserState): boolean {
    return account.myPermissions[ScopeData.PROBLEM]?.charAt(0) !== '9' ||
      account.myPermissions[ScopeData.PROBLEM]?.charAt(1) !== '9' ||
      account.myPermissions[ScopeData.PROBLEM]?.charAt(2) !== '9' ||
      account.myPermissions[ScopeData.PROBLEM]?.charAt(3) === '0' ||
      account.myPermissions[ScopeData.PROBLEM]?.charAt(3) === '1' ||
      account.myPermissions[ScopeData.PROBLEM]?.charAt(3) === '2';
  },
};