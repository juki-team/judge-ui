import { JukiBaseUiProvider, NavigationBar } from 'components';
import { JUKI_SUBMISSIONS_RESOLVE_SERVICE_BASE_URL, JUKI_TOKEN_NAME } from 'config/constants';
import { OnlineStatusProvider } from 'hooks';
import React from 'react';
import { TaskProvider, UserProvider } from 'store';
import { SWRConfig } from 'swr';
import '../i18n';
import './styles.scss';

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <body>
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
                  {children}
                </NavigationBar>
              </SWRConfig>
            </OnlineStatusProvider>
          </TaskProvider>
        </UserProvider>
      </div>
    </JukiBaseUiProvider>
    </body>
    </html>
  );
}