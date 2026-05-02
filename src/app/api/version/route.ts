import { contentResponse } from '@juki-team/commons/helpers';
import pkg from '../../../../package.json';

const { version } = pkg;

export function GET() {
  return Response.json(contentResponse('ok', { version }));
}
