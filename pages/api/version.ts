import { contentResponse } from 'helpers';
import { NextApiRequest, NextApiResponse } from 'types';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(contentResponse('ok', { version: '1.2.3' }));
}
