import { UserStoreProvider } from 'components';
import { jukiApiManager } from 'config';
import { EMPTY_COMPANY, EMPTY_USER } from 'config/constants';
import { ReactNode } from 'react';
import './styles.scss';
import { ContentResponseType, PingResponseDTO } from 'types';
import { get } from '../../helpers/fetch';
import { Initializer } from './Initializer';

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
      <Initializer />
      <div id="juki-app" style={{ overflow: 'auto' }}>
        {children}
      </div>
    </UserStoreProvider>
  );
}
