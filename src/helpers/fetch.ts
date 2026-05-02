'use server';

import { HEADER_JUKI_FORWARDED_HOST } from '@juki-team/commons/constants';
import { ErrorCode } from '@juki-team/commons/enums';
import { type ContentResponse, type ContentsResponse, type ErrorResponse } from '@juki-team/commons/types';
import { cookies, headers } from 'next/headers';
import { cleanRequest } from '@juki-team/commons/helpers';
import { getAuthorizedRequest } from '@juki-team/base-ui/helpers';

export const get = async <T extends ContentResponse<any> | ContentsResponse<any>, >(url: string) => {
  try {
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

    const result = await getAuthorizedRequest(encodeURI(url), {
      headers: customHeaders,
    });
    return cleanRequest<T>(
      result,
    );
  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      message: (error as Error)?.message ?? `Error on get "${url}"`,
      errors: [
        {
          code: ErrorCode.ERR500,
          detail: (error as Error)?.message ?? `Error on get "${url}"`,
          message: (error as Error)?.stack ?? `Error on get "${url}" ${error}`,
        },
      ],
    };
    return errorResponse;
  }
};
