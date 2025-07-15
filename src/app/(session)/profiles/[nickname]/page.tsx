'use client';

import { FetcherLayer, PageNotFound } from 'components';
import { jukiApiManager } from 'config';
import { useRouterStore } from 'hooks';
import { ContentResponseType, UserProfileResponseDTO } from 'types';
import { ProfileViewPage } from './ProfileViewPage';

export default function ProfileView() {
  
  const nickname = useRouterStore(state => state.routeParams.nickname);
  
  return (
    <FetcherLayer<ContentResponseType<UserProfileResponseDTO>>
      url={nickname ? jukiApiManager.API_V1.user.getProfile({ params: { nickname: nickname as string } }).url : null}
      errorView={<PageNotFound />}
    >
      {({ data, mutate }) => <ProfileViewPage profile={data.content} reloadProfile={mutate} />}
    </FetcherLayer>
  );
}
