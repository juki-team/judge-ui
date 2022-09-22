import { Button, ButtonLoader, CityIcon, EditIcon, Input, Modal, PersonIcon, PlaceIcon, SchoolIcon, T, TextArea } from 'components';
import { JUDGE } from 'config/constants';
import { classNames } from 'helpers';
import { useEffect, useState } from 'react';
import { useUserDispatch } from 'store';
import { UserResponseDTO } from 'types';
import { ImageProfileModal } from './ImageProfileModal';

export function EditProfileModal({ user, onClose }: { user: UserResponseDTO, onClose: () => void }) {
  
  const [userState, setUserState] = useState(user);
  const { updateProfileData } = useUserDispatch();
  useEffect(() => setUserState(user), [JSON.stringify(user)]);
  const [modalImageProfile, setModalImageProfile] = useState(false);
  
  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="user-profile jk-row stretch center gap jk-pad relative">
        {modalImageProfile && <ImageProfileModal onClose={() => setModalImageProfile(false)} nickname={user.nickname} />}
        <div className="jk-col top jk-pad">
          <img src={user?.imageUrl} className="jk-user-profile-img huge jk-shadow" alt={user?.nickname as string} />
          <EditIcon onClick={() => setModalImageProfile(true)} />
        </div>
        <div className={classNames('jk-col top stretch left jk-pad gap')}>
          <div className="jk-form-item">
            <label>
              <div className="jk-row left gap"><PersonIcon size="small" /><T>nickname</T></div>
              <Input onChange={nickname => setUserState({ ...userState, nickname })} value={userState.nickname} />
            </label>
          </div>
          <div className="jk-row gap">
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
          </div>
          <div className="jk-form-item">
            <label>
              <div className="jk-row left gap"><PersonIcon size="small" /><T>about me</T></div>
              <TextArea onChange={aboutMe => setUserState({ ...userState, aboutMe })} value={userState.aboutMe} />
            </label>
          </div>
          <div className="jk-row gap">
            <div className="jk-form-item">
              <label>
                <div className="jk-row left gap"><CityIcon size="small" /><T>country</T></div>
                <Input onChange={country => setUserState({ ...userState, country })} value={userState.country} />
              </label>
            </div>
            <div className="jk-form-item">
              <label>
                <div className="jk-row left gap"><PlaceIcon size="small" /><T>city</T></div>
                <Input onChange={city => setUserState({ ...userState, city })} value={userState.city} />
              </label>
            </div>
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
        </div>
        <div className="jk-row gap extend right">
          <Button type="text" onClick={onClose}><T>cancel</T></Button>
          <ButtonLoader
            onClick={updateProfileData(
              user.nickname,
              {
                nickname: userState.nickname,
                givenName: userState.givenName,
                familyName: userState.familyName,
                aboutMe: userState.aboutMe,
                country: userState.country,
                city: userState.city,
                institution: userState.institution,
                handles: userState.handles,
              },
              onClose,
            )}
          >
            <T>update</T>
          </ButtonLoader>
        </div>
      </div>
    </Modal>
  );
}
