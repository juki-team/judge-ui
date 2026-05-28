'use client';

import { Button, DocumentMembersContent, Modal, T, UserChip } from '@juki-team/base-ui';
import { useState } from 'hooks';
import { type BasicModalProps } from '@juki-team/base-ui/types';
import { type DocumentMemberResponseDTO } from '@juki-team/commons/dto';
import { EditViewMembersContestProps } from '../types';
import { contestAccessProps } from './contestAccessProps';

export const EditViewMembers = ({ setContest, contest }: EditViewMembersContestProps) => {
  
  const [ viewMember, setViewMember ] = useState<DocumentMemberResponseDTO | null>(null);
  
  return (
    <div className="bc-we jk-br-ie jk-pg-sm">
      <DocumentMembersContent
        members={contest.members}
        setMembers={setContest ? (setStateAction) => {
          if (typeof setStateAction === 'function') {
            setContest?.(prevState => ({ ...prevState, members: setStateAction(prevState.members) }));
          } else {
            setContest?.(prevState => ({ ...prevState, members: setStateAction }));
          }
        } : undefined}
        documentOwner={contest.owner}
        {...contestAccessProps(!setContest, setViewMember)}
      />
      {viewMember && <ViewMemberModal isOpen onClose={() => setViewMember(null)} member={viewMember} />}
    </div>
  );
};

interface ViewMemberModalProps extends BasicModalProps {
  member: DocumentMemberResponseDTO,
}

const ViewMemberModal = ({ member, ...modalProps }: ViewMemberModalProps) => {
  
  return (
    <Modal {...modalProps}>
      <div className="jk-col gap jk-pg">
        <div className="jk-row left">
          <UserChip
            imageUrl={member.imageUrl}
            nickname={member.nickname}
            key={member.nickname}
            organizationKey={member.organization.key}
          />
        </div>
        <div>
          <Button onClick={modalProps.onClose}><T>close</T></Button>
        </div>
      </div>
    </Modal>
  );
};
