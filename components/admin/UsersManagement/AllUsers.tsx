import {
  Button,
  DataViewer,
  DemographyIcon,
  Field,
  OpenInNewIcon,
  ReloadIcon,
  ResetPassword,
  Select,
  T,
  UserChip,
} from 'components';
import {
  CONTEST_ROLE,
  COURSE_ROLE,
  DEFAULT_DATA_VIEWER_PROPS,
  JUDGE_API_V1,
  PROBLEM_ROLE,
  TEAM_ROLE,
  USER_ROLE,
  USER_STATUS,
} from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useDataViewerRequester, useNotification } from 'hooks';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import {
  CompanyResponseDTO,
  ContentResponseType,
  ContentsResponseType,
  DataViewerHeadersType,
  FilterTextOfflineType,
  HTTPMethod,
  QueryParam,
  UserManagementResponseDTO,
  UserStatus,
} from 'types';
import { UserPermissions } from './UserPermissions';

export function AllUsers({ company }: { company: CompanyResponseDTO }) {
  
  const [ nickname, setNickname ] = useState('');
  const optionsFilterStatus = Object.values(USER_STATUS).map(status => ({
    value: status.value,
    label: <T className="tt-ce">{status.label}</T>,
  }));
  const { notifyResponse } = useNotification();
  const {
    data: response,
    request,
    setLoaderStatusRef,
    reload,
    refreshRef,
  } = useDataViewerRequester<ContentsResponseType<UserManagementResponseDTO>>(
    () => JUDGE_API_V1.USER.MANAGEMENT_LIST(company.key),
  );
  useEffect(reload, [ company.key, reload ]);
  const changeUserStatus = async (nickname: string, status: UserStatus) => {
    const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(
      JUDGE_API_V1.USER.STATUS(nickname),
      {
        method: HTTPMethod.PUT,
        body: JSON.stringify({ status }),
      },
    ));
    notifyResponse(response);
    reload();
  };
  
  const columns: DataViewerHeadersType<UserManagementResponseDTO>[] = useMemo(() => [
    {
      head: 'name',
      index: 'name',
      field: ({ record: { givenName, familyName, nickname, imageUrl, email, city, country } }) => (
        <Field className="jk-row center gap">
          <UserChip
            imageUrl={imageUrl}
            nickname={nickname}
            givenName={givenName}
            familyName={familyName}
            email={email}
          />
          {city}
          <div className="fw-bd">{country}</div>
        </Field>
      ),
      sort: { compareFn: () => (rowA, rowB) => rowA.nickname.localeCompare(rowB.nickname) },
      filter: {
        type: 'text',
        callbackFn: ({ text }) => ({ givenName, familyName, nickname, email }) => {
          const regExp = new RegExp(text, 'gi');
          return !!(nickname?.match?.(regExp))
            || !!(givenName?.match?.(regExp))
            || !!(familyName?.match?.(regExp))
            || !!(email?.match?.(regExp));
        },
      } as FilterTextOfflineType<UserManagementResponseDTO>,
      cardPosition: 'top',
      minWidth: 400,
    },
    {
      head: 'permissions',
      index: 'permissions',
      field: ({ record }) => (
        <Field className="jk-col">
          <UserPermissions
            key={record.nickname}
            companyKey={company.key}
            user={record}
            refresh={reload}
          />
        </Field>
      ),
      sort: {
        compareFn: () => (rowA, rowB) => {
          const rowAAllPermissions = (USER_ROLE[rowA.userRole]?.level ?? 100)
            + (PROBLEM_ROLE[rowA.problemRole]?.level
              ?? 100)
            + (CONTEST_ROLE[rowA.contestRole]?.level ?? 100)
            + (TEAM_ROLE[rowA.teamRole]?.level ?? 100)
            + (COURSE_ROLE[rowA.courseRole]?.level ?? 100);
          const rowBAllPermissions = (USER_ROLE[rowB.userRole]?.level ?? 100)
            + (PROBLEM_ROLE[rowB.problemRole]?.level
              ?? 100)
            + (CONTEST_ROLE[rowB.contestRole]?.level ?? 100)
            + (TEAM_ROLE[rowB.teamRole]?.level ?? 100)
            + (COURSE_ROLE[rowB.courseRole]?.level ?? 100);
          return rowAAllPermissions - rowBAllPermissions;
        },
      },
      cardPosition: 'center',
      minWidth: 360,
    },
    {
      head: 'operations',
      index: 'operations',
      field: ({ record: { status: userStatus, nickname, canResetPassword } }) => {
        return (
          <Field className="jk-col center gap">
            <Select
              options={Object.values(USER_STATUS).map(status => ({
                label: <T className="tt-se">{status.label}</T>,
                value: status.value,
                disabled: status.value === userStatus,
              }))}
              selectedOption={{ value: userStatus }}
              onChange={({ value }) => changeUserStatus(nickname, value)}
            />
            {canResetPassword && (
              <Button
                icon={<ReloadIcon />}
                onClick={() => setNickname(nickname)}
                size="tiny"
              >
                <T>reset password</T>
              </Button>
            )}
          </Field>
        );
      },
      sort: { compareFn: () => (rowA, rowB) => rowA.status.localeCompare(rowB.status) },
      filter: {
        type: 'select-auto', options: optionsFilterStatus,
      },
      cardPosition: 'center',
      minWidth: 190,
    },
  ], [ reload, company.key ]);
  
  const data: UserManagementResponseDTO[] = (response?.success ? response?.contents : []);
  
  return (
    <>
      <ResetPassword onClose={() => setNickname('')} nickname={nickname} companyKey={company.key} />
      <DataViewer<UserManagementResponseDTO>
        headers={columns}
        data={data}
        rows={{ height: 200 }}
        cards={{ width: 400, height: 400, expanded: true }}
        request={request}
        name={QueryParam.ALL_USERS_TABLE}
        setLoaderStatusRef={setLoaderStatusRef}
        refreshRef={refreshRef}
        extraNodes={[
          <Link
            href="https://oscargauss.notion.site/Permissions-V2-6487a360cea1482c963d281f6f6317d4"
            target="_blank"
            key="user roles"
          >
            <Button icon={<DemographyIcon />} size="small">
              <div className="jk-row gap"><T>user roles</T><OpenInNewIcon size="small" /></div>
            </Button>
          </Link>,
        ]}
        {...DEFAULT_DATA_VIEWER_PROPS}
      />
    </>
  );
}
