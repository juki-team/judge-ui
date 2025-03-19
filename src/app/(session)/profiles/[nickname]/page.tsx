'use client';

import { FetcherLayer, PageNotFound, ProfileViewLayout } from 'components';
import { jukiApiSocketManager } from 'config';
import { useRouterStore } from 'hooks';
import { ContentResponseType, UserProfileResponseDTO } from 'types';

export default function ProfileView() {
  
  const nickname = useRouterStore(state => state.routeParams.nickname);
  
  return (
    <FetcherLayer<ContentResponseType<UserProfileResponseDTO>>
      url={nickname ? jukiApiSocketManager.API_V1.user.getProfile({ params: { nickname: nickname as string } }).url : null}
      errorView={<PageNotFound />}
    >
      {({ data, mutate }) => <ProfileViewLayout profile={data.content} reloadProfile={mutate} />}
    </FetcherLayer>
  );
}
