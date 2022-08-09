import { cloneElement } from 'react';
import { QueryParam } from '../../config/constants';
import { replaceParamQuery } from '../../helpers';
import { useRouter } from '../../hooks';

interface UserChipProps {
  imageUrl: string,
  nickname: string,
  givenName: string,
  familyName: string,
  email: string
}

export const UserChip = ({ imageUrl, email, familyName, nickname, givenName }: UserChipProps) => {
  return (
    <div className="jk-row nowrap center gap">
      <img src={imageUrl} className="jk-user-profile-img huge" alt={nickname} />
      <div className="jk-col">
        <div>{givenName} {familyName}</div>
        <UserNicknameLink nickname={nickname}>
          <div className="link">{nickname}</div>
        </UserNicknameLink>
        <div>{email}</div>
      </div>
    </div>
  );
};

export const UserNicknameLink = ({ children, nickname }) => {
  const { query, push } = useRouter();
  return cloneElement(children, { onClick: () => push({ query: replaceParamQuery(query, QueryParam.USER_PREVIEW, nickname) }) });
};