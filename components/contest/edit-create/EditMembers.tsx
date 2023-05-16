import { InputToggle, T, UsersSelector } from 'components';
import { classNames, isEndlessContest } from 'helpers';
import { useJukiUser } from 'hooks';
import React from 'react';
import { AdminInformation, JudgeInformation } from '../Information';
import { EditContestProps } from '../types';

export const EditMembers = ({ setContest, contest, editing }: EditContestProps) => {
  
  const { company: { key } } = useJukiUser();
  const guests = contest.members.guests;
  const spectators = contest.members.spectators;
  const contestants = contest.members.contestants;
  const judges = contest.members.judges;
  const administrators = contest.members.administrators;
  
  const openRegistration = contest.members.guests.length === 1 && contest.members.guests[0] === '*';
  const openScore = contest.members.spectators.length === 1 && contest.members.spectators[0] === '*';
  
  const competition = isEndlessContest(contest);
  
  return (
    <div className="jk-col left top stretch gap nowrap">
      <div className="jk-col gap stretch">
        <div className="jk-row left gap">
          <div className="fw-bd tt-se tx-xl cr-py"><T>guests</T>:</div>
          <InputToggle
            size="small"
            checked={openRegistration}
            onChange={(value) => setContest(prevState => ({
              ...prevState,
              members: { ...prevState.members, guests: value ? [ '*' ] : [] },
            }))}
            leftLabel={<T className={classNames('tt-se', { 'fw-bd': !openRegistration })}>only guests</T>}
            rightLabel={<T className={classNames('tt-se', { 'fw-bd': openRegistration })}>open</T>}
            disabled={competition}
          />
        </div>
        <div className="jk-row left stretch extend" style={{ minHeight: 34 }}>
          {openRegistration ? <T className="tt-se">the contest is open to all users of the judge</T> : (
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
          )}
        </div>
      </div>
      {editing && (
        <div className="jk-col left stretch gap nowrap">
          <div className="fw-bd tt-se tx-xl cr-py"><T>contestants</T>:</div>
          <div style={{ minHeight: 34 }}>
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
          </div>
        </div>
      )}
      <div className="jk-col gap stretch">
        <div className="jk-row left gap">
          <div className="fw-bd tt-se tx-xl cr-py"><T>spectators</T>:</div>
          <InputToggle
            size="small"
            checked={openScore}
            onChange={(value) => setContest(prevState => ({
              ...prevState,
              members: { ...prevState.members, spectators: value ? [ '*' ] : [] },
            }))}
            leftLabel={<T className={classNames('tt-se', { 'fw-bd': !openScore })}>only guests</T>}
            rightLabel={<T className={classNames('tt-se', { 'fw-bd': openScore })}>open</T>}
            disabled={competition}
          />
        </div>
        <div style={{ minHeight: 34 }}>
          {openScore ? <T className="tt-se">the scoreboard of the contest is open to all users of the judge</T> : (
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
          )}
        </div>
      </div>
      <div className="jk-col gap stretch">
        <div className="jk-row left gap">
          <div className="fw-bd tt-se tx-xl cr-py"><T>judges</T>:</div>
          <JudgeInformation filledCircle />
        </div>
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
      </div>
      <div className="jk-col gap stretch">
        <div className="jk-row left gap">
          <div className="fw-bd tt-se tx-xl cr-py"><T>administrators</T>:</div>
          <AdminInformation filledCircle />
        </div>
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
      </div>
    </div>
  );
};
