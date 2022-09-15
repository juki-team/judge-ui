import { useEffect } from 'react';
import { SWRConfig } from 'swr';
import { JukiBaseUiProvider, NavigationBar } from '../components';
import { OnlineStatusProvider } from '../hooks';
import '../i18n';
import { UserProvider } from '../store';
import { TaskProvider } from '../store/tasks';
import './styles.scss';

export default function MyApp({ Component, pageProps }) {
  
  useEffect(() => {
    document.querySelector('body')?.classList.add('jk-theme-light');
  }, []);
  
  return (
    <JukiBaseUiProvider
      // utilsServiceUrl={'https://prod-v1-utils-back.juki.app'}
      // utilsServiceUrl={'http://prodv1utilsbackjukiappapp-env.eba-v2iz3isa.us-east-1.elasticbeanstalk.com'}
      utilsServiceUrl="https://utils-back-v1.juki.app"
      apiVersion={'api/v1'}
      utilsUiUrl={'http://localhost:3001'}
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