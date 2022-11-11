import { settings } from '@juki-team/base-ui';
import { JukiBaseUiProvider, NavigationBar } from 'components';
import { JUKI_TOKEN_NAME } from 'config/constants';
import { OnlineStatusProvider } from 'hooks';
import { TaskProvider, UserProvider } from 'store';
import { SWRConfig } from 'swr';
import '../i18n';
import './styles.scss';

export default function MyApp({ Component, pageProps }) {
  settings.setSetting('http://localhost:3005', 'api/v1', 'http://localhost:3005', 'http://localhost:3001', JUKI_TOKEN_NAME);
  
  return (
    <JukiBaseUiProvider
      utilsServiceUrl="http://localhost:3005"
      utilsServiceApiVersion="api/v1"
      utilsUiUrl="http://localhost:3005"
      tokenName={JUKI_TOKEN_NAME}
      utilsSocketServiceUrl="http://localhost:3005"
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