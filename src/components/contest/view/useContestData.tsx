'use client';

import { jukiApiManager } from 'config';
import { EMPTY_ENTITY_MEMBERS, JUKI_SERVICE_V2_URL } from 'config/constants';
import { consoleInfo, contentResponse } from 'helpers';
import { useFetcher, useJukiNotification, useMatchMutate, useRef, useRouterStore } from 'hooks';
import { useCallback, useEffect, useMemo } from 'react';
import {
  ContentResponseType,
  ContestClarificationsResponseDto,
  ContestDataResponseDto,
  ContestEventsResponseDto,
  ContestMembersResponseDto,
} from 'types';
import { T } from '../../commons';
import { ContestDataUI } from './types';

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function useContestData(fallbackData: ContestDataResponseDto, organizationKey: string) {
  const { data: dataContest, isLoading: l1, isValidating: v1 } =
    useFetcher<ContentResponseType<ContestDataResponseDto>>(
      jukiApiManager.API_V2.contest.getData({ params: { key: fallbackData.key as string, organizationKey } }).url,
      { fallbackData: JSON.stringify(contentResponse('fallback data', fallbackData)) },
    );
  
  const { data: dataEvents, isLoading: l2, isValidating: v2 } =
    useFetcher<ContentResponseType<ContestEventsResponseDto>>(
      jukiApiManager.API_V2.contest.getDataEvents({ params: { key: fallbackData.key, organizationKey } }).url,
    );
  
  const { data: dataMembers, isLoading: l3, isValidating: v3 } =
    useFetcher<ContentResponseType<ContestMembersResponseDto>>(
      jukiApiManager.API_V2.contest.getDataMembers({ params: { key: fallbackData.key, organizationKey } }).url,
    );
  
  const { data: dataClarifications, isLoading: l4, isValidating: v4 } =
    useFetcher<ContentResponseType<ContestClarificationsResponseDto>>(
      jukiApiManager.API_V2.contest.getDataClarifications({ params: { key: fallbackData.key, organizationKey } }).url,
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
  
  const mutate = useMatchMutate();
  
  // Everything of THIS contest (data, events, members, clarifications, scoreboard, problems...) and its submissions
  // lists; it used to revalidate every cached contest and submission request (other contests, problem pages...).
  const contestKey = fallbackData.key;
  const reloadContest = useCallback(async () => {
    consoleInfo('reloading all contest', contestKey);
    const base = escapeRegExp(JUKI_SERVICE_V2_URL);
    const key = escapeRegExp(contestKey);
    const encodedKey = escapeRegExp(encodeURIComponent(contestKey));
    void mutate(new RegExp(`${base}/contest/(${key}|${encodedKey})([/?"]|$)`));
    void mutate(new RegExp(`${base}/submission/[^"]*[?&]contestKeys=${encodedKey}(&|"|$)`));
  }, [ contestKey, mutate ]);
  
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
