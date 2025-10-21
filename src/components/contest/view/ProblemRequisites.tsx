'use client';

import { CheckIcon, CloseIcon, T, Timer } from 'components';
import { classNames } from 'helpers';
import { type KeyedMutator } from 'swr';
import {
  ContestDataResponseDTO,
  ContestProblemBlockedByType,
  ContestProblemDataResponseDTO,
  ContestProblemPrerequisiteType,
} from 'types';

interface ProblemRequisitesProps {
  problem: ContestProblemDataResponseDTO,
  reloadContest: KeyedMutator<any>,
  contest: ContestDataResponseDTO,
}

export const ProblemRequisites = ({ problem, reloadContest, contest }: ProblemRequisitesProps) => {
  
  const { prerequisites, blockedBy, startTimestamp, endTimestamp } = problem;
  
  const { user: { isAdministrator, isManager } } = contest;
  
  const hasUnmetPrerequisites = blockedBy?.some(block => block.type === ContestProblemBlockedByType.UNMET_PREREQUISITES);
  return (
    <div className="jk-col gap">
      {(isAdministrator || isManager) && (
        <div className="jk-col tx-t">
          {problem.startTimestamp !== contest.settings.startTimestamp && (
            <div className="jk-row center">
              <T className="tt-se">starts at the minute</T>:&nbsp;
              <Timer
                currentTimestamp={problem.startTimestamp - contest.settings.startTimestamp}
                interval={0}
                type="weeks-days-hours-minutes-seconds"
                ignoreLeadingZeros
                ignoreTrailingZeros
                literal
                abbreviated
              />
            </div>
          )}
          {problem.endTimestamp !== contest.settings.endTimestamp && (
            <div className="jk-row center">
              <T className="tt-se">ends at the minute</T>:&nbsp;
              <Timer
                currentTimestamp={problem.endTimestamp - contest.settings.startTimestamp}
                interval={0}
                type="weeks-days-hours-minutes-seconds"
                ignoreLeadingZeros
                ignoreTrailingZeros
                literal
                abbreviated
              />
            </div>
          )}
        </div>
      )}
      {prerequisites.length > 0 && (
        <div
          className={classNames('jk-row br-hl jk-br-ie jk-pg-xsm tx-t', {
            'bc-wl': hasUnmetPrerequisites,
            'bc-sl': !hasUnmetPrerequisites,
          })}
        >
          <T className="tt-se">prerequisites</T>:&nbsp;
          {prerequisites.map((prerequisite, index) => {
            const isUnmet = blockedBy?.some(block => block.type === ContestProblemBlockedByType.UNMET_PREREQUISITES && block.details?.problemIndex === prerequisite.problemIndex);
            return (
              <div
                key={index}
                data-tooltip-id="jk-tooltip"
                data-tooltip-content={isUnmet
                  ? (prerequisite.type === ContestProblemPrerequisiteType.INDIVIDUALLY ? 'you have to solve this problem to enable the problem' : 'someone has to solve this problem to enable the problem')
                  : 'prerequisite fulfilled'}
                className={'fw-br problem-index bc-g6 jk-br-ie pn-re' + (isUnmet ? ' wrong' : ' accepted')}
              >
                {isUnmet ? <CloseIcon size="tiny" /> : <CheckIcon size="tiny" />}
                {prerequisite.problemIndex}
              </div>
            );
          })}
        </div>
      )}
      {blockedBy.filter(b => b.type !== ContestProblemBlockedByType.UNMET_PREREQUISITES).map((block, index) => (
        <div key={index}>
          {block.type === ContestProblemBlockedByType.START_TIME_IN_THE_FUTURE && (
            <div className="jk-row br-hl jk-br-ie jk-pg-xsm tx-t bc-wl">
              <T className="tt-se">problem will be released in</T>&nbsp;
              <Timer
                currentTimestamp={startTimestamp - Date.now()}
                interval={-100}
                ignoreLeadingZeros
                ignoreTrailingZeros
                type="weeks-days-hours-minutes-seconds-milliseconds"
                literal
                abbreviated
                onTimeout={reloadContest}
              />
            </div>
          )}
          {block.type === ContestProblemBlockedByType.END_TIME_IN_THE_PAST && (
            <div className="jk-row br-hl jk-br-ie jk-pg-xsm tx-t bc-wl">
              <T className="tt-se">problem was closed ago</T>&nbsp;
              <Timer
                currentTimestamp={Date.now() - endTimestamp}
                interval={1000}
                ignoreLeadingZeros
                ignoreTrailingZeros
                type="weeks-days-hours-minutes"
                literal
                abbreviated
                onTimeout={reloadContest}
              />
            </div>
          )}
          {block.type === ContestProblemBlockedByType.MAX_ACCEPTED_SUBMISSIONS_ACHIEVED && (
            <div
              className={classNames('jk-row br-hl jk-br-ie jk-pg-xsm tx-t', {
                'bc-sl': problem.myIndexAccepted !== -1 && problem.myIndexAccepted < problem.maxAcceptedUsers,
                'bc-wl': !(problem.myIndexAccepted !== -1 && problem.myIndexAccepted < problem.maxAcceptedUsers),
              })}
            >
              <T className="tt-se">max accepted submissions achieved</T>:&nbsp;
              {block.details?.totalSuccess} / {block.details?.maxAcceptedUsers}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
