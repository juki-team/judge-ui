'use client';

import { ButtonLoader, CodeViewer, CopyToClipboard, DateLiteral, Input, T } from 'components';
import { getJukiMcpUrl, JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useFetcher, useJukiNotification, useState, useUserStore } from 'hooks';
import type { ReactNode } from 'react';
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

const claudeCodeCommand = (mcpUrl: string, token?: string) => (
  `claude mcp add --transport http juki ${mcpUrl}${token ? ` --header "Authorization: Bearer ${token}"` : ''}`
);

const Copyable = ({ text, language = CodeLanguage.BASH }: { text: string, language?: CodeLanguage }) => (
  <div className="jk-row gap left nowrap">
    <CodeViewer code={text} language={language} />
    <CopyToClipboard text={text} />
  </div>
);

const HowToCard = ({ title, children }: { title: ReactNode, children: ReactNode }) => (
  <div className="jk-col gap stretch bc-we jk-br-ie jk-pg-sm">
    <div className="fw-bd">{title}</div>
    <ol className="jk-col gap stretch" style={{ margin: 0, paddingLeft: 20 }}>{children}</ol>
  </div>
);

/**
 * Access of the AI assistants to the account, through the MCP server of JUKI (Claude Desktop, Claude Code...):
 * how to connect them, the applications connected with OAuth and the personal access tokens (shown only once).
 */
export const AccessTokens = () => {

  const { notifyResponse } = useJukiNotification();
  const organizationKey = useUserStore(state => state.user.organization.key);
  const [ name, setName ] = useState('');
  const [ created, setCreated ] = useState<CreatedAccessTokenResponseDto | null>(null);
  const { data, mutate } = useFetcher<ContentResponseType<AccessTokenResponseDto[]>>(JUDGE_API_V1.ACCESS_TOKEN.LIST());
  const accessTokens = data?.success ? data.content : [];
  // the MCP server of the organization: its users sign in on its own platform
  const mcpUrl = getJukiMcpUrl(organizationKey);

  return (
    <div className="jk-col gap stretch jk-pg">
      <div className="jk-col gap stretch bc-pd jk-br-ie jk-pg-sm">
        <T className="tt-se fw-bd">AI assistants</T>
        <T className="tt-se">
          connect Claude to JUKI: it will be able to view and edit your problems, upload test cases and submit solutions, with your permissions
        </T>
        <div className="jk-row gap left">
          <T className="tt-se fw-bd ws-np">your MCP URL</T>
          <code className="jk-pg-xsm bc-pl jk-br-ie" style={{ wordBreak: 'break-all' }}>{mcpUrl}</code>
          <CopyToClipboard text={mcpUrl} />
        </div>
      </div>

      <T className="tt-se fw-bd">how to connect</T>
      <HowToCard
        title={<>Claude Desktop <span className="cr-g4">(Windows, Mac)</span></>}
      >
        <li><T className="tt-se">open Settings → Connectors → Add custom connector</T></li>
        <li><T className="tt-se">name: JUKI, URL: your MCP URL</T></li>
        <li><T className="tt-se">click Connect, sign in to JUKI and click Allow</T></li>
      </HowToCard>
      <HowToCard
        title={<>Claude Code <span className="cr-g4">(Linux, Mac, Windows, with a browser)</span></>}
      >
        <li>
          <div className="jk-col gap stretch">
            <T className="tt-se">run in your terminal</T>
            <Copyable text={claudeCodeCommand(mcpUrl)} />
          </div>
        </li>
        <li><T className="tt-se">inside Claude Code, type /mcp, choose juki and then Authenticate</T></li>
        <li><T className="tt-se">the browser opens: sign in to JUKI and click Allow</T></li>
      </HowToCard>
      <HowToCard
        title={<>Claude Code <span className="cr-g4">(server without a browser, SSH)</span></>}
      >
        <li><T className="tt-se">create a personal access token below</T></li>
        <li><T className="tt-se">run the command it shows you (it includes the token)</T></li>
      </HowToCard>

      <div className="jk-col gap stretch bc-pd jk-br-ie jk-pg-sm">
        <T className="tt-se fw-bd">personal access tokens</T>
        <T className="tt-se cr-g4">for servers without a browser, scripts or other MCP clients</T>
        <div className="jk-row gap left nowrap">
          <Input
            label={<T className="tt-se ws-np fw-bd">name</T>}
            labelPlacement="top"
            value={name}
            onChange={setName}
            placeholder="e.g. Claude Code (server)"
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
          <Copyable text={claudeCodeCommand(mcpUrl, created.token)} />
          <T className="tt-se fw-bd">other MCP clients</T>
          <T className="tt-se">URL: your MCP URL, and this header:</T>
          <Copyable text={`Authorization: Bearer ${created.token}`} language={CodeLanguage.TEXT} />
          <div>
            <ButtonLoader type="secondary" size="small" onClick={() => setCreated(null)}>
              <T className="tt-se">done</T>
            </ButtonLoader>
          </div>
        </div>
      )}

      <T className="tt-se fw-bd">with access to your account</T>
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
