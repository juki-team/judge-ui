import { ONE_MINUTE } from '@juki-team/commons';
import { ButtonLoader, FirstLoginWrapper, InfoIIcon, ProblemView, T } from 'components';
import { jukiApiManager } from 'config';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useJukiNotification, useJukiUI } from 'hooks';
import { RefObject } from 'react';
import { CodeLanguage, ContentResponseType, ProblemDataResponseDTO, Status } from 'types';

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
  const { components: { Link } } = useJukiUI();
  
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
                type="secondary"
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
                  const { url, ...options } = jukiApiManager.API_V1.problem.submit({
                    params: { key: problem.key },
                    body: { language: language as string, source },
                  });
                  const response = cleanRequest<ContentResponseType<any>>(
                    await authorizedRequest(url, options),
                  );
                  
                  notifyResponse(response, setLoaderStatus);
                  // if (notifyResponse(response, setLoaderStatus)) {
                  //   listenSubmission({ id: response.content.submitId, problem: { name: problem.name } }, true);
                  //   await mutate(new RegExp(`${jukiApiManager.SERVICE_API_V1_URL}/submission`, 'g'));
                  //   pushRoute(jukiAppRoutes.JUDGE().problems.view({
                  //     key: problem.key,
                  //     tab: ProblemTab.MY_SUBMISSIONS,
                  //   }));
                  // }
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
