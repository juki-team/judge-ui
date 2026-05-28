import { DocumentMembersContent } from '@juki-team/base-ui';
import { type Dispatch, type SetStateAction } from 'react';
import { type EntityMembersResponseDTO, type UserOrganizationBasicInfoResponseDTO as UserCompanyBasicInfoResponseDTO } from '@juki-team/commons/dto';
import { problemAccessProps } from './problemAccessProps';

interface ProblemStatementProps {
  members: EntityMembersResponseDTO,
  setMembers?: Dispatch<SetStateAction<EntityMembersResponseDTO>>,
  documentOwner: UserCompanyBasicInfoResponseDTO,
}

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
