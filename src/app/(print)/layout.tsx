'use client';

import { JukiI18nProvider } from 'components';
import { useEffect, useI18nStore } from 'hooks';
import { useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';
import './styles.scss';
import { Theme } from 'types';

export default function Layout({ children }: { children: ReactNode }) {
  
  const searchParams = useSearchParams();
  const changeLanguage = useI18nStore(state => state.changeLanguage);
  
  const language = searchParams.get('language');
  useEffect(() => {
    if (language) {
      changeLanguage(language);
    }
  }, [ changeLanguage, language ]);
  
  const theme = searchParams.get('theme');
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.querySelector('body')?.classList.remove('jk-theme-dark');
      document.querySelector('body')?.classList.remove('jk-theme-light');
      if (theme === Theme.DARK) {
        document.querySelector('body')?.classList.add('jk-theme-dark');
      } else {
        document.querySelector('body')?.classList.add('jk-theme-light');
      }
    }
  }, [ theme ]);
  
  return (
    <JukiI18nProvider>
      <div id="juki-app" style={{ overflow: 'auto' }}>
        {children}
      </div>
    </JukiI18nProvider>
  );
}
