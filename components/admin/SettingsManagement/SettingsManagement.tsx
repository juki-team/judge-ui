import { ButtonLoader, Image, Input, T, UserChip, UsersSelector } from 'components';
import { JUDGE_API_V1 } from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useNotification } from 'hooks';
import React, { useEffect, useState } from 'react';
import { KeyedMutator } from 'swr';
import {
  CompanyResponseDTO,
  ContentResponseType,
  HTTPMethod,
  Status,
  SubmissionRunStatus,
  UserSummaryResponseDTO,
} from 'types';
import { ModifyContactEmailsButton } from './ModifyContactEmailsButton';
import { ModifyEmailTemplateButton } from './ModifyEmailTemplateButton';

interface SettingsManagementBodyProps {
  company: CompanyResponseDTO,
  mutate: KeyedMutator<string>
}

export const SettingsManagement = ({ company, mutate }: SettingsManagementBodyProps) => {
  
  const { notifyResponse } = useNotification();
  const [ user, setUser ] = useState<UserSummaryResponseDTO>({} as UserSummaryResponseDTO);
  const [ mainEmail, setMainEmail ] = useState(company.mainEmail);
  useEffect(() => {
    setMainEmail(company.mainEmail);
  }, [ company.mainEmail ]);
  
  return (
    <div className="jk-col nowrap top gap stretch">
      <div className="jk-col gap nowrap bc-we jk-br-ie jk-pad-sm">
        <h3>{company.name}</h3>
        <div><T className="fw-bd tt-se">key</T>:&nbsp;{company.key}</div>
        <div><T className="fw-bd tt-se">hosts</T>:&nbsp;{company.hosts.join(', ')}</div>
        <div><T className="fw-bd tt-se">icons</T></div>
        <div className="jk-col gap">
          <div className="jk-row-col gap">
            <div className="bc-pd jk-br-ie jk-pad-sm elevation-1">
              <Image src={company.imageUrl} alt={company.name} height={60} width={120} />
            </div>
            <div className="bc-we jk-br-ie jk-pad-sm elevation-1">
              <Image src={company.imageUrl.replace('white', 'color')} alt={company.name} height={60} width={120} />
            </div>
          </div>
          <div className="jk-row-col gap">
            <div className="bc-pd jk-br-ie jk-pad-sm elevation-1">
              <Image
                src={company.imageUrl.replace('horizontal', 'vertical')}
                alt={company.name}
                height={120}
                width={60}
              />
            </div>
            <div className="bc-we jk-br-ie jk-pad-sm elevation-1">
              <Image
                src={company.imageUrl.replace('horizontal', 'vertical').replace('white', 'color')}
                alt={company.name}
                height={120}
                width={60}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="jk-col gap nowrap bc-we jk-br-ie jk-pad-sm">
        <h3>set email data</h3>
        <div className="jk-col gap">
          <div className="jk-row">
            <T className="tt-se">main email</T>:&nbsp;
            <span className="fw-bd">{company.mainEmail}</span>
          </div>
          <div className="jk-row gap">
            <div><T className="tt-se">set main email</T>:&nbsp;</div>
            <Input value={mainEmail} onChange={setMainEmail} />
            <ButtonLoader
              disabled={!mainEmail}
              onClick={async (setLoaderStatus) => {
                setLoaderStatus(Status.LOADING);
                const response = cleanRequest<ContentResponseType<{}>>(
                  await authorizedRequest(JUDGE_API_V1.COMPANY.CURRENT(), {
                    method: HTTPMethod.POST,
                    body: JSON.stringify({ mainEmail }),
                  }));
                notifyResponse(response, setLoaderStatus);
                await mutate();
              }}
            >
              <T>set</T>
            </ButtonLoader>
          </div>
        </div>
        <ModifyEmailTemplateButton
          emailTemplate={company.emailTemplate}
          mutate={mutate}
        />
        <ModifyContactEmailsButton
          contactEmails={company.contactEmails}
          mutate={mutate}
        />
      </div>
      <div className="jk-col gap nowrap bc-we jk-br-ie jk-pad-sm">
        <h3>set manager Juki user</h3>
        <div className="jk-row nowrap extend">
          <div>
            <T className="tt-se">manager Juki user</T>:&nbsp;
            <span className="fw-bd">{company.managerUserNickname}</span>
          </div>
        </div>
        <div className="jk-row nowrap extend">
          <UsersSelector
            selectedUsers={user.nickname ? [ user.nickname ] : []}
            onChangeSelectedUsers={(user) => setUser((user[0] || {}) as UserSummaryResponseDTO)}
            maxUsersSelection={1}
          />
          {user.nickname && (
            <UserChip
              imageUrl={user.imageUrl}
              nickname={user.nickname}
              givenName={user.givenName}
              familyName={user.familyName}
              email={user.email}
            />
          )}
          <ButtonLoader
            disabled={!user.id}
            onClick={async (setLoaderStatus) => {
              setLoaderStatus(Status.LOADING);
              const response = cleanRequest<ContentResponseType<{
                listCount: number,
                status: SubmissionRunStatus.RECEIVED
              }>>(
                await authorizedRequest(JUDGE_API_V1.COMPANY.CURRENT(), {
                  method: HTTPMethod.POST,
                  body: JSON.stringify({ managerUserId: user.id }),
                }));
              notifyResponse(response, setLoaderStatus);
              await mutate();
            }}
          >
            <T>set</T>
          </ButtonLoader>
        </div>
      </div>
    </div>
  );
};
