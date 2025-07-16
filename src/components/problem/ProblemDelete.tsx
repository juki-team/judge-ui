'use client';

import { ButtonLoader, T } from 'components';
import { jukiAppRoutes } from 'config';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useJukiNotification, useRouterStore } from 'hooks';
import React from 'react';
import { JUDGE_API_V1 } from 'src/constants';
import { ContentResponseType, HTTPMethod, Status, UserCompanyBasicInfoResponseDTO } from 'types';

interface ProblemStatementProps {
  documentOwner: UserCompanyBasicInfoResponseDTO,
  problemJudgeKey: string,
  deleted: boolean,
}

export const ProblemDelete = ({ problemJudgeKey, deleted }: ProblemStatementProps) => {
  
  const { notifyResponse } = useJukiNotification();
  const pushRoute = useRouterStore(state => state.pushRoute);
  
  if (deleted) {
    return (
      <div className="jk-col gap jk-pg bc-we jk-br-ie cr-er">
        <T className="tt-se cr-er fw-bd">already deleted</T>
      </div>
    );
  }
  
  return (
    <div className="jk-col gap jk-pg bc-we jk-br-ie cr-er">
      <T className="tt-se cr-er fw-bd">Are you sure you want to delete it?</T>
      <div style={{ display: 'ruby' }}>
        <T className="tt-se cr-er">you will no longer have access to this problem</T>, &nbsp;
        <T className="cr-er">to see it again contact the administrator</T>.
      </div>
      <ButtonLoader
        onClick={async (setLoaderStatus) => {
          setLoaderStatus(Status.LOADING);
          setLoaderStatus(Status.LOADING);
          const response = cleanRequest<ContentResponseType<true>>(
            await authorizedRequest(JUDGE_API_V1.PROBLEM.PROBLEM(problemJudgeKey), {
              method: HTTPMethod.DELETE,
            }));
          if (notifyResponse(response, setLoaderStatus)) {
            pushRoute({ pathname: jukiAppRoutes.JUDGE().problems.list() });
          }
        }}
        className="bc-er"
      >
        <T className="tt-se">delete</T>
      </ButtonLoader>
    </div>
  );
};
