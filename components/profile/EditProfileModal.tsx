import {
  Button,
  ButtonLoader,
  CityIcon,
  EditIcon,
  Image,
  Input,
  LocationOnIcon,
  Modal,
  PersonIcon,
  SchoolIcon,
  T,
  TextArea,
} from 'components';
import { ALPHANUMERIC_DASH_UNDERSCORE_REGEX, JUDGE, JUDGE_API_V1, ROUTES } from 'config/constants';
import { classNames } from 'helpers';
import { useJukiUser, useRouter, useSWR } from 'hooks';
import { useEffect, useState } from 'react';
import { ProfileTab, Status, UserProfileResponseDTO } from 'types';
import { ImageProfileModal } from './ImageProfileModal';

interface EditProfileModalProps {
  isOpen: boolean,
  user: UserProfileResponseDTO,
  onClose: () => void
}

export function EditProfileModal({ isOpen, user, onClose }: EditProfileModalProps) {
  
  const [ userState, setUserState ] = useState(user);
  const { updateUserProfileData, mutatePing } = useJukiUser();
  const { mutate } = useSWR();
  useEffect(() => setUserState(user), [ JSON.stringify(user) ]);
  const [ modalImageProfile, setModalImageProfile ] = useState(false);
  const validLengthNickname = userState.nickname.length >= 3;
  const validCharNickname = ALPHANUMERIC_DASH_UNDERSCORE_REGEX.test(userState.nickname);
  const { push, query } = useRouter();
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="user-profile jk-row stretch center gap jk-pad-md pn-re">
        {modalImageProfile &&
          <ImageProfileModal onClose={() => setModalImageProfile(false)} nickname={user.nickname} />}
        <div className="jk-col top jk-pad-md">
          <img src={user?.imageUrl} className="jk-user-profile-img huge elevation-1" alt={user?.nickname as string} />
          <EditIcon onClick={() => setModalImageProfile(true)} />
        </div>
        <div className={classNames('jk-col top stretch left jk-pad-md gap')}>
          <div className="jk-form-item">
            <label>
              <div className="jk-row left gap"><PersonIcon size="small" /><T>nickname</T></div>
              <Input onChange={nickname => setUserState({ ...userState, nickname })} value={userState.nickname} />
            </label>
            <p>
              {!validLengthNickname
                ? <T>Must be at least 3 characters</T>
                : !validCharNickname && <T>only alphanumeric characters or dash or underscore is valid</T>}
            </p>
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
                <Input
                  onChange={familyName => setUserState({ ...userState, familyName })}
                  value={userState.familyName}
                />
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
                <div className="jk-row left gap"><LocationOnIcon size="small" /><T>city</T></div>
                <Input onChange={city => setUserState({ ...userState, city })} value={userState.city} />
              </label>
            </div>
          </div>
          <div className="jk-form-item">
            <label>
              <div className="jk-row left gap"><SchoolIcon size="small" /><T>institution</T></div>
              <Input
                onChange={institution => setUserState({ ...userState, institution })}
                value={userState.institution}
              />
            </label>
          </div>
          {Object.values(JUDGE)
            .map(({ value, label, logo, url, logoSize }) => (
              <div className="jk-form-item" key={value}>
                <label>
                  <div className="jk-row left gap">
                    <Image
                      src={logo}
                      alt={label}
                      height={(64 / logoSize[0]) * logoSize[1]}
                      width={64}
                    />
                    <span>{label}</span></div>
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
            disabled={!validLengthNickname || !validCharNickname}
            onClick={(setLoader) =>
              updateUserProfileData({
                params: { nickname: user.nickname },
                body: {
                  nickname: userState.nickname,
                  givenName: userState.givenName,
                  familyName: userState.familyName,
                  aboutMe: userState.aboutMe,
                  country: userState.country,
                  city: userState.city,
                  institution: userState.institution,
                  handles: userState.handles,
                },
                setLoader,
                onSuccess: async () => {
                  setLoader?.(Status.LOADING);
                  let tab = ProfileTab.PROFILE;
                  if (query.tab === ProfileTab.SUBMISSIONS) {
                    tab = ProfileTab.SUBMISSIONS;
                  }
                  await push({ pathname: ROUTES.PROFILE.PAGE(userState.nickname, tab), query });
                  await mutatePing();
                  await mutate(JUDGE_API_V1.USER.PROFILE(user.nickname));
                  setLoader?.(Status.SUCCESS);
                  onClose();
                },
              })}
          >
            <T>update</T>
          </ButtonLoader>
        </div>
      </div>
    </Modal>
  );
}
