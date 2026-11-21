'use client';

import { jukiApiManager } from 'config';
import { EMPTY_ENTITY_MEMBERS, JUKI_SERVICE_V2_URL } from 'config/constants';
import { consoleInfo, contentResponse } from 'helpers';
import { useFetcher, useJukiNotification, useMatchMutate, useRef, useRouterStore } from 'hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ContentResponseType,
  ContestClarificationsResponseDto,
  ContestDataResponseDto,
  ContestEventsResponseDto,
  ContestMembersResponseDto,
  ErrorCode,
} from 'types';
import { T } from '../../commons';
import { ContestDataUI } from './types';

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// the fetcher never throws: a request that got no valid response (network error, 5xx, API Gateway timeout) resolves to
// one of these codes
const TRANSIENT_ERROR_CODES: string[] = [ ErrorCode.ERR9997, ErrorCode.ERR9998, ErrorCode.ERR9999 ];

export const isTransientErrorResponse = (response: { success: boolean, errors?: { code: string }[] } | undefined) =>
  !!response && !response.success && !!response.errors?.some(({ code }) => TRANSIENT_ERROR_CODES.includes(code));

// The last successful response when a refetch got no valid response (network error, 5xx, timeout): a failure during a
// burst of verdicts must not empty the view (or bring back the server rendered contest, "not started" if it was loaded
// before the start). Any other response (a success, a real error such as no access) is returned as it is.
export const useLastSuccessfulResponse = <R extends { success: boolean, errors?: { code: string }[] }, >(response: R | undefined): R | undefined => {
  const [ lastSuccessful, setLastSuccessful ] = useState<R | undefined>(response?.success ? response : undefined);
  if (response?.success && response !== lastSuccessful) {
    setLastSuccessful(response);
  }
  if (lastSuccessful && isTransientErrorResponse(response)) {
    return lastSuccessful;
  }
  return response;
};

// on a contest change event every open tab reloads: a random delay spreads the requests of all the clients
const LIVE_RELOAD_MAX_DELAY_MS = 4000;

export function useContestData(fallbackData: ContestDataResponseDto, organizationKey: string) {
  const { data: fetchedDataContest, isLoading: l1, isValidating: v1 } =
    useFetcher<ContentResponseType<ContestDataResponseDto>>(
      jukiApiManager.API_V2.contest.getData({ params: { key: fallbackData.key as string, organizationKey } }).url,
      { fallbackData: JSON.stringify(contentResponse('fallback data', fallbackData)) },
    );
  
  const { data: fetchedDataEvents, isLoading: l2, isValidating: v2 } =
    useFetcher<ContentResponseType<ContestEventsResponseDto>>(
      jukiApiManager.API_V2.contest.getDataEvents({ params: { key: fallbackData.key, organizationKey } }).url,
    );

  const { data: fetchedDataMembers, isLoading: l3, isValidating: v3 } =
    useFetcher<ContentResponseType<ContestMembersResponseDto>>(
      jukiApiManager.API_V2.contest.getDataMembers({ params: { key: fallbackData.key, organizationKey } }).url,
    );

  const { data: fetchedDataClarifications, isLoading: l4, isValidating: v4 } =
    useFetcher<ContentResponseType<ContestClarificationsResponseDto>>(
      jukiApiManager.API_V2.contest.getDataClarifications({ params: { key: fallbackData.key, organizationKey } }).url,
    );

  const dataContest = useLastSuccessfulResponse(fetchedDataContest);
  const dataEvents = useLastSuccessfulResponse(fetchedDataEvents);
  const dataMembers = useLastSuccessfulResponse(fetchedDataMembers);
  const dataClarifications = useLastSuccessfulResponse(fetchedDataClarifications);

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

  // On a contest change event (each verdict, coalesced by the server): after a random delay, so the open tabs of every
  // participant do not reload at the same instant, and without the events and members, which a verdict does not change.
  // Events arriving while one is scheduled are merged into it.
  const liveReloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (liveReloadTimerRef.current) {
      clearTimeout(liveReloadTimerRef.current);
    }
  }, []);
  const reloadContestLive = useCallback(() => {
    if (liveReloadTimerRef.current) {
      return;
    }
    liveReloadTimerRef.current = setTimeout(() => {
      liveReloadTimerRef.current = null;
      consoleInfo('reloading live contest', contestKey);
      const base = escapeRegExp(JUKI_SERVICE_V2_URL);
      const key = escapeRegExp(contestKey);
      const encodedKey = escapeRegExp(encodeURIComponent(contestKey));
      void mutate(new RegExp(`${base}/contest/(${key}|${encodedKey})(?!/data/(events|members)([?"]|$))([/?"]|$)`));
      void mutate(new RegExp(`${base}/submission/[^"]*[?&]contestKeys=${encodedKey}(&|"|$)`));
    }, Math.random() * LIVE_RELOAD_MAX_DELAY_MS);
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
    reloadContestLive,
    isLoadingAny: l1 || l2 || l3 || l4,
    isValidatingAny: v1 || v2 || v3 || v4,
  };
}
