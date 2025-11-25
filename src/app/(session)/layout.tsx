import { UserStoreProvider } from 'components';
import { jukiApiManager } from 'config';
import { EMPTY_COMPANY, EMPTY_USER } from 'config/constants';
import { ReactNode } from 'react';
import { ContentResponseType, PingResponseDTO } from 'types';
import { UserLoader } from '../../components/commons/UserLoader';
import { get } from '../../helpers/fetch';
import { RootLayout } from './RootLayout';

export const dynamic = 'force-dynamic';

const getInitialUsers = async () => {
  
  const session = await get<ContentResponseType<PingResponseDTO>>(jukiApiManager.API_V2.auth.ping().url);
  
  return {
    user: session?.success ? session?.content.user : EMPTY_USER,
    company: session?.success ? session?.content.company : EMPTY_COMPANY,
    isLoading: false,
  };
};

export default async function Layout({ children }: { children: ReactNode }) {
  
  return (
    <UserStoreProvider initialUser={await getInitialUsers()}>
      <UserLoader />
      <RootLayout>
        {children}
      </RootLayout>
    </UserStoreProvider>
  );
}
