import { Button, ButtonLoader, EditIcon, Image, Input, T, UserChip, UsersSelector } from 'components';
import { jukiSettings } from 'config';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useNotification } from 'hooks';
import React, { useEffect, useState } from 'react';
import {
  CompanyLogoType,
  CompanyUserPermissionsResponseDTO,
  ContentResponseType,
  HTTPMethod,
  Status,
  SubmissionRunStatus,
  UserSummaryResponseDTO,
} from 'types';
import { IconModal } from './IconModal';
import { ModifyContactEmailsButton } from './ModifyContactEmailsButton';
import { ModifyEmailTemplateButton } from './ModifyEmailTemplateButton';
import { NameModal } from './NameModal';

interface SettingsManagementBodyProps {
  company: CompanyUserPermissionsResponseDTO,
  mutate: () => Promise<void>,
}

export const SettingsManagement = ({ company, mutate }: SettingsManagementBodyProps) => {
  
  const { notifyResponse } = useNotification();
  const { canHandleEmail, canHandleSettings } = company.userPermissions;
  const [ user, setUser ] = useState<UserSummaryResponseDTO>({} as UserSummaryResponseDTO);
  const [ mainEmail, setMainEmail ] = useState(company.mainEmail);
  const [ nameModal, setNameModal ] = useState(false);
  const [ iconModal, setIconModal ] = useState<CompanyLogoType | ''>('');
  useEffect(() => {
    setMainEmail(company.mainEmail);
  }, [ company.mainEmail ]);
  
  return (
    <div className="jk-col nowrap top gap stretch">
      <NameModal
        isOpen={nameModal}
        onClose={() => setNameModal(false)}
        companyKey={company.key}
        name={company.name}
        mutate={mutate}
      />
      <IconModal
        isOpen={!!iconModal}
        onClose={() => setIconModal('')}
        companyKey={company.key}
        name={company.name}
        mutate={mutate}
        logoType={iconModal}
      />
      <div className="jk-col gap nowrap bc-we jk-br-ie jk-pad-sm">
        <h3>{company.name}</h3>
        <div className="jk-row gap">
          <div className="jk-row">
            <T className="tt-se fw-bd">name</T>:&nbsp;
            <span>{company.name}</span>
          </div>
          {canHandleSettings && <Button size="small" icon={<EditIcon />} onClick={() => setNameModal(true)} />}
        </div>
        <div><T className="fw-bd tt-se">key</T>:&nbsp;{company.key}</div>
        <div><T className="fw-bd tt-se">hosts</T>:&nbsp;{company.hosts.join(', ')}</div>
      </div>
      <div className="jk-col gap nowrap bc-we jk-br-ie jk-pad-sm">
        <h3>icons</h3>
        <div className="jk-col gap">
          <div className="jk-row-col gap">
            <div className="jk-row gap bc-pd jk-br-ie jk-pad-sm elevation-1">
              <Image src={company.imageUrl} alt={company.name} height={60} width={120} />
              {canHandleSettings && (
                <Button
                  size="small"
                  icon={<EditIcon />}
                  onClick={() => setIconModal(CompanyLogoType.HORIZONTAL_WHITE)}
                />
              )}
            </div>
            <div className="jk-row gap bc-we jk-br-ie jk-pad-sm elevation-1">
              <Image src={company.imageUrl.replace('white', 'color')} alt={company.name} height={60} width={120} />
              {canHandleSettings && (
                <Button
                  size="small"
                  icon={<EditIcon />}
                  onClick={() => setIconModal(CompanyLogoType.HORIZONTAL_COLOR)}
                />
              )}
            </div>
          </div>
          <div className="jk-row-col gap">
            <div className="jk-row gap bc-pd jk-br-ie jk-pad-sm elevation-1">
              <Image
                src={company.imageUrl.replace('horizontal', 'vertical')}
                alt={company.name}
                height={120}
                width={60}
              />
              {canHandleSettings && (
                <Button
                  size="small"
                  icon={<EditIcon />}
                  onClick={() => setIconModal(CompanyLogoType.VERTICAL_WHITE)}
                />
              )}
            </div>
            <div className="jk-row gap bc-we jk-br-ie jk-pad-sm elevation-1">
              <Image
                src={company.imageUrl.replace('horizontal', 'vertical').replace('white', 'color')}
                alt={company.name}
                height={120}
                width={60}
              />
              {canHandleSettings && (
                <Button
                  size="small"
                  icon={<EditIcon />}
                  onClick={() => setIconModal(CompanyLogoType.VERTICAL_COLOR)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {canHandleEmail && (
        <div className="jk-col gap nowrap bc-we jk-br-ie jk-pad-sm">
          <h3>email data</h3>
          <div className="jk-col gap">
            <div className="jk-row">
              <T className="tt-se fw-bd">main email</T>:&nbsp;
              <span>{company.mainEmail}</span>
            </div>
            <div className="jk-row gap">
              <div><T className="tt-se fw-bd">set main email</T>:&nbsp;</div>
              <Input value={mainEmail} onChange={setMainEmail} />
              <ButtonLoader
                disabled={!mainEmail}
                onClick={async (setLoaderStatus) => {
                  setLoaderStatus(Status.LOADING);
                  const response = cleanRequest<ContentResponseType<{}>>(
                    await authorizedRequest(
                      jukiSettings.API.company.get({ params: { companyKey: company.key } }).url,
                      {
                        method: HTTPMethod.PATCH,
                        body: JSON.stringify({ mainEmail }),
                      }));
                  await mutate();
                  notifyResponse(response, setLoaderStatus);
                }}
              >
                <T>set</T>
              </ButtonLoader>
            </div>
          </div>
          <ModifyEmailTemplateButton
            companyKey={company.key}
            emailTemplate={company.emailTemplate}
            mutate={mutate}
          />
          <ModifyContactEmailsButton
            companyKey={company.key}
            contactEmails={company.contactEmails}
            mutate={mutate}
          />
        </div>
      )}
      {canHandleSettings && (
        <div className="jk-col gap nowrap bc-we jk-br-ie jk-pad-sm">
          <h3>manager user</h3>
          <div className="jk-row nowrap extend">
            <div>
              <T className="tt-se fw-bd">manager user</T>:&nbsp;
              <span>{company.managerUserNickname}</span>
            </div>
          </div>
          <div className="jk-row nowrap extend">
            <UsersSelector
              selectedUsers={user.nickname ? [ user.nickname ] : []}
              onChangeSelectedUsers={(user) => setUser((user[0] || {}) as UserSummaryResponseDTO)}
              maxUsersSelection={1}
              companyKey={company.key}
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
                  await authorizedRequest(
                    jukiSettings.API.company.get({ params: { companyKey: company.key } }).url,
                    {
                      method: HTTPMethod.PATCH,
                      body: JSON.stringify({ managerUserId: user.id }),
                    }));
                await mutate();
                notifyResponse(response, setLoaderStatus);
              }}
            >
              <T>set</T>
            </ButtonLoader>
          </div>
        </div>
      )}
    </div>
  );
};
