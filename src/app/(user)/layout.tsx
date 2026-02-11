import { UserLoaderLayout, UserStoreProvider } from 'components';
import { jukiApiManager } from 'config';
import { EMPTY_COMPANY, EMPTY_USER } from 'config/constants';
import { get } from 'helpers';
import { type ReactNode } from 'react';
import type { ContentResponseType, PingResponseDTO } from 'types';
import { RootLayout } from './RootLayout';

export const dynamic = 'force-dynamic';

const getInitialUser = async () => {
  
  const session = await get<ContentResponseType<PingResponseDTO>>(jukiApiManager.API_V2.auth.ping().url);
  
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
