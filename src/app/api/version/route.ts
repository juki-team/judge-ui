import { contentResponse } from '@juki-team/commons';
import pkg from '../../../../package.json';

const { version } = pkg;

export function GET() {
  return Response.json(contentResponse('ok', { version }));
}
