import { settings } from '@juki-team/base-ui';
import { JukiBaseUiProvider, NavigationBar } from 'components';
import { JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL, JUKI_TOKEN_NAME } from 'config/constants';
import { OnlineStatusProvider } from 'hooks';
import { TaskProvider, UserProvider } from 'store';
import { SWRConfig } from 'swr';
import dynamic from 'next/dynamic';
import '../i18n';
import './styles.scss';

const MyComponent = dynamic(() => import('./md-print'), { ssr: false });

export default function MyApp({ Component, pageProps, router, ...rest }) {
  
  settings.setSetting(JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL, 'api/v1', JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL, 'https://utils.juki.app', JUKI_TOKEN_NAME);
  
  if (router.route === '/md-print') {
    return <div><MyComponent {...pageProps} /></div>;
  }
  
  return (
    <JukiBaseUiProvider
      utilsServiceUrl={JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}
      utilsServiceApiVersion="api/v1"
      utilsUiUrl="https://utils.juki.app"
      tokenName={JUKI_TOKEN_NAME}
      utilsSocketServiceUrl={JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL}
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