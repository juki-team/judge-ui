import { Button, ButtonLoader, CloseIcon, EditIcon, SaveIcon, Select, T, useNotification } from 'components/index';
import {
  CONTEST_ROLE,
  COURSE_ROLE,
  JUDGE_API_V1,
  PROBLEM_ROLE,
  SHEET_ROLE,
  SYSTEM_ROLE,
  TEAM_ROLE,
  USER_ROLE,
} from 'config/constants';
import { authorizedRequest, cleanRequest } from 'helpers';
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
}

type Roles = {
  systemRole: SystemRole,
  userRole: UserRole;
  contestRole: ContestRole;
  problemRole: ProblemRole;
  teamRole: TeamRole;
  courseRole: CourseRole;
}

export const UserPermissions = ({ user: userToUpdate, refresh }: ProblemPermissionsProps) => {
  
  const [editing, setEditing] = useState(false);
  const { addSuccessNotification, addErrorNotification } = useNotification();
  const roles = {
    userRole: userToUpdate.userRole,
    contestRole: userToUpdate.contestRole,
    problemRole: userToUpdate.problemRole,
    teamRole: userToUpdate.teamRole,
    courseRole: userToUpdate.courseRole,
    sheetRole: userToUpdate.sheetRole,
    systemRole: userToUpdate.systemRole,
  };
  const [newRoles, setNewRoles] = useState<Roles>(roles);
  
  const ROLES = {
    system: SYSTEM_ROLE,
    user: USER_ROLE,
    problem: PROBLEM_ROLE,
    contest: CONTEST_ROLE,
    team: TEAM_ROLE,
    course: COURSE_ROLE,
    sheet: SHEET_ROLE,
  };
  
  return (
    <div>
      <div className="permissions-cell jk-row nowrap">
        <div className="permissions-box">
          {Object.entries(ROLES).map(([key, roles]) => (
            <div className="jk-row nowrap space-between" style={{ width: 300 }} key={key}>
              <div style={{ width: 150 }} className="jk-row left"><T>{key}</T></div>
              <Select
                disabled={!editing}
                options={Object.values(roles).map(role => ({ label: <T>{role.label}</T>, value: role.value }))}
                selectedOption={{ value: newRoles[key + 'Role'] }}
                onChange={({ value }) => {
                  setNewRoles(prevState => ({ ...prevState, [key + 'Role']: value }));
                }}
                extend
              />
            </div>
          ))}
        </div>
        {userToUpdate.canEditPermissionsData && (
          <div style={{ width: 40 }}>
            {editing ? (
              <>
                <ButtonLoader
                  size="small"
                  icon={<SaveIcon />}
                  onClick={async setLoaderStatus => {
                    if (JSON.stringify(newRoles) !== JSON.stringify(roles)) {
                      setLoaderStatus?.(Status.LOADING);
                      const response = cleanRequest<ContentResponseType<any>>(await authorizedRequest(JUDGE_API_V1.USER.ROLES(userToUpdate.nickname), {
                        method: HTTPMethod.PUT,
                        body: JSON.stringify(newRoles),
                      }));
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
        )}
      </div>
    </div>
  );
};
