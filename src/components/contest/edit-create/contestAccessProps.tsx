'use client';

import { UserChip } from '@juki-team/base-ui';
import { VisibilityIcon } from '@juki-team/base-ui/server-components';
import { type DocumentMemberResponseDTO } from '@juki-team/commons/dto';
import { EntityAccess } from '@juki-team/commons/enums';
import {
  AdminInformationContent,
  ContestantInformationContent,
  GuestInformationContent,
  JudgeInformationContent,
  SpectatorInformationContent,
} from 'components';

export const contestAccessProps = (readOnly: boolean, onViewMember?: (member: DocumentMemberResponseDTO) => void) => ({
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
    renderMember: (member: DocumentMemberResponseDTO) => {
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
