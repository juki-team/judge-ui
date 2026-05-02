import { UserLoaderLayout, UserStoreProvider } from '@juki-team/base-ui';
import { jukiApiManager } from '@juki-team/base-ui/settings';
import { EMPTY_ORGANIZATION as EMPTY_COMPANY, EMPTY_USER } from '@juki-team/base-ui/constants';
import { get } from 'helpers';
import { type ReactNode } from 'react';
import type { PingResponseDTO } from '@juki-team/commons/dto';
import type { ContentResponse } from '@juki-team/commons/types';
import { RootLayout } from './RootLayout';

export const dynamic = 'force-dynamic';

const getInitialUser = async () => {

  const session = await get<ContentResponse<PingResponseDTO>>(jukiApiManager.apiV2.auth.ping().url);

  return {
    user: session?.success ? session?.content.user : EMPTY_USER,
    company: session?.success ? session?.content.company : EMPTY_COMPANY,
    isLoading: false,
  };
};

export default async function Layout({ children }: { children: ReactNode }) {

  return (
    <UserStoreProvider initialUser={await getInitialUser()}>
      <UserLoaderLayout />
      <RootLayout>
        {children}
      </RootLayout>
    </UserStoreProvider>
  );
}
