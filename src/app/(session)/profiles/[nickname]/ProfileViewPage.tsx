'use client';

import { FetcherLayer, PageNotFound, UserViewLayout } from 'components';
import { jukiApiManager } from 'config';
import { ContentResponseType, UserProfileResponseDTO } from 'types';

interface ProfileViewPageProps {
  nickname: string,
}

export function ProfileViewPage({ nickname }: ProfileViewPageProps) {
  return (
    <FetcherLayer<ContentResponseType<UserProfileResponseDTO>>
      url={nickname ? jukiApiManager.API_V2.user.getProfile({ params: { nickname: nickname as string } }).url : null}
      errorView={<PageNotFound />}
    >
      {({ data, mutate }) => (
        <UserViewLayout user={data.content} reloadUser={mutate} />
      )}
    </FetcherLayer>
  );
}
