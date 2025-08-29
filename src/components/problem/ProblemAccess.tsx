import { DocumentMembersContent, T } from 'components';
import React, { Dispatch, SetStateAction } from 'react';
import { EntityAccess, EntityMembersResponseDTO, UserCompanyBasicInfoResponseDTO } from 'types';

interface ProblemStatementProps {
  members: EntityMembersResponseDTO,
  setMembers?: Dispatch<SetStateAction<EntityMembersResponseDTO>>,
  documentOwner: UserCompanyBasicInfoResponseDTO,
}

export const problemAccessProps = {
  administrators: {
    closeable: true,
    description: (
      <div style={{ maxWidth: 256 }} className="jk-pg-xsm">
        <T className="tt-se">
          an administrator can do everything a judge can, and can also edit the statement, settings, test cases,
          editorial, and access
        </T>
      </div>
    ),
  },
  managers: {
    name: 'judges',
    description: (
      <div style={{ maxWidth: 256 }} className="jk-pg-xsm">
        <T className="tt-se">
          {`a judge can do everything a viewer can and can also view the problem's submission codes`}
        </T>
      </div>
    ),
  },
  spectators: {
    name: 'viewers',
    description: (
      <div style={{ maxWidth: 256 }} className="jk-pg-xsm">
        <T className="tt-se">
          a viewer can view the problem and submit their solutions
        </T>
      </div>
    ),
  },
  entityAccess: {
    [EntityAccess.PRIVATE]: {
      description: 'the problem will have the owner as its only administrator, and administrators, judges, or viewers cannot be assigned',
    },
    [EntityAccess.RESTRICTED]: {
      description: 'the problem will have the owner as its administrator, and administrators, judges, and viewers can be assigned',
    },
    [EntityAccess.PUBLIC]: {
      description: 'the problem will have the owner as its administrator and all users as viewers, and administrators and judges can be assigned',
    },
    [EntityAccess.EXPOSED]: {
      description: 'the problem will have the owner as its administrator and all users as viewers and judges, and administrators can be assigned',
    },
  },
};

export const ProblemAccess = ({ members, setMembers, documentOwner }: ProblemStatementProps) => {
  return (
    <div className="jk-pg bc-we jk-br-ie">
      <DocumentMembersContent
        members={members}
        documentOwner={documentOwner}
        setMembers={setMembers}
        {...problemAccessProps}
      />
    </div>
  );
};
