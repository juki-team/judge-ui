import { Image } from 'components';
import { replaceParamQuery } from 'helpers';
import { useRouter } from 'hooks';
import React, { cloneElement } from 'react';
import { QueryParam } from 'types';

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
      <Image src={imageUrl} className="jk-user-profile-img huge" alt={nickname} height={50} width={50} />
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
  const { query, push, pathname } = useRouter();
  const queries = replaceParamQuery(query, QueryParam.USER_PREVIEW, nickname);
  // console.log({ queries });
  // return (
  //   <Link href={{ query: { a: 1 } }}>
  //     {children}
  //   </Link>
  // );
  return cloneElement(children, { onClick: () => push({ query: replaceParamQuery(query, QueryParam.USER_PREVIEW, nickname) }) });
};
