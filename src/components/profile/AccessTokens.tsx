'use client';

import { ButtonLoader, CodeViewer, CopyToClipboard, DateLiteral, Input, T } from 'components';
import { JUDGE_API_V1, JUKI_MCP_URL } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useFetcher, useJukiNotification, useState } from 'hooks';
import { CodeLanguage, ContentResponseType, HTTPMethod, Status } from 'types';

type AccessTokenResponseDto = {
  id: string,
  // PERSONAL: created here; OAUTH: an application connected with its "Connect" button (OAuth)
  kind: 'PERSONAL' | 'OAUTH',
  name: string,
  tokenPrefix: string,
  createdAt: number,
  lastUsedAt: number,
};

type CreatedAccessTokenResponseDto = AccessTokenResponseDto & { token: string };

const claudeCodeCommand = (token: string) => (
  `claude mcp add --transport http juki ${JUKI_MCP_URL} --header "Authorization: Bearer ${token}"`
);

const claudeDesktopConfig = (token: string) => JSON.stringify({
  mcpServers: {
    juki: {
      command: 'npx',
      args: [ '-y', 'mcp-remote', JUKI_MCP_URL, '--header', `Authorization: Bearer ${token}` ],
    },
  },
}, null, 2);

/**
 * Access of the AI assistants to the account, through the MCP server of JUKI (Claude Desktop, Claude Code...):
 * the applications connected with OAuth and the personal access tokens (shown only once, when they're created).
 */
export const AccessTokens = () => {

  const { notifyResponse } = useJukiNotification();
  const [ name, setName ] = useState('');
  const [ created, setCreated ] = useState<CreatedAccessTokenResponseDto | null>(null);
  const { data, mutate } = useFetcher<ContentResponseType<AccessTokenResponseDto[]>>(JUDGE_API_V1.ACCESS_TOKEN.LIST());
  const accessTokens = data?.success ? data.content : [];

  return (
    <div className="jk-col gap stretch jk-pg">
      <div className="jk-col gap stretch bc-pd jk-br-ie jk-pg-sm">
        <T className="tt-se fw-bd">AI assistants</T>
        <T className="tt-se">
          connect AI assistants (Claude Desktop, Claude Code) to JUKI through its MCP server: they can view and edit your problems, upload test cases and submit solutions with your permissions
        </T>
        <div className="jk-row gap left">
          <T className="tt-se">add this URL as a connector in your assistant and sign in when it asks</T>
          <code className="jk-pg-xsm bc-pl jk-br-ie">{JUKI_MCP_URL}</code>
          <CopyToClipboard text={JUKI_MCP_URL} />
        </div>
        <T className="tt-se cr-g4">
          or create a personal access token, for scripts or clients without sign in
        </T>
        <div className="jk-row gap left nowrap">
          <Input
            label={<T className="tt-se ws-np fw-bd">name</T>}
            labelPlacement="top"
            value={name}
            onChange={setName}
            placeholder="e.g. Claude Desktop (laptop)"
            expand
          />
          <ButtonLoader
            disabled={!name.trim()}
            onClick={async (setLoaderStatus) => {
              setLoaderStatus(Status.LOADING);
              const response = cleanRequest<ContentResponseType<CreatedAccessTokenResponseDto>>(
                await authorizedRequest(JUDGE_API_V1.ACCESS_TOKEN.CREATE(), {
                  method: HTTPMethod.POST,
                  body: JSON.stringify({ name: name.trim() }),
                }));
              if (notifyResponse(response, setLoaderStatus) && response.success) {
                setCreated(response.content);
                setName('');
                await mutate();
              }
            }}
          >
            <T className="tt-se ws-np">create token</T>
          </ButtonLoader>
        </div>
      </div>

      {created && (
        <div className="jk-col gap stretch bc-we jk-br-ie jk-pg-sm">
          <T className="tt-se fw-bd cr-er">copy the token now, it won&apos;t be shown again</T>
          <div className="jk-row gap left nowrap">
            <code className="jk-pg-xsm bc-pl jk-br-ie" style={{ wordBreak: 'break-all' }}>{created.token}</code>
            <CopyToClipboard text={created.token} />
          </div>
          <T className="tt-se fw-bd">Claude Code</T>
          <div className="jk-row gap left nowrap">
            <CodeViewer code={claudeCodeCommand(created.token)} language={CodeLanguage.BASH} />
            <CopyToClipboard text={claudeCodeCommand(created.token)} />
          </div>
          <T className="tt-se fw-bd">Claude Desktop (claude_desktop_config.json)</T>
          <div className="jk-row gap left nowrap top">
            <CodeViewer code={claudeDesktopConfig(created.token)} language={CodeLanguage.JSON} />
            <CopyToClipboard text={claudeDesktopConfig(created.token)} />
          </div>
          <div>
            <ButtonLoader type="secondary" size="small" onClick={() => setCreated(null)}>
              <T className="tt-se">done</T>
            </ButtonLoader>
          </div>
        </div>
      )}

      <div className="jk-col gap stretch">
        {!accessTokens.length && <T className="tt-se cr-g4">no assistant has access to your account</T>}
        {accessTokens.map(({ id, kind, name, tokenPrefix, createdAt, lastUsedAt }) => (
          <div key={id} className="jk-row gap space-between nowrap bc-we jk-br-ie jk-pg-sm">
            <div className="jk-col left">
              <div className="jk-row gap left">
                <span className="fw-bd">{name}</span>
                <span className="jk-tag bc-io">
                  <T className="tt-se">{kind === 'OAUTH' ? 'connected app' : 'personal token'}</T>
                </span>
              </div>
              {kind !== 'OAUTH' && <code>{tokenPrefix}…</code>}
              <div className="jk-row gap left">
                <T className="tt-se">created</T>
                <DateLiteral date={new Date(createdAt)} />
              </div>
              <div className="jk-row gap left">
                <T className="tt-se">last used</T>
                {lastUsedAt ? <DateLiteral date={new Date(lastUsedAt)} /> : <T>never</T>}
              </div>
            </div>
            <ButtonLoader
              size="tiny"
              className="bc-er"
              onClick={async (setLoaderStatus) => {
                setLoaderStatus(Status.LOADING);
                const response = cleanRequest<ContentResponseType<true>>(
                  await authorizedRequest(JUDGE_API_V1.ACCESS_TOKEN.REVOKE(id), { method: HTTPMethod.DELETE }));
                if (notifyResponse(response, setLoaderStatus)) {
                  await mutate();
                }
              }}
            >
              <T className="tt-se ws-np">{kind === 'OAUTH' ? 'disconnect' : 'revoke'}</T>
            </ButtonLoader>
          </div>
        ))}
      </div>
    </div>
  );
};
