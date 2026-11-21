'use client';

import { ButtonLoader, LoginUser, T } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useFetcher, useJukiNotification, useRouterStore, useUserStore } from 'hooks';
import { ContentResponseType, HTTPMethod, Status } from 'types';

type OAuthClientResponseDto = {
  clientId: string,
  clientName: string,
  redirectUris: string[],
};

/**
 * Consent page of the OAuth flow of the MCP server (juki-service/apps/mcp): an MCP client (Claude Desktop, Claude
 * Code...) asks to act as the user. The MCP server redirects here with the authorization request; the private API
 * validates it (client and redirect_uri) and gives the redirect with the code or the error.
 */
export default function OAuthAuthorizePage() {

  const searchParams = useRouterStore(state => state.searchParams);
  const isLogged = useUserStore(state => state.user.isLogged);
  const nickname = useUserStore(state => state.user.nickname);
  const { notifyResponse } = useJukiNotification();
  const clientId = searchParams.get('client_id') ?? '';
  const redirectUri = searchParams.get('redirect_uri') ?? '';
  const { data, isLoading } = useFetcher<ContentResponseType<OAuthClientResponseDto>>(
    clientId ? JUDGE_API_V1.OAUTH.CLIENT(clientId) : null,
  );
  const client = data?.success ? data.content : null;

  const answer = (approve: boolean) => async (setLoaderStatus: (status: Status) => void) => {
    setLoaderStatus(Status.LOADING);
    const response = cleanRequest<ContentResponseType<{ redirectUrl: string }>>(
      await authorizedRequest(JUDGE_API_V1.OAUTH.AUTHORIZE(), {
        method: HTTPMethod.POST,
        body: JSON.stringify({
          clientId,
          redirectUri,
          codeChallenge: searchParams.get('code_challenge') ?? '',
          codeChallengeMethod: searchParams.get('code_challenge_method') ?? '',
          state: searchParams.get('state') ?? '',
          scope: searchParams.get('scope') ?? '',
          resource: searchParams.get('resource') ?? '',
          approve,
        }),
      }));
    if (notifyResponse(response, setLoaderStatus) && response.success) {
      window.location.assign(response.content.redirectUrl);
    }
  };

  let body;
  if (!clientId || !redirectUri) {
    body = <T className="tt-se cr-er">invalid authorization request</T>;
  } else if (isLoading) {
    body = <T className="tt-se">loading</T>;
  } else if (!client || !client.redirectUris.includes(redirectUri)) {
    body = <T className="tt-se cr-er">unknown application, close this page</T>;
  } else if (!isLogged) {
    body = (
      <>
        <T className="tt-se">sign in to connect the application to your account</T>
        <LoginUser withLabel isVertical />
      </>
    );
  } else {
    body = (
      <>
        <h2>{client.clientName}</h2>
        <div>
          <T className="tt-se">wants to access your JUKI account</T> (<span className="fw-bd">{nickname}</span>)
        </div>
        <ul>
          <li><T className="tt-se">view the problems, test cases and submissions you can see</T></li>
          <li><T className="tt-se">edit the problems you administer and upload their test cases</T></li>
          <li><T className="tt-se">submit solutions on your behalf</T></li>
        </ul>
        <T className="tt-se cr-g4">you can revoke the access anytime from your profile, in the access tokens tab</T>
        <div className="jk-row gap right">
          <ButtonLoader type="secondary" onClick={answer(false)}>
            <T className="tt-se">deny</T>
          </ButtonLoader>
          <ButtonLoader onClick={answer(true)}>
            <T className="tt-se">allow</T>
          </ButtonLoader>
        </div>
        <div className="cr-g4 fs-sm" style={{ wordBreak: 'break-all' }}>
          <T className="tt-se">you will be redirected to</T> {URL.canParse(redirectUri) ? new URL(redirectUri).origin : redirectUri}
        </div>
      </>
    );
  }

  return (
    <div className="jk-row jk-pg">
      <div className="jk-col gap stretch bc-we jk-br-ie jk-pg elevation-1" style={{ maxWidth: 520, width: '100%' }}>
        {body}
      </div>
    </div>
  );
}
