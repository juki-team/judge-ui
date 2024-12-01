import { DocumentMembersContent } from 'components';
import React, { Dispatch, SetStateAction } from 'react';
import { DocumentMembersResponseDTO, UserBasicInfoResponseDTO } from 'src/types';

interface ProblemStatementProps {
  members: DocumentMembersResponseDTO;
  setMembers?: Dispatch<SetStateAction<DocumentMembersResponseDTO>>;
  documentOwner: UserBasicInfoResponseDTO;
}

export const ProblemAccess = ({ members, setMembers, documentOwner }: ProblemStatementProps) => {
  return (
    <div className="jk-pg bc-we jk-br-ie">
      <DocumentMembersContent members={members} documentOwner={documentOwner} setMembers={setMembers} />
    </div>
  );
};
