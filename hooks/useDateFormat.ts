import { useRouter } from 'hooks';
import { useCallback } from 'react';

export const useDateFormat = () => {
  const { locale } = useRouter();
  const dtf = useCallback((date: Date | number) => {
    const dtf = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeStyle: 'medium' });
    return dtf.format(date);
  }, [locale]);
  const rlt = useCallback((date: number, unit: Intl.RelativeTimeFormatUnit) => {
    const rtf = new Intl.RelativeTimeFormat(locale);
    return rtf.format(date, unit);
  }, [locale]);
  return { dtf, rlt };
};
