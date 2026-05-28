'use client';

import { ButtonLoader, T, useJukiNotification, useRouterStore } from '@juki-team/base-ui';
import { ContestsTab } from '@juki-team/base-ui/enums';
import { authorizedRequest } from '@juki-team/base-ui/helpers';
import { jukiApiManager, jukiAppRoutes } from '@juki-team/base-ui/settings';
import { type UserOrganizationBasicInfoResponseDTO as UserCompanyBasicInfoResponseDTO } from '@juki-team/commons/dto';
import { Status } from '@juki-team/commons/enums';
import { cleanRequest } from '@juki-team/commons/helpers';
import { type ContentResponse } from '@juki-team/commons/types';

interface ProblemStatementProps {
  documentOwner: UserCompanyBasicInfoResponseDTO,
  contestKey: string,
  deleted: boolean,
}

export const ContestDelete = ({ contestKey, deleted }: ProblemStatementProps) => {

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
        <T className="tt-se cr-er">you will no longer have access to this contest</T>, &nbsp;
        <T className="cr-er">to see it again contact the administrator</T>.
      </div>
      <ButtonLoader
        onClick={async (setLoaderStatus) => {
          setLoaderStatus(Status.LOADING);
          const { url, ...options } = jukiApiManager.apiV2.contest.delete({ params: { key: contestKey } });
          const response = cleanRequest<ContentResponse<true>>(
            await authorizedRequest(url, options));
          if (notifyResponse(response, setLoaderStatus)) {
            pushRoute({ pathname: jukiAppRoutes.JUDGE().contests.list({ tab: ContestsTab.CLASSICS }) });
          }
        }}
        className="bc-er"
      >
        <T>delete</T>
      </ButtonLoader>
    </div>
  );
};
