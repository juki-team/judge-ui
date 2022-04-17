import { JUDGE } from '@juki-team/commons';
import { MailIcon, PlaceIcon, SchoolIcon } from '../index';

export function Profile({ user }) {
  console.log({ user });
  return (
    <div className="user-profile jk-row stretch center gap jk-pad">
      <div className="jk-col top jk-pad">
        <img src={user?.imageUrl} className="jk-user-profile-img huge jk-shadow" alt={user?.nickname as string} />
      </div>
      <div className="jk-col top stretch left jk-pad">
        <div className="text-bold">{user?.nickname}</div>
        <div className="color-gray-3">{user?.givenName} {user?.familyName}</div>
        <div className="jk-divider tiny" />
        <div className="jk-col gap left stretch">
          {(user?.city?.trim() || user?.country?.trim()) && (
            <div className="jk-row left gap">
              <PlaceIcon />{user?.city}{user?.city && ','} {user?.country}
            </div>
          )}
          {user?.institution?.trim() && (
            <div className="jk-row left gap"><SchoolIcon />{user?.institution}</div>
          )}
          <div className="jk-row left gap"><MailIcon />{user?.email}</div>
          {Object.entries(user?.handles || {})
            .filter(([judge, nickname]) => !!nickname && !!JUDGE[judge])
            .map(([judge, nickname]) => (
              <div key={judge}>
                <div className="jk-row left gap"><img src={JUDGE[judge]?.logo} alt={judge} /> {nickname}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}