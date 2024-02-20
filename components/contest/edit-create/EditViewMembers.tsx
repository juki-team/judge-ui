import { UserChip } from '@juki-team/base-ui';
import { ContestResponseDTO } from '@juki-team/commons';
import {
  ContestantInformation,
  GuestInformation,
  InputToggle,
  SpectatorInformation,
  T,
  UsersSelector,
} from 'components';
import { classNames, isEndlessContest } from 'helpers';
import { useJukiUser } from 'hooks';
import React from 'react';
import { AdminInformation, JudgeInformation } from '../Informations';
import { EditViewMembersContestProps } from '../types';

const PrintUsers = ({ members }: { members?: ContestResponseDTO['members']['spectators'] }) => {
  const users = Object.values(members || {});
  
  if (!users.length) {
    return <div className="jk-row extend"><T className="fw-lr">nobody</T></div>
  }
  
  return (
    <div className="jk-row left gap">
      {users.map(({ nickname, imageUrl }) => (
        <UserChip imageUrl={imageUrl} nickname={nickname} key={nickname} />
      ))}
    </div>
  );
}

export const EditViewMembers = ({ setContest, contest, editing, membersToView }: EditViewMembersContestProps) => {
  
  const isEditing = !!setContest;
  const { company: { key } } = useJukiUser();
  const guests = contest.members.guests;
  const spectators = contest.members.spectators;
  const contestants = contest.members.contestants;
  const judges = contest.members.judges;
  const administrators = contest.members.administrators;
  
  const openRegistration = isEditing
    ? contest.members.guests.length === 1 && contest.members.guests[0] === '*'
    : !!membersToView?.guests['*'];
  const openScore = isEditing
    ? contest.members.spectators.length === 1 && contest.members.spectators[0] === '*'
    : !!membersToView?.spectators['*'];
  
  const competition = isEndlessContest(contest);
  
  return (
    <div className="jk-col gap left top stretch gap nowrap">
      <div className="jk-col gap stretch bc-we jk-br-ie jk-pad-sm">
        <div className="jk-row left fw-bd tx-l cr-py">
          <T className="tt-se">spectators</T>&nbsp;<SpectatorInformation filledCircle />
        </div>
        {isEditing && (
          <InputToggle
            size="small"
            checked={openScore}
            onChange={(value) => setContest(prevState => ({
              ...prevState,
              members: { ...prevState.members, spectators: value ? [ '*' ] : [] },
            }))}
            leftLabel={<T className={classNames('tt-se', { 'fw-bd': !openScore })}>closed</T>}
            rightLabel={<T className={classNames('tt-se', { 'fw-bd': openScore })}>open</T>}
            disabled={competition}
          />
        )}
        <div className="jk-col left stretch">
          {openScore
            ? <T className="tt-se">all judge users will be able to enter the contest as spectators.</T>
            : (
              <>
                <T className="tt-se">only the next users will be able to enter the contest as spectators:</T>
                {isEditing ? (
                  <UsersSelector
                    selectedUsers={spectators}
                    onChangeSelectedUsers={users => {
                      setContest(prevState => ({
                        ...prevState,
                        members: { ...prevState.members, spectators: users.map(user => user.nickname) },
                      }));
                    }}
                    companyKey={key}
                  />
                ) : <PrintUsers members={membersToView?.spectators} />}
              </>
            )}
        </div>
      </div>
      <div className="jk-col gap stretch bc-we jk-br-ie jk-pad-sm">
        <div className="jk-row left fw-bd tx-l cr-py">
          <T className="tt-se">guests</T>&nbsp;<GuestInformation filledCircle />
        </div>
        {isEditing && (
          <InputToggle
            size="small"
            checked={openRegistration}
            onChange={(value) => setContest(prevState => ({
              ...prevState,
              members: { ...prevState.members, guests: value ? [ '*' ] : [] },
            }))}
            leftLabel={<T className={classNames('tt-se', { 'fw-bd': !openRegistration })}>closed</T>}
            rightLabel={<T className={classNames('tt-se', { 'fw-bd': openRegistration })}>open</T>}
            disabled={competition}
          />
        )}
        <div className="jk-row left stretch extend" style={{ minHeight: 34 }}>
          {openRegistration
            ? <T className="tt-se">all judge users will be able to enter the contest as guests.</T>
            : (
              <>
                <T className="tt-se">only the next users will be able to enter the contest as guests:</T>
                {isEditing ? (
                  <UsersSelector
                    selectedUsers={guests}
                    onChangeSelectedUsers={users => {
                      setContest(prevState => ({
                        ...prevState,
                        members: { ...prevState.members, guests: users.map(user => user.nickname) },
                      }));
                    }}
                    companyKey={key}
                  />
                ) : <PrintUsers members={membersToView?.guests} />}
              </>
            )}
        </div>
      </div>
      {(editing || !isEditing) && (
        <div className="jk-col gap stretch bc-we jk-br-ie jk-pad-sm">
          <div className="jk-row left fw-bd tx-l cr-py">
            <T className="tt-se">contestants</T>&nbsp;<ContestantInformation filledCircle />
          </div>
          <div>
            <T className="tt-se">only the next users will be able to enter the contest as contestants:</T>
            {isEditing ? (
              <UsersSelector
                selectedUsers={contestants}
                onChangeSelectedUsers={users => {
                  setContest(prevState => ({
                    ...prevState,
                    members: { ...prevState.members, contestants: users.map(user => user.nickname) },
                  }));
                }}
                companyKey={key}
              />
            ) : <PrintUsers members={membersToView?.contestants} />}
          </div>
        </div>
      )}
      <div className="jk-col gap stretch bc-we jk-br-ie jk-pad-sm">
        <div className="jk-row left cr-py fw-bd tx-xl">
          <T className="tt-se">judges</T>&nbsp;<JudgeInformation filledCircle />
        </div>
        <T className="tt-se">only the next users will be able to enter the contest as guests:</T>
        {isEditing ? (
          <UsersSelector
            selectedUsers={judges}
            onChangeSelectedUsers={users => {
              setContest(prevState => ({
                ...prevState,
                members: { ...prevState.members, judges: users.map(user => user.nickname) },
              }));
            }}
            companyKey={key}
          />
        ) : <PrintUsers members={membersToView?.judges} />}
      </div>
      <div className="jk-col gap stretch bc-we jk-br-ie jk-pad-sm">
        <div className="jk-row left cr-py fw-bd tx-l">
          <T className="tt-se">administrators</T>&nbsp;<AdminInformation filledCircle />
        </div>
        <T className="tt-se">only the next users will be able to enter the contest as guests:</T>
        {isEditing ? (
          <UsersSelector
            selectedUsers={administrators}
            onChangeSelectedUsers={users => {
              setContest(prevState => ({
                ...prevState,
                members: { ...prevState.members, administrators: users.map(user => user.nickname) },
              }));
            }}
            companyKey={key}
          />
        ) : <PrintUsers members={membersToView?.administrators} />}
      </div>
    </div>
  );
};
