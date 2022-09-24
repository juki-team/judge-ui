import { settings } from '@juki-team/base-ui';
import { JukiBaseUiProvider, NavigationBar } from 'components';
import { JUKI_TOKEN_NAME } from 'config/constants';
import { OnlineStatusProvider } from 'hooks';
import { useEffect } from 'react';
import { TaskProvider, UserProvider } from 'store';
import { SWRConfig } from 'swr';
import '../i18n';
import './styles.scss';

export default function MyApp({ Component, pageProps }) {
  settings.setSetting("https://utils-back-v1.juki.app", "api/v1", "http://localhost:3001", JUKI_TOKEN_NAME);
  console.log({ settings });
  useEffect(() => {
    document.querySelector('body')?.classList.add('jk-theme-light');
  }, []);
  
  return (
    <JukiBaseUiProvider
      utilsServiceUrl="https://utils-back-v1.juki.app"
      apiVersion="api/v1"
      utilsUiUrl="http://localhost:3001"
      tokenName={JUKI_TOKEN_NAME}
    >
      <div className="jk-app">
        <UserProvider>
          <TaskProvider>
            <OnlineStatusProvider>
              <SWRConfig
                value={{
                  revalidateIfStale: false,
                  revalidateOnFocus: false,
                  revalidateOnReconnect: false,
                }}
              >
                <NavigationBar>
                  <Component {...pageProps} />
                </NavigationBar>
              </SWRConfig>
            </OnlineStatusProvider>
          </TaskProvider>
        </UserProvider>
      </div>
    </JukiBaseUiProvider>
  );
}