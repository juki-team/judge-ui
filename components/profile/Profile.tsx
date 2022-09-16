import { classNames } from '@juki-team/base-ui';
import { JUDGE } from '@juki-team/commons';
import { CityIcon, FloatToolbar, Input, MailIcon, PersonIcon, PlaceIcon, SchoolIcon, T } from 'components';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { EditIcon, LockIcon } from '../index';
import { ChangePasswordModal } from './ChangePasswordModal';
import { ImageProfileModal } from './ImageProfileModal';

export function Profile({ user }: { user: any }) {
  
  const { query: { nickname } } = useRouter();
  const [userState, setUserState] = useState(user);
  const [editing, setEditing] = useState(false);
  const [modalChangePassword, setModalChangePassword] = useState(false);
  const [modalImageProfile, setModalImageProfile] = useState(false);
  useEffect(() => {
    if (nickname !== user.nickname) {
      setEditing(false);
    }
  }, [nickname]);
  
  const onClose = () => setModalChangePassword(false);
  
  return (
    <div className="user-profile jk-row stretch center gap jk-pad relative">
      {modalChangePassword && <ChangePasswordModal onClose={onClose} />}
      {modalImageProfile && <ImageProfileModal onClose={() => setModalImageProfile(false)} />}
      <FloatToolbar
        actionButtons={[
          ...(!editing ? [
            // {
            //   icon: <EditIcon />,
            //   buttons: [
            //     {
            //       icon: <EditIcon />,
            //       onClick: () => setEditing(!editing),
            //       label: <T className="text-nowrap">update my data</T>,
            //     },
            //   ],
            // },
            {
              icon: <LockIcon />,
              buttons: [
                {
                  icon: <LockIcon />,
                  onClick: () => setModalChangePassword(true),
                  label: <T className="text-nowrap">change password</T>,
                },
              ],
            },
          ] : []),
        ]}
      />
      <div className="jk-col top jk-pad">
        <img src={user?.imageUrl} className="jk-user-profile-img huge jk-shadow" alt={user?.nickname as string} />
        {editing && <EditIcon onClick={() => setModalImageProfile(true)} />}
      </div>
      <div className={classNames('jk-col top stretch left jk-pad', { 'gap': editing })}>
        {editing ? (
          <div className="jk-form-item">
            <label>
              <div className="jk-row left gap"><PersonIcon size="small" /><T>nickname</T></div>
              <Input onChange={nickname => setUserState({ ...userState, nickname })} value={userState.nickname} />
            </label>
          </div>
        ) : <div className="tx-wd-bolder">{user?.nickname}</div>}
        {editing ? (
          <>
            <div className="jk-form-item">
              <label>
                <div className="jk-row left gap"><PersonIcon size="small" /><T>given name</T></div>
                <Input onChange={givenName => setUserState({ ...userState, givenName })} value={userState.givenName} />
              </label>
            </div>
            <div className="jk-form-item">
              <label>
                <div className="jk-row left gap"><PersonIcon size="small" /><T>family name</T></div>
                <Input onChange={familyName => setUserState({ ...userState, familyName })} value={userState.familyName} />
              </label>
            </div>
          </>
        ) : <div className="color-gray-3">{user?.givenName} {user?.familyName}</div>}
        {editing && (
          <>
            <div className="jk-form-item">
              <label>
                <div className="jk-row left gap"><PlaceIcon size="small" /><T>city</T></div>
                <Input onChange={city => setUserState({ ...userState, city })} value={userState.city} />
              </label>
            </div>
            <div className="jk-form-item">
              <label>
                <div className="jk-row left gap"><CityIcon size="small" /><T>country</T></div>
                <Input onChange={country => setUserState({ ...userState, country })} value={userState.country} />
              </label>
            </div>
            <div className="jk-form-item">
              <label>
                <div className="jk-row left gap"><SchoolIcon size="small" /><T>institution</T></div>
                <Input onChange={institution => setUserState({ ...userState, institution })} value={userState.institution} />
              </label>
            </div>
            {Object.values(JUDGE)
              .map(({ value, label, logo, url }) => (
                <div className="jk-form-item" key={value}>
                  <label>
                    <div className="jk-row left gap"><img src={logo} alt={value}></img><span>{label}</span></div>
                    <Input
                      onChange={nickname => setUserState({
                        ...userState,
                        handles: { ...(userState.handles || {}), [value]: nickname },
                      })}
                      value={userState?.handles?.[value]}
                    />
                  </label>
                </div>
              ))}
          </>
        )}
        {!editing && <div className="jk-divider tiny" />}
        {!editing && (
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
        )}
      </div>
    </div>
  );
}