import { T, UserNicknameLink } from 'components/index';
import { classNames } from 'helpers';
import React from 'react';
import { ContestResponseDTO } from 'types';
import { AdminInformation, JudgeInformation } from '../Information';

export const ViewMembers = ({ contest }: { contest: ContestResponseDTO }) => {
  
  const printNicknames = (nicknames: string[]) => {
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
          <UserNicknameLink nickname={nickname}>
            <div
              className={classNames('jk-border-radius jk-tag gray-6 link', {
                // 'bg-color-primary color-white tx-wd-bolder': userNickname === user.nickname,
                // 'link': userNickname !== user.nickname,
              })}
            >
              {nickname}
            </div>
          </UserNicknameLink>
        ))}
      </div>
    );
  };
  
  return (
    <div className="jk-col left stretch jk-pad gap">
      <div>
        <div className="jk-row left gap">
          <h6><T>administrators</T></h6>
          <AdminInformation filledCircle />
        </div>
        {printNicknames(contest.members.administrators)}
      </div>
      <div>
        <div className="jk-row left gap">
          <h6><T>judges</T></h6>
          <JudgeInformation filledCircle />
        </div>
        {printNicknames(contest.members.judges)}
      </div>
      <div>
        <div className="jk-row left gap">
          <h6><T>guests</T></h6>
        </div>
        {printNicknames(contest.members.guests)}
      </div>
      <div>
        <h6><T>contestants</T></h6>
        {printNicknames(contest.members.contestants)}
      </div>
      <div>
        <h6><T>spectators</T></h6>
        {printNicknames(contest.members.spectators)}
      </div>
    </div>
  );
};