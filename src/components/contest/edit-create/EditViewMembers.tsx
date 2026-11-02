'use client';

import {
  AdminInformationContent,
  Button,
  ContestantInformationContent,
  DocumentMembersContent,
  GuestInformationContent,
  JudgeInformationContent,
  Modal,
  SpectatorInformationContent,
  T,
  UserChip,
  VisibilityIcon,
} from 'components';
import { useState } from 'hooks';
import { BasicModalProps, DocumentMemberResponseDto, EntityAccess } from 'types';
import { EditViewMembersContestProps } from '../types';

export const contestAccessProps = (readOnly: boolean, onViewMember?: (member: DocumentMemberResponseDto) => void) => ({
  administrators: {
    closeable: true,
    description: (
      <div style={{ maxWidth: 256 }} className="jk-pg-xsm">
        <AdminInformationContent />
      </div>
    ),
    readOnly,
  },
  managers: {
    name: 'judges',
    description: (
      <div style={{ maxWidth: 256 }} className="jk-pg-xsm">
        <JudgeInformationContent />
      </div>
    ),
    readOnly,
  },
  participants: {
    closeable: true,
    name: 'contestants',
    description: (
      <div style={{ maxWidth: 256 }} className="jk-pg-xsm">
        <ContestantInformationContent />
      </div>
    ),
    readOnly,
    renderMember: (member: DocumentMemberResponseDto) => {
      return (
        <div className="jk-row gap">
          <UserChip
            imageUrl={member.imageUrl}
            nickname={member.nickname}
            key={member.nickname}
            organizationKey={member.organization.key}
          />
          {onViewMember && <VisibilityIcon onClick={() => onViewMember(member)} />}
        </div>
      );
    },
  },
  guests: {
    closeable: true,
    description: (
      <div style={{ maxWidth: 256 }} className="jk-pg-xsm">
        <GuestInformationContent />
      </div>
    ),
    readOnly,
  },
  spectators: {
    description: (
      <div style={{ maxWidth: 256 }} className="jk-pg-xsm">
        <SpectatorInformationContent />
      </div>
    ),
    readOnly,
  },
  entityAccess: {
    [EntityAccess.PRIVATE]: {
      description: 'the contest will have the owner as its only administrator, and administrators, judges, participants, guests or viewers cannot be assigned',
    },
    [EntityAccess.RESTRICTED]: {
      description: 'the contest will have the owner as its administrator, and administrators, judges, participants, guests or viewers can be assigned',
    },
    [EntityAccess.PUBLIC]: {
      description: 'the contest will have the owner as its administrator and all users as viewers, and administrators, judges, participants or guests can be assigned',
    },
    [EntityAccess.EXPOSED]: {
      description: 'the contest will have the owner as its administrator and all users as viewers and judges, and administrators, participants or guests can be assigned',
    },
  },
});

export const EditViewMembers = ({ setContest, contest }: EditViewMembersContestProps) => {
  
  const [ viewMember, setViewMember ] = useState<DocumentMemberResponseDto | null>(null);
  
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
  member: DocumentMemberResponseDto,
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
