'use client';

import { JukiI18nProvider } from 'components';
import { jukiApiSocketManager } from 'config';
import { JUKI_SERVICE_V1_URL, JUKI_SERVICE_V2_URL, JUKI_SOCKET_BASE_URL, JUKI_TOKEN_NAME } from 'config/constants';
import { useEffect, useI18nStore } from 'hooks';
import { useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';
import './styles.scss';

export default function Layout({ children }: { children: ReactNode }) {
  
  const searchParams = useSearchParams();
  const changeLanguage = useI18nStore(state => state.changeLanguage);
  
  useEffect(() => {
    jukiApiSocketManager.setApiSettings(JUKI_SERVICE_V1_URL, JUKI_SERVICE_V2_URL, JUKI_TOKEN_NAME);
    jukiApiSocketManager.setSocketSettings(JUKI_SOCKET_BASE_URL);
  }, []);
  
  const language = searchParams.get('language');
  
  useEffect(() => {
    if (language) {
      changeLanguage(language);
    }
  }, [ changeLanguage, language ]);
  
  return (
    <JukiI18nProvider>
      {children}
    </JukiI18nProvider>
  );
}
