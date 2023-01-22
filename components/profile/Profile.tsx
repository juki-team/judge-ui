import { Image, LocationOnIcon, MailIcon, SchoolIcon } from 'components';
import { JUDGE } from 'config/constants';
import { classNames } from 'helpers';
import { UserProfileResponseDTO } from 'types';

export function Profile({ user }: { user: UserProfileResponseDTO }) {
  
  return (
    <div className="user-profile jk-row stretch center gap relative">
      <div className="jk-col top jk-pad-md">
        <Image
          src={user?.imageUrl}
          className="jk-user-profile-img elevation-1"
          alt={user?.nickname as string}
          width={104}
          height={104}
        />
      </div>
      <div className={classNames('jk-col top stretch left jk-pad-md')}>
        <div className="jk-col gap stretch">
          <div>
            <div className="fw-br">{user?.nickname}</div>
            <div className="cr-g3">{user?.givenName} {user?.familyName}</div>
          </div>
          <div className="cr-g1">{user?.aboutMe}</div>
        </div>
        <div className="jk-divider tiny" />
        <div className="jk-col gap left stretch">
          {(user?.city?.trim() || user?.country?.trim()) && (
            <div className="jk-row left gap">
              <LocationOnIcon />{user?.city}{user?.city && ','} {user?.country}
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
                <div className="jk-col left gap block stretch">
                  <div className="jk-row gap">
                    <Image
                      src={JUDGE[judge]?.logo}
                      alt={judge}
                      height={(64 / JUDGE[judge]?.logoSize[0]) * JUDGE[judge]?.logoSize[1]}
                      width={64}
                    />
                    {nickname}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
