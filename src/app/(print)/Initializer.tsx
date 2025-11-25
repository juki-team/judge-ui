'use client';

import { useInjectTheme } from '@juki-team/base-ui';
import { Theme } from '@juki-team/commons';
import { useEffect, useI18nStore } from 'hooks';
import { useSearchParams } from 'next/navigation';

export const Initializer = () => {
  
  const searchParams = useSearchParams();
  
  const language = searchParams.get('language');
  
  const theme = searchParams.get('theme');
  
  const changeLanguage = useI18nStore(state => state.changeLanguage);
  useInjectTheme(theme === Theme.DARK ? Theme.DARK : Theme.LIGHT);
  
  useEffect(() => {
    if (language) {
      changeLanguage(language);
    }
  }, [ changeLanguage, language ]);
  return null;
};
