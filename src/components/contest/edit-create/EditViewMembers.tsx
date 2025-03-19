'use client';

import {
  AdminInformationContent,
  ContestantInformationContent,
  DocumentCustomMembersContent,
  GuestInformationContent,
  JudgeInformationContent,
  SpectatorInformationContent,
} from 'components';
import React from 'react';
import { EditViewMembersContestProps } from '../types';

export const EditViewMembers = ({ setContest, contest }: EditViewMembersContestProps) => {
  
  return (
    <div className="bc-we jk-br-ie jk-pg-sm">
      <DocumentCustomMembersContent
        members={contest.members}
        setMembers={setContest ? (setStateAction) => {
          if (typeof setStateAction === 'function') {
            setContest?.(prevState => ({ ...prevState, members: setStateAction(prevState.members) }));
          } else {
            setContest?.(prevState => ({ ...prevState, members: setStateAction }));
          }
        } : undefined}
        documentOwner={contest.owner}
        administrators={{
          description: (
            <div style={{ maxWidth: 200 }}>
              <AdminInformationContent />
            </div>
          ),
          readOnly: !setContest,
        }}
        managers={{
          name: 'judges',
          description: (
            <div style={{ maxWidth: 200 }}>
              <JudgeInformationContent />
            </div>
          ),
          readOnly: !setContest,
        }}
        participants={{
          name: 'contestants',
          description: (
            <div style={{ maxWidth: 200 }}>
              <ContestantInformationContent />
            </div>
          ),
          readOnly: !setContest,
        }}
        guests={{
          description: (
            <div style={{ maxWidth: 200 }}>
              <GuestInformationContent />
            </div>
          ),
          closeable: true,
          readOnly: !setContest,
        }}
        spectators={{
          description: (
            <div style={{ maxWidth: 200 }}>
              <SpectatorInformationContent />
            </div>
          ),
          closeable: true,
          readOnly: !setContest,
        }}
      />
    </div>
  );
};
