'use client';

import {
  AdminInformationContent,
  ContestantInformationContent,
  DocumentMembersContent,
  GuestInformationContent,
  JudgeInformationContent,
  SpectatorInformationContent,
} from 'components';
import React from 'react';
import { EntityAccess } from 'types';
import { EditViewMembersContestProps } from '../types';

export const contestAccessProps = (readOnly: boolean) => ({
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
        {...contestAccessProps(!setContest)}
      />
    </div>
  );
};
