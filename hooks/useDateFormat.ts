import { useCallback } from 'react';
import { useRouter } from './useRouter';

export const useDateFormat = () => {
  
  const { locale } = useRouter();
  
  const dtf = useCallback((date: Date | number) => {
    const dtf = new Intl.DateTimeFormat(locale?.toLowerCase(), { dateStyle: 'long', timeStyle: 'medium' });
    return dtf.format(date);
  }, [ locale ]);
  
  const rlt = useCallback((date: number, unit: Intl.RelativeTimeFormatUnit) => {
    const rtf = new Intl.RelativeTimeFormat(locale?.toLowerCase());
    return rtf.format(date, unit);
  }, [ locale ]);
  
  return { dtf, rlt };
};
