import { Button, ExternalIcon, FetcherLayer, MailIcon, Modal, PlaceIcon, SchoolIcon, T } from 'components';
import { JUDGE_API_V1, QueryParam, ROUTES } from 'config/constants';
import { removeParamQuery } from 'helpers';
import { useFetcher } from 'hooks';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ContentResponseType, ProfileTab, UserStatus } from 'types';

type UserType = {
  aboutMe: string,
  email: string,
  familyName: string,
  givenName: string,
  handles: {},
  imageUrl: string,
  nickname: string,
  status: UserStatus,
  city: string,
  country: string,
  institution: string,
}

export const UserPreview = ({ nickname }) => {
  
  const { push, query } = useRouter();
  const { data, error, isLoading } = useFetcher<ContentResponseType<UserType>>(JUDGE_API_V1.ACCOUNT.USER(nickname));
  
  useEffect(() => {
    if (error) {
      push({ query: removeParamQuery(query, QueryParam.OPEN_USER_PREVIEW, null) });
    }
  }, [error]);
  
  const handleClose = () => {
    push({ query: removeParamQuery(query, QueryParam.OPEN_USER_PREVIEW, null) });
    return null;
  };
  
  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      className="modal-user-preview"
    >
      <FetcherLayer<any>
        isLoading={isLoading}
        data={data}
        error={!data?.success ? handleClose : null}
      >
        {data => (
          <div className="jk-pad jk-col stretch gap">
            <div className="jk-row center gap">
              <img src={data?.content?.imageUrl} className="jk-user-profile-img huge jk-shadow" alt={nickname} />
              <div className="jk-col stretch">
                <div className="text-bold">{data?.content?.nickname}</div>
                <div className="color-gray-3">{data?.content?.givenName} {data?.content?.familyName}</div>
                <div className="jk-divider tiny" />
                {(data?.content?.city?.trim() || data?.content?.country?.trim()) && (
                  <div className="jk-row left gap">
                    <PlaceIcon />{data?.content?.city}{data?.content?.city && ','} {data?.content?.country}
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
                  <div className="jk-row"><T>see profile</T><ExternalIcon /></div>
                </Button>
              </a>
            </div>
          </div>
        )}
      </FetcherLayer>
    </Modal>
  );
};