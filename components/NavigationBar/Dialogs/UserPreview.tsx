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
  
  console.log({ nickname, data, error, isLoading });
  
  useEffect(() => {
    if (error) {
      push({ query: removeParamQuery(query, QueryParam.OPEN_USER_PREVIEW, null) });
    }
  }, [error]);
  
  const handleClose = () => (
    push({ query: removeParamQuery(query, QueryParam.OPEN_USER_PREVIEW, null) })
  );
  
  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      className="modal-user-preview"
    >
      <FetcherLayer
        isLoading={isLoading}
        data={data}
        error={!data?.success ? handleClose : null}
      >
        {data => data.success && (
          <div className="jk-pad jk-col filled gap">
            <div className="jk-row center gap">
              <img src={data?.content?.imageUrl} className="jk-user-profile-img huge" alt={nickname} />
              <div>
                <div className="jk-col filled">
                  <div className="text-bold">{data?.content?.nickname}</div>
                  <div className="color-gray-3">{data?.content?.givenName} {data?.content?.familyName}</div>
                  <div className="jk-divider tiny" />
                  {(data?.content?.city?.trim() || data?.content?.country?.trim()) && (
                    <div className="jk-row start gap">
                      <PlaceIcon />{data?.content?.city}{data?.content?.city && ','} {data?.content?.country}
                    </div>
                  )}
                  {data?.content?.institution?.trim() && (
                    <div className="jk-row start gap"><SchoolIcon />{data?.content?.institution}</div>
                  )}
                  <div className="jk-row start gap"><MailIcon />{data?.content?.email}</div>
                </div>
              </div>
            </div>
            <div className="jk-row end gap">
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