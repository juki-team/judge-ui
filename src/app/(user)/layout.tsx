import { JukiI18nBridge, UserLoaderLayout, UserStoreProvider } from 'src/components/jukiClientBoundary';
import { jukiApiManager } from '@juki-team/base-ui/settings';
import { EMPTY_ORGANIZATION as EMPTY_COMPANY, EMPTY_USER } from '@juki-team/base-ui/constants';
import { loadServerDicts, setServerDict } from '@juki-team/base-ui/server-components';
import { get } from 'helpers';
import { type ReactNode } from 'react';
import type { PingResponseDTO } from '@juki-team/commons/dto';
import type { ContentResponse } from '@juki-team/commons/types';
import { Language, ProfileSetting } from '@juki-team/commons/enums';
import { RootLayout } from './RootLayout';

export const dynamic = 'force-dynamic';

const getInitialUser = async () => {

  const session = await get<ContentResponse<PingResponseDTO>>(jukiApiManager.apiV2.auth.ping().url);

  return {
    user: session?.success ? session?.content.user : EMPTY_USER,
    organization: session?.success ? session?.content.organization : EMPTY_COMPANY,
    isLoading: false,
  };
};

export default async function Layout({ children }: { children: ReactNode }) {

  const initialUser = await getInitialUser();
  const locale = initialUser.user.settings?.[ProfileSetting.LANGUAGE] ?? Language.EN;
  const dicts = await loadServerDicts([ Language.EN, Language.ES ]);
  setServerDict(locale, dicts[locale] ?? {});

  return (
    <UserStoreProvider initialUser={initialUser}>
      <JukiI18nBridge dicts={dicts}>
        <UserLoaderLayout />
        <RootLayout>
          {children}
        </RootLayout>
      </JukiI18nBridge>
    </UserStoreProvider>
  );
}
