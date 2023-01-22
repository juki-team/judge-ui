import { Button, FetcherLayer, Image, LocationOnIcon, MailIcon, Modal, OpenInNewIcon, SchoolIcon, T } from 'components';
import { JUDGE_API_V1, QueryParam, ROUTES } from 'config/constants';
import { removeParamQuery } from 'helpers';
import { useRouter } from 'next/router';
import { ContentResponseType, ProfileTab, UserBasicResponseDTO } from 'types';

export const UserPreviewModal = ({ nickname }: { nickname: string }) => {
  
  const { push, query } = useRouter();
  const handleClose = () => push({ query: removeParamQuery(query, QueryParam.USER_PREVIEW, null) });
  
  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      className="modal-user-preview"
      closeWhenClickOutside
    >
      <FetcherLayer<ContentResponseType<UserBasicResponseDTO>>
        url={JUDGE_API_V1.USER.NICKNAME(nickname)}
        onError={handleClose}
      >
        {({ data }) => (
          <div className="jk-pad-md jk-col stretch gap">
            <div className="jk-row center gap">
              <Image
                src={data?.content?.imageUrl}
                className="jk-user-profile-img elevation-1"
                alt={nickname}
                height={100}
                width={100}
              />
              <div className="jk-col gap stretch">
                <h3>{data?.content?.nickname}</h3>
                <div className="cr-g3">{data?.content?.givenName} {data?.content?.familyName}</div>
                <div className="jk-divider tiny" />
                {(data?.content?.city?.trim() || data?.content?.country?.trim()) && (
                  <div className="jk-row left gap">
                    <LocationOnIcon />{data?.content?.city}{data?.content?.city && ','} {data?.content?.country}
                  </div>
                )}
                {data?.content?.institution?.trim() && (
                  <div className="jk-row left gap"><SchoolIcon />{data?.content?.institution}</div>
                )}
                <div className="jk-row left gap"><MailIcon />{data?.content?.email}</div>
              </div>
            </div>
            <div className="jk-row right gap">
              <Button size="small" type="text" onClick={handleClose}><T>close</T></Button>
              <a href={ROUTES.PROFILE.PAGE(nickname, ProfileTab.PROFILE)} target="_blank">
                <Button size="small">
                  <div className="jk-row"><T>see profile</T><OpenInNewIcon /></div>
                </Button>
              </a>
            </div>
          </div>
        )}
      </FetcherLayer>
    </Modal>
  );
};
