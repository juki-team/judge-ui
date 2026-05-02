import { InfoIIcon } from '@juki-team/base-ui/server-components';
import { ButtonLoader, FirstLoginWrapper, ProblemView, T, useJukiNotification, useMatchMutate, useRouterStore, useUIStore } from '@juki-team/base-ui';
import { jukiApiManager, jukiAppRoutes } from '@juki-team/base-ui/settings';
import { JUKI_SERVICE_V2_URL } from '@juki-team/base-ui/constants';
import { ONE_MINUTE } from '@juki-team/commons/constants';
import { type ProblemDataResponseDTO } from '@juki-team/commons/dto';
import { CodeLanguage, Status } from '@juki-team/commons/enums';
import { cleanRequest } from '@juki-team/commons/helpers';
import { type ContentResponse } from '@juki-team/commons/types';
import { authorizedRequest } from '@juki-team/base-ui/helpers';
import { RefObject } from 'react';
import { ProblemTab } from '@juki-team/base-ui/enums';

interface ProblemViewTabProps {
  problem: ProblemDataResponseDTO,
  historyRefs: {
    lastLanguageRef: RefObject<string>,
    lastSourceRef: RefObject<string>,
    submissionTimestampsRef: RefObject<number[]>,
  }
}

export const ProblemViewTab = ({
                                 problem,
                                 historyRefs: { lastLanguageRef, lastSourceRef, submissionTimestampsRef },
                               }: ProblemViewTabProps) => {

  const { notifyResponse, addWarningNotification } = useJukiNotification();
  const { Link } = useUIStore(store => store.components);
  const mutate = useMatchMutate();
  const pushRoute = useRouterStore(store => store.pushRoute);

  return (
    <ProblemView
      problem={problem}
      infoPlacement="name"
      codeEditorStoreKey={problem.key}
      codeEditorCenterButtons={({ files, currentFileName }) => {
        const { source = '', language = CodeLanguage.TEXT } = files[currentFileName] || {};
        // if (problem.judge.isExternal && false) {
        //   return (
        //     <div className="jk-row">
        //       <InfoIIcon
        //         data-tooltip-id="jk-tooltip"
        //         data-tooltip-content="it is not possible to submit to external judges at this time, we apologize for the inconvenience"
        //         data-tooltip-t-class-name="tt-se"
        //         className="cr-py"
        //       />
        //     </div>
        //   );
        // }

        return (
          <div className="jk-row gap">
            <FirstLoginWrapper>
              <ButtonLoader
                size="tiny"
                disabled={source === ''}
                onClick={async setLoaderStatus => {

                  const now = Date.now();
                  submissionTimestampsRef.current = submissionTimestampsRef.current.filter(ts => now - ts < ONE_MINUTE);
                  if (submissionTimestampsRef.current.length >= 5) {
                    addWarningNotification(<T className="tt-se">you cannot submit more than 5 times per minute</T>);
                    return;
                  }
                  submissionTimestampsRef.current.push(now);

                  if (source === lastSourceRef.current && language === lastLanguageRef.current) {
                    addWarningNotification(<T>you cannot submit the same code again</T>);
                    return;
                  }

                  lastSourceRef.current = source;
                  lastLanguageRef.current = language as string;

                  setLoaderStatus(Status.LOADING);
                  const { url, ...options } = jukiApiManager.apiV2.problem.submit({
                    params: { key: problem.key },
                    body: { language: language as string, source },
                  });
                  const response = cleanRequest<ContentResponse<any>>(
                    await authorizedRequest(url, options),
                  );

                  if (notifyResponse(response, setLoaderStatus)) {
                    await mutate(new RegExp(`${JUKI_SERVICE_V2_URL}/submission`));
                    pushRoute(jukiAppRoutes.JUDGE().problems.view({
                      key: problem.key,
                      tab: ProblemTab.SUBMISSIONS,
                    }));
                  }
                }}
              >
                <T className="tt-se">submit</T>
              </ButtonLoader>
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
      }}
      // expandPosition={{
      //   top: 0,
      //   left: 0,
      //   width: '100vw',
      //   height: '100vh',
      // }}
    />
  );
};
