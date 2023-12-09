import { Button, ButtonLoader, CloseIcon, EditIcon, SaveIcon, Select, T, useNotification } from 'components';
import {
  CONTEST_ROLE,
  COURSE_ROLE,
  FILE_ROLE,
  JUDGE_API_V1,
  PROBLEM_ROLE,
  SYSTEM_ROLE,
  TEAM_ROLE,
  USER_ROLE,
} from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
import { useJukiUser } from 'hooks';
import React, { useState } from 'react';
import {
  ContentResponseType,
  ContestRole,
  CourseRole,
  HTTPMethod,
  ProblemRole,
  Status,
  SystemRole,
  TeamRole,
  UserManagementResponseDTO,
  UserRole,
} from 'types';

export interface ProblemPermissionsProps {
  user: UserManagementResponseDTO,
  refresh: () => void,
  companyKey: string,
}

type Roles = {
  systemRole: SystemRole,
  userRole: UserRole;
  contestRole: ContestRole;
  problemRole: ProblemRole;
  teamRole: TeamRole;
  courseRole: CourseRole;
}

export const UserPermissions = ({ user: userToUpdate, companyKey, refresh }: ProblemPermissionsProps) => {
  const { company: { key }, user: { canHandleSettings, canManageSettings } } = useJukiUser();
  const [ editing, setEditing ] = useState(false);
  const { addSuccessNotification, addErrorNotification } = useNotification();
  const roles = {
    systemRole: userToUpdate.systemRole,
    userRole: userToUpdate.userRole,
    problemRole: userToUpdate.problemRole,
    contestRole: userToUpdate.contestRole,
    teamRole: userToUpdate.teamRole,
    courseRole: userToUpdate.courseRole,
    fileRole: userToUpdate.fileRole,
  };
  const [ newRoles, setNewRoles ] = useState<Roles>(roles);
  
  const ROLES: { [key: string]: { [key: string]: { value: string, label: string, level: number } } } = {
    user: USER_ROLE,
    problem: PROBLEM_ROLE,
    contest: CONTEST_ROLE,
  };
  
  if (canManageSettings) {
    ROLES.system = SYSTEM_ROLE;
    ROLES.team = TEAM_ROLE;
    ROLES.course = COURSE_ROLE;
    ROLES.file = FILE_ROLE;
  }
  
  return (
    <div>
      <div className="permissions-cell jk-row nowrap">
        <div className="permissions-box">
          {Object.entries(ROLES).map(([ key, roles ]) => (
            <div className="jk-row nowrap space-between" style={{ width: 300 }} key={key}>
              <div style={{ width: 150 }} className="jk-row left"><T>{key}</T></div>
              <Select
                disabled={!editing}
                options={Object.values(roles).map(role => ({ label: <T>{role.label}</T>, value: role.value }))}
                // @ts-ignore
                selectedOption={{ value: newRoles[key + 'Role'] }}
                onChange={({ value }) => {
                  setNewRoles(prevState => ({ ...prevState, [key + 'Role']: value }));
                }}
                extend
              />
            </div>
          ))}
        </div>
        
        <div style={{ width: 40 }}>
          {editing ? (
            <>
              <ButtonLoader
                size="small"
                icon={<SaveIcon />}
                onClick={async setLoaderStatus => {
                  if (JSON.stringify(newRoles) !== JSON.stringify(roles)) {
                    setLoaderStatus?.(Status.LOADING);
                    const response = cleanRequest<ContentResponseType<any>>(
                      await authorizedRequest(
                        JUDGE_API_V1.USER.ROLES(companyKey, userToUpdate.nickname),
                        { method: HTTPMethod.PUT, body: JSON.stringify(newRoles) },
                      ),
                    );
                    if (response.success) {
                      addSuccessNotification(<T>success</T>);
                      setLoaderStatus?.(Status.SUCCESS);
                    } else {
                      addErrorNotification(<T>error</T>);
                      setLoaderStatus?.(Status.ERROR);
                    }
                    refresh();
                  }
                  setEditing(false);
                }}
              />
              <Button
                size="small"
                icon={<CloseIcon />}
                onClick={() => {
                  setNewRoles(roles);
                  setEditing(false);
                }}
              />
            </>
          ) : <Button size="small" icon={<EditIcon />} onClick={() => setEditing(true)} />}
        </div>
      </div>
    </div>
  );
};
