import { InputToggle, T, UsersSelector } from 'components';
import { classNames } from 'helpers';
import React from 'react';
import { AdminInformation, JudgeInformation } from '../Information';
import { EditContestProps } from '../types';

export const EditMembers = ({ setContest, contest }: EditContestProps) => {
  
  const guests = contest.members.guests;
  const spectators = contest.members.spectators;
  const judges = contest.members.judges;
  const administrators = contest.members.administrators;
  
  const openRegistration = contest.members.guests.length === 1 && contest.members.guests[0] === '*';
  const openScore = contest.members.spectators.length === 1 && contest.members.spectators[0] === '*';
  
  return (
    <div className="jk-col left stretch jk-pad">
      <div className="jk-col gap stretch">
        <div className="jk-row left gap">
          <h6><T>guests</T></h6>
          <InputToggle
            checked={openRegistration}
            onChange={(value) => setContest(prevState => ({
              ...prevState,
              members: { ...prevState.members, guests: value ? ['*'] : [] },
            }))}
            leftLabel={<T className={classNames('text-sentence-case', { 'tx-wd-bold': !openRegistration })}>only guests</T>}
            rightLabel={<T className={classNames('text-sentence-case', { 'tx-wd-bold': openRegistration })}>open</T>}
          />
        </div>
        <div style={{ minHeight: 34 }}>
          {openRegistration ? <T className="text-sentence-case">the contest is open to all users of the judge</T> : (
            <UsersSelector
              selectedUsers={guests}
              onChangeSelectedUsers={guests => {
                setContest(prevState => ({
                  ...prevState,
                  members: { ...prevState.members, guests },
                }));
              }}
            />
          )}
        </div>
      </div>
      <div className="jk-divider small" />
      <div className="jk-col gap stretch">
        <div className="jk-row left gap">
          <h6><T>spectators</T></h6>
          <InputToggle
            checked={openScore}
            onChange={(value) => setContest(prevState => ({
              ...prevState,
              members: { ...prevState.members, spectators: value ? ['*'] : [] },
            }))}
            leftLabel={<T className={classNames('text-sentence-case', { 'tx-wd-bold': !openScore })}>only guests</T>}
            rightLabel={<T className={classNames('text-sentence-case', { 'tx-wd-bold': openScore })}>open</T>}
          />
        </div>
        <div style={{ minHeight: 34 }}>
          {openScore ? <T className="text-sentence-case">the scoreboard of the contest is open to all users of the judge</T> : (
            <UsersSelector
              selectedUsers={spectators}
              onChangeSelectedUsers={spectators => {
                setContest(prevState => ({
                  ...prevState,
                  members: { ...prevState.members, spectators },
                }));
              }}
            />
          )}
        </div>
      </div>
      <div className="jk-divider small" />
      <div className="jk-col gap stretch">
        <div className="jk-row left gap">
          <h6><T>judges</T></h6>
          <JudgeInformation filledCircle />
        </div>
        <UsersSelector
          selectedUsers={judges}
          onChangeSelectedUsers={judges => {
            setContest(prevState => ({
              ...prevState,
              members: { ...prevState.members, judges },
            }));
          }}
        />
      </div>
      <div className="jk-divider" />
      <div className="jk-col gap stretch">
        <div className="jk-row left gap">
          <h6><T>administrators</T></h6>
          <AdminInformation filledCircle />
        </div>
        <UsersSelector
          selectedUsers={administrators}
          onChangeSelectedUsers={administrators => {
            setContest(prevState => ({
              ...prevState,
              members: { ...prevState.members, administrators },
            }));
          }}
        />
      </div>
    </div>
  );
};