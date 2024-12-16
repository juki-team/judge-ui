import { DocumentMembersContent } from 'components';
import React, { Dispatch, SetStateAction } from 'react';
import { DocumentMembersResponseDTO, UserCompanyBasicInfoResponseDTO } from 'src/types';

interface ProblemStatementProps {
  members: DocumentMembersResponseDTO;
  setMembers?: Dispatch<SetStateAction<DocumentMembersResponseDTO>>;
  documentOwner: UserCompanyBasicInfoResponseDTO;
}

export const ProblemAccess = ({ members, setMembers, documentOwner }: ProblemStatementProps) => {
  return (
    <div className="jk-pg bc-we jk-br-ie">
      <DocumentMembersContent members={members} documentOwner={documentOwner} setMembers={setMembers} />
    </div>
  );
};
