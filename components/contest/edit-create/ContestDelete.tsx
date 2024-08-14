import { ButtonLoader, T } from 'components';
import { jukiSettings } from 'config';
import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useJukiNotification, useJukiRouter } from 'hooks';
import React from 'react';
import { ContentResponseType, HTTPMethod, Status, UserBasicInfoResponseDTO } from 'types';

interface ProblemStatementProps {
  documentOwner: UserBasicInfoResponseDTO,
  contestKey: string,
}

export const ContestDelete = ({ contestKey, documentOwner }: ProblemStatementProps) => {
  
  const { notifyResponse } = useJukiNotification();
  const { pushRoute } = useJukiRouter();
  
  return (
    <div className="jk-col gap jk-pg bc-we jk-br-ie cr-er">
      <T className="tt-se cr-er fw-bd">Are you sure you want to delete it?</T>
      <div style={{ display: 'ruby' }}>
        <T className="tt-se cr-er">you will no longer have access to this contest</T>, &nbsp;
        <T className="cr-er">to see it again contact the administrator</T>.
      </div>
      <ButtonLoader
        onClick={async (setLoaderStatus) => {
          setLoaderStatus(Status.LOADING);
          setLoaderStatus(Status.LOADING);
          const response = cleanRequest<ContentResponseType<true>>(
            await authorizedRequest(JUDGE_API_V1.CONTEST.CONTEST(contestKey), {
              method: HTTPMethod.DELETE,
            }));
          if (notifyResponse(response, setLoaderStatus)) {
            pushRoute({ pathname: jukiSettings.ROUTES.contests().list() });
          }
        }}
        className="bc-er"
      >
        <T>delete</T>
      </ButtonLoader>
    </div>
  );
};
