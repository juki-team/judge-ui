import { HEADER_JUKI_FORWARDED_HOST } from 'config/constants';
import { cookies, headers } from 'next/headers';
import { ContentResponseType, ContentsResponseType } from 'types';
import { cleanRequest, getAuthorizedRequest } from './commons';

export const get = async <T extends ContentResponseType<any> | ContentsResponseType<any>, >(url: string) => {
  const headersStore = await headers();
  const cookieStore = await cookies();
  
  const host = headersStore.get('host') || '';
  const protocol = headersStore.get('x-forwarded-proto') ?? 'https';
  const origin = `${protocol}://${host}`;
  const cookieHeader = cookieStore
    .getAll()
    .map(c => `${c.name}=${c.value}`)
    .join('; ');
  const customHeaders = {
    origin,
    referer: origin + '/',
    [HEADER_JUKI_FORWARDED_HOST]: host,
    Cookie: cookieHeader,
  };
  
  return cleanRequest<T>(
    await getAuthorizedRequest(url, {
      headers: customHeaders,
    }),
  );
};
