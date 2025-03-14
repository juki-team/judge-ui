'use client';

import { jukiApiSocketManager, jukiGlobalStore } from 'config';
import { JUKI_SERVICE_V1_URL, JUKI_SERVICE_V2_URL, JUKI_SOCKET_BASE_URL, JUKI_TOKEN_NAME } from 'config/constants';
import { useEffect } from 'hooks';
import { createInstance, i18n } from 'i18next';
import { useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';
import initTranslations from '../../i18n/i18n';

const i18nInstance = createInstance() as i18n;
void initTranslations(i18nInstance);

export default function Layout({ children }: { children: ReactNode }) {
  
  const searchParams = useSearchParams();
  
  useEffect(() => {
    jukiApiSocketManager.setApiSettings(JUKI_SERVICE_V1_URL, JUKI_SERVICE_V2_URL, JUKI_TOKEN_NAME);
    jukiApiSocketManager.setSocketSettings(JUKI_SOCKET_BASE_URL);
    void jukiGlobalStore.setI18n(i18nInstance);
  }, []);
  
  const language = searchParams.get('language');
  
  useEffect(() => {
    if (language) {
      void jukiGlobalStore.getI18n().changeLanguage(language);
    }
  }, [ language ]);
  
  return <div>
    {children}
  </div>;
}
