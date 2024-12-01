import { contentResponse } from '@juki-team/commons';
import getConfig from 'next/config';

export function GET() {
  const { publicRuntimeConfig } = getConfig();
  return Response.json(contentResponse('ok', { version: publicRuntimeConfig?.version }));
}
