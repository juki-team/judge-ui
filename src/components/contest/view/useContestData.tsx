'use client';

import { jukiApiManager } from 'config';
import { EMPTY_ENTITY_MEMBERS, JUKI_SERVICE_V2_URL } from 'config/constants';
import { consoleInfo, contentResponse } from 'helpers';
import { useFetcher, useJukiNotification, useMutate, useRef, useRouterStore } from 'hooks';
import { useCallback, useEffect, useMemo } from 'react';
import {
  ContentResponseType,
  ContestClarificationsResponseDTO,
  ContestDataResponseDTO,
  ContestEventsResponseDTO,
  ContestMembersResponseDTO,
} from 'types';
import { T } from '../../commons';
import { ContestDataUI } from './types';

export function useContestData(fallbackData: ContestDataResponseDTO, companyKey: string) {
  const { data: dataContest, isLoading: l1, isValidating: v1 } =
    useFetcher<ContentResponseType<ContestDataResponseDTO>>(
      jukiApiManager.API_V2.contest.getData({ params: { key: fallbackData.key as string, companyKey } }).url,
      { fallbackData: JSON.stringify(contentResponse('fallback data', fallbackData)) },
    );
  
  const { data: dataEvents, isLoading: l2, isValidating: v2 } =
    useFetcher<ContentResponseType<ContestEventsResponseDTO>>(
      jukiApiManager.API_V2.contest.getDataEvents({ params: { key: fallbackData.key, companyKey } }).url,
    );
  
  const { data: dataMembers, isLoading: l3, isValidating: v3 } =
    useFetcher<ContentResponseType<ContestMembersResponseDTO>>(
      jukiApiManager.API_V2.contest.getDataMembers({ params: { key: fallbackData.key, companyKey } }).url,
    );
  
  const { data: dataClarifications, isLoading: l4, isValidating: v4 } =
    useFetcher<ContentResponseType<ContestClarificationsResponseDTO>>(
      jukiApiManager.API_V2.contest.getDataClarifications({ params: { key: fallbackData.key, companyKey } }).url,
    );
  
  const contestResponse = dataContest?.success ? dataContest.content : fallbackData;
  
  const contest: ContestDataUI = useMemo(() => ({
    ...contestResponse,
    events: dataEvents?.success ? dataEvents.content.events : [],
    members: dataMembers?.success ? dataMembers.content.members : {
      ...EMPTY_ENTITY_MEMBERS(),
      administrators: {},
      managers: {},
      guests: {},
      spectators: {},
      participants: {},
    },
    clarifications: dataClarifications?.success ? dataClarifications.content.clarifications : [],
  }), [ contestResponse, dataEvents, dataMembers, dataClarifications ]);
  
  const mutate = useMutate();
  
  const reloadContest = useCallback(async () => {
    consoleInfo('reloading all contest');
    void mutate(new RegExp(`${JUKI_SERVICE_V2_URL}/contest`));
    void mutate(new RegExp(`${JUKI_SERVICE_V2_URL}/submission`));
  }, [ mutate ]);
  
  const reloadRoute = useRouterStore(store => store.reloadRoute);
  useEffect(() => {
    if (!dataContest?.success) {
      reloadRoute();
    }
  }, [ dataContest?.success, reloadRoute ]);
  
  const previousContestRef = useRef(contest);
  const { addWarningNotification } = useJukiNotification();
  
  useEffect(() => {
    for (const problem of Object.values(contest.problems)) {
      if (previousContestRef.current?.problems?.[problem.key]?.blockedBy?.length !== problem.blockedBy.length && problem.blockedBy.length === 0) {
        addWarningNotification(
          <div className="jk-col jk-pg tx-h fw-bd">
            <T className="tt-se fw-br">problem unlocked</T>
            <div className="jk-row">
              <div className="jk-pg-xsm jk-br-ie bc-ht">{problem.index}</div>
              &nbsp;{problem.name}
            </div>
          </div>,
        );
      }
    }
    previousContestRef.current = contest;
  }, [ addWarningNotification, contest ]);
  
  return {
    contest,
    isSuccess: dataContest?.success ?? false,
    reloadContest,
    isLoadingAny: l1 || l2 || l3 || l4,
    isValidatingAny: v1 || v2 || v3 || v4,
  };
}
