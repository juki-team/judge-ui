import { AdminInformation, JudgeInformation, T, UserNicknameLink } from 'components';
import { classNames } from 'helpers';
import React from 'react';
import { ContestResponseDTO } from 'types';

export const ViewMembers = ({ contest }: { contest: ContestResponseDTO }) => {
  
  const printNicknames = (nicknames: string[]) => {
    if (nicknames.length === 1 && nicknames[0] === '*') {
      return (
        <div className="jk-row left gap">
          <T>all users</T>
        </div>
      );
    }
    if (!nicknames.length) {
      return (
        <div className="jk-row left gap">
          <T>nobody</T>
        </div>
      );
    }
    return (
      <div className="jk-row left gap">
        {nicknames.map(nickname => (
          <UserNicknameLink nickname={nickname} key={nickname}>
            <div className={classNames('jk-border-radius jk-tag gray-6 link')}>
              {nickname}
            </div>
          </UserNicknameLink>
        ))}
      </div>
    );
  };
  
  return (
    <div className="jk-col left top stretch jk-pad-md gap">
      <div>
        <div className="jk-row left gap">
          <h3><T>administrators</T></h3>
          <AdminInformation filledCircle />
        </div>
        {printNicknames(Object.keys(contest.members.administrators))}
      </div>
      <div>
        <div className="jk-row left gap">
          <h3><T>judges</T></h3>
          <JudgeInformation filledCircle />
        </div>
        {printNicknames(Object.keys(contest.members.judges))}
      </div>
      <div>
        <div className="jk-row left gap">
          <h3><T>guests</T></h3>
        </div>
        {printNicknames(Object.keys(contest.members.guests))}
      </div>
      <div>
        <h3><T>contestants</T></h3>
        {printNicknames(Object.keys(contest.members.contestants))}
      </div>
      <div>
        <h3><T>spectators</T></h3>
        {printNicknames(Object.keys(contest.members.spectators))}
      </div>
    </div>
  );
};
