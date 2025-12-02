'use client';

import { ButtonLoader, FirstLoginWrapper, InfoIIcon, ProblemView, SpectatorInformation, T } from 'components';
import { jukiApiManager, jukiAppRoutes } from 'config';
import { authorizedRequest, cleanRequest, isGlobalContest } from 'helpers';
import { useJukiNotification, useRouterStore, useUIStore } from 'hooks';
import { type ReactNode } from 'react';
import { KeyedMutator } from 'swr';
import {
  CodeLanguage,
  ContentResponseType,
  ContestDataResponseDTO,
  ContestProblemBlockedByType,
  ContestProblemDataResponseDTO,
  ContestTab,
  EntityState,
  Status,
} from 'types';
import { ProblemRequisites } from './ProblemRequisites';

interface ViewProblemContestProps {
  problem: ContestProblemDataResponseDTO,
  contest: ContestDataResponseDTO,
  reloadContest: KeyedMutator<any>,
}

export const ViewProblemContest = ({ problem, contest, reloadContest }: ViewProblemContestProps) => {
  
  const { addWarningNotification, notifyResponse } = useJukiNotification();
  const pushRoute = useRouterStore(state => state.pushRoute);
  const { Link } = useUIStore(store => store.components);
  
  if (!contest.isPast && problem.blockedBy.filter(b => b.type !== ContestProblemBlockedByType.MAX_ACCEPTED_SUBMISSIONS_ACHIEVED).length > 0) {
    return (
      <div className="jk-pg jk-br-ie jk-row bc-we">
        <ProblemRequisites problem={problem} reloadContest={reloadContest} contest={contest} />
      </div>
    );
  }
  
  const isGlobal = isGlobalContest(contest.settings);
  const {
    user: { isAdministrator, isManager, isParticipant, isGuest, isSpectator },
  } = contest;
  
  return (
    <ProblemView
      key="problem-view"
      contest={{
        index: problem.index,
        color: problem.color,
      }}
      languages={problem.judge.isExternal
        ? []
        : contest.settings.languages.map((language) => ({ value: language, label: language as ReactNode }))
      }
      problem={{
        ...problem,
        user: {
          isOwner: false,
          isAdministrator: false,
          isManager: false,
          tried: false,
          isSpectator: false,
          solved: false,
        },
        state: EntityState.RELEASED,
      }}
      infoPlacement="name"
      withoutDownloadButtons
      codeEditorStoreKey={contest.key + '/' + problem.key}
      codeEditorCenterButtons={({ files, currentFileName }) => {
        const { source = '', language = CodeLanguage.TEXT } = files[currentFileName] || {};
        const validSubmit = (
          <ButtonLoader
            type="secondary"
            size="tiny"
            disabled={source === ''}
            onClick={async setLoaderStatus => {
              setLoaderStatus(Status.LOADING);
              let response;
              if (isGlobal) {
                const { url, ...options } = jukiApiManager.API_V2.problem.submit({
                  params: {
                    key: problem.key,
                  }, body: { language: language as string, source },
                });
                response = cleanRequest<ContentResponseType<any>>(
                  await authorizedRequest(url, options),
                );
              } else {
                const { url, ...options } = jukiApiManager.API_V2.contest.submit({
                  params: {
                    key: contest.key,
                    problemKey: problem.key,
                  }, body: { language: language as string, source },
                });
                response = cleanRequest<ContentResponseType<any>>(
                  await authorizedRequest(url, options),
                );
              }
              notifyResponse(response, setLoaderStatus);
              await reloadContest();
              // if (notifyResponse(response, setLoaderStatus)) {
              //   if (isGlobal) {
              //     listenSubmission({
              //       id: response.content.submitId,
              //       problem: { name: problem.name },
              //     }, true);
              //     pushRoute(jukiAppRoutes.JUDGE().problems.view({
              //       key: problem.key,
              //       tab: ProblemTab.MY_SUBMISSIONS,
              //     }));
              //   } else {
              //     listenSubmission({
              //       id: response.content.submitId,
              //       problem: { name: problem.name },
              //       contest: {
              //         name: contest.name,
              //         problemIndex: problem.index,
              //         isFrozenTime: contest.isFrozenTime,
              //         isQuietTime: contest.isQuietTime,
              //       },
              //     }, true);
              //     pushRoute(jukiAppRoutes.JUDGE().contests.view({
              //       key: contest.key,
              //       tab: ContestTab.SUBMISSIONS,
              //       subTab: problem.index,
              //     }));
              //     await mutate(new RegExp(`${JUKI_SERVICE_V2_URL}/submission`, 'g'));
              //   }
              // }
            }}
          >
            {(isAdministrator || isManager) && !isGlobal
              ? <T className="tt-se">submit as judge</T>
              : <T className="tt-se">submit</T>}
          </ButtonLoader>
        );
        if (isAdministrator || isManager || isParticipant) {
          return (
            <div className="jk-row gap">
              <FirstLoginWrapper>
                {validSubmit}
              </FirstLoginWrapper>
              <Link
                data-tooltip-id="jk-tooltip"
                data-tooltip-content="how does it work?"
                href="https://www.juki.app/docs?page=2&sub_page=2&focus=ef99389d-f48f-415f-b652-38cac0a065b8"
                target="_blank"
                className="cr-py"
              >
                <div className="jk-row">
                  <InfoIIcon circle size="small" />
                </div>
              </Link>
            </div>
          );
        }
        if (isGuest) {
          return (
            <ButtonLoader
              type="secondary"
              size="tiny"
              onClick={() => {
                addWarningNotification(<T className="tt-se">to submit, first register</T>);
                pushRoute(jukiAppRoutes.JUDGE().contests.view({
                  key: contest.key,
                  tab: ContestTab.OVERVIEW,
                  subTab: problem.index,
                }));
              }}
            >
              <T className="tt-se">submit</T>
            </ButtonLoader>
          );
        }
        if (isSpectator) {
          return <SpectatorInformation />;
        }
        
        return null;
      }}
    >
      <ProblemRequisites problem={problem} reloadContest={reloadContest} contest={contest} />
    </ProblemView>
  );
};
