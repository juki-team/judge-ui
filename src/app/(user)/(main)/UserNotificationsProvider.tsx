'use client';

import { T } from 'components';
import { PROBLEM_VERDICT } from 'config/constants';
import { getUserKey, isUserNotificationSubmissionWebSocketResponseEventDTO } from 'helpers';
import { useJukiNotification, useSubscribe, useUserStore } from 'hooks';
import { ProblemVerdict, SubscribeUserNotificationWebsocketEventDTO, WebSocketSubscriptionEvent } from 'types';

export function UserNotificationProvider({}) {
  const userNickname = useUserStore(store => store.user.nickname);
  const userCompanyKey = useUserStore(store => store.user.company.key);
  const { addSuccessNotification, addErrorNotification } = useJukiNotification();
  const event: Omit<SubscribeUserNotificationWebsocketEventDTO, 'clientId'> = {
    event: WebSocketSubscriptionEvent.SUBSCRIBE_USER_NOTIFICATION,
    userKey: getUserKey(userNickname, userCompanyKey),
  };
  
  useSubscribe(
    event,
    (data) => {
      if (isUserNotificationSubmissionWebSocketResponseEventDTO(data)) {
        const contest = data.content.contest;
        const verdict = data.content.verdict;
        const problem = data.content.problem;
        
        const points = data?.content.points || 0;
        const header = contest ?
          <>
            <div className="tx-s jk-row"><T className="tt-se">problem</T>: ({contest.problemIndex}) {problem.name}</div>
            <div className="tx-t jk-row"><T className="tt-se">contest</T>: {contest.name}</div>
          </>
          : <div className="tx-s jk-row"><T className="tt-se">problem</T>: {problem.name}</div>;
        const verdictLabel = (
          <div className="jk-row gap">
            <span>({verdict})</span>
            <T className="tt-ce">{PROBLEM_VERDICT[verdict]?.label}</T>
          </div>
        );
        if (verdict === ProblemVerdict.AC) {
          addSuccessNotification(
            <div className="jk-col">
              {verdictLabel}
              {header}
            </div>,
            !contest?.isUpsolving && (contest?.isFrozen || contest?.isQuiet),
          );
        } else if (verdict === ProblemVerdict.PA) {
          addSuccessNotification(
            <div className="jk-col">
              <div>
                <T className="tt-ce">{PROBLEM_VERDICT[ProblemVerdict.PA].label}</T>
                &nbsp;
                ({points} <T>pts.</T>)
              </div>
              {header}
            </div>,
            !contest?.isUpsolving && (contest?.isFrozen || contest?.isQuiet),
          );
        } else if (Object.keys(PROBLEM_VERDICT).includes(verdict)) {
          addErrorNotification(
            <div className="jk-col">
              {verdictLabel}
              {header}
            </div>,
            !contest?.isUpsolving && (contest?.isFrozen || contest?.isQuiet),
          );
        } else {
          addErrorNotification(
            <div className="jk-col">
              {verdict}
              {header}
            </div>,
            !contest?.isUpsolving && (contest?.isFrozen || contest?.isQuiet),
          );
        }
      }
    },
  );
  
  return null;
}
